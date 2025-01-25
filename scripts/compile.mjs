/**
 * @typedef {import('@arpadroid/types').Project} Project
 */
/* eslint-disable security/detect-non-literal-fs-filename */
import { mkdirSync, readFileSync, writeFileSync } from 'fs';

import path from 'path';
import { mergeObjects, sortKeys } from '@arpadroid/tools/src/objectTool/objectTool.js';

const { glob } = await import('glob');
const cwd = process.cwd();

/**
 * Gets i18n files.
 * @param {string} path - The path to search.
 * @returns {Promise<string[]>} The i18n files.
 */
export async function getI18nFiles(path = `${cwd}/src`) {
    return glob.sync(`${path}/**/*.i18n.*.json`);
}

/**
 * Adds i18n files to the store.
 * @param {string} path - The path to search.
 * @param {string} namespace - The project name.
 * @param {[]} store
 */
export async function addI18nFiles(path, namespace, store) {
    const files = await getI18nFiles(path);
    files.forEach(file => {
        store.push({
            file,
            namespace
        });
    });
}

/**
 * Compiles an i18n file.
 * @param {object} payload
 * @param {string} payload.file
 * @param {string} payload.namespace - The project name.
 * @param {string} payload.language - The language code.
 * @param {Record<string, unknown>} lang - The language object.
 */
export async function compileI18nFile(payload, lang = {}) {
    const data = JSON.parse(readFileSync(payload.file, 'utf8'));
    const language = payload.language || path.basename(payload.file).split('.')[2] || 'en';
    if (!language || !data) return;
    if (!lang[language]) lang[language] = {};
    lang[language] = mergeObjects(lang[language], { [payload.namespace]: sortKeys(data) });
}

/**
 * Compiles i18n files.
 * @param {[]} files - The files to compile.
 * @param {string} destination - The destination directory.
 */
export async function compileI18nFiles(files, destination = `${cwd}/src/i18n`) {
    const lang = {};
    files.forEach(file => compileI18nFile(file, lang));
    for (const [language, data] of Object.entries(lang)) {
        const filePath = `${destination}/${language}.json`;
        mkdirSync(destination, { recursive: true });
        writeFileSync(filePath, JSON.stringify(sortKeys(data), null, 4));
    }
}

/**
 * Adds common i18n files to the store.
 * @param {[]} store
 */
export async function addCommonFiles(store) {
    const files = await glob.sync(`${cwd}/node_modules/@arpadroid/i18n/src/lang/common.*.json`);
    files.forEach(file => {
        const language = path.basename(file).split('.')[1];
        store.push({
            file,
            namespace: 'common',
            language
        });
    });
}

/**
 * Compiles i18n files for a project.
 * @param {Project} project
 * @param {string[]} deps
 * @returns {Promise<void>}
 */
export async function compileI18n(project, deps = project.getArpadroidDependencies()) {
    if (!deps.includes('i18n')) return;
    const files = [];
    await addCommonFiles(files);
    await addI18nFiles(`${cwd}/src`, project.name, files);
    await deps.forEach(
        async dep => await addI18nFiles(`${cwd}/node_modules/@arpadroid/${dep}/src`, dep, files)
    );
    compileI18nFiles(files);
    return files;
}

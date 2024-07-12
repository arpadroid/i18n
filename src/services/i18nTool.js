import { processTemplate as _processTemplate, renderNode } from '@arpadroid/tools';
import I18n from './i18n.js';

const html = String.raw;

/**
 * Parses the text for i18n keys.
 * It will replace any occurrences of "i18n{some.key}" with the actual text, return the html tags as strings or the html live nodes for i18n-text component.
 * @param {string} text - The text to parse.
 * @param {'text' | 'html' | 'nodes'} returnType - The type of the return value.
 * @returns {string | HTMLElement[] | HTMLElement | undefined} The parsed text or nodes.
 */
export function parseI18nText(text, returnType = 'text') {
    const nodes = [];
    const rv = text?.replace(/(?<!=")i18n{([^}]+)}/g, (match, key) => {
        const $text = I18n.getText(key) || match;
        const $html = html`<i18n-text key="${key}"></i18n-text>`;
        if (returnType === 'nodes') {
            nodes.push(renderNode($html));
            return '';
        }
        return returnType === 'html' ? $html : $text;
    });
    return (nodes.length && nodes) || rv;
}

/**
 * Processes a template.
 * @param {string} template - The template to process.
 * @param {Record<string, unknown>} props - The properties to replace.
 * @param {'text' | 'html'} parseType - The type of the return value for the parsing function.
 * @returns {string}
 */
export function processTemplate(template, props = {}, parseType = 'html') {
    return parseI18nText(_processTemplate(template, props), parseType);
}

/**
 * Checks if a string is an i18n key.
 * @param {string} string - The string to check.
 * @returns {boolean}
 */
export function isI18nKey(string) {
    return !string.includes(' ') && string.includes('.');
}

/**
 * Renders an i18n component if a key is passed otherwise returns as is.
 * @param {string} key - The key to render.
 * @param {Record<string, unknown>} replacements - The replacements for the i18n text.
 * @returns {string}
 */
export function renderI18n(key, replacements = {}) {
    let replacementStr = '';
    const parts = [];
    for (const [key, value] of Object.entries(replacements)) {
        parts.push(`${key}::${value}`);
    }
    if (parts.length) {
        replacementStr = ` replacements="${parts.join(',')}" `;
    }
    return isI18nKey(key)
        ? html`<i18n-text key="${key}" ${replacementStr}></i18n-text>`
        : html`<i18n-text key="unknown">${key}</i18n-text>`;
}

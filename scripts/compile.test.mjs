/* eslint-disable jsdoc/check-tag-names */
/**
 * @jest-environment node
 */
import { compileI18nFiles } from './compile.mjs';
import { unlinkSync, existsSync, readFileSync } from 'fs';
const cwd = process.cwd();

describe('Compiles the i18n files', () => {
    it('Calls compileI18nFiles and verifies new language files are created.', async () => {
        const componentPath = `${cwd}/src/components/testComponent`;
        const files = [
            {
                file: `${componentPath}/testComponent.i18n.en.json`,
                namespace: 'i18n'
            },
            {
                file: `${componentPath}/testComponent.i18n.es.json`,
                namespace: 'i18n'
            },
            {
                file: `${componentPath}/testComponent2.i18n.en.json`,
                namespace: 'i18n'
            },
            {
                file: `${componentPath}/testComponent2.i18n.es.json`,
                namespace: 'i18n'
            }
        ];
        existsSync(`${cwd}/src/i18n/en.json`) && unlinkSync(`${cwd}/src/i18n/en.json`);
        existsSync(`${cwd}/src/i18n/es.json`) && unlinkSync(`${cwd}/src/i18n/es.json`);
        compileI18nFiles(files, `${cwd}/src/i18n`);

        expect(existsSync(`${cwd}/src/i18n/en.json`)).toBe(true);
        expect(existsSync(`${cwd}/src/i18n/es.json`)).toBe(true);
    });

    it('Checks integrity of the compiled files', async () => {
        const en = JSON.parse(readFileSync(`${cwd}/src/i18n/en.json`, 'utf8'));
        const es = JSON.parse(readFileSync(`${cwd}/src/i18n/es.json`, 'utf8'));

        expect(en.i18n).toBeDefined();
        expect(en.i18n.testComponent).toBeDefined();
        expect(en.i18n.testComponent2).toBeDefined();
        expect(en.i18n.testComponent.title).toEqual('Test Component');

        expect(es.i18n).toBeDefined();
        expect(es.i18n.testComponent).toBeDefined();
        expect(es.i18n.testComponent2).toBeDefined();
        expect(es.i18n.testComponent.title).toEqual('Componente de Prueba');
    });
});

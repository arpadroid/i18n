/* eslint-disable jsdoc/check-tag-names */
/**
 * @jest-environment jsdom
 */
import { jest, expect } from '@jest/globals';
import I18n from './i18n.js';
import DEFAULT_LANGUAGE from '../i18n/en.json';
import { DEFAULT_LANGUAGE_OPTIONS } from '../config/config.js';
import SPANISH from '../i18n/es.json';

describe('I18n', () => {
    const i18n = I18n.getInstance({
        payload: DEFAULT_LANGUAGE
    });
    it('receives expected values from default language', () => {
        expect(i18n.getLocale()).toEqual('en');
        const payload = I18n.getPayload();
        expect(payload).toEqual(DEFAULT_LANGUAGE);
    });

    it('should get the locale options', () => {
        const localeOptions = i18n.getLocaleOptions();
        expect(localeOptions).toEqual(DEFAULT_LANGUAGE_OPTIONS);
    });

    it('changes locale to spanish and receives expected values', async () => {
        expect(I18n.getText('i18n.testComponent.title')).toEqual('Test Component');
        global.fetch = jest.fn().mockImplementationOnce(() =>
            Promise.resolve({
                status: 200,
                json: () => Promise.resolve(SPANISH)
            })
        );
        await i18n.setLocale('es');
        expect(i18n.getLocale()).toEqual('es');
        expect(I18n.getText('i18n.testComponent.title')).toEqual('Componente de Prueba');
    });

    it('should check if the locale is supported', () => {
        expect(i18n.supportsLocale('es')).toEqual(true);
        expect(i18n.supportsLocale('en')).toEqual(true);
        expect(i18n.supportsLocale('au')).toEqual(false);
    });
});

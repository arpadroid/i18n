import I18n from './i18n.js';
import DEFAULT_LANGUAGE from '../lang/en-gb.json';
import { DEFAULT_LANGUAGE_OPTIONS } from '../config/config.js';
import SPANISH from '../lang/es.json';

describe('I18n', () => {
    const i18n = new I18n();
    it('receives expected values from default language', () => {
        expect(i18n.getLocale()).toEqual('en-gb');
        const payload = I18n.getPayload();
        expect(payload).toEqual(DEFAULT_LANGUAGE);
    });

    it('should get the locale options', () => {
        const localeOptions = i18n.getLocaleOptions();
        expect(localeOptions).toEqual(DEFAULT_LANGUAGE_OPTIONS);
    });

    it('changes locale to spanish and receives expected values', async () => {
        expect(I18n.getText('common.labels.lblSearch')).toEqual('Search');
        global.fetch = jest.fn().mockImplementationOnce(() =>
            Promise.resolve({
                status: 200,
                json: () => Promise.resolve(SPANISH)
            })
        );
        await i18n.setLocale('es');
        expect(i18n.getLocale()).toEqual('es');
        expect(I18n.getText('common.labels.lblSearch')).toEqual('Buscar');
    });
    
    it('should check if the locale is supported', () => {
        expect(i18n.supportsLocale('es')).toEqual(true);
        expect(i18n.supportsLocale('en-gb')).toEqual(true);
        expect(i18n.supportsLocale('au')).toEqual(false);
    });
});

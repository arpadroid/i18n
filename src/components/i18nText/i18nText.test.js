import I18nText from './i18nText.js';
import I18n from '../../services/i18n.js';
import SPANISH from '../../lang/es.json';

describe('I18nText', () => {
    it('should render the text and update when the language is changed', async () => {
        const i18nText = new I18nText();
        i18nText.setAttribute('key', 'common.labels.lblSearch');
        i18nText.render();

        expect(i18nText.textContent).toEqual('Search');
        global.fetch = jest.fn().mockImplementationOnce(() =>
            Promise.resolve({
                status: 200,
                json: () => Promise.resolve(SPANISH)
            })
        );
        const i18n = I18n.getInstance();
        await i18n.setLocale('es');
        expect(i18n.getLocale()).toEqual('es');
        expect(i18nText.textContent).toEqual('Buscar');
    });
});

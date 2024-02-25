import { getPropertyValue, getURLParam, mergeObjects, ObserverTool } from '@arpadroid/tools';
import { DEFAULT_LANGUAGE_OPTIONS, DEFAULT_LOCALE, LANGUAGES_PATH } from '../config/config.js';
import DEFAULT_LANGUAGE from '../lang/en-gb.json';
export let TEXT = DEFAULT_LANGUAGE;
export let LOCALE = DEFAULT_LOCALE;

/**
 * Locale Option interface for the language selection.
 * @typedef {object} LocaleOption
 * @property {string} label - The label for the language.
 * @property {string} value - The value for the language.
 * @property {string} [flag] - The flag for the language.
 * @property {string} [icon] - The icon for the language.
 * @property {string} [country] - The country for the language.
 * @property {string} [language] - The language for the language.
 */

/**
 * The form configuration.
 * @typedef {object} i18nInterface
 * @property {Record<string, unknown>} [payload] - The language payload.
 * @property {string} [language] - The selected language string.
 * @property {string} [defaultLanguage] - The default selected language.
 * @property {string} [path] - The path to the language files.
 * @property {Record<string, LocaleOption>} localeOptions - Default locale list for user selection.
 * @export i18nInterface 
 */

/**
 * The I18nService class is responsible for managing the application locale.
 * @typedef {I18nService}
 * @class I18nService
 */
class I18n {
    /** @type {i18nInterface} _defaultConfig */
    _defaultConfig = {
        path: LANGUAGES_PATH,
        defaultLocale: DEFAULT_LOCALE,
        locale: DEFAULT_LOCALE,
        payload: DEFAULT_LANGUAGE,
        localeOptions: DEFAULT_LANGUAGE_OPTIONS
    };
    /** @type {i18nInterface} _config */
    _config = {};
    

    /** @property {string} defaultLocale - The default application locale. */
    static defaultLocale = DEFAULT_LOCALE;

    /** @type {(property: string, value: unknown) => void} signal */
    signal;

    /** @type {(property: string, callback: () => unknown) => () => void} listen */
    listen;

    /**
     * Set the configuration for the service.
     * @param {i18nInterface} config
     */
    constructor(config) {
        ObserverTool.mixin(this);
        this.setConfig(config);
    }

    _loadDefaultPayload() {
        return this.fetchLanguage(I18n.defaultLocale).then(payload => {
            TEXT = payload;
            return Promise.resolve(payload);
        });
    }

    /**
     * Set the configuration for the service.
     * @param {i18nInterface} config
     */
    setConfig(config) {
        this._config = mergeObjects(this._defaultConfig, config);
        if (this._config?.locale) {
            LOCALE = this._config.locale;
        }
    }

    /**
     * Initializes the service.
     * @returns {Promise<unknown>}
     */
    initialize() {
        return this._loadDefaultPayload();
    }

    /**
     * Returns the locale options.
     * @returns {Record<string, LocaleOption>}
     */
    getLocaleOptions() {
        return this._config.localeOptions;
    }

    /**
     * Gets an entry from the current language payload given a path.
     * @param {string} path
     * @param {boolean} includeCommon
     * @returns {Record<string, unknown>}
     */
    static get(path, includeCommon = true) {
        const payload = this.getPayload(path);
        const rv = this.getDefaultPayload(path, payload);
        if (includeCommon) {
            this.addCommonPayload(rv, path);
        }
        return rv;
    }

    static getText(path) {
        return getPropertyValue(path, TEXT);
    }

    /**
     * Gets the locale payload given a path.
     * @param {string} path
     * @param {Record<string, unknown>} payload
     * @returns {Record<string, unknown>}
     */
    static getPayload(path, payload = TEXT) {
        if (!path) {
            return payload;
        }
        return getPropertyValue(path, payload, {});
    }

    /**
     * The default locale payload.
     * @param {string} path
     * @param {Record<string, any>} payload
     * @returns {Record<string, any>}
     */
    static getDefaultPayload(path, payload) {
        const defaultPayload = getPropertyValue(path, DEFAULT_LANGUAGE, {});
        if (JSON.stringify(payload) === '{}') {
            payload = { ...defaultPayload };
        }
        if (LOCALE !== I18n.defaultLocale) {
            payload = { ...defaultPayload, ...payload };
        }
        return payload;
    }
    /**
     * Adds the 'common' payload to the requested item payload.
     * @param {Record<string, any>} payload
     * @param {string} path
     */
    static addCommonPayload(payload, path) {
        if (path.indexOf('common') !== 0) {
            payload.common = { ...I18n.get('common') };
        }
    }
    /**
     * Returns the locale String.
     * @returns {string}
     */
    getLocale() {
        const locale = this.getURLocale() ?? this.getStoredLocale() ?? LOCALE ?? I18n.defaultLocale;
        return this.preprocessLocale(locale);
    }

    /**
     * Returns the query string locale value from the URL.
     * @returns {string}
     */
    getURLocale() {
        return getURLParam('language');
    }

    /**
     * Preprocesses the locale.
     * @param {string} locale
     * @returns {string}
     */
    preprocessLocale(locale) {
        const lang = locale.toLowerCase();
        if (lang === 'en-au') {
            return 'en-gb';
        }
        return lang;
    }

    /**
     * Sets the locale.
     * @param {string} locale
     * @returns {Promise<Response>}
     */
    setLocale(locale) {
        return new Promise(resolve => {
            if (this.preprocessLocale(locale)) {
                this.fetchLanguage(locale).then(resolve);
            } else {
                this.setDefaultLocale();
                resolve(DEFAULT_LANGUAGE);
            }
        });
    }

    /**
     * Fetches the language payload from the server.
     * @param {string} locale
     * @returns {Promise<Response>}
     */
    fetchLanguage(locale) {
        const url = this._config.path + `/${locale}.json`;
        return fetch(url)
            .then(response => response.json())
            .then(payload => {
                this.handleFetchPayload(locale, payload);
                return Promise.resolve(payload);
            })
            .catch(() => {
                this.setDefaultLocale();
                return Promise.resolve(DEFAULT_LANGUAGE);
            });
    }

    /**
     * Handles receipt of the language payload from the server.
     * @param {string} locale
     * @param {Record<string, any>} payload
     */
    handleFetchPayload(locale, payload) {
        LOCALE = locale;
        TEXT = payload;
        this.storeLocale(LOCALE);
        this.signal('locale', { locale: LOCALE, payload: TEXT });
    }

    /**
     * User action for changing locale.
     * @param {*} locale
     * @returns {Promise<Response>}
     */
    changeLocale(locale) {
        if (!this.supportsLocale(locale)) {
            return Promise.reject(`locale not supported: ${locale}`);
        }
        return this.setLocale(locale).then(locale => {
            this.setUserLocale(locale);
            return Promise.resolve(locale);
        });
    }

    /**
     * Sets the locale to the defaultLocale.
     */
    setDefaultLocale() {
        TEXT = DEFAULT_LANGUAGE;
        LOCALE = I18n.defaultLocale;
        this.signal('locale', { locale: LOCALE, payload: TEXT });
    }

    /**
     * Saves the language in the local storage.
     * @param {string} locale
     */
    storeLocale(locale) {
        if (typeof locale === 'string') {
            window.localStorage.setItem('selectedLanguage', locale);
        }
    }

    /**
     * Returns the language from local storage.
     * @returns {string}
     */
    getStoredLocale() {
        return localStorage?.getItem('selectedLanguage');
    }

    /**
     * Checks id the language exists in languageOptions.
     * @param {string} locale
     * @param {[]} options
     * @returns {boolean}
     */
    supportsLocale(locale, options = this._config.localeOptions) {
        return Boolean(options.find(lang => lang.value === locale));
    }

    static setText(key, node, replacements = {}) {
        let text = I18n.getText(key);
        if (typeof text !== 'string' || !(node instanceof HTMLElement)) {
            console.error('I18n.setText: invalid arguments');
            return;
        }
        for (const [key, value] of Object.entries(replacements)) {
            text = text.replace(`{${key}}`, value);
        }
        node.setAttribute('data-i18n', key);
        const replacementCount = Object.entries(replacements).length;
        if (replacementCount) {
            node.innerHTML = text;
        } else {
            node.textContent = text;
        }
    }
}

export default I18n;

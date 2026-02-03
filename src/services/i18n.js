/**
 * @typedef {import('./i18n.types').I18nConfigType} I18nConfigType
 * @typedef {import('./i18n.types').LanguagePayloadType} LanguagePayloadType
 * @typedef {import('./i18n.types').LanguageResponseType} LanguageResponseType
 * @typedef {import('./i18n.types').LocaleOptionType} LocaleOptionType
 * @typedef {import('@arpadroid/tools').ObserverType} ObserverType
 */

import { getPropertyValue, getURLParam, mergeObjects, observerMixin } from '@arpadroid/tools';
import { dummySignal, dummyListener } from '@arpadroid/tools';
import { DEFAULT_LANGUAGE_OPTIONS, DEFAULT_LOCALE, LANGUAGES_PATH } from '../config/config.js';

/**
 * @class
 * @mixes {ObserverType}
 * The I18n service class is responsible for managing the application locale.
 * It is used to fetch, store and switch the language.
 * It should be used as a singleton.
 */
class I18n {
    /** @type {I18n | undefined} */
    static _instance;
    /**
     * Returns the instance of the I18n service.
     * @param {I18nConfigType} config
     * @returns {I18n}
     */
    static getInstance(config = {}) {
        if (!window?.i18nInstance) {
            window.i18nInstance = new I18n(config);
        }
        this._instance = window.i18nInstance;
        return window.i18nInstance;
    }

    /** @property {I18nConfigType} _defaultConfig - The default config. */
    _defaultConfig = {
        path: LANGUAGES_PATH,
        defaultLocale: DEFAULT_LOCALE,
        locale: DEFAULT_LOCALE,
        payload: undefined,
        localeOptions: DEFAULT_LANGUAGE_OPTIONS,
        urlParam: 'language'
    };

    /** @property {string} defaultLocale - The default application locale. */
    static defaultLocale = DEFAULT_LOCALE;

    /**
     * Set the configuration for the service.
     * @param {I18nConfigType} config
     */
    constructor(config = {}) {
        this.payload = undefined;
        I18n._instance = this;
        this.signal = dummySignal;
        this.on = dummyListener;
        observerMixin(this);
        this.setConfig(config);
        if (!this.payload || JSON.stringify(this.payload) === '{}') {
            this._loadDefaultPayload();
        } else {
            this.signal('locale', { locale: this.locale, payload: this.payload });
        }
    }

    _loadDefaultPayload() {
        /**
         * Returns the payload from the default locale.
         * @param {LanguagePayloadType} payload
         * @returns {Promise<LanguagePayloadType>}
         */
        const onFetched = (payload = {}) => {
            this.payload = payload;
            return Promise.resolve(payload);
        };
        return this.fetchLanguage(I18n.defaultLocale).then(onFetched);
    }

    /**
     * Set the configuration for the service.
     * @param {I18nConfigType} config
     */
    setConfig(config = {}) {
        /** @type {I18nConfigType} */
        this._config = mergeObjects(this._defaultConfig, config);
        this.payload = this._config?.payload;
        this.locale = this._config?.locale;
    }

    /**
     * Initializes the service.
     * @returns {LanguageResponseType}
     */
    initialize() {
        return this._loadDefaultPayload();
    }

    /**
     * Returns the locale options.
     * @returns {LocaleOptionType[] | undefined}
     */
    getLocaleOptions() {
        return this._config?.localeOptions;
    }

    /**
     * Gets an entry from the current language payload given a path.
     * @param {string} path
     * @param {boolean} includeCommon
     * @returns {LanguagePayloadType}
     */
    static get(path, includeCommon = true) {
        /** @type {LanguagePayloadType | {}} */
        const payload = this.getPayload(path) || {};
        const rv = this.getDefaultPayload(path, payload);
        if (includeCommon) {
            this.addCommonPayload(rv, path);
        }
        return rv;
    }

    /**
     * Gets the text from the current language payload given a path.
     * @param {string} path
     * @param {Record<string, string | number>} replacements
     * @param {LanguagePayloadType} payload
     * @returns {string}
     */
    static getText(path, replacements = {}, payload = I18n.getInstance()?.payload || {}) {
        let rv = getPropertyValue(path, payload, undefined) || '';
        if (typeof rv !== 'string') return '';
        for (const [key, value] of Object.entries(replacements)) {
            rv = rv.toString().replace(`{${key}}`, String(value));
        }
        return rv.toString() || '';
    }

    /**
     * Gets the locale payload given a path.
     * @param {string} [path]
     * @param {LanguagePayloadType} payload
     * @returns {LanguagePayloadType | unknown}
     */
    static getPayload(path, payload = I18n.getInstance()?.payload || {}) {
        return (!path && payload) || getPropertyValue(path || '', payload, {});
    }

    /**
     * The default locale payload.
     * @param {string} path
     * @param {LanguagePayloadType} payload
     * @returns {LanguagePayloadType}
     */
    static getDefaultPayload(path, payload) {
        const instance = I18n.getInstance();
        const defaultLanguage = instance._config?.payload || {};
        const defaultPayload = getPropertyValue(path, defaultLanguage, {}) || {};
        if (JSON.stringify(payload) === '{}') {
            payload = { ...defaultPayload };
        }
        if (instance.locale !== I18n.defaultLocale) {
            payload = { ...defaultPayload, ...payload };
        }
        return payload;
    }
    /**
     * Adds the 'common' payload to the requested item payload.
     * @param {LanguagePayloadType} payload
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
        const locale = this.getURLocale() ?? this.getStoredLocale() ?? this.locale ?? I18n.defaultLocale;
        return this.preprocessLocale(locale);
    }

    /**
     * Returns the locale value in the URL query string.
     * @returns {string | undefined}
     */
    getURLocale() {
        return getURLParam(this._config?.urlParam || '');
    }

    /**
     * Normalizes a locale string.
     * @param {string} locale
     * @returns {string}
     */
    preprocessLocale(locale) {
        const lang = locale.toLowerCase();
        if (lang === 'en-au') return 'en-gb';
        return lang;
    }

    /**
     * Sets the locale.
     * @param {string} locale
     * @returns {LanguageResponseType}
     */
    async setLocale(locale) {
        if (this.preprocessLocale(locale)) {
            return await this.fetchLanguage(locale);
        }
        this.setDefaultLocale();
        return this._config?.payload;
    }

    /**
     * Fetches the language payload from the server.
     * @param {string} locale
     * @returns {LanguageResponseType}
     */
    fetchLanguage(locale) {
        const url = (this._config?.path || '') + `/${locale}.json`;
        return fetch(url)
            .then(response => response.json())
            .then(payload => {
                this.handleFetchPayload(locale, payload);
                return Promise.resolve(payload);
            })
            .catch(() => {
                this.setDefaultLocale();
                return Promise.resolve(this._config?.payload);
            });
    }

    /**
     * Handles receipt of the language payload from the server.
     * @param {string} locale
     * @param {LanguagePayloadType} payload
     */
    handleFetchPayload(locale, payload) {
        this.locale = locale;
        this.payload = payload;
        this.storeLocale(this.locale);
        this.signal('locale', { locale: this.locale, payload: this.payload });
    }

    /**
     * User action for changing locale.
     * @param {string} locale
     * @returns {Promise<unknown>}
     */
    changeLocale(locale) {
        if (!this.supportsLocale(locale)) {
            return Promise.reject(`locale not supported: ${locale}`);
        }
        return this.setLocale(locale).then(Promise.resolve);
    }

    /**
     * Sets the locale to the defaultLocale.
     * @param {LanguagePayloadType | undefined} defaultPayload
     */
    setDefaultLocale(defaultPayload = this._config?.payload) {
        this.payload = defaultPayload;
        this.locale = I18n.defaultLocale;
        this.signal('locale', { locale: this.locale, payload: this.payload });
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
     * @returns {string | null}
     */
    getStoredLocale() {
        return localStorage?.getItem('selectedLanguage');
    }

    /**
     * Checks if the given locale is supported by checking against localeOptions.
     * @param {string} locale
     * @param {LocaleOptionType[] | undefined} options
     * @returns {boolean}
     */
    supportsLocale(locale, options = this._config?.localeOptions) {
        return Boolean(options?.find(lang => lang.value === locale));
    }

    /**
     * Sets the text of an i18n node and with given key replaces the placeholders.
     * @param {string} key
     * @param {HTMLElement} node
     * @param {Record<string, string>} replacements
     */
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

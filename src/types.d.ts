import type I18n from './services/i18n';

export * from './services/i18n.types';

declare global {
    interface Window {
        i18nInstance: any | I18n;
    }
}

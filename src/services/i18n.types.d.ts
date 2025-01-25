import { ObserverType } from '@arpadroid/tools';

export type LanguagePayloadType = Record<string, unknown> & {
    common?: Record<string, unknown>;
};

export type LanguageResponseType = Promise<LanguagePayloadType | undefined>;

export type LocaleOptionType = {
    label: string;
    value: string;
    flag?: string;
    icon?: string;
    country?: string;
    language?: string;
    file?: string;
};

export type I18nConfigType = {
    payload?: LanguagePayloadType;
    locale?: string;
    defaultLocale?: string;
    path?: string;
    localeOptions?: LocaleOptionType[];
    urlParam?: string;
};

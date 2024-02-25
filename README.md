## Classes

<dl>
<dt><a href="#I18n">I18n</a></dt>
<dd><p>The I18n service class is responsible for managing the application locale.
It is used to fetch, store and switch the language.
It should be used as a singleton.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#signal - Emits a signal.">signal - Emits a signal.(signalName, payload)</a></dt>
<dd></dd>
<dt><a href="#listen - Listens for a signal.">listen - Listens for a signal.(signalName, callback)</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#LocaleOptionInterface">LocaleOptionInterface</a> : <code>object</code></dt>
<dd><p>Locale Option interface for the language selection.</p>
</dd>
<dt><a href="#i18nInterface">i18nInterface</a> : <code>object</code></dt>
<dd><p>The I18n instance configuration.</p>
</dd>
</dl>

<a name="I18n"></a>

## I18n
The I18n service class is responsible for managing the application locale.
It is used to fetch, store and switch the language.
It should be used as a singleton.

**Kind**: global class  

* [I18n](#I18n)
    * [new I18n(config)](#new_I18n_new)
    * _instance_
        * [._defaultConfig](#I18n+_defaultConfig)
        * [._config](#I18n+_config) : [<code>i18nInterface</code>](#i18nInterface)
        * [.defaultLocale](#I18n+defaultLocale)
        * [._config](#I18n+_config) : [<code>i18nInterface</code>](#i18nInterface)
        * [.setConfig(config)](#I18n+setConfig)
        * [.initialize()](#I18n+initialize) ⇒ <code>Promise.&lt;unknown&gt;</code>
        * [.getLocaleOptions()](#I18n+getLocaleOptions) ⇒ <code>Record.&lt;string, LocaleOptionInterface&gt;</code>
        * [.getLocale()](#I18n+getLocale) ⇒ <code>string</code>
        * [.getURLocale()](#I18n+getURLocale) ⇒ <code>string</code>
        * [.preprocessLocale(locale)](#I18n+preprocessLocale) ⇒ <code>string</code>
        * [.setLocale(locale)](#I18n+setLocale) ⇒ <code>Promise.&lt;Response&gt;</code>
        * [.fetchLanguage(locale)](#I18n+fetchLanguage) ⇒ <code>Promise.&lt;Response&gt;</code>
        * [.handleFetchPayload(locale, payload)](#I18n+handleFetchPayload)
        * [.changeLocale(locale)](#I18n+changeLocale) ⇒ <code>Promise.&lt;Response&gt;</code>
        * [.setDefaultLocale()](#I18n+setDefaultLocale)
        * [.storeLocale(locale)](#I18n+storeLocale)
        * [.getStoredLocale()](#I18n+getStoredLocale) ⇒ <code>string</code>
        * [.supportsLocale(locale, options)](#I18n+supportsLocale) ⇒ <code>boolean</code>
    * _static_
        * [.getInstance()](#I18n.getInstance) ⇒ [<code>I18n</code>](#I18n)
        * [.get(path, includeCommon)](#I18n.get) ⇒ <code>Record.&lt;string, unknown&gt;</code>
        * [.getPayload(path, payload)](#I18n.getPayload) ⇒ <code>Record.&lt;string, unknown&gt;</code>
        * [.getDefaultPayload(path, payload)](#I18n.getDefaultPayload) ⇒ <code>Record.&lt;string, unknown&gt;</code>
        * [.addCommonPayload(payload, path)](#I18n.addCommonPayload)

<a name="new_I18n_new"></a>

### new I18n(config)
Set the configuration for the service.


| Param | Type |
| --- | --- |
| config | [<code>i18nInterface</code>](#i18nInterface) | 

<a name="I18n+_defaultConfig"></a>

### i18n.\_defaultConfig
**Kind**: instance property of [<code>I18n</code>](#I18n)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| _defaultConfig | [<code>i18nInterface</code>](#i18nInterface) | The default config. |

<a name="I18n+_config"></a>

### i18n.\_config : [<code>i18nInterface</code>](#i18nInterface)
_config - The configuration.

**Kind**: instance property of [<code>I18n</code>](#I18n)  
<a name="I18n+defaultLocale"></a>

### i18n.defaultLocale
**Kind**: instance property of [<code>I18n</code>](#I18n)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| defaultLocale | <code>string</code> | The default application locale. |

<a name="I18n+_config"></a>

### i18n.\_config : [<code>i18nInterface</code>](#i18nInterface)
**Kind**: instance property of [<code>I18n</code>](#I18n)  
<a name="I18n+setConfig"></a>

### i18n.setConfig(config)
Set the configuration for the service.

**Kind**: instance method of [<code>I18n</code>](#I18n)  

| Param | Type |
| --- | --- |
| config | [<code>i18nInterface</code>](#i18nInterface) | 

<a name="I18n+initialize"></a>

### i18n.initialize() ⇒ <code>Promise.&lt;unknown&gt;</code>
Initializes the service.

**Kind**: instance method of [<code>I18n</code>](#I18n)  
<a name="I18n+getLocaleOptions"></a>

### i18n.getLocaleOptions() ⇒ <code>Record.&lt;string, LocaleOptionInterface&gt;</code>
Returns the locale options.

**Kind**: instance method of [<code>I18n</code>](#I18n)  
<a name="I18n+getLocale"></a>

### i18n.getLocale() ⇒ <code>string</code>
Returns the locale String.

**Kind**: instance method of [<code>I18n</code>](#I18n)  
<a name="I18n+getURLocale"></a>

### i18n.getURLocale() ⇒ <code>string</code>
Returns the locale value in the URL query string.

**Kind**: instance method of [<code>I18n</code>](#I18n)  
<a name="I18n+preprocessLocale"></a>

### i18n.preprocessLocale(locale) ⇒ <code>string</code>
Normalizes a locale string.

**Kind**: instance method of [<code>I18n</code>](#I18n)  

| Param | Type |
| --- | --- |
| locale | <code>string</code> | 

<a name="I18n+setLocale"></a>

### i18n.setLocale(locale) ⇒ <code>Promise.&lt;Response&gt;</code>
Sets the locale.

**Kind**: instance method of [<code>I18n</code>](#I18n)  

| Param | Type |
| --- | --- |
| locale | <code>string</code> | 

<a name="I18n+fetchLanguage"></a>

### i18n.fetchLanguage(locale) ⇒ <code>Promise.&lt;Response&gt;</code>
Fetches the language payload from the server.

**Kind**: instance method of [<code>I18n</code>](#I18n)  

| Param | Type |
| --- | --- |
| locale | <code>string</code> | 

<a name="I18n+handleFetchPayload"></a>

### i18n.handleFetchPayload(locale, payload)
Handles receipt of the language payload from the server.

**Kind**: instance method of [<code>I18n</code>](#I18n)  

| Param | Type |
| --- | --- |
| locale | <code>string</code> | 
| payload | <code>Record.&lt;string, any&gt;</code> | 

<a name="I18n+changeLocale"></a>

### i18n.changeLocale(locale) ⇒ <code>Promise.&lt;Response&gt;</code>
User action for changing locale.

**Kind**: instance method of [<code>I18n</code>](#I18n)  

| Param | Type |
| --- | --- |
| locale | <code>\*</code> | 

<a name="I18n+setDefaultLocale"></a>

### i18n.setDefaultLocale()
Sets the locale to the defaultLocale.

**Kind**: instance method of [<code>I18n</code>](#I18n)  
<a name="I18n+storeLocale"></a>

### i18n.storeLocale(locale)
Saves the language in the local storage.

**Kind**: instance method of [<code>I18n</code>](#I18n)  

| Param | Type |
| --- | --- |
| locale | <code>string</code> | 

<a name="I18n+getStoredLocale"></a>

### i18n.getStoredLocale() ⇒ <code>string</code>
Returns the language from local storage.

**Kind**: instance method of [<code>I18n</code>](#I18n)  
<a name="I18n+supportsLocale"></a>

### i18n.supportsLocale(locale, options) ⇒ <code>boolean</code>
Checks if the given locale is supported by checking against localeOptions.

**Kind**: instance method of [<code>I18n</code>](#I18n)  

| Param | Type |
| --- | --- |
| locale | <code>string</code> | 
| options | [<code>Array.&lt;LocaleOptionInterface&gt;</code>](#LocaleOptionInterface) | 

<a name="I18n.getInstance"></a>

### I18n.getInstance() ⇒ [<code>I18n</code>](#I18n)
Returns the instance of the I18n service.

**Kind**: static method of [<code>I18n</code>](#I18n)  
<a name="I18n.get"></a>

### I18n.get(path, includeCommon) ⇒ <code>Record.&lt;string, unknown&gt;</code>
Gets an entry from the current language payload given a path.

**Kind**: static method of [<code>I18n</code>](#I18n)  

| Param | Type | Default |
| --- | --- | --- |
| path | <code>string</code> |  | 
| includeCommon | <code>boolean</code> | <code>true</code> | 

<a name="I18n.getPayload"></a>

### I18n.getPayload(path, payload) ⇒ <code>Record.&lt;string, unknown&gt;</code>
Gets the locale payload given a path.

**Kind**: static method of [<code>I18n</code>](#I18n)  

| Param | Type |
| --- | --- |
| path | <code>string</code> | 
| payload | <code>Record.&lt;string, unknown&gt;</code> | 

<a name="I18n.getDefaultPayload"></a>

### I18n.getDefaultPayload(path, payload) ⇒ <code>Record.&lt;string, unknown&gt;</code>
The default locale payload.

**Kind**: static method of [<code>I18n</code>](#I18n)  

| Param | Type |
| --- | --- |
| path | <code>string</code> | 
| payload | <code>Record.&lt;string, unknown&gt;</code> | 

<a name="I18n.addCommonPayload"></a>

### I18n.addCommonPayload(payload, path)
Adds the 'common' payload to the requested item payload.

**Kind**: static method of [<code>I18n</code>](#I18n)  

| Param | Type |
| --- | --- |
| payload | <code>Record.&lt;string, unknown&gt;</code> | 
| path | <code>string</code> | 

<a name="signal - Emits a signal."></a>

## signal - Emits a signal.(signalName, payload)
**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| signalName | <code>string</code> |  |
| payload | <code>unknown</code> | The payload to send with the signal. |

<a name="listen - Listens for a signal."></a>

## listen - Listens for a signal.(signalName, callback)
**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| signalName | <code>string</code> | The signal to listen for. |
| callback | <code>function</code> | The callback function. |

<a name="LocaleOptionInterface"></a>

## LocaleOptionInterface : <code>object</code>
Locale Option interface for the language selection.

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| label | <code>string</code> | The label for the language. |
| value | <code>string</code> | The value for the language. |
| [flag] | <code>string</code> | The flag for the language. |
| [icon] | <code>string</code> | The icon for the language. |
| [country] | <code>string</code> | The country for the language. |
| [language] | <code>string</code> | The language for the language. |
| [file] | <code>string</code> | The file for the language. |

<a name="i18nInterface"></a>

## i18nInterface : <code>object</code>
The I18n instance configuration.

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [payload] | <code>Record.&lt;string, unknown&gt;</code> | The language payload. |
| [locale] | <code>string</code> | The currently selected language code. |
| [defaultLocale] | <code>string</code> | The default language code. |
| [path] | <code>string</code> | The path to the language files. |
| localeOptions | <code>Record.&lt;string, LocaleOptionInterface&gt;</code> | Default locale list for user selection. |
| [urlParam] | <code>string</code> | The URL parameter for the language. |


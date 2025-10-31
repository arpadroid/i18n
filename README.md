# @arpadroid/i18n

A comprehensive internationalization (i18n) library for JavaScript applications, providing dynamic language switching, text replacement, and custom web components for seamless multilingual user experiences.

[![npm version](https://badge.fury.io/js/@arpadroid%2Fi18n.svg)](https://www.npmjs.com/package/@arpadroid/i18n)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

🌍 **Dynamic Language Switching** - Runtime locale changes with automatic content updates  
📦 **Singleton Service** - Centralized i18n management with observer pattern  
🔄 **Text Replacement** - Template-based string interpolation with placeholder support  
🎯 **Custom Web Components** - Drop-in `<i18n-text>` elements for declarative internationalization  
💾 **Persistent Storage** - Automatic locale persistence in localStorage  
🌐 **URL Integration** - Language selection via URL parameters  
⚡ **Lazy Loading** - On-demand language file fetching  
🛠️ **TypeScript Support** - Full type definitions included

## Installation

```bash
npm install @arpadroid/i18n
```

## Quick Start

```javascript
import { I18n, I18nText } from '@arpadroid/i18n';

// Initialize the i18n service
const i18n = I18n.getInstance({
    defaultLocale: 'en',
    path: '/locales',
    localeOptions: [
        { label: 'English', value: 'en' },
        { label: 'Español', value: 'es' },
        { label: 'Français', value: 'fr' }
    ]
});

// Change language
await i18n.changeLocale('es');

// Get translated text
const welcomeText = I18n.getText('welcome.message');
```

### HTML Usage

```html
<!-- Basic internationalized text -->
<i18n-text key="navigation.home"></i18n-text>

<!-- With variable replacement -->
<i18n-text key="welcome.greeting" replacements="name::John,time::morning"></i18n-text>

<!-- With nested replacement content -->
<i18n-text key="profile.status">
    <i18n-replace name="username">JohnDoe</i18n-replace>
    <i18n-replace name="count">42</i18n-replace>
</i18n-text>
```

## API Reference

### I18n Service

The core internationalization service implementing the singleton pattern.

#### Static Methods

##### `I18n.getInstance(config)`
Returns the singleton instance of the I18n service.

```javascript
const i18n = I18n.getInstance({
    defaultLocale: 'en',
    path: '/i18n',
    localeOptions: [
        { label: 'English', value: 'en' },
        { label: 'Spanish', value: 'es' }
    ]
});
```

##### `I18n.getText(path, replacements, payload)`
Retrieves translated text with optional variable replacement.

```javascript
// Basic usage
const text = I18n.getText('errors.validation.required');

// With replacements
const text = I18n.getText('welcome.user', { name: 'John', role: 'admin' });
```

##### `I18n.get(path, includeCommon)`
Gets language payload data for a specific path.

```javascript
const formLabels = I18n.get('forms.labels');
```

##### `I18n.setText(key, element, replacements)`
Sets internationalized text content on HTML elements.

```javascript
const button = document.querySelector('#submit-btn');
I18n.setText('buttons.submit', button, { action: 'save' });
```

#### Instance Methods

##### `setLocale(locale)`
Sets the current locale and fetches language data.

```javascript
await i18n.setLocale('fr');
```

##### `changeLocale(locale)`
User-triggered locale change with validation.

```javascript
try {
    await i18n.changeLocale('de');
} catch (error) {
    console.error('Unsupported locale:', error);
}
```

##### `getLocale()`
Returns the current locale, considering URL parameters, stored preferences, and defaults.

```javascript
const currentLocale = i18n.getLocale(); // 'en'
```

##### `supportsLocale(locale, options)`
Checks if a locale is supported.

```javascript
const isSupported = i18n.supportsLocale('ja'); // false
```

### I18nText Web Component

Custom element for declarative internationalization in HTML.

#### Attributes

- `key` - Translation key path
- `replacements` - Comma-separated key::value pairs for variable substitution

#### Child Elements

- `<i18n-replace name="key">content</i18n-replace>` - Named replacement content

#### Example

```html
<i18n-text key="notifications.email">
    <i18n-replace name="count">5</i18n-replace>
    <i18n-replace name="action"><strong>reply</strong></i18n-replace>
</i18n-text>
```

### I18n Utility Tools

#### `parseI18nText(text, returnType)`
Parses text for i18n key patterns and returns processed content.

```javascript
import { parseI18nText } from '@arpadroid/i18n';

// Parse text with i18n keys
const parsed = parseI18nText('Welcome to i18n{app.name}!', 'text');
// Returns: "Welcome to My App!"

// Generate HTML components
const html = parseI18nText('Click i18n{buttons.here}', 'html');
// Returns: 'Click <i18n-text key="buttons.here"></i18n-text>'
```

#### `renderI18n(key, replacements, attributes)`
Programmatically creates i18n-text components.

```javascript
import { renderI18n } from '@arpadroid/i18n';

const component = renderI18n('user.greeting', 
    { name: 'Alice' }, 
    { class: 'welcome-text' }
);
```

## Configuration

### I18nConfigType

```typescript
type I18nConfigType = {
    payload?: LanguagePayloadType;        // Pre-loaded language data
    locale?: string;                      // Current locale
    defaultLocale?: string;               // Fallback locale
    path?: string;                        // Language files path
    localeOptions?: LocaleOptionType[];   // Available languages
    urlParam?: string;                    // URL parameter name for locale
    context?: Record<string, unknown>;    // Additional context data
};
```

### LocaleOptionType

```typescript
type LocaleOptionType = {
    label: string;     // Display name
    value: string;     // Locale code
    flag?: string;     // Flag emoji or icon
    icon?: string;     // Custom icon
    country?: string;  // Country name
    language?: string; // Language name
    file?: string;     // Custom language file
};
```

## Language File Structure

Language files should be JSON objects with nested structures:

```json
{
    "common": {
        "labels": {
            "submit": "Submit",
            "cancel": "Cancel",
            "loading": "Loading..."
        },
        "errors": {
            "required": "This field is required",
            "invalid": "Invalid {field} format"
        }
    },
    "navigation": {
        "home": "Home",
        "about": "About",
        "contact": "Contact"
    },
    "forms": {
        "login": {
            "title": "Sign In",
            "email": "Email Address",
            "password": "Password",
            "submit": "Sign In"
        }
    }
}
```

## Advanced Usage

### Event Handling

Listen for locale changes:

```javascript
const i18n = I18n.getInstance();

i18n.on('locale', ({ locale, payload }) => {
    console.log(`Language changed to: ${locale}`);
    // Update UI components
    updateDateFormats(locale);
    updateNumberFormats(locale);
});
```

### Custom Language Loading

```javascript
const i18n = I18n.getInstance({
    path: '/custom/locales',
    defaultLocale: 'en-US',
    localeOptions: [
        { label: 'English (US)', value: 'en-US' },
        { label: 'English (UK)', value: 'en-GB' },
        { label: 'Español (México)', value: 'es-MX' }
    ]
});
```

### URL Parameter Integration

Enable automatic locale detection from URL:

```javascript
// URL: https://example.com?language=es
const i18n = I18n.getInstance({
    urlParam: 'language', // Reads ?language=es
    defaultLocale: 'en'
});

// Automatically loads Spanish if URL contains ?language=es
```

### Locale Preprocessing

Built-in locale normalization:

```javascript
// Automatically maps en-AU to en-GB
const locale = i18n.preprocessLocale('en-AU'); // Returns 'en-GB'
```

## Browser Support

- Modern browsers with ES6+ support
- Custom Elements v1
- Fetch API
- localStorage

## TypeScript

Full TypeScript support with comprehensive type definitions:

```typescript
import { I18n, I18nConfigType, LocaleOptionType } from '@arpadroid/i18n';

const config: I18nConfigType = {
    defaultLocale: 'en',
    localeOptions: [
        { label: 'English', value: 'en' }
    ]
};

const i18n = I18n.getInstance(config);
```

## Development

### Building

```bash
npm run build
```

### Testing

```bash
npm test
```

### Documentation

```bash
npm run generate-docs
```

## License

MIT © [Arpadroid](https://github.com/arpadroid)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Related Packages

- [@arpadroid/tools](https://www.npmjs.com/package/@arpadroid/tools) - Utility functions and helpers
- [@arpadroid/module](https://www.npmjs.com/package/@arpadroid/module) - Build system and development tools


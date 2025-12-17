# @arpadroid/i18n

Reactive internationalization for web components and vanilla JavaScript. Change language once, all UI updates automatically.

[![npm version](https://badge.fury.io/js/@arpadroid%2Fi18n.svg)](https://www.npmjs.com/package/@arpadroid/i18n)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Why this library?**
- **Zero-framework reactive i18n** — Built for vanilla JS and web components, no framework required
- **Declarative HTML syntax** — Use `<i18n-text>` in templates instead of manual JavaScript calls
- **Rich content replacements** — Embed HTML, links, icons, and styled elements in translations via `<i18n-replace>`
- **Truly reactive** — Change language once, all components auto-update via observer pattern
- **Simple singleton pattern** — No context providers, prop drilling, or manual wiring needed

## Installation

```bash
npm install @arpadroid/i18n @arpadroid/tools
```

## Quick Start

**Step 1:** Create language files at `/public/i18n/`

```json
// en.json
{
  "navigation": { "home": "Home", "about": "About" },
  "greeting": "Hello {name}!"
}
```

**Step 2:** Initialize once in your app

```javascript
import { I18n } from '@arpadroid/i18n';

I18n.getInstance({ path: '/i18n', defaultLocale: 'en' });
```

**Step 3:** Use in HTML or JavaScript

```html
<i18n-text key="navigation.home"></i18n-text>
<i18n-text key="greeting" replacements="name::John"></i18n-text>
```

```javascript
// Anywhere in your code
const text = I18n.getText('greeting', { name: 'Jane' });

// Change language - all components update automatically
await I18n.getInstance().changeLocale('es');
```

## How It Works

**Singleton Pattern** — One instance manages all translations globally. Access via `I18n.getInstance()` or static methods like `I18n.getText()`.

**Observer Pattern** — All `<i18n-text>` components subscribe to language changes. When you call `changeLocale()`, they automatically re-render.

**Lazy Loading** — Language files are fetched on-demand as JSON from your server.

```
Initialize → Load en.json → Components subscribe
                              ↓
User changes language → Fetch es.json → Signal observers → Auto re-render
```

## Essential Features

### Variable Interpolation

```javascript
// Language file: { "welcome": "Hello {name}, you have {count} messages" }
I18n.getText('welcome', { name: 'Alice', count: 5 });
// → "Hello Alice, you have 5 messages"
```

```html
<i18n-text key="welcome">
    <i18n-replace name="name"><strong>Alice</strong></i18n-replace>
    <i18n-replace name="count"><span class="badge">5</span></i18n-replace>
</i18n-text>
```

### Change Language

```javascript
const i18n = I18n.getInstance();
await i18n.changeLocale('es'); // All <i18n-text> components update automatically
```

### React to Language Changes

```javascript
i18n.on('locale', ({ locale, payload }) => {
    console.log(`Language changed to: ${locale}`);
    // Update date/number formats, etc.
});
```

## Common Use Cases

### URL Parameter Detection

```javascript
// Automatically reads ?lang=es from URL
I18n.getInstance({
    path: '/i18n',
    urlParam: 'lang'
});
```

## Language File Structure

Organize with namespaces for clarity:

```json
{
    "navigation": {
        "home": "Home",
        "about": "About"
    },
    "greeting": "Hello {name}!",
    "welcome": "Hello {name}, you have {count} messages",
    "forms": {
        "login": {
            "title": "Sign In",
            "email": "Email Address",
            "password": "Password"
        }
    },
    "common": {
        "labels": { "submit": "Submit", "cancel": "Cancel" },
        "errors": { "required": "This field is required" }
    }
}
```

**Access with dot notation:**
```javascript
I18n.getText('navigation.home');        // "Home"
I18n.getText('greeting', { name: 'Jane' });  // "Hello Jane!"
I18n.getText('forms.login.title');      // "Sign In"
I18n.getText('common.labels.submit');   // "Submit"
```

## API Reference

### I18n Service Methods

```javascript
// Get singleton instance
const i18n = I18n.getInstance(config);

// Static methods (work anywhere after initialization)
I18n.getText(path, replacements, payload);  // Get translated text
I18n.get(path, includeCommon);              // Get payload data
I18n.getPayload(path, payload);             // Get specific payload

// Instance methods
await i18n.changeLocale(locale);            // Change language (async)
i18n.getLocale();                           // Get current locale
i18n.supportsLocale(locale);                // Check if locale exists
i18n.on('locale', callback);                // Subscribe to changes
```

### Configuration Options

```typescript
I18n.getInstance({
    path: '/i18n',              // Where JSON files are served
    defaultLocale: 'en',        // Fallback language
    locale: 'es',               // Initial language (optional)
    urlParam: 'lang',           // Read from URL param (optional)
    payload: {...},             // Pre-loaded data (optional)
    localeOptions: [            // Available languages (optional)
        { label: 'English', value: 'en' }
    ]
});
```

### Utility Functions

```javascript
import { parseI18nText, renderI18n } from '@arpadroid/i18n';

// Parse i18n{key} syntax in strings
parseI18nText('Text with i18n{key}', 'text');  // Returns translated text
parseI18nText('Text with i18n{key}', 'html');  // Returns HTML with components

// Programmatically create component
renderI18n(key, replacements, attributes);
```

## TypeScript Support

Full type definitions included. See `src/services/i18n.types.d.ts` for complete type documentation.


## License

MIT © [Arpadroid](https://github.com/arpadroid)


## Related Packages

- [@arpadroid/tools](https://www.npmjs.com/package/@arpadroid/tools) - Utility functions and helpers
- [@arpadroid/module](https://www.npmjs.com/package/@arpadroid/module) - Build system and development tools


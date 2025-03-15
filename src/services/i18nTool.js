import { renderNode, mapHTML, camelToDashed, attrString } from '@arpadroid/tools';
import { processTemplate as _processTemplate, getProperty } from '@arpadroid/tools';
import I18n from './i18n.js';

const html = String.raw;

/**
 * Parses the text for i18n keys.
 * It will replace any occurrences of "i18n{some.key}" with the actual text, return the html tags as strings or the html live nodes for i18n-text component.
 * @param {string} text - The text to parse.
 * @param {'text' | 'html' | 'nodes'} returnType - The type of the return value.
 * @returns {string | HTMLElement[] | HTMLElement | undefined} The parsed text or nodes.
 */
export function parseI18nText(text, returnType = 'text') {
    /** @type {HTMLElement[]} */
    const nodes = [];
    const rv = text?.replace(/(?<!=")i18n{([^}]+)}/g, (match, key) => {
        const $text = I18n.getText(key) || match;
        const $html = html`<i18n-text key="${key}"></i18n-text>`;
        if (returnType === 'nodes') {
            const node = renderNode($html);
            node instanceof HTMLElement && nodes.push(node);
            return '';
        }
        return returnType === 'html' ? $html : $text;
    });
    return (nodes.length && nodes) || rv;
}

/**
 * Processes a template.
 * @param {string} template - The template to process.
 * @param {Record<string, any>} props - The properties to replace.
 * @param {'text' | 'html'} parseType - The type of the return value for the parsing function.
 * @returns {string | HTMLElement | HTMLElement[] | undefined}
 */
export function processTemplate(template, props = {}, parseType = 'html') {
    return parseI18nText(_processTemplate(template, props), parseType);
}

/**
 * Checks if a string is an i18n key.
 * @param {string} string - The string to check.
 * @returns {boolean}
 */
export function isI18nKey(string) {
    return !string.includes(' ') && string.includes('.');
}

/**
 * Renders an i18n component if a key is passed otherwise returns as is.
 * @param {string} key - The key to render.
 * @param {Record<string, unknown>} replacements - The replacements for the i18n text.
 * @param {Record<string, string>} attributes - The attributes to add to the i18n component.
 * @returns {string}
 */
export function renderI18n(key, replacements = {}, attributes = {}) {
    const name = key.split('.').pop();
    return I18n.getText(key)
        ? html`<i18n-text key="${key}" zone="i18n-${name}" ${attrString(attributes)}>
              ${mapHTML(
                  Object.keys(replacements),
                  (/** @type {string} */ key) =>
                      html`<i18n-replace name="${key}">${replacements[key]}</i18n-replace>`
              )}
          </i18n-text>`
        : '';
}

/**
 * Similar to renderI18n but for i18n-text components inside custom elements that extend ArpaElement.
 * The reason this is abstracted is to support custom built-in elements that don't extend ArpaElement.
 * @param {import('@arpadroid/tools').ElementType} element - The element to render the i18n-text component for.
 * @param {string} key - The key to render.
 * @param {Record<string, string>} [replacements] - The replacements for the i18n text.
 * @param {Record<string, string>} [attributes] - The attributes to add to the i18n component.
 * @param {string} [base] - The base key to use.
 * @returns {string} The rendered i18n text.
 */
export function arpaElementI18n(element, key, replacements = {}, attributes = {}, base = 'common') {
    const parts = key.split('.');
    const keyLast = parts.pop();
    const attributeName = camelToDashed(keyLast || '');
    const configValue = getProperty(element, attributeName);
    return configValue?.toString() || renderI18n(`${base}.${key}`, replacements, attributes);
}

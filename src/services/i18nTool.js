import { processTemplate as _processTemplate, renderNode } from '@arpadroid/tools';
import I18n from './i18n.js';

const html = String.raw;

/**
 * Parses the text for i18n keys.
 * It will replace any occurrences of "i18n{some.key}" with the actual text, return the html tags as strings or the html live nodes for i18n-text component.
 * @param {string} text - The text to parse.
 * @param {'text' | 'html' | 'nodes'} returnType - The type of the return value.
 * @returns {string | HTMLElement[] | HTMLElement | undefined} The parsed text or nodes.
 */
export function parseText(text, returnType = 'text') {
    const nodes = [];
    const rv = text?.replace(/(?<!=")i18n{([^}]+)}/g, (match, key) => {
        const $text = I18n.getText(key) || match;
        const $html = html`<i18n-text key="${key}"></i18n-text>`;
        if (returnType === 'nodes') {
            nodes.push(renderNode($html));
            return '';
        }
        return returnType === 'html' ? $html : $text;
    });
    return (nodes.length && nodes) || rv;
}

/**
 * Processes a template.
 * @param {string} template - The template to process.
 * @param {Record<string, unknown>} props - The properties to replace.
 * @param {'text' | 'html'} parseType - The type of the return value for the parsing function.
 * @returns {string}
 */
export function processTemplate(template, props = {}, parseType = 'html') {
    return parseText(_processTemplate(template, props), parseType);
}

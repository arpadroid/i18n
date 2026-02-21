/**
 * @typedef {import('@storybook/web-components-vite').StoryContext} StoryContext
 * @typedef {import('@storybook/web-components-vite').StoryObj} StoryObj
 */

import DEFAULT_LANGUAGE from '../../i18n/en.json';
import I18n from '../../services/i18n';

export const i18n = I18n.getInstance({
    payload: DEFAULT_LANGUAGE
});

/**
 * Setup function to be used in Storybook stories for the i18nText component.
 * It waits for the custom element to be defined and then selects the i18n-text node from the canvas.
 * @param {StoryContext} payload - The Storybook story context.
 * @returns {Promise<{i18nTextNode?: Element, i18n: I18n}>} An object containing the i18nTextNode and the i18n instance.
 */
export async function playSetup(payload) {
    const { canvasElement } = payload;
    await customElements.whenDefined('i18n-text');
    const i18nTextNode = canvasElement.querySelector('i18n-text') || undefined;
    return { i18nTextNode, i18n };
}

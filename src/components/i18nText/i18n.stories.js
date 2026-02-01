/**
 * @typedef {import('@storybook/web-components-vite').Meta} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj} StoryObj
 * @typedef {import('@storybook/web-components-vite').StoryContext} StoryContext
 * @typedef {import('@storybook/web-components-vite').Args} Args
 */
import DEFAULT_LANGUAGE from '../../i18n/en.json';
import { attrString } from '@arpadroid/tools';
import I18n from '../../services/i18n';
import { expect, waitFor } from 'storybook/test';

const i18n = I18n.getInstance({
    payload: DEFAULT_LANGUAGE
});

const html = String.raw;

/** @type {Meta} */
const I18nTextStory = {
    title: 'i18n/i18nText',
    tags: [],
    args: {
        key: 'i18n.testComponent.title'
    },
    render: (/** @type {Args} */ args) => {
        return html`<i18n-text ${attrString(args)}>${args.text || ''}</i18n-text>`;
    }
};

/** @type {StoryObj} */
export const Default = {
    name: 'Render',
    parameters: {},

    playSetup: async (/** @type {StoryContext} */ payload) => {
        const { canvasElement } = payload;
        await customElements.whenDefined('i18n-text');
        const i18nTextNode = canvasElement.querySelector('i18n-text');
        return { i18nTextNode, i18n };
    }
};

/** @type {StoryObj} */
export const Test = {
    play: async (/** @type {StoryContext} */ payload) => {
        const { canvas, step } = payload;
        const setup = await Default.playSetup(payload);
        const { i18nTextNode } = setup;
        await step('Renders the i18n-text component with the corresponding text', async () => {
            expect(i18nTextNode).not.toBeNull();
            await waitFor(() => expect(canvas.getByText('Test Component')).toBeInTheDocument());
        });
        await step('Changes the language to Spanish and updates the text', async () => {
            await i18n.setLocale('es');
            expect(i18n.getLocale()).toEqual('es');
            await waitFor(() => expect(canvas.getByText('Componente de Prueba')).toBeInTheDocument());
        });
    }
};

export default I18nTextStory;

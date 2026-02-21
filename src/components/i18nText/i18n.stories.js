/**
 * @typedef {import('@storybook/web-components-vite').Meta} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj} StoryObj
 * @typedef {import('@storybook/web-components-vite').StoryContext} StoryContext
 * @typedef {import('@storybook/web-components-vite').Args} Args
 */
import { attrString } from '@arpadroid/tools';
import { expect, waitFor } from 'storybook/test';
import { playSetup } from './stories.util.js';

const html = String.raw;

/** @type {Meta} */
const I18nTextStory = {
    title: 'i18n/i18nText',
    tags: [],
    args: {
        key: 'i18n.testComponent.title'
    },
    render: args => {
        return html`<i18n-text ${attrString(args)}>${args.text || ''}</i18n-text>`;
    }
};

/** @type {StoryObj} */
export const Default = {
    name: 'Render',
    parameters: {}
};

/** @type {StoryObj} */
export const Test = {
    play: async payload => {
        const { canvas, step } = payload;
        const setup = await playSetup(payload);
        const { i18nTextNode, i18n } = setup;
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

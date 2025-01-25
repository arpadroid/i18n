import DEFAULT_LANGUAGE from '../../../test/temp/en.json';
import { attrString } from '@arpadroid/tools';
import { waitFor, expect, within } from '@storybook/test';
import I18n from '../../services/i18n';

const i18n = I18n.getInstance({
    payload: DEFAULT_LANGUAGE
});

const html = String.raw;
const I18nTextStory = {
    title: 'Components/i18nText',
    tags: [],
    args: {
        key: 'i18n.testComponent.title'
    },
    render: args => {
        return html`<i18n-text ${attrString(args)}>${args.text || ''}</i18n-text>`;
    }
};

export const Default = {
    name: 'Render',
    parameters: {},
    playSetup: async canvasElement => {
        const canvas = within(canvasElement);
        await customElements.whenDefined('i18n-text');
        const i18nTextNode = canvasElement.querySelector('i18n-text');
        return { canvas, i18nTextNode, i18n };
    }
};

export const Test = {
    play: async ({ canvasElement, canvas, step }) => {
        const setup = await Default.playSetup(canvasElement);
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

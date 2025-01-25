import I18n from '../../services/i18n.js';

/**
 * Custom element for displaying internationalized text.
 */
class I18nText extends HTMLElement {
    constructor() {
        super();
        /** @type {I18n} */
        this.i18n = I18n.getInstance();
        this.update = this.update.bind(this);
        // @ts-ignore
        this.i18n.on('locale', this.update);
        this.replacementNodes = this.querySelectorAll('i18n-replace');
        this.replacementNodes.forEach(node => node.remove());
    }

    connectedCallback() {
        this.render();
    }

    update() {
        this.render();
    }

    /**
     * Renders the text.
     */
    render() {
        const key = this.getAttribute('key');
        let content = '';
        if (key) {
            const text = I18n.getText(key);
            if (text) {
                content = this.doReplacements(text);
            }
        }
        if (this.replacementNodes.length) {
            /** @type {string[][]} */
            const nodeReplacements = [];
            this.replacementNodes.forEach(node => {
                const name = node.getAttribute('name');
                nodeReplacements.push([name, node.innerHTML]);
            });
            content = this.doReplacements(content, nodeReplacements);
        }
        this.innerHTML = content;
    }

    /**
     * Retrieves the replacements from the 'replacements' attribute.
     * @returns {string[][]} Array of replacement key-value pairs.
     */
    getReplacements() {
        return (
            this.getAttribute('replacements')
                ?.split(',')
                .map(replacement => {
                    const [key, value] = replacement.split('::');
                    return [key, value];
                }) ?? []
        );
    }

    /**
     * Returns the replacements defined as attributes in the given node.
     * @param {Element} node - The node to get the replacements from.
     * @returns {Record<string, string>}
     */
    getReplacementAttributes(node) {
        /** @type {Record<string, string>} */
    getReplacementAttributes(node) {
        const attr = {};
        node.attributes.forEach(attribute => {
            const exceptions = ['key', 'replacements'];
            if (!exceptions.includes(attribute.name)) {
                attr[attribute.name] = attribute.value;
            }
        });
        return attr;
    }

    /**
     * Replaces the placeholders in the text with the given replacements.
     * @param {string} text - The text to replace the placeholders in.
     * @param {string[][]} replacements - Array of replacement key-value pairs.
     * @returns {string} The text with the replacements.
     */
    doReplacements(text, replacements = this.getReplacements()) {
        replacements.forEach(item => (text = text.replace(`{${item[0]}}`, item[1])));
        return text;
    }
}

if (!customElements.get('i18n-text')) {
    customElements.define('i18n-text', I18nText);
}
export default I18nText;

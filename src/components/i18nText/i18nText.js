import I18n from '../../services/i18n.js';

/**
 * Custom element for displaying internationalized text.
 */
class I18nText extends HTMLElement {
    /**
     * Defines the observed attributes for the element.
     * @returns {string[]} Array of observed attribute names.
     */
    static get observedAttributes() {
        return ['key', 'replacements'];
    }

    constructor() {
        super();
        /** @type {I18n} */
        this.i18n = I18n.getInstance();
        this.i18n.listen('locale', this.render.bind(this));
    }

    connectedCallback() {
        this.render();
    }

    /**
     * Renders the text.
     */
    render() {
        const key = this.getAttribute('key');
        if (key) {
            const text = I18n.getText(key);
            if (text) {
                this.textContent = this.doReplacements(text);
            }
        }
    }

    /**
     * Retrieves the replacements from the 'replacements' attribute.
     * @returns {Array} Array of replacement key-value pairs.
     */
    getReplacements() {
        return (
            this.getAttribute('replacements')
                ?.split(',')
                .map(replacement => {
                    const [key, value] = replacement.split(':');
                    return [key, value];
                }) ?? []
        );
    }

    /**
     * Replaces the placeholders in the text with the given replacements.
     * @param {string} text - The text to replace the placeholders in.
     * @param {Array} replacements - Array of replacement key-value pairs.
     * @returns {string} The text with the replacements.
     */
    doReplacements(text, replacements = this.getReplacements()) {
        replacements.forEach(item => (text = text.replace(`{${item[0]}}`, item[1])));
        return text;
    }
}

customElements.define('i18n-text', I18nText);
export default I18nText;

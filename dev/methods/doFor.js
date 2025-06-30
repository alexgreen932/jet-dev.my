import { resolveDataPath } from './helpers.js';

/**
 * Processes all elements with `j-for` attribute.
 * Repeats the element's inner content for each item in the provided array.
 */
export default function doFor(str) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, 'text/html');

    // Find all elements with `j-for` directive
    const elements = doc.querySelectorAll('[j-for]');

    elements.forEach(element => {
        const forValue = element.getAttribute('j-for');
        element.removeAttribute('j-for');

        let key = 'e', idx = 'i', arr = '';

        // Parse the "item in array" syntax
        if (forValue.includes(' in ')) {
            const [left, right] = forValue.split(' in ').map(s => s.trim());
            arr = right;

            if (left.startsWith('(') && left.endsWith(')')) {
                // (item, index) in array
                [key, idx] = left.slice(1, -1).split(',').map(s => s.trim());
            } else {
                // item in array
                key = left;
            }
        } else {
            // short form: "array"
            arr = forValue;
        }

        // this.j_deb('com-for', [ [evalArray, 'on load'], [resolveDataPath(this, arr), 'array key'] ]);

        const evalArray = resolveDataPath(this, arr);
        if (!Array.isArray(evalArray)) return;

        //re rendering checker
        this.data_update_checker( evalArray, arr );

        const isTemplate = element.tagName.toLowerCase() === 'template';
        const wrapper = document.createElement('div');

        evalArray.forEach((item, index) => {
            let fragment;

            // Clone the content to render for this item
            if (isTemplate) {
                fragment = element.content.cloneNode(true);
            } else {
                fragment = document.createDocumentFragment();
                fragment.appendChild(element.cloneNode(true));
            }

            // Walk through all text and element nodes inside the fragment
            const walker = document.createTreeWalker(
                fragment,
                NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
                null,
                false
            );

            while (walker.nextNode()) {
                const node = walker.currentNode;

                // TEXT NODE: Replace bracket expressions like [e[1]], [e], [e.title]
                if (node.nodeType === 3 && typeof node.textContent === 'string' && node.textContent.includes('[')) {
                    node.textContent = replaceBrackets(node.textContent, key, idx, item, index);
                }

                // ELEMENT NODE: Handle bracket expressions in attributes + j-html
                if (node.attributes) {
                    for (let attr of [...node.attributes]) {
                        if (attr.value.includes('[')) {
                            attr.value = replaceBrackets(attr.value, key, idx, item, index);
                        }

                        // Support j-html for injecting raw HTML into the element
                        if (attr.name === 'j-html') {
                            const htmlExpr = attr.value;
                            try {
                                const htmlContent = new Function(key, idx, `return ${htmlExpr}`)(item, index);
                                node.innerHTML = htmlContent;
                            } catch (err) {
                                node.innerHTML = `<pre>Error in j-html: ${htmlExpr}</pre>`;
                            }
                            node.removeAttribute('j-html');
                        }
                    }
                }
            }

            wrapper.appendChild(fragment);
        });

        // Replace the original template or element with rendered content
        element.replaceWith(...wrapper.childNodes);
    });

    return doc.body.innerHTML;
}

/**
 * Replaces [bracketed expressions] inside text/attributes using JS eval.
 * Handles [e], [i], [e[1]], [e.title], etc.
 * Now safely skips non-strings and catches runtime errors.
 */
function replaceBrackets(text, key, idx, item, index) {
    if (typeof text !== 'string') return text;

    return text.replace(/\[([^\[\]]+(\[[^\[\]]*\])?[^\[\]]*)\]/g, (match, expr) => {
        let result;

        try {
            result = new Function(key, idx, `return ${expr}`)(item, index);
        } catch (err) {
            console.warn('⚠️ Expression error:', expr, err);
            return match;
        }

        // Safeguard: Convert undefined/null/objects to strings
        if (result === undefined || result === null) {
            return '';
        }

        if (typeof result === 'object') {
            try {
                return JSON.stringify(result); // Safe fallback
            } catch {
                return '[Object]'; // Avoid crash if circular
            }
        }

        return String(result);
    });
}



import { resolveDataPath } from './help-functions.js';

export default function doFor(str) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, 'text/html');
    const elements = doc.querySelectorAll('[j-for]');

    elements.forEach(element => {
        const forValue = element.getAttribute('j-for');
        element.removeAttribute('j-for');

        let key = 'e', idx = 'i', arr = '';

        if (forValue.includes(' in ')) {
            let [left, right] = forValue.split(' in ').map(s => s.trim());
            arr = right;

            if (left.startsWith('(') && left.endsWith(')')) {
                [key, idx] = left.slice(1, -1).split(',').map(s => s.trim());
            } else {
                key = left;
            }
        } else {
            arr = forValue;
        }

        const evalArray = resolveDataPath(this, arr);
        if (!Array.isArray(evalArray)) return;

        const isTemplate = element.tagName.toLowerCase() === 'template';
        const wrapper = document.createElement('div');

        evalArray.forEach((item, index) => {
            let fragment;
            if (isTemplate) {
                fragment = element.content.cloneNode(true);
            } else {
                fragment = document.createDocumentFragment();
                fragment.appendChild(element.cloneNode(true));
            }

            const walker = document.createTreeWalker(
                fragment,
                NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
                null,
                false
            );

            while (walker.nextNode()) {
                const node = walker.currentNode;

                // ✅ Handle text content replacements with full bracket support
                if (node.nodeType === 3 && node.textContent.includes('[')) {
                    node.textContent = replaceBrackets(node.textContent, key, idx, item, index);
                    console.log('node.textContent: ', node.textContent);
                }

                // ✅ Handle attributes and j-html
                if (node.attributes) {
                    for (let attr of [...node.attributes]) {
                        if (attr.value.includes('[')) {
                            attr.value = replaceBrackets(attr.value, key, idx, item, index);
                            console.log('attr.value ----- ', attr.value);
                            console.log('key: ', key);
                            console.log('idx: ', idx);
                            console.log('item: ', item);
                            console.log('index: ', index);
                        }

                        // ✅ New: process j-html attribute
                        if (attr.name === 'j-html') {
                            const htmlExpr = attr.value;
                            try {
                                const htmlContent = new Function(key, idx, `return ${htmlExpr}`)(item, index);
                                node.innerHTML = htmlContent;
                            } catch {
                                node.innerHTML = `<pre>Error in j-html: ${htmlExpr}</pre>`;
                            }
                            node.removeAttribute('j-html');
                        }
                    }
                }
            }

            wrapper.appendChild(fragment);
        });

        element.replaceWith(...wrapper.childNodes);
    });

    return doc.body.innerHTML;
}

// 🔁 New helper to safely replace [e], [e[0]], [e.title], [i], etc.
function replaceBrackets(text, key, idx, item, index) {
    return text.replace(/\[([^\]]+?)\]/g, (match, expr) => {
        try {
            return new Function(key, idx, `return ${expr}`)(item, index);
        } catch {
            if (expr === key) return item;
            if (expr === idx) return index;
            return match;
        }
    });
}

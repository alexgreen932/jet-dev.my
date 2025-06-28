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
                console.log('node: ', node);

                // Handle text content replacements
                if (node.nodeType === 3 && node.textContent.includes('[')) {
                    node.textContent = node.textContent.replace(/\[([^\[\]]+?)\]/g, (match, expr) => {
                        try {
                            return new Function(key, idx, `return ${expr}`)(item, index);
                        } catch {
                            if (expr === key) return item;
                            if (expr === idx) return index;
                            return match;
                        }
                    });
                }

                // Handle attribute replacements and j-html
                if (node.attributes) {
                    for (let attr of [...node.attributes]) {
                        if (attr.value.includes('[')) {
                            attr.value = attr.value.replace(/\[([^\[\]]+?)\]/g, (match, expr) => {
                                try {
                                    return new Function(key, idx, `return ${expr}`)(item, index);
                                } catch {
                                    if (expr === key) return item;
                                    if (expr === idx) return index;
                                    return match;
                                }
                            });
                        }

                        // NEW FEATURE: j-html support
                        if (attr.name === 'j-html') {
                            const htmlExpr = attr.value;
                            try {
                                const htmlContent = new Function(key, idx, `return ${htmlExpr}`)(item, index);
                                node.innerHTML = htmlContent;
                            } catch {
                                //todo dev 
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

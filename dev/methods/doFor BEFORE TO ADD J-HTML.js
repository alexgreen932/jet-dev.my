import { resolveDataPath } from './help-functions.js';

export default function doFor(str) {
    // Use DOMParser to convert HTML string into a manipulatable document
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, 'text/html');

    // Select all elements with the j-for directive
    const elements = doc.querySelectorAll('[j-for]');

    elements.forEach(element => {
        // Read and remove the j-for attribute
        const forValue = element.getAttribute('j-for');
        element.removeAttribute('j-for');

        // Default variable names: e = element, i = index, arr = array name
        let key = 'e', idx = 'i', arr = '';

        // Support both syntaxes:
        // (e, i) in items  → key = e, idx = i, arr = items
        // items            → arr = items, default key = e, idx = i
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

        // Try to resolve array value from the component instance
        const evalArray = resolveDataPath(this, arr);

        // If the result is not a valid array, skip processing
        if (!Array.isArray(evalArray)) return;

        // Check if j-for is used on a <template> element
        const isTemplate = element.tagName.toLowerCase() === 'template';

        // Create a temporary wrapper div to collect generated output
        const wrapper = document.createElement('div');

        // Loop through array and generate repeated blocks
        evalArray.forEach((item, index) => {
            let fragment;

            if (isTemplate) {
                // For <template>, clone its content as a DocumentFragment
                fragment = element.content.cloneNode(true);
            } else {
                // For normal elements, create a fragment and clone the element inside it
                fragment = document.createDocumentFragment();
                fragment.appendChild(element.cloneNode(true));
            }

            // Traverse all nodes inside the fragment (text + element nodes)
            const walker = document.createTreeWalker(
                fragment,
                NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
                null,
                false
            );

            // For each node inside the cloned fragment
            while (walker.nextNode()) {
                const node = walker.currentNode;

                // If it's a text node and contains [interpolation]
                if (node.nodeType === 3 && node.textContent.includes('[')) {
                    // Replace all [e], [e.title], [i], etc.
                    node.textContent = node.textContent.replace(/\[([^\[\]]+?)\]/g, (match, expr) => {
                        try {
                            // Evaluate using Function constructor: (e, i) => expr
                            return new Function(key, idx, `return ${expr}`)(item, index);
                        } catch {
                            // If evaluation fails, fallback to direct values
                            if (expr === key) return item;
                            if (expr === idx) return index;
                            return match; // Leave as-is if not matched
                        }
                    });
                }

                // If it has attributes, check and replace placeholders there too
                if (node.attributes) {
                    for (let attr of node.attributes) {
                        if (attr.value.includes('[')) {
                            // Replace attribute values with evaluated output
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
                    }
                }
            }

            // Append processed fragment into the wrapper
            wrapper.appendChild(fragment);
        });

        // Replace the original <template> or element with processed child nodes
        element.replaceWith(...wrapper.childNodes);
    });

    // Return the updated HTML content as a string
    return doc.body.innerHTML;
}

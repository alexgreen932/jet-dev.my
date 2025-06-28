import { resolveDataPath } from './help-functions.js';

export default function doFor(str) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, 'text/html');
    const elements = doc.querySelectorAll('[j-for]');

    elements.forEach(element => {
        // Extract and clean up j-for
        let forValue = element.getAttribute('j-for');
        element.removeAttribute('j-for');

        // Parse expression: "(e, i) in items" or just "items"
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

        // Resolve actual array from component context
        let evalArray = resolveDataPath(this, arr);

        if (!Array.isArray(evalArray)) return; // Skip invalid arrays

        // Generate HTML by cloning and replacing placeholders
        let output = evalArray.map((item, index) => {
            let clone = element.cloneNode(true);
            let html = clone.innerHTML;

            html = html.replaceAll(/\[([^\[\]]+?)\]/g, (match, expr) => {
                try {
                    // Try to evaluate expression like [e.title] or [i]
                    return new Function(key, idx, `return ${expr}`)(item, index);
                } catch {
                    // Fallback for primitives: [e] or [i]
                    if (expr === key) return item;
                    if (expr === idx) return index;
                    return match;
                }
            });

            clone.innerHTML = html;
            return clone.outerHTML;
        }).join('');

        // Replace original element with generated output
        element.outerHTML = output;
    });

    return doc.body.innerHTML;
}

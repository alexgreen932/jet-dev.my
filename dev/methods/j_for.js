// Updated j_for.js with support for:
// - unique parent properties per iteration (el0, el1, etc.)
// - clean i:el="key" syntax
// - index interpolation ([i])
// - detailed comments

import { resolveDataPath, getElementsByAttributePrefix } from './helpers.js';

/**
 * j_for — Handles <j-for data="items"> directives.
 * - Iterates over arrays and renders multiple elements.
 * - Supports interpolated [key] values.
 * - Supports i:prop="path" for passing iteration data to child.
 * - Supports [i] for index access in content.
 */
export default function j_for(str) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, 'text/html');

    // Find all <j-for> elements
    const elems = doc.querySelectorAll('j-for');

    elems.forEach(elem => {
        const forValue = elem.getAttribute('data'); // e.g., "items"
        const evalArray = resolveDataPath(this, forValue); // Resolve array from parent data
        if (!Array.isArray(evalArray)) return;

        const rendered = [];

        for (let index = 0; index < evalArray.length; index++) {
            const item = evalArray[index];
            const type = typeof item;

            // Replace [key] and [i] (index) in template
            let htmlTemplate = elem.innerHTML.replace(/\[(.*?)]/g, (_, key) => {
                if (key === 'i') return index; // Index shortcut
                if (type === 'object') return item[key] ?? '';
                return item;
            });

            // Create wrapper to parse HTML string
            const temp = document.createElement('div');
            temp.innerHTML = htmlTemplate.trim();

            // Process each child inside <j-for>
            Array.from(temp.children).forEach(child => {
                for (const attr of child.attributes) {
                    if (attr.name.startsWith('i:')) {
                        const propName = attr.name.slice(2); // e.g. "el"
                        const valueKey = attr.value;         // e.g. "content"

                        const dataToPass = (typeof item === 'object') ? item[valueKey] : item;

                        // Generate unique property name (e.g. el0, el1, el2...)
                        const uniqueKey = `${propName}${index}`;

                        // Assign on parent instance so children can reference it later
                        this[uniqueKey] = dataToPass;

                        // Mark child to let j_props know how to bind it
                        child.setAttribute('parent-data', this.tagName.toLowerCase());
                        child.setAttribute(`data-i-key`, propName);     // original i:el prop name
                        child.setAttribute(`data-i-idx`, index);       // current index

                        break; // Only first i:* per tag supported for now
                    }
                }

                rendered.push(child);
            });
        }

        // Replace the j-for node with generated children
        elem.replaceWith(...rendered);
    });

    return doc.body.innerHTML;
}

import { resolveDataPath, getElementsByAttributePrefix } from './help-functions.js';

/**
 * j_for — custom directive to handle <j-for data="items"> iteration.
 * This version replaces the <j-for> with repeated child elements.
 * Supports simplified interpolation and passing iterated data via i: attributes.
 */
export default function j_for(str) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, 'text/html');

    // Find all <j-for> elements
    const elems = doc.querySelectorAll('j-for');

    elems.forEach(elem => {
        const forValue = elem.getAttribute('data'); // e.g. "items"
        const evalArray = resolveDataPath(this, forValue); // Get array from parent data
        if (!Array.isArray(evalArray)) return; // Skip if not iterable

        const rendered = [];

        for (let index = 0; index < evalArray.length; index++) {
            const item = evalArray[index];
            const type = typeof item;

            // Replace [key] in inner HTML with values from item (object or string)
            let htmlTemplate = elem.innerHTML.replace(/\[(.*?)]/g, (_, key) => {
                if (type === 'object') return item[key];
                return item;
            });

            // Wrap into temp container so we can process HTML fragments
            const temp = document.createElement('div');
            temp.innerHTML = htmlTemplate.trim();

            // For each child element inside <j-for>...
            Array.from(temp.children).forEach(child => {
                // Detect all attributes that start with 'i:'
                for (const attr of child.attributes) {
                    if (attr.name.startsWith('i:')) {
                        const propName = attr.name.slice(2); // e.g., i:el => "el"
                        const valueKey = attr.value; // e.g., "content"

                        // Check if item is object and has the requested value
                        const dataToPass = (typeof item === 'object') ? item[valueKey] : item;

                        // Assign the data to current component scope, so child can access via j_props
                        this[propName] = dataToPass;

                        // Set temporary marker attribute so child can trace parent
                        child.setAttribute('parent-data', this.tagName.toLowerCase());

                        break; // Only support one i:* attribute per child for now
                    }
                }

                // Append processed child to final list
                rendered.push(child);
            });
        }

        // Replace the <j-for> with all rendered children
        elem.replaceWith(...rendered);
    });

    return doc.body.innerHTML;
}

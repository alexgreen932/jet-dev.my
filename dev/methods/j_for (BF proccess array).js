import { resolveDataPath, getElementsByAttributePrefix } from './helpers.js';

/**
 * j_for — Handles <j-for data="items"> directives.
 * - Iterates over arrays and renders multiple elements.
 * - Supports interpolated [key], [i], and [e] values.
 * - Supports i:prop="key" for passing iteration data to child components.
 * - Supports nested elements with i:* attributes (not just first child).
 */
export default function j_for(str) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(str, 'text/html');

  // Find all <j-for> elements
  const elems = doc.querySelectorAll('j-for');

  elems.forEach((elem) => {
    const forValue = elem.getAttribute('data'); // e.g., "items"
    const evalArray = resolveDataPath(this, forValue); // Resolve array from parent data
    if (!Array.isArray(evalArray)) return;

    const rendered = [];

    for (let index = 0; index < evalArray.length; index++) {
      const item = evalArray[index];
      const type = typeof item;

      // Replace [key], [i], and [e] in template
      let htmlTemplate = elem.innerHTML.replace(/\[(.*?)]/g, (_, key) => {
        if (key === 'i') return index; // Index shortcut
        if (key === 'e') {
          // Only render primitive [e], skip if object/array
          return typeof item === 'object' ? '' : item;
        }
        if (type === 'object') return item[key] ?? '';
        return item;
      });

      // Parse result into DOM
      const temp = document.createElement('div');
      temp.innerHTML = htmlTemplate.trim();

      // Find all nested elements with i:* attributes
      const matchedElements = [];

      temp.querySelectorAll('*').forEach((el) => {
        for (const attr of el.attributes) {
          if (attr.name.startsWith('i:')) {
            matchedElements.push(el);
            break;
          }
        }
      });
      

      matchedElements.forEach((el) => {
        for (const attr of el.attributes) {
          if (attr.name.startsWith('i:')) {
            
            const propName = attr.name.slice(2); // e.g., "el"
            
            const valueKey = attr.value; // e.g., "content" or "e"
            

            // Determine value to pass to child
            const dataToPass =
              valueKey === 'e'
                ? item
                : item &&
                  typeof item === 'object' &&
                  item[valueKey] !== undefined
                ? item[valueKey]
                : item;

            
            // Generate unique key per iteration
            const uniqueKey = `${propName}${index}`;
            this[uniqueKey] = dataToPass;

            // Mark child for j_props to find parent and key
            el.setAttribute('parent-data', this.tagName.toLowerCase());
            el.setAttribute('data-i-key', propName);
            el.setAttribute('data-i-idx', index);
          }
        }
      });

      // Push parsed children to final output
      rendered.push(...temp.children);
    }

    // Replace the <j-for> with rendered DOM
    elem.replaceWith(...rendered);
  });

  return doc.body.innerHTML;
}

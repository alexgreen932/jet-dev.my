import { handleEl, handleColon, handleAt, handleProp } from './handlers/attrHandlers.js';



export default function jHtml(str) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, 'text/html');
    const elements = doc.querySelectorAll('[j-html]');
    console.log('elements: ', elements);

    elements.forEach(el => {
        let content = el.getAttribute('j-html');
        el.innerHTML = cleanedHtml(content);
    });
    return { doc };
}

// doInterpolation.js

import { resolveDataPath } from './helpers.js'

//todo check and remove

// Escape potentially dangerous HTML/script code for safe rendering inside interpolation
function escapeDangerCode(str) {
    if (typeof str !== 'string') return str;

    // Replace characters that can lead to XSS attacks with HTML entities
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Interpolates expressions inside {{ }} within the given template string.
 * Supports:
 *   - Method calls (e.g., {{ someMethod(arg) }})
 *   - Data path resolution (e.g., {{ user.name }})
 *   - HTML escaping for safe output (unless you opt for raw HTML)
 * @param {string} tpl - The template string containing interpolations
 * @returns {string} - The interpolated, escaped string
 */
export default function doInterpolation(tpl) {
    // Skip processing if no interpolation is found
    if (!tpl.includes('{{')) return tpl;

    // Replace all {{ ... }} expressions
    return tpl.replace(/{{(.*?)}}/g, (_, path) => {
        const trimmed = path.trim();

        // Check if it's a method call (e.g., someFunc() or someFunc(arg))
        if (/^([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\((.*?)\)$/.test(trimmed)) {
            try {
                // Use this.executeMethod to evaluate the method string
                return this.executeMethod(trimmed);
            } catch (err) {
                console.error(`Error executing method: ${trimmed}`, err);
                return '';
            }
        }

        // Otherwise, resolve the value from the data path (e.g., this.data.key)
        const resolvedValue = resolveDataPath(this, trimmed);

        // Return safely escaped content (to avoid injection)
        // You can change this logic if you later decide to trust some content as raw HTML
        return resolvedValue !== undefined
            ? escapeDangerCode(resolvedValue)
            : '';
    });
}



import { isStaticOrDynamic } from './help-functions.js';


export default function processProps() {

    let parentElement = this.getAttribute('parent-data');

    if (!parentElement) {
        // Info: Standalone components (without parent) can still have static props.
        console.warn(`[${this.tagName}] Parent component not found. Assuming static props if provided.`);
        // Don't return yet — allow processing static (#) attributes.
    }

    let parent = parentElement ? this.closest(parentElement) : null;

    for (const attr of this.attributes) {
        // === 1. Handle "prop:" attributes (dynamic or static) ===
        if (attr.name.startsWith('prop:')) {
            const key = attr.name.slice(5);
            const dynamicData = isStaticOrDynamic(parent, attr.value);

            if (dynamicData !== undefined) {
                this[key] = this.proxy(dynamicData || {});
                // You can later track dynamicKeys if needed.
            } else {
                console.warn(`[${this.tagName}] Failed to resolve prop "${key}" from path "${attr.value}"`);
            }
        }

        // === 2. Handle "#" attributes (static props for standalone use) ===
        if (attr.name.startsWith('#')) {
            const key = attr.name.slice(1);
            const value = attr.value;

            // Check if it's static (number, boolean, string in quotes)
            const staticValue = isStaticOrDynamic(null, value); 
            // Note: passing null to parent, because standalone means no parent needed.

            if (staticValue !== undefined) {
                this[key] = staticValue;
            } else {
                console.warn(`[${this.tagName}] Static prop "#${key}" is not valid static value: ${value}`);
            }
        }

        // === 3. Future: optionally remove processed attributes ===
        // this.removeAttribute('parent-data');
        // this.removeAttribute(attr.name);
    }
}



// Updated j_props.js with support for new i:el="key" logic and detailed comments
import { isStaticOrDynamic, j_escape } from './helpers.js';

/**
 * j_props — handles passing of props to custom components
 * Supports:
 * - p:prop="key" (default dynamic prop)
 * - i:prop="key" (from j-for, keyed by index)
 * - #key="value" (static)
 */
export default function j_props() {
    // Get reference to parent component (tagName stored in 'parent-data')
    const parentTag = this.getAttribute('parent-data');
    const parent = parentTag ? this.closest(parentTag) : null;

    // Iterate over all attributes on this component
    for (const attr of this.attributes) {

        // ✅ i: - iterated prop, passed by j-for with index
        if (attr.name.startsWith('i:')) {
            const key = attr.name.slice(2); // e.g., i:el => key = "el"
            const propName = this.getAttribute('data-i-key'); // original key name
            const index = this.getAttribute('data-i-idx');    // e.g., "0", "1"

            if (parent && propName && index !== null) {
                const fullKey = `${propName}${index}`; // e.g., "el0"

                if (parent[fullKey] !== undefined) {
                    this[key] = this.proxy(parent[fullKey]);
                    this.j_props_arr.push({ key, value: this[key] });
                } else {
                    console.warn(`[${this.tagName}] Parent has no property '${fullKey}' to pass via i:${key}`);
                }
            }
        }

        // ✅ p: - dynamic prop passed from parent data (not from iteration)
        else if (attr.name.startsWith('p:')) {
            const key = attr.name.slice(2);
            const value = attr.value;

            const dynamicData = isStaticOrDynamic(parent, value);

            if (typeof dynamicData === 'string') {
                this.log?.('Warn', `Prop "${key}" is a string - "${dynamicData}". It's recommended to use objects or arrays for reactivity.`);
                console.warn(`[${this.tagName}] Non-object prop '${key}' may not be reactive.`);
            }

            if (dynamicData !== undefined) {
                this[key] = this.proxy(dynamicData || {});
                this.j_props_arr.push({ key, value: this[key] });
            } else {
                console.warn(`[${this.tagName}] Could not resolve dynamic prop p:${key} from: ${value}`);
            }
        }

        // ✅ #key - static prop (value as literal string or number)
        else if (attr.name.startsWith('#')) {
            const key = attr.name.slice(1);
            const value = attr.value;

            const staticValue = j_escape(value);
            if (staticValue !== undefined) {
                this[key] = staticValue;
                this.j_props_arr.push({ key, value: this[key] });
            } else {
                console.warn(`[${this.tagName}] Invalid static prop #${key}: ${value}`);
            }
        }

        // Optional: clean attributes after processing (uncomment if desired)
        // this.removeAttribute(attr.name);
        // this.removeAttribute('parent-data');
    }
}

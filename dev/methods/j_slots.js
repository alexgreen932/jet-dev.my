// jModel.js
import { j_escape } from './help-functions.js';


/**
 * Handles slot parsing for Jet.js components
 * @param {'array'|true} sl
 */
export default function j_slots(sl) {
    if (sl === 'array') {
        this.slots = [];
        const slotElements = this.querySelectorAll('slot');

        slotElements.forEach(slot => {
            const children = [...slot.children];
            if (children.length) {
                // Look for data-* attributes and build object
                const obj = {};
                children.forEach(child => {
                    [...child.attributes].forEach(attr => {
                        if (attr.name.startsWith('data-')) {
                            const key = attr.name.replace('data-', '');
                            obj[key] = j_escape(child.innerHTML.trim());
                        }
                    });
                });
                // Only push if valid keys found
                if (Object.keys(obj).length > 0) {
                    this.slots.push(obj);
                } else {
                    // Fallback to raw string if no data-* attributes
                    this.slots.push(j_escape(slot.innerHTML.trim()));
                }
            } else {
                // Raw string slot
                this.slots.push(j_escape(slot.innerHTML.trim()));
            }
        });

    } else {
        this.slots = {};
        const slotElements = this.querySelectorAll('slot[name]');

        slotElements.forEach(slot => {
            const name = slot.getAttribute('name');
            const value = slot.innerHTML.trim();
            if (name && value) {
                this.slots[name] = j_escape(value);
            }
        });
    }
}



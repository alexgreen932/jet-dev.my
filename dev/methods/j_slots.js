// jModel.js
import { j_escape } from './helpers.js';

/**
 * Handle parsing of <slot> content into either:
 * - Object with named keys: slots: true
 * - Array of raw strings or objects: slots: 'array'
 * - Array of objects built from nested named <slot>s: slots: 'array_object'
 *
 * @param {string|boolean} sl - The slot parsing mode ('array', 'array_object', or true)
 */
export default function j_slots(sl) {
  // Initialize the slots container
  this.slots = sl === 'array' || sl === 'array_object' ? [] : {};

  // Handle 'array_object' mode
  if (sl === 'array_object') {
    // Find all direct <slot> children inside this component
    const parentSlots = this.querySelectorAll('slot');

    parentSlots.forEach((parentSlot) => {
      const obj = {};

      // Find any inner <slot name="..."> elements inside the current <slot>
      const namedSlots = parentSlot.querySelectorAll('slot[name]');

      namedSlots.forEach((innerSlot) => {
        const key = innerSlot.getAttribute('name')?.trim();
        const value = innerSlot.innerHTML.trim();

        if (key && value) {
          // Save key-value pair to object
          obj[key] = j_escape(value);
        }
      });

      // Only push if at least one named inner slot was found
      if (Object.keys(obj).length > 0) {
        this.slots.push(obj);
      }
    });

    // Handle 'array' mode — raw content or data-* mapped object
  } else if (sl === 'array') {
    const slotElements = this.querySelectorAll('slot');

    slotElements.forEach((slot) => {
      const children = [...slot.children];

      if (children.length) {
        const obj = {};

        // Loop through children and check for data-* attributes
        children.forEach((child) => {
          [...child.attributes].forEach((attr) => {
            if (attr.name.startsWith('data-')) {
              const key = attr.name.replace('data-', '');
              obj[key] = j_escape(child.innerHTML.trim());
            }
          });
        });

        // If object was built from data-* attributes, push it
        if (Object.keys(obj).length > 0) {
          this.slots.push(obj);
        } else {
          // Otherwise just push the full inner content
          this.slots.push(j_escape(slot.innerHTML.trim()));
        }
      } else {
        // If <slot> is empty or plain content, use it as a raw string
        this.slots.push(j_escape(slot.innerHTML.trim()));
      }
    });

    // Handle 'object' mode (default): collect all <slot name="...">
  } else {
    const slotElements = this.querySelectorAll('slot[name]');

    slotElements.forEach((slot) => {
      const name = slot.getAttribute('name');
      const value = slot.innerHTML.trim();

      if (name && value) {
        this.slots[name] = j_escape(value);
      }
    });
  }
}

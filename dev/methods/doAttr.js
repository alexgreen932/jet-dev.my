
import { handleProp, handleIteration, handleGrid, handleHtml } from './handlers/attrHandlers.js';
import handleAt from './handlers/handleAt.js';
import handleColon from './handlers/handleColon.js';
import { isStaticOrDynamic, getElementsByAttributePrefix } from './helpers.js';

// Prefixes mapped to their respective handler functions
const handlers = {
  'p:': handleProp,
  'i:': handleIteration,
  '#': handleProp,
  ':': handleColon,
  'j-html': handleHtml,
  '@': handleAt,
};

/**
 * doAttr: Handles all dynamic attribute bindings.
 * Scans elements in a template and applies logic for prefixes like :class, @click, j-html, etc.
 *
 * @param {HTMLElement} tpl - The root element to process
 * @returns {string} - Final rendered HTML string
 */
export default function doAttr(tpl) {
  const { doc, matchedElements } = getElementsByAttributePrefix(
    [':', '@', 'j-html', 'p:', '#'],
    tpl
  );

  matchedElements.forEach(el => {
    Array.from(el.attributes).forEach(attr => {
      const value = attr.value.trim();

      for (const prefix in handlers) {
        if (attr.name.startsWith(prefix)) {

          // Track only dynamic values (not static strings)
          if (!attr.name.startsWith('p:') && !value.startsWith("'") && !value.startsWith('"')) {
            this.data_update_checker(isStaticOrDynamic(this, value), value);
          }

          handlers[prefix](el, attr, value, this);
          break;
        }
      }
    });
  });

  return doc.body.innerHTML;
}

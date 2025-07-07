import { handleProp, handleIteration, handleGrid, handleHtml } from './handlers/attrHandlers.js';
import handleAt from './handlers/handleAt.js';
import handleColon from './handlers/handleColon.js';
import { isStaticOrDynamic, getElementsByAttributePrefix } from './helpers.js';

// Define handler prefixes
const handlers = {

    'p:': handleProp,
    'i:': handleIteration,//todo rm if not used
    '#': handleProp,
    ':': handleColon,
    'j-html': handleHtml,
    '@': handleAt,
};


/**
 * Main attribute processor for all dynamic bindings like :class, j-html, etc.
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

                    //exclude props attrs starting with 'prop:' & 'p:'
                    if ( !attr.name.startsWith('p:') ) {
                        // 👇 ADDED: only track values that are not plain static (e.g., j-html="html")
                        if (!value.startsWith("'") && !value.startsWith('"')) {
                            this.data_update_checker(isStaticOrDynamic(this, value), value);
                        }
                    }


                    handlers[prefix](el, attr, value, this);
                    break;
                }
            }
        });
    });

    return doc.body.innerHTML;
}

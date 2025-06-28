import { isStaticOrDynamic, resolveDataPath } from './help-functions.js';

export default function processProps() {

    let parentElement = this.getAttribute('parent-data');

    if (!parentElement) {
        //todo log
        console.warn(`[${this.tagName}] Parent component has no data, thought it can be normally.`);
        // return;//if has no parent element attr means no attr 'el' or startsWith 'el:'
    }

    let parent = this.closest(parentElement);
    for (const attr of this.attributes) {
        //single or multiple props 'el' or any other, but with attribute starting with 'el:'
        if (attr.name.startsWith('prop:')) {
            const key = attr.name.slice(5);
            const dynamicData = isStaticOrDynamic(parent, attr.value);


            if (dynamicData !== undefined) {
                this[key] = this.proxy(dynamicData || {});
                //add found keys to dynamicKeys
                // this.dynamicKeys.push(key);
            } else {
                console.warn(`[${this.tagName}] Failed to resolve prop "${key}" from path "${attr.value}"`);
            }
        }
        //todo uncomment on prod
        // el.removeAttribute('parent-data');
        // el.removeAttribute(attr.name);
    }
}


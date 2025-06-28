import { resolveDataPath, cB } from './help-functions.js';

export default function getData() {
    // console.log('get data args.data-------------', this.args.data);
    //if component has data
    if (this.args.data) {
        // this.componentProperties('data', this.args.data);
        this.data = this.proxy(this.args.data || {});
        this.dynamicKeys.push('data');//adds key on root element of component for inner purposes(mostly, for data use el)
    }

    let parentElement = this.getAttribute('data-parent');

    if (!parentElement) {
        console.warn(`[${this.tagName}] Parent component has no data, thought it can be normally.`);
        return;//if has no parent element attr means no attr 'el' or startsWith 'el:'
    }

    let parent = this.closest(parentElement);
    for (const attr of this.attributes) {
        //single or multiple props 'el' or any other, but with attribute starting with 'el:'
        if (attr.name === 'el' || attr.name.startsWith('el:')) {
            const key = attr.name === 'el' ? 'el' : attr.name.slice(3);
            const dynamicData = resolveDataPath(parent, attr.value);


            if (dynamicData !== undefined) {
                this[key] = this.proxy(dynamicData || {});;
                //add found keys to dynamicKeys
                this.dynamicKeys.push(key);
            } else {
                console.warn(`[${this.tagName}] Failed to resolve prop "${key}" from path "${attr.value}"`);
            }
        }
    }
}


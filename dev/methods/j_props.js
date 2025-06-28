import { isStaticOrDynamic, j_escape } from './help-functions.js';
//todo rm depricated, replased with j_props

export default function j_props() {

    let parentElement = this.getAttribute('parent-data');
    console.log('parentElement:', parentElement);

    if (!parentElement) {
        //todo dev
        // Info: Standalone components (without parent) can still have static props.
        //console.warn(`[${this.tagName}] Parent component not found. Assuming static props if provided.`);
        // Don't return yet — allow processing static (#) attributes.
    }

    let parent = parentElement ? this.closest(parentElement) : null;

    for (const attr of this.attributes) {
        //props i: - object in iteration use value as property of parent component, which was done before in j_for method
        // Handle iteration prop from parent
        if (attr.name.startsWith('i:')) {
            const key = attr.name.slice(2); // e.g., "el", "tab", etc.
            const parent = this.closest(this.getAttribute('parent-data'));
            if (parent && parent[key]) {
                this[key] = this.proxy(parent[key]);
                this.j_props_arr.push({ key, value: this[key] });
            } else {
                console.warn(`[${this.tagName}] i:${key} could not find parent or data.`);
            }
        }

        //props 'p:' defaul prop key, which use value as property of parent component
        if (attr.name.startsWith('p:')) {
            const key = attr.name.slice(2);
            // console.log('key----- ', key);
            const value = attr.value;
            console.log('value:', value);

            // Check if it's static (number, boolean, string in quotes)

            const dynamicData = isStaticOrDynamic(parent, attr.value);

            // this.j_deb('com-attr2', [ [dynamicData] ]);

            if (typeof dynamicData == 'string') {
                ;
                this.log('Warn', `Prop "${key}" is a string - "${dynamicData}". It is recommended to use an Object or Array for props. You can have problem with reactivity and two way binding. String props will be supported in future versions.`)
                console.warn('Warn', `Prop "${key}" is a string - "${dynamicData}". It is recommended to use an Object or Array for props. You can have problem with reactivity and two way binding. String props will be supported in future versions.`)
            }


            // Note: passing null to parent, because standalone means no parent needed.

            if (dynamicData !== undefined) {
                this[key] = this.proxy(dynamicData || {});
                //dev op

                this.j_props_arr.push({ key, value: this[key] });
                // this.j_props_arr.push( `${key}: ${this[key]}` );//todo improve
            } else {
                //todo dev 
                console.warn(`[${this.tagName}] Static prop "#${key}" is not valid static value: ${value}`);
            }
        }
        // # ------------------
        if (attr.name.startsWith('#')) {
            const key = attr.name.slice(1);
            const value = attr.value;

            // Check if it's static (number, boolean, string in quotes)
            const staticValue = j_escape(value);
            // Note: passing null to parent, because standalone means no parent needed.

            if (staticValue !== undefined) {
                this[key] = staticValue;
                //dev op
                this.j_props_arr.push({ key, value: this[key] });
            } else {
                console.warn(`[${this.tagName}] Static prop "#${key}" is not valid static value: ${value}`);
            }
        }

        //uncoment on dev if necessary
        //todo remove safaly, now i lose dynamic data
        // this.removeAttribute(attr.name);
        // this.removeAttribute('parent-data');
    }
}



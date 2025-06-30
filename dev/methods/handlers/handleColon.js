import { isStaticOrDynamic } from '../helpers.js';

/**
 * Handle attributes starting with ":" like :src, :alt, :class, :style
 */
export default function handleColon(el, attr, value, context) {
    const key = attr.name.slice(1); // Remove ":" from attribute name

    if (key === 'class') {
        // Handle :class - split by space and add dynamic or static classes
        value.split(' ').map(cls => cls.trim()).forEach(cls => {
            let processedVal = isStaticOrDynamic(context, cls);
            if (processedVal) {
                el.classList.add(processedVal);
            }
        });
    }

    else if (key === 'style') {
        value = value.trim();

        // 1. Inline object syntax? (starts with { and ends with })
        if (value.startsWith('{') && value.endsWith('}')) {
            const inner = value.slice(1, -1).trim(); // remove { and }

            inner.split(';').map(stylePair => stylePair.trim()).forEach(pair => {
                if (!pair) return;
                let [prop, val] = pair.split(':').map(p => p.trim());
                if (!prop || !val) return;

                prop = toCamelCase(prop);
                val = isStaticOrDynamic(context, val);

                try {
                    if (prop in el.style) {
                        el.style[prop] = val;
                    }
                } catch (err) {
                    console.error(`Error setting style "${prop}: ${val}"`, err);
                }
            });
        }

        // 2. Array syntax? (starts with [ and ends with ])
        else if (value.startsWith('[') && value.endsWith(']')) {
            const inner = value.slice(1, -1).trim();
            const styleNames = inner.split(',').map(name => name.trim());
            const styleObjects = styleNames.map(name => isStaticOrDynamic(context, name));

            styleObjects.forEach(styleObj => {
                if (!styleObj || typeof styleObj !== 'object') return;

                Object.keys(styleObj).forEach(prop => {
                    let val = styleObj[prop];
                    let camelProp = toCamelCase(prop);

                    try {
                        if (camelProp in el.style) {
                            el.style[camelProp] = val;
                        }
                    } catch (err) {
                        console.error(`Error setting style "${camelProp}: ${val}"`, err);
                    }
                });
            });
        }

        // 3. Normal object (style1) or string ("background-color: red")
        else {
            let resolvedValue = isStaticOrDynamic(context, value);

            if (typeof resolvedValue === 'object') {
                // It's a style object
                const styles = Array.isArray(resolvedValue) ? resolvedValue : [resolvedValue];
                styles.forEach(styleObj => {
                    if (!styleObj || typeof styleObj !== 'object') return;

                    Object.keys(styleObj).forEach(prop => {
                        let val = styleObj[prop];
                        let camelProp = toCamelCase(prop);

                        try {
                            if (camelProp in el.style) {
                                el.style[camelProp] = val;
                            }
                        } catch (err) {
                            console.error(`Error setting style "${camelProp}: ${val}"`, err);
                        }
                    });
                });
            }
            else if (typeof resolvedValue === 'string') {
                // It's a normal style string (background-color: red; font-size: 14px;)
                resolvedValue.split(';').map(stylePair => stylePair.trim()).forEach(pair => {
                    if (!pair) return;
                    let [prop, val] = pair.split(':').map(p => p.trim());
                    if (!prop || !val) return;

                    prop = toCamelCase(prop);

                    try {
                        if (prop in el.style) {
                            el.style[prop] = val;
                        }
                    } catch (err) {
                        console.error(`Error setting style "${prop}: ${val}"`, err);
                    }
                });
            }
        }
    }

    else {
        // Handle other attributes (standard or custom like uk-scrollspy)
        let processedVal = isStaticOrDynamic(context, value);
        if (processedVal !== undefined && processedVal !== null) {
            el.setAttribute(key, processedVal);
        }
    }

    // Remove the original ":" attribute
    el.removeAttribute(attr.name);
}

/**
 * Convert kebab-case to camelCase
 * Example: background-color => backgroundColor
 */
function toCamelCase(str) {
    return str.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
}

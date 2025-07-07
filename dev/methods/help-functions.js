//todo remove as all moved to helpers.js

export function formatTime(ms) {
    const date = new Date(ms);
    return date.toISOString().substr(11, 12); // "hh:mm:ss.sss"
}

/**
 * Escapes single quotes and other risky characters
 * @param {string} str
 * @returns {string}
 */
export function j_escape(str) {
        // Check for boolean literals
        if (str === 'true') return true;
        if (str === 'false') return false;
    
        // Check for numbers
        if (!isNaN(str)) {
            return Number(str);
        }
    return str.replace(/'/g, '&lsquo;');

}
/**
 * Resolves a dot-path with optional array access like "items[current].title"
 * @param {Object} obj - The base object to resolve from.
 * @param {string} path - Path like "items[current].title" or "items[0].desc"
 * @returns {*} - The resolved value or undefined
 */
export function resolveDataPath(obj, path) {
    if (!obj || typeof obj !== 'object') return undefined;

    const parts = path.split('.');
    let current = obj;

    for (let part of parts) {
        if (!current) break;

        // Match array access like items[0] or items[current]
        const match = part.match(/^([a-zA-Z0-9_$]+)\[([^\]]+)\]$/);
        if (match) {
            const baseKey = match[1];       // e.g., "items"
            // console.log('baseKey: ', baseKey);
            const indexKey = match[2];      // e.g., "0" or "current"
            // console.log('indexKey: ', indexKey);

            // 👇 Resolve the array using resolveDataPath — to support nested objects
            const arr = resolveDataPath(current, baseKey);
            // console.log('arr: ', arr);
            if (!Array.isArray(arr)) {
                console.warn(`resolveDataPath: '${baseKey}' is not an array.`);
                return undefined;
            }

            const index = isStaticOrDynamic(obj, indexKey);
            // console.log('[resolveDataPath] indexKey:', indexKey, '→ index:', index);

            current = arr[index];
        } else {
            // Standard dot access
            current = current[part];
        }
    }

    return current;
}


/**
 * Fallback resolver for paths with mixed dot/array access, similar to resolveDataPath.
 * Mostly for legacy or one-off needs.
 */
export function resolveDynamicIndex(str, ctx) {
    const parts = str.split('.');
    let current = ctx;

    for (let part of parts) {
        if (!current) break;

        const match = part.match(/^([a-zA-Z0-9_$]+)\[([^\]]+)\]$/);
        if (match) {
            let base = match[1];
            let indexKey = match[2];
            let index = isStaticOrDynamic(ctx, indexKey);

            current = current[base];
            if (Array.isArray(current)) {
                current = current[index];
            } else {
                current = undefined;
            }
        } else {
            current = current[part];
        }
    }

    return current;
}

/**
 * Strips quotes from a string like "value" or 'value'
 */
export function removeQuotes(str) {
    if ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'"))) {
        return str.slice(1, -1);
    }
    return str;
}

/**
 * Attempts to parse a list of argument strings to real values.
 * Handles dynamic lookups from context as well.
 */
export function parseArgs(argsArray, context) {
    if (!Array.isArray(argsArray)) return [];

    return argsArray.map(arg => {
        if (typeof arg !== 'string') return arg;

        const raw = arg.trim();

        // Resolve dynamic path
        if (raw.match(/^[a-zA-Z_][a-zA-Z0-9_.\[\]]*$/)) {
            const value = resolveDataPath(context, raw);
            if (value !== undefined) return value;
        }

        // Primitives
        if (raw === 'true') return true;
        if (raw === 'false') return false;
        if (!isNaN(raw) && raw !== '') return Number(raw);

        return removeQuotes(raw);
    });
}


/**
 * Updates a nested property, including support for array access like items[current]
 */
export function updateNestedProperty(obj, path, value) {
    const keys = path.split('.');
    let target = obj;

    for (let i = 0; i < keys.length - 1; i++) {
        let key = keys[i];

        const match = key.match(/^([a-zA-Z0-9_$]+)\[([^\]]+)\]$/);
        if (match) {
            const base = match[1];
            const indexKey = match[2];
            const index = isStaticOrDynamic(obj, indexKey);

            target = target[base];
            if (Array.isArray(target)) {
                target = target[index];
            } else {
                console.warn(`updateNestedProperty: '${base}' is not an array`);
                return;
            }
        } else {
            target = target[key];
        }
    }

    const lastKey = keys[keys.length - 1];
    const lastMatch = lastKey.match(/^([a-zA-Z0-9_$]+)\[([^\]]+)\]$/);
    if (lastMatch) {
        const base = lastMatch[1];
        const indexKey = lastMatch[2];
        const index = isStaticOrDynamic(obj, indexKey);

        if (Array.isArray(target[base])) {
            target[base][index] = value;
        } else {
            console.warn(`updateNestedProperty: '${base}' is not an array at end`);
        }
    } else {
        target[lastKey] = value;
    }
}

/**
 * New - Determines if a value is a static string/number or a dynamic path, and returns the actual value
* Replaced current isStaticOrDynamic in - executeMethod...
 */
export function isStaticOrDynamic(obj, value) {
    value = value.trim();

    //scip if function
    // if (value.match(/^([a-zA-Z0-9_.]+)\((.*?)\)$/g)) {
    //     console.log(`value "${value}" is a method`);        
    //     return;
    // }

    // Check for static quoted strings
    if (value.startsWith("'") && value.endsWith("'")) {
        const val = value.slice(1, -1);
        if (val === 'true') return true;
        if (val === 'false') return false;
        return val;
    }

    // Check for boolean literals
    if (value === 'true') return true;
    if (value === 'false') return false;

    // Check for numbers
    if (!isNaN(value)) {
        return Number(value);
    }

    // Try dynamic path lookup
    const resolved = resolveDataPath(obj, value);
    // console.log(`[isStaticOrDynamic] resolved "${value}" to:`, resolved);

    if (resolved === undefined) {
        console.warn(`[isStaticOrDynamic] could not resolve dynamic path "${value}"`);
    }

    return resolved;
}


/**
 * Gets a dynamic value from either main component or alt context
 */
export function getMultiValue(value, component, alt) {
    value = value.trim();

    if (value.startsWith("'") && value.endsWith("'")) {
        return value.slice(1, -1);
    }

    if (!isNaN(value)) {
        return Number(value);
    }

    if (value.startsWith("method.")) {
        let methodName = value.slice(7);
        if (typeof component[methodName] === "function") {
            return component[methodName]();
        }
    }

    if (alt && value.startsWith(alt.key + ".")) {
        let keyPath = value.slice(alt.key.length + 1);
        return resolveDataPath(alt.obj, keyPath);
    }

    return resolveDataPath(component, value);
}

/**
 * Collects elements with attributes like ":class", "j-html", etc.
 */
export function getElementsByAttributePrefix(prefixes, str, type = '*') {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, 'text/html');
    const elements = doc.querySelectorAll(type);
    const matchedElements = [];

    elements.forEach(el => {
        for (const attr of el.attributes) {
            if (prefixes.some(prefix => attr.name.startsWith(prefix))) {
                matchedElements.push(el);
                break;
            }
        }
    });

    return { doc, matchedElements };
}


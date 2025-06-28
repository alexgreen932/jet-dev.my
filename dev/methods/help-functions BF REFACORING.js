
//returns dynamic data where obj is object, path is multi key like 'data.set.property'
function resolveDataPath(obj, path) {
    if (!obj || typeof obj !== 'object') return undefined;
    return path.split('.').reduce((acc, key) => (acc != null ? acc[key] : undefined), obj);
}

export { resolveDataPath };

export function resolveDynamicIndex(str, ctx) {
	// Split the string by `.` but keep array access like `items[current]` intact
	const parts = str.split('.');

	let current = ctx;
	for (let part of parts) {
		if (!current) break;

		// Handle array access like items[0] or items[current]
		const match = part.match(/^([a-zA-Z0-9_$]+)\[([^\]]+)\]$/);
		if (match) {
			let base = match[1];         // "items"
			let indexKey = match[2];     // "current" or "0"
			let index = isStaticOrDynamic(ctx, indexKey); // resolves "current" => 0

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



export function removeQuotes(str) {
    if ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'"))) {
        return str.slice(1, -1);
    }
    return str;
}

//returns correct type of value passed
export function parseArgs(argsArray, context) {
    if (!Array.isArray(argsArray)) return [];

    return argsArray.map(arg => {
        // Already a boolean, number, or object — return as-is
        if (typeof arg !== 'string') return arg;

        let raw = arg.trim();

        // Check if it's a dynamic data path
        if (raw.match(/^[a-zA-Z_][a-zA-Z0-9_.]*$/)) {
            const value = resolveDataPath(context, raw);
            if (value !== undefined) return value;
        }

        // Convert to boolean
        if (raw === 'true') return true;
        if (raw === 'false') return false;

        // Convert to number
        if (!isNaN(raw) && raw !== '') return Number(raw);

        // Strip quotes
        if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
            return raw.slice(1, -1);
        }

        return raw;
    });
}




//select all elements started with any characters
export function getElementsByAttributePrefix(prefixes, str, type = '*') {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, 'text/html');
    const elements = doc.querySelectorAll(type);
    const matchedElements = [];

    elements.forEach(el => {
        for (const attr of el.attributes) {
            if (prefixes.some(prefix => attr.name.startsWith(prefix))) {
                matchedElements.push(el);
                break; // Stop after the first matching attribute
            }
        }
    });

    return { doc, matchedElements };
}


export function updateNestedProperty(obj, path, value) {
	const keys = path.split('.');
	let target = obj;

	for (let i = 0; i < keys.length - 1; i++) {
		let key = keys[i];

		// ✅ Check for dynamic index syntax like items[current]
		const match = key.match(/^([a-zA-Z0-9_$]+)\[([^\]]+)\]$/);
		if (match) {
			const base = match[1]; // e.g. "items"
			const indexKey = match[2]; // e.g. "current"
			const index = isStaticOrDynamic(obj, indexKey); // resolve dynamic value

			target = target[base];
			if (Array.isArray(target)) {
				target = target[index];
			} else {
				console.warn(`updateNestedProperty: '${base}' is not an array`);
				return;
			}
		} else {
			// Standard object path
			target = target[key];
		}
	}

	const lastKey = keys[keys.length - 1];

	// ✅ Final key: handle dynamic index if needed
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
		// Standard assignment
		target[lastKey] = value;
	}
}

// Keep old version for now
// export function updateNestedProperty(obj, keyPath, newValue) {
//     const keys = keyPath.split('.'); // Split the key path into an array of keys
//     let current = obj;

//     // Traverse the object to the second-to-last key
//     for (let i = 0; i < keys.length - 1; i++) {
//         const key = keys[i];
//         if (!current[key] || typeof current[key] !== 'object') {
//             current[key] = {}; // Create a new object if the key doesn't exist
//         }
//         current = current[key];
//     }

//     // Update the last key with the new value
//     current[keys[keys.length - 1]] = newValue;
// }


/**
 * Determines if a value is static (string, number, boolean) or dynamic (data path).
 * @param {Object} obj - The data object to resolve dynamic paths.
 * @param {string} value - The value to evaluate.
 * @returns {*} - The evaluated static value or the result of resolving the dynamic path.
 */
export function isStaticOrDynamic(obj, value) {
    value = value.trim();

    // Check if the value is a quoted string
    if (value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1);

        // Handle boolean strings
        if (value === 'true') return true;
        if (value === 'false') return false;

        return value;
    }

    // Handle unquoted boolean strings
    if (value === 'true') return true;
    if (value === 'false') return false;

    // Handle numeric values
    if (!isNaN(value)) {
        return Number(value);
    }

    // Treat as dynamic data path
    return resolveDataPath(obj, value);
}


/**
 * 
 * @param {*} value //key or value
 * @param {*} component // this
 * @param {*} alt //alt object eg iterated contend object
 * @returns 
 */
export function getMultiValue(value, component, alt) {
    // console.log('getMultiValue called');
    value = value.trim();

    // Check if it's a static string (wrapped in single quotes)
    if (value.startsWith("'") && value.endsWith("'")) {
        return value.slice(1, -1); // Remove the quotes and return the string
        // console.log('single quotes');
    }

    // Check if it's a number
    if (!isNaN(value)) {
        return Number(value);
    }

    // If it starts with "method.", assume it's a method call
    if (value.startsWith("method.")) {
        let methodName = value.slice(7); // Remove "method."
        if (typeof component[methodName] === "function") {
            return component[methodName](); // Call the method
        }
    }

    // console.log('value: ', value);
    // console.log('alt: ', alt);
    // console.log('alt.key: ', alt.key);
    // If it's an iterated object property (alt.key exists)
    //todo check seems not used, then rm
    if (alt && value.startsWith(alt.key + ".")) {

        let keyPath = value.slice(alt.key.length + 1); //todo // Remove 'e.' prefix//wrong as it can be not only 'e. but 'item.' etc
        return resolveDataPath(alt.obj, keyPath); // Get from iterated object
    }

    // console.log('component: ', component);
    // console.log('--------value: ', value);
    // Otherwise, try resolving it from the component (element's data)
    return resolveDataPath(component, value);
}



//helper functions for debag, just colorize console.log and console.error messages
export function cB(str, com = null) {
    let tag = '';
    if (com) tag = `[${com.tagName}]: `;
    // console.log(`%c${tag+str}"`, 'background:#0d47a1; color: #fff; padding:3px;');
}
export function cG(str, com = null) {
    let tag = '';
    if (com) tag = `[${com.tagName}]: `;
    // console.log(`%c${tag+str}"`, 'background:#004d40; color: #fff; padding:3px;');
}
export function cR(str, com = null) {
    let tag = '';
    if (com) tag = `[${com.tagName}]: `;
    // console.log(`%c${tag+str}"`, 'background:#f00; color: #fff; padding:3px;');
}
export function cD(str, com = null) {
    let tag = '';
    if (com) tag = `[${com.tagName}]: `;
    // console.log(`%c${tag + str}"`, 'background:#404550; color: #fff; padding:3px;');
}
export function cE(str, com = null) {
    let tag = '';
    if (com) tag = `[${com.tagName}]: `;
    console.error(`%c${tag + str}"`, 'background:#ad1457; color: #fff; padding:3px; font-Weight:bold;');
}








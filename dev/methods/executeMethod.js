import { parseArgs, isStaticOrDynamic } from './helpers.js';

// Executes a method call like `doSomething(arg)` or `app.globFunc(x, y)`
export default function executeMethod(methodKey, conditions = {}) {
    let methodName, args = null, argArray = [];

    // Match method calls like app.globFunc('hello', 123)
    const match = methodKey.match(/^([a-zA-Z0-9_.]+)\((.*?)\)$/);

    if (match) {
        methodName = match[1]; // e.g. "app.globFunc"
        args = match[2];       // e.g. "123, true"

        // Parse argument values (dynamic or static)
        if (args) {
            const splitArgs = args.split(',').map(arg => arg.trim());
            argArray = splitArgs.map(arg => isStaticOrDynamic(this, arg));
        }

        const parsedArgs = parseArgs(argArray, this);

        // Detect dot path for global call, e.g. app.utils.formatDate()
        const parts = methodName.split('.');
        let context = this;
        let fn = null;

        if (parts.length > 1) {
            context = window;
            while (parts.length > 1) {
                context = context[parts.shift()];
            }
            fn = context[parts[0]];
        } else {
            fn = this[methodName];
        }

        if (typeof fn === 'function') {
            return fn.apply(context, parsedArgs);
        } else {
            console.warn(`[${this.tagName}] ${methodName} is not a valid function`);
        }
    } else {
        this.log('Error', `${methodKey} is not a valid function call`);//todo fix, do not shown in jetConsole errors
        console.error('Error', ` [${this.tagName}] ${methodKey} is not a valid function call`);
    }
}

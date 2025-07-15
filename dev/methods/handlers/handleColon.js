import { isStaticOrDynamic } from '../helpers.js';

/**
 * ✅ Utility: Convert kebab-case to camelCase
 * For converting CSS properties (e.g. background-color → backgroundColor)
 */
function toCamelCase(str) {
  return str.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
}

/**
 * ✅ Utility: Safely split a class string without breaking method calls
 * Example:
 * Input:  "static isActive('Tab 1') other"
 * Output: ["static", "isActive('Tab 1')", "other"]
 */
function smartSplitClasses(str) {
  const result = [];
  let current = '';
  let depth = 0;
  let inQuote = false;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];

    if (char === '\'' || char === '"') {
      inQuote = inQuote === char ? false : char;
    }

    if (!inQuote) {
      if (char === '(') depth++;
      if (char === ')') depth--;
    }

    if (!inQuote && depth === 0 && char === ' ') {
      if (current.trim()) result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  if (current.trim()) result.push(current.trim());
  return result;
}

/**
 * ✅ Utility: Check if the value is a method call like myFunc('arg')
 */
function isMethodCall(str, context) {
  const match = str.match(/^([a-zA-Z_$][\w$]*)\((.*?)\)$/);
  if (!match) return false;

  const methodName = match[1];
  return context.methods && typeof context.methods[methodName] === 'function';
}

/**
 * ✅ Utility: Executes a method string with arguments
 * Example: "myFunc('Tab 1')" → context.methods.myFunc('Tab 1')
 */
function executeMethod(str, context) {
  const match = str.match(/^([a-zA-Z_$][\w$]*)\((.*?)\)$/);
  if (!match) return null;

  const methodName = match[1];
  const argsString = match[2].trim();

  let args = [];
  if (argsString.length > 0) {
    try {
      args = eval('[' + argsString + ']'); // safe if you're in full control of templates
    } catch (e) {
      console.warn('[Jet] Invalid method arguments in:', str);
    }
  }

  return context.methods[methodName].apply(context, args);
}

/**
 * 🔧 Main handler for all attributes prefixed with ":"
 * Supports dynamic bindings like :class, :style, :src, :alt, etc.
 */
export default function handleColon(el, attr, value, context) {
  const key = attr.name.slice(1); // Remove ':' to get real attribute name (e.g. class, style)
  let resolvedValue;

  // ========== 1. Handle :class ==========
  if (key === 'class') {
    // Safely split value into parts (props or method calls)
    smartSplitClasses(value).forEach(cls => {
      cls = cls.trim();
      if (!cls) return;

      if (isMethodCall(cls, context)) {
        resolvedValue = executeMethod(cls, context);
      } else {
        resolvedValue = isStaticOrDynamic(context, cls);
      }

      // Apply resulting class(es)
      if (typeof resolvedValue === 'string') {
        resolvedValue.split(' ').forEach(c => {
          if (c) el.classList.add(c.trim());
        });
      }
    });
  }

  // ========== 2. Handle :style ==========
  else if (key === 'style') {
    value = value.trim();

    if (isMethodCall(value, context)) {
      resolvedValue = executeMethod(value, context);
    } else {
      resolvedValue = isStaticOrDynamic(context, value);
    }

    if (typeof resolvedValue === 'object' && resolvedValue !== null) {
      const styles = Array.isArray(resolvedValue) ? resolvedValue : [resolvedValue];
      styles.forEach(styleObj => {
        if (!styleObj || typeof styleObj !== 'object') return;
        for (let prop in styleObj) {
          const camel = toCamelCase(prop);
          if (camel in el.style) el.style[camel] = styleObj[prop];
        }
      });
    } else if (typeof resolvedValue === 'string') {
      resolvedValue.split(';').forEach(pair => {
        const [prop, val] = pair.split(':').map(p => p.trim());
        if (prop && val) {
          const camel = toCamelCase(prop);
          el.style[camel] = val;
        }
      });
    }
  }

  // ========== 3. Handle other attributes (e.g. :src, :alt, :data-x) ==========
  else {
    if (isMethodCall(value, context)) {
      resolvedValue = executeMethod(value, context);
    } else {
      resolvedValue = isStaticOrDynamic(context, value);
    }

    if (resolvedValue != null) {
      el.setAttribute(key, resolvedValue);
    }
  }

  // ✅ Clean up original attribute
  el.removeAttribute(attr.name);
}

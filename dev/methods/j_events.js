import { updateNestedProperty } from './helpers.js';

/**
 * Evaluate a value like `"42"`, `'text'`, or a variable name.
 */
function _evaluateLiteralOrExpression(str) {
  try {
    return Function('"use strict"; return (' + str + ')')();
  } catch {
    return this[str];
  }
}

/**
 * Jet.js Event Binder
 * Parses event/action/modifiers and binds logic to each DOM node.
 */
export default function j_events() {
  const ctx = this;

  this.querySelectorAll('[data-j-on]').forEach((el) => {
    const eventName = el.getAttribute('data-j-on'); // e.g. "click"
    const eventWithMods = el.getAttribute('data-j-event') || ''; // e.g. "click.prevent"
    const action = el.getAttribute('data-j-action'); // e.g. "_setProp"
    const prop = el.getAttribute('data-j-prop');
    const newVal = el.getAttribute('data-j-newvalue');
    const method = el.getAttribute('data-j-method');
    const argsStr = el.getAttribute('data-j-args') || '';

    // ✅ Extract modifiers from the original attribute string
    let prevent = eventWithMods.includes('.prevent');
    
    if (action === '_setProp') {
      prevent = true;
    }
    
    const stop = eventWithMods.includes('.stop');

    el.addEventListener(eventName, (e) => {
      if (prevent) e.preventDefault(); // stops <a href="..."> nav
      if (stop) e.stopPropagation(); // stops bubbling

      // ✅ Handle property update like @click="current=42"
      if (action === '_setProp' && prop && newVal != null) {
        const val = _evaluateLiteralOrExpression.call(ctx, newVal);
        updateNestedProperty(ctx, prop, val);
      }

      // ✅ Handle method calls like @click="myMethod('X')"
      else if (method) {
        const args = argsStr
          ? argsStr
              .split(',')
              .map((s) => _evaluateLiteralOrExpression.call(ctx, s.trim()))
          : [];

        if (typeof ctx[method] === 'function') {
          ctx[method](...args);
        } else {
          
        }
      }
    });
  });
}

//todo at Optional cleanup (uncomment if you want clean HTML after render)
// el.removeAttribute('data-j-on');
// el.removeAttribute('data-j-action');
// el.removeAttribute('data-j-method');
// el.removeAttribute('data-j-prop');
// el.removeAttribute('data-j-newvalue');
// el.removeAttribute('data-j-args');

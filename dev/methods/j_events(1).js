
// console.log('j events loaded');
import { updateNestedProperty } from './helpers.js';

/**
 * Evaluate argument string to either a literal or dynamic value.
 * Accepts: ['hello'], [42], ['"X"'], [variableName]
 */
function _evaluateLiteralOrExpression(str) {
  try {
    // wrap in parentheses—allows JSON-like literals
    return Function('"use strict"; return (' + str + ')')();
  } catch {
    // fallback to a component property (this[str])
    return this[str];
  }
}

/**
 * Scans the component DOM for elements with 'data-j-event' and attaches the listener.
 * Supports:
 * - property assignment: data-j-prop & data-j-newvalue
 * - method invocation: data-j-method & optional data-j-args
 * - event modifiers: .prevent, .stop
 */

export default function j_events() {
  this.querySelectorAll('[data-j-event]').forEach(el => {
    const raw = el.getAttribute('data-j-event');
    const newVal = el.getAttribute('data-j-newvalue');
    const prop = el.getAttribute('data-j-prop');
    const method = el.getAttribute('data-j-method');
    const argsStr = el.getAttribute('data-j-args') || '';

    const mods = [];
    const eventName = raw.replace(/\.(\w+)/g, (_, m) => {
      mods.push(m);
      return '';
    });
    const prevent = mods.includes('prevent');
    const stop = mods.includes('stop');

    //todo at uncomment
    // el.removeAttribute('data-j-event');

    el.addEventListener(eventName, e => {
      if (prevent) e.preventDefault();
      if (stop) e.stopPropagation();

      if (raw === '_setProp' && prop && newVal != null) {
        const val = _evaluateLiteralOrExpression.call(this, newVal);
        console.log('Setting prop:', prop, 'to:', val);
        updateNestedProperty(this, prop, val);
      } else if (method) {
        const args = argsStr
          ? argsStr.split(',').map(s => _evaluateLiteralOrExpression.call(this, s.trim()))
          : [];
        this[method]?.(...args);
      }
    }); 
  });
}




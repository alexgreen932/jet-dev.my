import { updateNestedProperty } from './helpers.js';
import { isStaticOrDynamic } from './helpers.js'; // since you're using it

export default function jListener(target, event, handlerName, scope) {
  const boundListeners = this._boundListeners || [];
  let elements = [];

  const root = (scope === 'document') ? document : this;

  // Resolve selector targets
  if (typeof target === 'string') {
    if (target.startsWith('$$')) {
      elements = Array.from(root.querySelectorAll(target.slice(2)));
    } else if (target.startsWith('$')) {
      const el = root.querySelector(target.slice(1));
      if (el) elements = [el];
    }
  } else {
    elements = [target]; // e.g. window, document, or a passed DOM element
  }

  for (let el of elements) {
    if (!el) continue;

    // Data assignment (e.g., 'current=0')
    if (typeof handlerName === 'string' && handlerName.includes('=')) {
      const [path, rawValue] = handlerName.split('=');
      const value = isStaticOrDynamic(this, rawValue.trim());

      const handler = () => {
        updateNestedProperty(this, path.trim(), value);
      };
      el.addEventListener(event, handler);
      boundListeners.push([el, event, handler]);
    }

    // Method call
    else if (typeof handlerName === 'string') {
      const method = this.methods?.[handlerName];
      if (typeof method === 'function') {
        const bound = method.bind(this);
        el.addEventListener(event, bound);
        boundListeners.push([el, event, bound]);
      }
    }
  }

  this._boundListeners = boundListeners;
}

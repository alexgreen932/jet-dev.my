import { updateNestedProperty } from './help-functions.js';

export default function jListener(target, event, handlerName) {
    console.log('method jListener binded');    
  const boundListeners = this._boundListeners || [];
  let elements = [];

  // Resolve selector targets
  if (typeof target === 'string') {
    if (target.startsWith('$$')) {
      elements = Array.from(document.querySelectorAll(target.slice(2)));
    } else if (target.startsWith('$')) {
      const el = document.querySelector(target.slice(1));
      if (el) elements = [el];
    }
  } else {
    elements = [target]; // e.g. window or document
  }

  for (let el of elements) {
    // Static data update
    if (typeof handlerName === 'string' && handlerName.includes('=')) {
        console.log('is new data action');   //there's log     
      const [path, rawValue] = handlerName.split('=');
      console.log('path ---- ', path);//there's log  
      console.log('rawValue ---- ', rawValue);//there's log  
    //   const value = parseValue(rawValue.trim());
      const value = isStaticOrDynamic(this,rawValue.trim());
      console.log('value----- ', value);//there's log  

      const handler = () => {
        updateNestedProperty(this, path.trim(), value);
        console.log('updated value');  //no log      
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

// Helper to parse boolean, number, or string
function parseValue(value) {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (!isNaN(value)) return Number(value);
  return value;
}

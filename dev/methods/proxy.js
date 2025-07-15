export default function proxy(data) {
  const component = this; // this === component instance
  const seen = new WeakMap();

  function createProxy(target, path = '') {
    if (typeof target !== 'object' || target === null) return target;
    if (seen.has(target)) return seen.get(target);
  
    const handler = {
      get(obj, key) {
        const value = obj[key];
        if (typeof value === 'object' && value !== null) {
          return createProxy(value, `${path}${key}.`);
        }
        return value;
      },
      set(obj, key, value) {
        if (obj[key] === value) return true;
        obj[key] = value;
  
        const fullPath = `${path}${key}`;
  
        if (typeof component.updated === 'function') {
          component.updated(fullPath, value);
        }
  
        component.log('Data_changed', `Property "${key}" updated with value "${value}"`);
  
        const e = new Event('data-updated', { bubbles: true });
        // component.dispatchEvent(e);
        document.dispatchEvent(e);
        //console.log('---------------', `[${component.tagName}]Property "${key}" updated with value "${value}"`);

  
        if (component.j_r && component.j_r!==false ) {
          component.log('Re_render', `Component Re Rendered Due to its settings "Forced Re Rendering"`);
          component.render();
        }
  
        return true;
      }
    };
  
    const proxy = new Proxy(target, handler);
    seen.set(target, proxy);
    return proxy;
  }
  

  return createProxy(data);
}

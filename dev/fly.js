import processAnimation from './fly-src/processAnimation.js';

export default function fly() {
  // Collect all elements that have any fly-* attribute
  const items = Array.from(document.querySelectorAll('*')).filter(el =>
    Array.from(el.attributes).some(attr => attr.name.startsWith('fly'))
  );

  if (!items.length) return;

  for (const el of items) {
    const flyAttrs = Array.from(el.attributes).filter(attr => attr.name.startsWith('fly'));

    for (const { name, value } of flyAttrs) {
      if (name === 'fly-in') {
        const [keyframes, options] = processAnimation(value);
        el.style.display = 'block';
        el.animate(keyframes, options);
      }

      if (name === 'fly-event') {
        let match = value.match(/\[(.+?)\]$/);
        let triggerStr = match ? match[1] : null;
        let animValue = value.replace(/\s*;\s*\[.+?\]$/, '').trim();

        let triggers = document.querySelectorAll(triggerStr);
        if (!triggers.length) return;

        triggers.forEach((trigger) => {
          trigger.addEventListener('click', () => {
            const [keyframes, options] = processAnimation(animValue);
            show.log(keyframes, 'keyframes');
            show.log(options, 'options');
            el.animate(keyframes, options);
            setTimeout(() => {
              el.style.display = 'block';
            }, 300);
          });
        });
      }

      // NEW: fly-scroll — triggers fly-in when in viewport
      if (name === 'fly-scroll') {
        if (el.dataset.flyInited) return;
      
        el.style.opacity = '0';
      
        const [keyframes, baseOptions] = processAnimation(value);
      
        const observer = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) {
            el.animate(keyframes, { ...baseOptions, direction: 'normal' });
            el.style.opacity = '1';
          } else {
            el.animate(keyframes, { ...baseOptions, direction: 'reverse' });
            el.style.opacity = '0';
          }
        }, { threshold: 0.25 });
      
        observer.observe(el);
        el.dataset.flyInited = "true";
      }
      
      
      

      // NEW: fly-group — applies fly-in to children with delay when they enter viewport
      if (name === 'fly-group') {
        if (el.dataset.flyInited) return;
      
        const children = Array.from(el.children).filter(c => !c.classList.contains('el-exclude'));
        children.forEach(child => child.style.opacity = '0');
      
        const [keyframes, baseOptions] = processAnimation(value);
      
        const observer = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) {
            children.forEach((child, index) => {
              const delay = 250 * index;
      
              setTimeout(() => {
                const childOptions = { ...baseOptions, delay, direction: 'normal' };
                child.animate(keyframes, childOptions);
                child.style.opacity = '1';
              }, delay);
            });
          } else {
            children.forEach((child, index) => {
              const delay = 250 * index;
      
              setTimeout(() => {
                const childOptions = { ...baseOptions, delay, direction: 'reverse' };
                child.animate(keyframes, childOptions);
                child.style.opacity = '0';
              }, delay);
            });
          }
        }, { threshold: 0.25 });
      
        observer.observe(el);
        el.dataset.flyInited = 'true';
      }
      
      
      

    }
  }
}

// === GLOBAL LOGGER (already in your code) ===
(function (global) {
  global.show = {
    dev: false,
    log(data, type = 'Log') {
      if (!show.dev) return;
      const style = {
        Log: 'background:#00ace6; color:#fff; padding:3px;min-width:160px;',
        important: 'background:#f00; color:#fff; padding:3px;min-width:160px;',
        keyframes: 'background:#7e57c2; color:#fff; padding:3px;min-width:160px;',
        options: 'background:#0a0; color:#fff; padding:3px;min-width:160px;',
      };
      console.groupCollapsed(`%c${type}`, style[type], data);
      console.trace();
      console.groupEnd();
    }
  };
})(window);

show.dev = true;

// === REACTIVITY SUPPORT ===
// Auto re-run fly() on DOM updates (Jet.js or any reactive app)
const observer = new MutationObserver(() => {
  fly(); // Re-run fly for new elements
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Initial trigger
fly();

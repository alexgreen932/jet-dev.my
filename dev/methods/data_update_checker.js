import { isStaticOrDynamic } from './helpers.js';

//todo SAM(Symplify and Modify)

/**
 * Checks if a value at the given path has changed, and rerenders once if needed
 * @param {*} valueOnRender - Value when the template rendered
 * @param {string} path - Path to track (e.g. "el.cls", "title", "app[0]")
 */

export default function data_update_checker(valueOnRender, path) {
  //cancel re render if its canseled
  if (this.j_r == false || this.j_r == 0) return;
  
  const compName = this.tagName.toLowerCase();

  // Deep clone using JSON fallback (structuredClone fails on DOM/function refs)
  let renderedSnapshot;
  try {
    renderedSnapshot = JSON.parse(JSON.stringify(valueOnRender));
  } catch (err) {
    
    renderedSnapshot = valueOnRender; // fallback to shallow
  }

  document.addEventListener('data-updated', () => {
    if (!this.j_isNotRerendered || this.j_isRendering) return;

    let checkedValue = isStaticOrDynamic(this, path);

    // Normalize both values for comparison
    const rendered = JSON.stringify(renderedSnapshot);
    
    const current = JSON.stringify(checkedValue);
    

    // this.j_deb('com-for', [[rendered, 'on render'], [current, 'path']]);

    if (rendered !== current) {
      this.j_isRendering = true;
      this.j_isNotRerendered = false;

      this.log(
        'Re_render',
        `Component re-rendered because value of "${path}" changed.`
      );
      this.render();

      setTimeout(() => {
        this.j_isNotRerendered = true;
        this.j_isRendering = false;
      }, 100);
    }
  });
}

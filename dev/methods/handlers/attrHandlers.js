import { isStaticOrDynamic, resolveDataPath } from '../helpers.js';


export function handleHtml(el, attr, value, context) {
	el.innerHTML = isStaticOrDynamic(context, value);
}

//todo rm
export function handleEl(el, attr, value, context) {
	el.setAttribute('data-parent', context.tagName.toLowerCase());
}

export function handleGrid(el, attr, value, context) {
	el.setAttribute('parent-data', context.tagName.toLowerCase());
}
export function handleProp(el, attr, value, context) {
	el.setAttribute('parent-data', context.tagName.toLowerCase());
}

export function handleIteration(el, attr, value, context) {
	el.setAttribute('parent-data', context.tagName.toLowerCase());
}

export function handleJson(el, attr, value, context) {
	// el.setAttribute('parent-data', context.tagName.toLowerCase());
	   console.log('el: ', el);
    console.log('attr: ', attr);
    console.log('value: ', value);
    console.log('context: ', context);
    const propName = attr.name.slice(2); // from 'j:' → 'prop_name'
    console.log(' obj val ---------- ', propName.item);
    // console.log(' obj val ---------- ', propName[attr.value]);
    let jsonStr = btoa(JSON.stringify(propName[attr.value]))
    el.setAttribute(`j-${propName}`, jsonStr);
}



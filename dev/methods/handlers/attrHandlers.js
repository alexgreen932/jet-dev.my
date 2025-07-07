import { isStaticOrDynamic, resolveDataPath } from '../helpers.js';

//depricated
// export function handleAt(el, attr, value, context) {
// 	const event = attr.name.slice(1);
// 	el.setAttribute('element-event', event);
// 	el.setAttribute('event-data', value);

// 	if (value.includes('=')) {
// 		const [prop, val] = value.split('=').map(s => s.trim());
// 		el.setAttribute('data-event', event);
// 		el.setAttribute('data-prop', prop);
// 		el.setAttribute('data-newvalue', val);
// 	} else {
// 		//process function call
// 		const match = value.match(/^([a-zA-Z0-9_]+)\((.*?)\)$/);
// 		if (match) {
// 			const methodName = match[1];
// 			let args = null;
// 			if (match[2]) {
// 				args = match[2];
// 				el.setAttribute('data-args', args);//set data-args only if it has
// 			}

// 			el.setAttribute('data-event', event);
// 			el.setAttribute('data-method', methodName);
// 		} else {
// 			el.setAttribute('data-event', event);
// 			el.setAttribute('data-method', value);
// 		}
// 	}

// 	// context.doEvents();
// 	context.j_events();
// }

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



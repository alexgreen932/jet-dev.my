import { resolveDataPath } from '../helpers.js';


export function handleProp(el, attr, value, context) {
console.log('el--- ', el);
	const event = attr.name.slice(1);
	el.setAttribute('element-event', event);
	el.setAttribute('event-data', value);

	if (value.includes('=')) {
		const [prop, val] = value.split('=').map(s => s.trim());
		el.setAttribute('data-event', event);
		el.setAttribute('data-prop', prop);
		el.setAttribute('data-newvalue', val);
	} else {
        //process function call
		const match = value.match(/^([a-zA-Z0-9_]+)\((.*?)\)$/);
		if (match) {
			const methodName = match[1];
			let args = null;
			if (match[2]) {
				args = match[2];
                el.setAttribute('data-args', args);//set data-args only if it has
			}
            //old way
			// if (match[2] && match[2].includes(',')) {
			// 	args = match[2].split(',').map(arg => context.resolveDataPath(this, arg)).join(', ');
            //     console.log('multi args ', args);
			// } else if (match[2]) {
			// 	args = context.resolveDataPath(this, match[2]);
            //     console.log('single arg ', args);
			// }
			el.setAttribute('data-event', event);
			el.setAttribute('data-method', methodName);
		} else {
			el.setAttribute('data-event', event);
			el.setAttribute('data-method', value);
		}
	}

	context.doEvents();
}

export function handleEl(el, attr, value, context) {
	el.setAttribute('data-parent', context.tagName.toLowerCase());
}

export function handleColon(el, attr, value, context) {
	const key = attr.name.slice(1);
	if (key === 'class') {
		value.split(',').map(cls => cls.trim()).forEach(cls => {
			el.classList.add(resolveDataPath(context, cls));
		});
	} else {
		// Handle dynamic attrs
		// el.setAttribute(key, context.data[value] || value); // Your original note
	}
}


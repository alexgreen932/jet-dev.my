// import { resolveDataPath } from './help-functions.js';

export default function handleAt(el, attr, value, context) {
	const event = attr.name.slice(1);

	if (value.includes('=')) {
		const [prop, val] = value.split('=').map(s => s.trim());
		el.setAttribute('data-event', event);
		el.setAttribute('data-prop', prop);
		el.setAttribute('data-newvalue', val);
	} else {
        //process function call
		const match = value.match(/^([a-zA-Z0-9_]+)\((.*?)\)$/);
		if (match) {
		console.log('match: ', match);

			const methodName = match[1];
			let args = null;
			if (match[2]) {
				args = match[2];
                el.setAttribute('data-args', args);//set data-args only if it has
			}
			el.setAttribute('data-event', event);
			el.setAttribute('data-method', methodName);
		} else {
			console.log('not match');			
			el.setAttribute('data-event', event);
			el.setAttribute('data-method', value);
		}
	}

	context.doEvents();
}

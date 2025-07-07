// jModel.js
import { updateNestedProperty, resolveDataPath, resolveDynamicIndex } from './helpers.js';


export default function jModel() {
	const items = this.querySelectorAll('[j-model]');
	if (items.length === 0) return;

	items.forEach(item => {
		const keyPath = item.getAttribute('j-model');
		let propValue = resolveDynamicIndex(keyPath, this);

		if (propValue !== undefined) {
			item.value = propValue;
		}

		item.addEventListener('input', (e) => {
			let newValue = e.target.value;
			updateNestedProperty(this, keyPath, newValue); // keep this for now
		});

		item.removeAttribute('j-model');
	});
}


import { updateNestedProperty, resolveDynamicIndex } from './help-functions.js';

/**
 * Handles two-way data binding using j-model (input, textarea, select)
 */
export default function jModel() {
	const items = this.querySelectorAll('[j-model]');
	if (items.length === 0) return;

	items.forEach(item => {
		const keyPath = item.getAttribute('j-model');
		let propValue = resolveDynamicIndex(keyPath, this);

		// 👇 Handle textarea innerHTML vs value properly
		if (propValue !== undefined) {
			if (item.tagName === 'TEXTAREA') {
				item.value = String(propValue); // Always set as raw string
			} else if (item.type === 'checkbox') {
				item.checked = Boolean(propValue);
			} else {
				item.value = propValue;
			}
		}

		// 👇 Listen for changes and update reactive data
		item.addEventListener('input', (e) => {
			let newValue = e.target.value;

			// Checkboxes: update boolean
			if (item.type === 'checkbox') {
				newValue = item.checked;
			}

			// 👇 Update model (trigger Proxy reactivity)
			updateNestedProperty(this, keyPath, newValue);


			// 👇 Optional: dispatch reactivity event
			if (this.j_r) {
				const ev = new Event('data-updated', { bubbles: true });
				this.dispatchEvent(ev);
			}
		});

		item.removeAttribute('j-model');
	});
}

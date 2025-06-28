// jModel.js
import { j_escape } from './help-functions.js';


export default function j_slots(sl) {
	if (sl === 'array') {
		this.slots = [];//create array
		//logic
	} else {
		this.slots = {};//create object
		const slotElements = this.querySelectorAll('slot[name]');

		slotElements.forEach(slot => {
			const name = slot.getAttribute('name');
			const value = slot.innerHTML.trim(); // inject slot content into data as default
			if (name && value) {
				this.slots[name] = slot.innerHTML.trim();
			}
		});
	}

}


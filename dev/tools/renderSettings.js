export function renderSettings(el, windowEl) {
	const current = getStyleSettings();
	el.innerHTML = `
		<h3>Settings</h3>
		<form id="debug-settings-form">
        <div class="control-field">
			<label>Theme:</label>
				<select name="styleClass">
					<option value="db-light" ${current.styleClass === 'db-light' ? 'selected' : ''}>Light</option>
					<option value="db-dark" ${current.styleClass === 'db-dark' ? 'selected' : ''}>Dark</option>
				</select>
        </div>
        <div class="control-field">
			<label>Position:</label>
				<select name="positionClass">
					<option value="db-bottom" ${current.positionClass === 'db-bottom' ? 'selected' : ''}>Bottom</option>
					<option value="db-bottom-right" ${current.positionClass === 'db-bottom-right' ? 'selected' : ''}>Right</option>
				</select>
        </div>
        <div class="control-field">			
			<label>Size:</label>
				<select name="sizeClass">
					<option value="db-medium" ${current.sizeClass === 'db-medium' ? 'selected' : ''}>Normal</option>
					<option value="db-large" ${current.sizeClass === 'db-large' ? 'selected' : ''}>Large</option>
				</select>
        </div>
        <div class="control-field">
			<label>Keep Open:</label>
				<select name="keepOpen">
					<option value="no" ${!current.keepOpen ? 'selected' : ''}>No</option>
					<option value="yes" ${current.keepOpen ? 'selected' : ''}>Yes</option>
				</select>
        </div>



	
			<button type="submit">Save Settings</button>
		</form>
	`;

	document.getElementById('debug-settings-form').onsubmit = (e) => {
		e.preventDefault();
		const form = e.target;
		localStorage.setItem('styleClass', form.styleClass.value);
		localStorage.setItem('positionClass', form.positionClass.value);
		localStorage.setItem('sizeClass', form.sizeClass.value);
		localStorage.setItem('keepOpen', form.keepOpen.value);
		alert('Settings saved. Reload the page to apply.');
	};
}

function getStyleSettings() {
	return {
		styleClass: localStorage.getItem('styleClass') || 'db-dark',
		positionClass: localStorage.getItem('positionClass') || 'db-bottom-right',
		sizeClass: localStorage.getItem('sizeClass') || 'db-medium',
		keepOpen: localStorage.getItem('keepOpen') === 'yes'
	};
}
export {getStyleSettings};
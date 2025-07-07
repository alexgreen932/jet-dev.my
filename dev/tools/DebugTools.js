export default function DebugTools() {
	if (!app.debug) return;
	initDebugUI();
	hookConsoleError();
	hookConsoleWarn();
	hookConsoleLog();
	hookGlobalErrors();
	hookUnhandledRejections();
	bindDebugShortcut();
}

function getStyleSettings() {
	return {
		styleClass: localStorage.getItem('styleClass') || 'db-dark',
		positionClass: localStorage.getItem('positionClass') || 'db-bottom-right',
		sizeClass: localStorage.getItem('sizeClass') || 'db-medium',
		keepOpen: localStorage.getItem('keepOpen') === 'yes'
	};
}

function initDebugUI() {
	const { styleClass, positionClass, sizeClass, keepOpen } = getStyleSettings();
	const container = document.createElement('div');
	container.id = 'debug-panel';
	container.innerHTML = `
		<div id="debug-icons">
			<button id="debug-info-btn">\u2139\ufe0f</button>
			<button id="debug-error-btn" style="display:none;">\u2757</button>
			<button id="debug-warn-btn" style="display:none;">\u26a0\ufe0f</button>
			<button id="debug-log-btn" style="display:none;">\u270d\ufe0f</button>
		</div>
		<div id="debug-window" class="${styleClass} ${positionClass} ${sizeClass}" style="display: ${keepOpen ? 'block' : 'none'};">
			<div id="debug-tabs">
				<button data-tab="info">App Info</button>
				<button data-tab="errors">Errors</button>
				<button data-tab="warnings">Warnings</button>
				<button data-tab="renders">Renders</button>
				<button data-tab="logs">Logs</button>
				<button data-tab="settings">Settings</button>
			</div>
			<div id="debug-content"></div>
		</div>
	`;
	document.body.appendChild(container);

	const infoBtn = document.getElementById('debug-info-btn');
	const errorBtn = document.getElementById('debug-error-btn');
	const warnBtn = document.getElementById('debug-warn-btn');
	const logBtn = document.getElementById('debug-log-btn');
	const windowEl = document.getElementById('debug-window');
	const contentEl = document.getElementById('debug-content');
	const tabs = document.querySelectorAll('#debug-tabs button');

	infoBtn.onclick = () => {
		toggleDebugWindow(windowEl);
		renderAppInfo(contentEl);
	};
	errorBtn.onclick = () => {
		showDebugWindow(windowEl);
		renderErrors(contentEl);
	};
	warnBtn.onclick = () => {
		showDebugWindow(windowEl);
		renderWarnings(contentEl);
	};
	logBtn.onclick = () => {
		showDebugWindow(windowEl);
		renderLogs(contentEl);
	};

	tabs.forEach(tab => {
		tab.onclick = () => {
			const type = tab.dataset.tab;
			if (type === 'info') renderAppInfo(contentEl);
			else if (type === 'errors') renderErrors(contentEl);
			else if (type === 'warnings') renderWarnings(contentEl);
			else if (type === 'renders') renderRenders(contentEl);
			else if (type === 'logs') renderLogs(contentEl);
			else if (type === 'settings') renderSettings(contentEl, windowEl);
		};
	});

	app._updateErrorIcon = () => {
		errorBtn.style.display = app.errors.length > 0 ? 'inline-block' : 'none';
	};
	app._updateWarnIcon = () => {
		warnBtn.style.display = app.warnings.length > 0 ? 'inline-block' : 'none';
	};
	app._updateLogIcon = () => {
		logBtn.style.display = app.logs && app.logs.length > 0 ? 'inline-block' : 'none';
	};
}

function hookConsoleError() {
	const original = console.error;
	console.error = function (...args) {
		app.errors.push(args.join(' '));
		app._updateErrorIcon?.();
		original.apply(console, args);
	};
}

function hookConsoleWarn() {
	const original = console.warn;
	console.warn = function (...args) {
		app.warnings.push(args.join(' '));
		app._updateWarnIcon?.();
		original.apply(console, args);
	};
}

function hookConsoleLog() {
	const original = console.log;
	console.log = function (...args) {
		app.logs = app.logs || [];
		app.logs.push(args.map(String).join(' '));
		app._updateLogIcon?.();
		original.apply(console, args);
	};
}

function hookGlobalErrors() {
	const oldHandler = window.onerror;
	window.onerror = function (msg, url, line, col, err) {
		const text = `${msg} at ${url}:${line}:${col}`;
		app.errors.push(text);
		app._updateErrorIcon?.();
		if (oldHandler) return oldHandler(msg, url, line, col, err);
		return false;
	};
}

function hookUnhandledRejections() {
	window.addEventListener('unhandledrejection', function (e) {
		app.errors.push(`Unhandled promise rejection: ${e.reason}`);
		app._updateErrorIcon?.();
	});
}

function toggleDebugWindow(win) {
	win.style.display = win.style.display === 'none' ? 'block' : 'none';
}
function showDebugWindow(win) {
	win.style.display = 'block';
}

function bindDebugShortcut() {
	document.addEventListener('keydown', (e) => {
		if (e.ctrlKey && e.key === 'x') {
			const win = document.getElementById('debug-window');
			toggleDebugWindow(win);
			if (win.style.display === 'block') {
				renderAppInfo(document.getElementById('debug-content'));
			}
		}
	});
}

function renderAppInfo(el) {
	el.innerHTML = `
		<h3>App Info</h3>
		${app.components.map(comp => `
			<div style="margin-bottom: 1em;">
				<strong>${comp.name}</strong>
				<pre>data: ${JSON.stringify(comp.data, null, 2)}</pre>
				<pre>methods: ${comp.methods.join(', ')}</pre>
				<pre>renders: ${comp.renders || 0} (last: ${comp.lastRenderTime?.toFixed(2) || 'N/A'}ms)</pre>
			</div>
		`).join('')}
	`;
}

function renderErrors(el) {
	el.innerHTML = `
		<h3>Console Errors</h3>
		<ul>
			${app.errors.length ? app.errors.map(e => `<li>${e}</li>`).join('') : '<li>No errors logged</li>'}
		</ul>
	`;
}

function renderWarnings(el) {
	el.innerHTML = `
		<h3>Console Warnings</h3>
		<ul>
			${app.warnings.length ? app.warnings.map(w => `<li>${w}</li>`).join('') : '<li>No warnings logged</li>'}
		</ul>
	`;
}

function renderLogs(el) {
	const logs = app.logs || [];
	el.innerHTML = `
		<h3>Console Logs</h3>
		<ul>
			${logs.length ? logs.map(l => `<li>${l}</li>`).join('') : '<li>No logs</li>'}
		</ul>
	`;
}

function renderRenders(el) {
	el.innerHTML = `
		<h3>Render Logs</h3>
		${app.components.map(comp => `
			<div style="margin-bottom: 1em;">
				<strong>${comp.name}</strong>
				<pre>renders: ${comp.renders || 0}</pre>
				<pre>Last Render Time: ${comp.lastRenderTime?.toFixed(2) || 'N/A'}ms</pre>
			</div>
		`).join('')}
	`;
}

function renderSettings(el, windowEl) {
	const current = getStyleSettings();
	el.innerHTML = `
		<h3>Settings</h3>
		<form id="debug-settings-form">
			<label>Theme:
				<select name="styleClass">
					<option value="db-light" ${current.styleClass === 'db-light' ? 'selected' : ''}>Light</option>
					<option value="db-dark" ${current.styleClass === 'db-dark' ? 'selected' : ''}>Dark</option>
				</select>
			</label><br/><br/>
			<label>Position:
				<select name="positionClass">
					<option value="db-top-left" ${current.positionClass === 'db-top-left' ? 'selected' : ''}>Top Left</option>
					<option value="db-bottom-right" ${current.positionClass === 'db-bottom-right' ? 'selected' : ''}>Bottom Right</option>
				</select>
			</label><br/><br/>
			<label>Size:
				<select name="sizeClass">
					<option value="db-small" ${current.sizeClass === 'db-small' ? 'selected' : ''}>Small</option>
					<option value="db-medium" ${current.sizeClass === 'db-medium' ? 'selected' : ''}>Medium</option>
					<option value="db-large" ${current.sizeClass === 'db-large' ? 'selected' : ''}>Large</option>
				</select>
			</label><br/><br/>
			<label>Keep Open:
				<select name="keepOpen">
					<option value="no" ${!current.keepOpen ? 'selected' : ''}>No</option>
					<option value="yes" ${current.keepOpen ? 'selected' : ''}>Yes</option>
				</select>
			</label><br/><br/>
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

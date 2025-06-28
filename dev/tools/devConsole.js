// devConsole.js (Updated Version)
export { trace } from './trace.js'; // keep trace export

// Import renderers
import renderAppInfo from './console/renderAppInfo.js';
import { renderSettings, getStyleSettings } from './renderSettings.js';
import navigateApp from './console/navigateApp.js';

export function devConsole() {
	app.devtoolsEnabled = true; // ✅ New flag
	initDebugUI();
	bindDebugShortcut();
}

function initDebugUI() {
	const { styleClass, positionClass, sizeClass, keepOpen } = getStyleSettings();
	const container = document.createElement('div');
	container.id = 'debug-panel';
	const cList = [styleClass, positionClass, sizeClass];
	container.classList.add(...cList);
	container.innerHTML = `
    <div id="debug-icons">
      <button id="debug-info-btn">ℹ️</button>
    </div>
    <div id="debug-window" class="${styleClass} ${positionClass} ${sizeClass}" style="display: ${keepOpen ? 'block' : 'none'};">
      <div id="debug-tabs">
        <button data-tab="info">App Info</button>
        <button data-tab="watchers">Watchers</button>
        <button data-tab="logs">Logs</button>
        <button data-tab="settings">⚙</button>
      </div>
      <div id="debug-content"></div>
    </div>
  `;
	document.body.appendChild(container);

	const infoBtn = document.getElementById('debug-info-btn');
	const windowEl = document.getElementById('debug-window');
	const contentEl = document.getElementById('debug-content');
	const tabs = document.querySelectorAll('#debug-tabs button');

	infoBtn.onclick = () => {
		toggleDebugWindow(windowEl);
		renderAppInfo(contentEl);
	};

	tabs.forEach(tab => {
		tab.onclick = () => {
			const type = tab.dataset.tab;
			if (type === 'info') renderAppInfo(contentEl);
			else if (type === 'watchers') renderWatchers(contentEl);
			else if (type === 'logs') renderLogs(contentEl);
			else if (type === 'settings') renderSettings(contentEl, windowEl);
		};
	});

	app.dev.refreshDevConsole = () => {
		const active = document.querySelector('#debug-tabs button.active')?.dataset.tab;
		if (active === 'logs') renderLogs(contentEl);
		if (active === 'watchers') renderWatchers(contentEl);
	};

	navigateApp();
	container.addEventListener('click', () => navigateApp());
}

function toggleDebugWindow(win) {
	win.style.display = win.style.display === 'none' ? 'block' : 'none';
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

function renderWatchers(el) {
	el.innerHTML = `
    <h3>Watchers</h3>
    ${Object.entries(app.watchers).map(([key, val]) => `
      <label style="display: block; margin-bottom: 0.25em;">
        <input type="checkbox" ${val ? 'checked' : ''} onchange="app.watchers['${key}'] = this.checked; localStorage.setItem('jet-watchers', JSON.stringify(app.watchers)); app.dev.refreshDevConsole();">
        ${key}
      </label>
    `).join('')}
  `;
}

function renderLogs(el) {
	const logs = app.logs || [];
	el.innerHTML = `
    <h3>Logs</h3>
    <ul>
      ${logs.length ? logs.map(l => `<li class="d-item-log">${l}</li>`).join('') : '<li>No logs</li>'}
    </ul>
  `;
}

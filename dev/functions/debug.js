// debug.js
/**
 * This module provides the Debug UI for Componentor.js.
 * It creates a floating panel that displays information about registered components,
 * console errors, console warnings, and render logs.
 *
 * Additionally, it binds a developer shortcut (Ctrl+X) to toggle the panel.
 */

// Export the function that enables the debug tools
export function enableDebugTools() {
    if (!app.debug) return;
    initDebugUI();       // Set up the debug UI panel and icons
    hookConsoleError();  // Hook into console.error
    hookConsoleWarn();   // Hook into console.warn
    bindDebugShortcut(); // Bind Ctrl+X to toggle the panel
  }
  
  /**
   * Initializes the Debug UI Panel.
   * Creates icons and the window with tabs, and appends everything to the document body.
   */
  function initDebugUI() {
    const container = document.createElement('div');
    container.id = 'debug-panel';
    container.innerHTML = `
      <style>
        /* Styles for debug panel and its contents */
        #debug-panel {
          position: fixed;
          bottom: 0;
          right: 0;
          z-index: 9999;
          font-family: sans-serif;
        }
        #debug-icons {
          display: flex;
          gap: 8px;
          padding: 5px;
        }
        #debug-icons button {
          padding: 5px 8px;
          cursor: pointer;
        }
        #debug-window {
          display: none;
          background: white;
          border: 1px solid #ccc;
          width: 400px;
          height: 300px;
          overflow: auto;
          padding: 10px;
        }
        #debug-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
        }
        #debug-tabs button {
          cursor: pointer;
        }
        #debug-content pre {
          white-space: pre-wrap;
          word-break: break-word;
        }
      </style>
      <div id="debug-icons">
        <button id="debug-info-btn">ℹ️</button>
        <button id="debug-error-btn" style="display:none;">❗</button>
        <button id="debug-warn-btn" style="display:none;">⚠️</button>
      </div>
      <div id="debug-window">
        <div id="debug-tabs">
          <button data-tab="info">App Info</button>
          <button data-tab="errors">Errors</button>
          <button data-tab="warnings">Warnings</button>
          <button data-tab="renders">Renders</button>
        </div>
        <div id="debug-content"></div>
      </div>
    `;
    document.body.appendChild(container);
  
    // Retrieve debug panel elements
    const infoBtn = document.getElementById('debug-info-btn');
    const errorBtn = document.getElementById('debug-error-btn');
    const warnBtn = document.getElementById('debug-warn-btn');
    const windowEl = document.getElementById('debug-window');
    const contentEl = document.getElementById('debug-content');
    const tabs = document.querySelectorAll('#debug-tabs button');
  
    // Toggle the debug window when clicking the info icon
    infoBtn.onclick = () => {
      toggleDebugWindow(windowEl);
      renderAppInfo(contentEl);
    };
  
    // Clicking error or warning icons switches to the corresponding tab
    errorBtn.onclick = () => renderErrors(contentEl);
    warnBtn.onclick = () => renderWarnings(contentEl);
  
    // Set up tab navigation
    tabs.forEach(tab => {
      tab.onclick = () => {
        const type = tab.dataset.tab;
        if (type === 'info') renderAppInfo(contentEl);
        else if (type === 'errors') renderErrors(contentEl);
        else if (type === 'warnings') renderWarnings(contentEl);
        else if (type === 'renders') renderRenders(contentEl);
      };
    });
  
    // Expose functions on app to update error/warning icons when new entries are logged.
    app._updateErrorIcon = () => {
      errorBtn.style.display = app.errors.length > 0 ? 'inline-block' : 'none';
    };
    app._updateWarnIcon = () => {
      warnBtn.style.display = app.warnings.length > 0 ? 'inline-block' : 'none';
    };
  }
  
  /**
   * Hooks into console.error so that errors are captured and stored in app.errors.
   */
  function hookConsoleError() {
    const originalError = console.error;
    console.error = function (...args) {
      app.errors.push(args.join(' '));
      app._updateErrorIcon();
      originalError.apply(console, args);
    };
  }
  
  /**
   * Hooks into console.warn to capture warning messages.
   */
  function hookConsoleWarn() {
    const originalWarn = console.warn;
    console.warn = function (...args) {
      app.warnings.push(args.join(' '));
      app._updateWarnIcon();
      originalWarn.apply(console, args);
    };
  }
  
  /**
   * Binds the shortcut Ctrl+X to toggle the debug panel.
   * (Ctrl+X is chosen as it does not conflict with other common shortcuts.)
   */
  function bindDebugShortcut() {
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'x') {
        const windowEl = document.getElementById('debug-window');
        windowEl.style.display = windowEl.style.display === 'none' ? 'block' : 'none';
        if (windowEl.style.display === 'block') {
          const contentEl = document.getElementById('debug-content');
          renderAppInfo(contentEl);
        }
      }
    });
  }
  
  /**
   * Toggles the visibility of the debug window.
   */
  function toggleDebugWindow(windowEl) {
    windowEl.style.display = windowEl.style.display === 'none' ? 'block' : 'none';
  }
  
  /**
   * Renders the "App Info" tab, which displays component info.
   */
  function renderAppInfo(el) {
    el.innerHTML = `
      <h3>App Info</h3>
      ${app.components.map(comp => `
        <div style="margin-bottom: 1em;">
          <strong>${comp.name}</strong>
          <pre>data: ${JSON.stringify(comp.data, null, 2)}</pre>
          <pre>methods: ${comp.methods.join(', ')}</pre>
          <pre>renders: ${comp.renders || 0} (last: ${comp.lastRenderTime ? comp.lastRenderTime.toFixed(2) + 'ms' : 'N/A'})</pre>
        </div>
      `).join('')}
    `;
  }
  
  /**
   * Renders the "Errors" tab with the logged console errors.
   */
  function renderErrors(el) {
    el.innerHTML = `
      <h3>Console Errors</h3>
      <ul>
        ${app.errors.map(err => `<li>${err}</li>`).join('')}
      </ul>
    `;
  }
  
  /**
   * Renders the "Warnings" tab with the logged console warnings.
   */
  function renderWarnings(el) {
    el.innerHTML = `
      <h3>Console Warnings</h3>
      <ul>
        ${app.warnings.map(warn => `<li>${warn}</li>`).join('')}
      </ul>
    `;
  }
  
  /**
   * Renders the "Renders" log tab showing how many times components have re-rendered.
   */
  function renderRenders(el) {
    el.innerHTML = `
      <h3>Component Render Logs</h3>
      ${app.components.map(comp => `
        <div style="margin-bottom: 1em;">
          <strong>${comp.name}</strong>
          <pre>renders: ${comp.renders || 0}</pre>
          <pre>Last Render Time: ${comp.lastRenderTime ? comp.lastRenderTime.toFixed(2) + 'ms' : 'N/A'}</pre>
        </div>
      `).join('')}
    `;
  }
  
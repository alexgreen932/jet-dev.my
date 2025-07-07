export function traceLog(data, component = null, label = null, note = null) {
	const enabled = Array.isArray(window.devDebug) ? window.devDebug.includes(label) : !!window.devDebug;
	if (!enabled && label !== null) return;
  
	const tag = `[${component?.name || component?.getAttribute?.('is') || component?.tagName?.toLowerCase() || 'component'}]:`;
	const styles = [
	  'background:#00ace6; color:#fff; padding:3px; font-weight:bold;',
	  'background:#f00; color:#fff; padding:3px; font-weight:bold;',
	  'background:#404550; color:#fff; padding:3px; font-weight:bold;',
	  'background:#0a0; color:#fff; padding:3px; font-weight:bold;',
	  'background:#9500ff; color:#fff; padding:3px; font-weight:bold;'
	];
	const style = styles[Math.floor(Math.random() * styles.length)];
	let message = label ? `${label} trace` : 'trace';
	if (note) message += ` (Note: ${note})`;
  
	console.groupCollapsed(`%c${tag} ${message}`, style);
	console.log(data);
	console.trace();
	console.groupEnd();
  
	if (window.__devtools_logs) {
	  window.__devtools_logs.push({ tag, message, data });
	  window.__devtools_update?.();
	}
  }
// export function hookConsoleError() {
// 	const original = console.error;
// 	console.error = function (...args) {
// 		app.errors.push(args.join(' '));
// 		app._updateErrorIcon?.();
// 		original.apply(console, args);
// 	};
// }

// export function hookConsoleWarn() {
// 	const original = console.warn;
// 	console.warn = function (...args) {
// 		app.warnings.push(args.join(' '));
// 		app._updateWarnIcon?.();
// 		original.apply(console, args);
// 	};
// }

// export function hookConsoleLog() {
// 	const original = console.log;
// 	console.log = function (...args) {
// 		app.logs = app.logs || [];
// 		app.logs.push(args.map(String).join(' '));
// 		app._updateLogIcon?.();
// 		// original.apply(console, args);
// 	};
// }


export function hookGlobalErrors() {
	const oldHandler = window.onerror;

	window.onerror = function (msg, url = '', line, col, err) {
		const stack = err?.stack || '';
		const matchesJet = stack.includes('/com.js') || stack.includes('/jet.js');

		if (!matchesJet) return false;

		const text = `
			<div class="d-item">
				<div class="d-title-er">${msg}</div>
				<div class="d-details">
					at ${url}:${line}:${col}<br>
					<pre class="d-stack">${stack}</pre>
				</div>
			</div>
		`;

		app.errors.push(text);
		app._updateErrorIcon?.();

		if (oldHandler) return oldHandler(msg, url, line, col, err);
		return false;
	};
}


export function hookUnhandledRejections() {
	window.addEventListener('unhandledrejection', function (e) {
		app.errors.push(`Unhandled promise rejection: ${e.reason}`);
		app._updateErrorIcon?.();
	});
}


export default function renderAppInfo(el) {
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

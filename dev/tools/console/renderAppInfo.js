export default function renderAppInfo(el) {
	el.innerHTML = `
		<h3>Components</h3>
		${app.components.map(comp => `
			<div class="d-item dbi isOpen isSection">
				<h3 class="dbi">${comp.name} <span class="db-click"></span></h3>
				<div class="db-content">
					<pre class="dbi isOpen isSubSection"><label>data:</label> ${JSON.stringify(comp.data, null, 2)} <span class="db-click"></span></pre>
					<pre class="dbi isOpen isSubSection"><label>methods: <span class="db-click"></span></label> ${comp.methods.join(', ')}</pre>
					<pre class="dbi isOpen isSubSection"><label>renders: <span class="db-click"></span></label> ${comp.renders || 0} (last: ${comp.lastRenderTime?.toFixed(2) || 'N/A'}ms)</pre>
				</div>
			</div>
		`).join('')}
	`;
}


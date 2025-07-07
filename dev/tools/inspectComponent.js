export default function inspectComponent(componentInstance) {
    // Remove any existing popup
    const existing = document.getElementById('jet-inspector-popup');
    if (existing) existing.remove();
  
    const style = localStorage.getItem('styleClass') || 'db-dark';
  
    // Create outer wrapper
    const wrapper = document.createElement('div');
    wrapper.id = 'jet-inspector-popup';
    wrapper.className = 'db-modal-backup';
  
    // Click outside popup closes it
    wrapper.addEventListener('click', (e) => {
      if (e.target === wrapper) wrapper.remove();
    });
  
    // Create popup HTML structure
    wrapper.innerHTML = `
      <style>
        /* You can customize later */
      </style>
      <div class="db-popup ${style}">
        <header>
          <h3>Inspect Component</h3>
        </header>
        <main>
          <pre>${JSON.stringify(componentInstance.args.data, null, 2)}</pre>
        </main>
        <footer>
          <button id="jet-inspector-close">Close</button>
        </footer>
      </div>
    `;
  
    document.body.appendChild(wrapper);
  
    // Button click closes popup
    wrapper.querySelector('#jet-inspector-close')?.addEventListener('click', () => wrapper.remove());
  }
  
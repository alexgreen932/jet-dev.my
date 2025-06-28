export default function inspectComponent(componentInstance) {
    // Remove any existing popup
    const existing = document.getElementById('jet-inspector-popup');
    if (existing) existing.remove();
  
    const popup = document.createElement('div');
    popup.id = 'jet-inspector-popup';
    let cls = localStorage.getItem('styleClass') || 'db-dark';
    popup.classList.add(cls);
    popup.style = `
      position: fixed;
      top: 10%;
      left: 50%;
      transform: translateX(-50%);
      max-width: 600px;
      background: #1e1e1e;
      color: #eee;
      padding: 1em;
      border-radius: 8px;
      box-shadow: 0 0 10px #000;
      z-index: 10000;
      font-family: monospace;
      white-space: pre-wrap;
    `;
  
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.style = `
      position: absolute;
      top: 5px;
      right: 10px;
      background: transparent;
      color: #ccc;
      font-size: 20px;
      border: none;
      cursor: pointer;
    `;
    closeBtn.onclick = () => popup.remove();
  
    const title = document.createElement('h3');
    title.textContent = `Inspecting: <${componentInstance.tagName.toLowerCase()}>`;
  
    const content = document.createElement('pre');
    content.textContent = JSON.stringify(componentInstance.args.data, null, 2);
  
    popup.appendChild(closeBtn);
    popup.appendChild(title);
    popup.appendChild(content);
    document.body.appendChild(popup);
  }
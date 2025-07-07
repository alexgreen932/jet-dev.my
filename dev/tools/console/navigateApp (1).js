export default function navigateApp() {
    const container = document.getElementById('debug-panel');
    if (!container) return;

    const headers = container.querySelectorAll('h3.dbc');

    headers.forEach((header, index) => {
        const key = `debug-panel-toggle-${index}`;

        // Prevent duplicate buttons
        if (header.querySelector('.dbc-click')) return;

        // Create and style the toggle icon
        const toggle = document.createElement('span');
        toggle.className = 'dbc-click';
        toggle.innerHTML = '&#x2795;'; // ➕ initially
        header.style.position = 'relative';
        header.appendChild(toggle);

        const parent = header.closest('.db-item');
        if (!parent) return;

        parent.style.overflow = 'hidden';
        parent.style.transition = 'height 0.3s ease';

        // Collapse by default, unless saved as 'open'
        const savedState = localStorage.getItem(key);
        const isCollapsed = savedState !== 'open';

        if (isCollapsed) {
            parent.style.height = '0px';
            parent.dataset.collapsed = 'true';
            toggle.innerHTML = '&#x2795;'; // ➕
        } else {
            const fullHeight = parent.scrollHeight;
            parent.style.height = `${fullHeight}px`;
            parent.dataset.collapsed = 'false';
            toggle.innerHTML = '&#x2796;'; // ➖
        }

        // Bind click toggle
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();

            const isNowCollapsed = parent.dataset.collapsed === 'true';

            if (isNowCollapsed) {
                const fullHeight = parent.scrollHeight;
                parent.style.height = `${fullHeight}px`;
                parent.dataset.collapsed = 'false';
                toggle.innerHTML = '&#x2796;';
                localStorage.setItem(key, 'open');
            } else {
                const currentHeight = parent.offsetHeight;
                parent.style.height = `${currentHeight}px`;
                requestAnimationFrame(() => {
                    parent.style.height = '0px';
                });
                parent.dataset.collapsed = 'true';
                toggle.innerHTML = '&#x2795;';
                localStorage.setItem(key, 'closed');
            }
        });
    });
}

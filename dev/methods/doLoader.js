import { resolveDataPath, formatTime } from './helpers.js'

export default function doLoader(tpl) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(tpl, 'text/html');
    const items = doc.querySelectorAll('[j-load]');

    if (items.length === 0) return tpl;

    items.forEach(item => {
        const conditionPath = item.getAttribute('j-load');
        const conditionValue = resolveDataPath(this, conditionPath);
        const isLoading = conditionValue === false || conditionValue === null || conditionValue === '';
        const loaderHTML = app.loader || `<div style="opacity:0;transition:opacity 0.4s ease;display:flex;justify-content:center;padding:1rem">Loading...</div>`;
        item.removeAttribute('j-load');

        if (isLoading) {
            item.innerHTML = loaderHTML;
            const loaderEl = item.firstElementChild;
            this._loadStart = performance.now(); // mark start time
            this.log('Loading...');

            if (loaderEl) {
                void loaderEl.offsetWidth;
                loaderEl.style.opacity = '1';
            }

        } else {
            const duration = performance.now() - (this._loadStart || 0);
            const takenTime = formatTime(duration);
            this.log('Loaded', `Loading time is ${takenTime}`, '', takenTime);
        }
    });

    return doc.body.innerHTML;
}


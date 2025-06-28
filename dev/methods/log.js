export default function log(key, msg = '', data = '', time = null) {

    if (!app.dev) return;
    //todo add condition app.dev
    if (app.watchers[key]) {
        const ignoreList = ['develop-console', 'j-logs', 'j-components', 'j-watchers', 'j-errors', 'j-warns'];
        const tag = this?.tagName?.toLowerCase?.() || 'unknown';
        if (ignoreList.includes(tag)) return;

        const log = {
            tag,
            key,
            msg,
            data,
            time: time || new Date().toLocaleTimeString('en-GB') + '.' + String(new Date().getMilliseconds()).padStart(3, '0'),
        };

        //new method - pushes to different log arrays if has special conditions
        switch (key) {
            case 'Error':
                app.errors.unshift(log);
                break;
            case 'Warn':
                app.warns.unshift(log);
                break;
            default:
                app.logs.unshift(log);
                break;
        }

        //old
        // if (key === 'Error') {
        //     app.errors.unshift(log);
        // } else {
        //     app.logs.unshift(log);
        // }

        const event = new Event('j_log', { bubbles: true });
        this.dispatchEvent(event);
    } else {

        // console.log(' Key is FALSE -----------');  
    }


}

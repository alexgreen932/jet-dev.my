
export default function d(logged_value, data, style = 'b', extra_message = null){
console.log('data: ', data);
console.log('logged_value: ', logged_value);
    console.log('method d works');    
    console.log('app.debug: ', app.debug);
    if (!window.app?.debug) return;
    ;
    //check if app.debug is not simply true for basic usage, and includes logged_value, for swith then on of off, not removing or commenting this.d()
    if (Array.isArray(app.debug) && app.debug.includes(logged_value)) {
        //
        const tag = `[${this?.name || this?.tagName?.toLowerCase() || 'component'}]: `
        const styles = {
            b: 'background:#00ace6; color: #fff; padding:3px;font-weight:bold;',
            r: 'background:#f00; color: #fff; padding:3px;;font-weight:bold;',
            d: 'background:#404550; color: #fff; padding:3px;;font-weight:bold;',
        };
        let extra = '';
        if (extra_message) {
            extra = ` (Note: ${extra})`;
        }
        const logStyle = styles[style] || styles.b;
        // console.trace(`%c${tag} ${logged_value} is ${data}.${extra}`, logStyle);
        console.trace(`%c${tag} ${logged_value} is${extra}`, logStyle, data);
    }


}



function log2(message = '', data = null, style = 'blue', type = 'log') {
	if (!window.app?.debug) return;

	const tag = `[${this?.name || this?.tagName?.toLowerCase() || 'component'}]: `;

	const styles = {
		b: 'background:#00ace6; color: #fff; padding:3px;font-weight:bold;',
		blue: 'background:#00ace6; color: #fff; padding:3px;font-weight:bold;',
		r: 'background:#f00; color: #fff; padding:3px;;font-weight:bold;',
		red: 'background:#f00; color: #fff; padding:3px;;font-weight:bold;',
		d: 'background:#404550; color: #fff; padding:3px;;font-weight:bold;',
		dark: 'background:#404550; color: #fff; padding:3px;;font-weight:bold;',
		error: 'background:#ad1457; color: #fff; padding:3px; font-weight:bold;;font-weight:bold;',
	};

	const logStyle = styles[style] || styles.blue;

	if (type === 'warn') {
		console.warn(`%c${tag}${message}`, logStyle, data || '');
	} else if (type === 'error') {
		console.error(`%c${tag}${message}`, logStyle, data || '');
	} else {
		console.log(`%c${tag}${message}`, logStyle, data || '');
	}
}


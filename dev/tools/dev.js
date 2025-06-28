function randomStyle() {
	const styles = [
		'background:#00ace6; color:#fff; padding:3px; font-weight:bold;',
		'background:#f00; color:#fff; padding:3px; font-weight:bold;',
		'background:#404550; color:#fff; padding:3px; font-weight:bold;',
		'background:#0a0; color:#fff; padding:3px; font-weight:bold;',
		'background:#9500ff; color:#fff; padding:3px; font-weight:bold;'
	];
	return styles[Math.floor(Math.random() * styles.length)];
}

	// console.log('dev loaded');
//global app.dev.func_name
export const dev = {
	//check data in interval 
	check: (v, msg = null, interval = 2000) => {

		// console.log('dev check works');
		if (!msg) {
			msg = 'Data Check: ';
		}
		let style = 'background:#512da8; color:#fff; padding:3px; font-weight:bold;';
		setInterval(() => {
			// console.log(`%c${msg} `, style, v);
		}, interval);
	},

};
import { resolveDataPath, resolveDynamicIndex } from './helpers.js'


function escapeDangerCode(str) {
	// TODO: basic safe escape
	return str.replace(/[<>&"'`]/g, c => ({
		'<': '&lt;',
		'>': '&gt;',
		'&': '&amp;',
		'"': '&quot;',
		"'": '&#x27;',
		'`': '&#x60;'
	}[c]));
}

export default function doInterpolation(tpl) {
	if (!tpl.includes('{{')) return tpl;

	return tpl.replace(/{{(.*?)}}/g, (_, path) => {
		path = path.trim();

		// If it's a method call like hello(1)
		if (/^([a-zA-Z0-9_]+)\((.*?)\)$/.test(path)) {
			return this.executeMethod(path);
		}

		this.data_update_checker( resolveDynamicIndex(path, this), path );
		// console.log('resolveDynamicIndex(path, this),: ', resolveDynamicIndex(path, this));
		// console.log('path: ', path);

		const resolvedValue = resolveDynamicIndex(path, this);
		return resolvedValue !== undefined ? escapeDangerCode(String(resolvedValue)) : '';
	});
}




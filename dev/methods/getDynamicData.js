import { resolveDataPath } from './help-functions.js'

//get dynamic data if value is a property of any of component object, returns if it's static value
export default function getDynamicData(val) {
    // console.log('val: ', val);
    // 	console.log('this.dynamicKeys: ', this.dynamicKeys);
    if (this.dynamicKeys.length) {
        this.dynamicKeys.forEach(key => {
            if (val.startsWith(`${key}.`)) {
                val = resolveDataPath(this, val);
                // console.log('${key}.: ', `${key}.`);
            }
        });
    }
    return val;
}



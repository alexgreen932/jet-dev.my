/**
 * For development only: log info only for a specific component
 * @param {string} com - Component tag name (like 'com-example')
 * @param {Array} logs - Array of arrays: [data] or [data, label]
 */

export default function j_deb(com, logs) {
    const current_component = this.tagName?.toLowerCase?.();
    if (current_component !== com.toLowerCase()) return;

    const style = 'background:#00ace6; color:#fff; padding:3px; font-weight:bold;';
    // console.log(`%c[${com}]`, style);

    logs.forEach((entry, i) => {
        let data = entry[0];
        let label = entry[1] || `log_${i}`;
        console.log(`%c[${com}], ${label}:`, style,  data);
    });
    //old
    // logs.forEach((entry, i) => {
    //     let data = entry[0];
    //     let label = entry[1] || `log_${i}`;
    //     console.log(`${label}:`, data);
    // });

}

//usage this.j_deb('com-example', [ [any_var], [any_var2, 'Second var'] ]);



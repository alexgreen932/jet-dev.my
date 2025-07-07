export default function j_log( watcherKey,  message = null,  data = null ){
    //if app.devand watcher not true stop
    if ( !app.dev && !watchers[watcherKey]) {
        return;
    }
    const ignoreList = ; 
    // let msg, d;
    // if (message) {
    //     msg = `<span class="j_log_msg">${message}</span>`;
    // } 
    // if (data) {
    //     d = `<span class="j_log_data">[${data}]</span>`;
    // } 
    // let log = `
    //     <span class="j_log_name">[${watcherKey}]</span>       
    //     ${msg}
    //     ${d}
    // `;
    let log = {
        key: watcherKey,
        message: message,
        data: data,
    }
    app.logs.push(log);
}

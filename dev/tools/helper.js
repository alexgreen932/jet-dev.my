/**
 * re render logs on event j_log
 * @param {*} com 
 */
export function j_rerenderLogs(com){
    document.addEventListener('j_log', () =>{
        com.render();
    })
}
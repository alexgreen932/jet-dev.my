// import { com } from '../com.js';

export default function do_toolbar(){
    this.edit = false;//adds new property which activated form
    this.classList.add('component-editable');//add class to component for bar
    //append bar
    // this.insertAdjacentHTML('afterBegin', `<jet-toolbar j:el="${btoa(JSON.stringify(this.j_toolbar))}"></jet-toolbar>`);
    // this.insertAdjacentHTML('afterBegin', `<jet-toolbar j:el="this.j_toolbar"></jet-toolbar>`);
    let bar = `
        <div class="form-toolbar">
            <i class="fa-solid fa-pen-to-square" @click="edit=true"></i>
        </div>
    `;
    this.insertAdjacentHTML('afterBegin', bar);

}

// com({
//     name:'jet-toolbar',
//     tpl:`
//         <div class="form-toolbar">
//             <i class="fa-solid fa-pen-to-square" @click="el.edit=true"></i> 
//         </div>
//     `,
//     mount(){
//         console.log('jet-toolbar.el ----------- ', this.el);
//     },
// });




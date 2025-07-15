import { com } from '../com.js';
import './jet-field-input.js';
import { options } from './options.js';

com({
  name: 'jet-field-select',
  data:{options:[]},
  // data:{
  //   options:[
  //         { t: 'Blue', v: 'tx-blue' },
  //         { t: 'Red', v: 'tx-red' },
  //         { t: 'Green', v: 'tx-green' },
  //       ],
  // },
  tpl() {
    let key = `obj.${this.key}`;
    return html`
    <!-- <input type="text" j-model="${key}" /> -->
    <select j-model="${key}">
      <j-for data="options">
        <option value="[v]">[t]</option>
      </j-for>
    </select>
    `;
  },
  created(){
    
    //for some reasons logs below are undefined, though all works
    // console.log('%c%s ops in select -----------', 'color: #3846be', this.ops);
    // console.log('%c%s obj in select -----------', 'color: #731d6d', this.obj);
    
    if (typeof this.ops === 'string') {
      this.options = options[this.ops];//set preset options if string
    }else{
      this.options = this.ops;//set options from array
    }
  }
});

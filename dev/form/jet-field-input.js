import { com } from '../com.js';
import './jet-field-input.js';
 

com({
  name: 'jet-field-input',
  tpl() {
    let key = `obj.${this.key}`;
    console.log('key------------ ', key);
    return html`<input type="text" j-model="${key}" />`;
  },
    mount(){     
      // console.log('%c ops in select -----------', 'color: #3846be', this.ops);
      // console.log('%c%s obj in select -----------', 'color: #731d6d', this.obj);
      }
});

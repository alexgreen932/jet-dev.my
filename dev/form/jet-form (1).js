import { com } from '../com.js';
import './jet-field-input.js';
import './jet-field-select.js';
import './jet-field-picker.js';
console.log('form loaded....');

com({
  name: 'jet-form',
  data: {
    el:{show_form: true,},
  },
  force_render: 'update_form',
  tpl() {
    return html`
      <div j-if="el.show_form" class="jet-form" :class="position class form_style">
        <h3>{{el.title}}</h3>     
            ${this.el.fields.map(e => {
              if (e.type === 'push') {
                return `<jet-field-push p:obj="obj" #key="${e.key}" #ops="${btoa(JSON.stringify(e.ops))}"></jet-field-push>`;
              } else {
                return renderFields(e);
              }     
            }).join('')}
      </div>
    `;
  },
  created() {
    //replace default if prop exists in this.el
    this.position = this.el.position ? this.el.position : 'fixed-bottom';
    this.class = this.el.class ? this.el.class : 'bg-grey-l2';
    this.form_style = this.el.form_style ? this.el.form_style : 'f-default';

  },
  mount() {
    
    // console.log(`%c [${this.tagName}]obj------- obj in form`, 'color: #f55308', this.obj);
    console.log(`%c [${this.tagName}]el-------- `, 'color: #f55308', this.el);


    console.log('%c show --', 'color: #804040',  this.el.show_form);
  },
});

com({
  name: 'jet-field-push',
  data:{
    new_item:{},
  },
  tpl() {
    return html`
        <div j-if="items" class="form-push">
          <h3>{{title}}</h3>
          ${this.items.map(e => {
              return renderFields(e, 'new_item');
            }).join('')}
            <div class="b-blue" @click="pushItem()">Add</div>
            <!-- <div class="b-red" @click="func()">Add</div> -->
        </div>
    `;
  },
  // tpl() {
  //   // let key = `obj.${this.key}`;
  //   return html`
  //       <div j-if="items" class="form-push">
  //         <h3>{{title}}</h3>
  //         ${this.items.map(e => {
  //             let ops = e.type ? e.type : '';
  //             let html = `<div class="control-field">`;
  //             html += `<label>${e.label}:</label>`;
  //             html += `<jet-field-${e.type} p:obj="obj" #key="${e.key}" #ops="${btoa(JSON.stringify(e.data))}"></jet-field-${e.type}>`;
  //             html += `</div>`;
  //             }).join('')}
  //       </div>
  //   `;
  // },
  methods: {
    func(){
      alert('Bazinga!');
    },
    pushItem() {
      // console.log(clicked);
      let obj = this.obj;
      console.log('obj: ', obj);
      console.log('this.key: ', this.key);
      console.log('items length ------------- ', this.items.length);
      console.log('items ------------- ', this.items);
      console.log('new_item ------------- ', this.new_item);
      obj[this.key].push(this.new_item);//item should be created before via itereted fields depending on this form in edited components(here it's my-app)
      this.new_item = {};
      this.render();
    }
  },
  created() {
    this.items = JSON.parse(atob(this.ops));
    // console.log('this.items -------------', this.items);
    // this.render();
  },
  mount() {
    // console.log(`%c [${this.tagName}]obj---`, 'background: #fcc', this.obj);
    // console.log(`%c [${this.tagName}]key---`, 'background: #ccf', this.key);
    console.log(`%c [${this.tagName}]arr length---`, 'background: #cfc', this.items.length);
    // // console.log(`%c [${this.tagName}]label---`, 'background: #cf9', this.label);
    // console.log(`%c [${this.tagName}]fields--`, 'background: #cf3', JSON.parse(atob(this.ops)));
  }
});


function renderFields( e, obj = 'obj' ) {
      let ops = e.type ? e.type : '';
      // console.log('ops: ', ops);
      let html = `<div class="control-field">`;
      html += `<label>${e.label}:</label>`;
      html += `<jet-field-${e.type} p:obj="${obj}" #key="${e.key}" #ops="${btoa(JSON.stringify(e.ops))}"></jet-field-${e.type}>`;
      html += `</div>`;
      return html;
}

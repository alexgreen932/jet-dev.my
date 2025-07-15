// j_form.js

// This method inserts a <jet-form> component next to the current component
// and links it with the component's form data and editable object.
export default function j_form() {
  const fm = this.j_form_data;
  // Get the tag name of the current component (e.g., 'my-app')
  // let parentTag = this.tagName.toLowerCase();

  let htmlTemplate = this.innerHTML;
  // console.log('html: ', html);
  // console.log('this: ', this);
  // console.log('html: ', html);

  //  const temp = document.createElement('div');
  //     temp.innerHTML = htmlTemplate.trim();

  // let form = document.createElement('jet-form');
  // form.setAttribute('j-form','');
  // this.append('<p>test</p>');
  let object = fm.obj;
  console.log('object: ', object);
  this.insertAdjacentHTML('afterEnd', `<div>!!!<jet-form j:obj="${btoa(JSON.stringify(this[object]))}" j:el="${btoa(JSON.stringify(fm))}"></jet-form></div>`);
  // this.insertAdjacentHTML(
  //   'afterEnd', 
  //   `<div>!!!!!
  //   <jet-form j:obj="${btoa(JSON.stringify(this[object]))}" j:el="${btoa(JSON.stringify(fm))}">
  //     <slot name="obj">${btoa(JSON.stringify(this[object]))}</slot>
  //     <slot name="el">${btoa(JSON.stringify(fm))}</slot>
  //   </jet-form>
  //   </div>`
  // ); //for some reason jet-form can be added only inside of div

  if (!fm.toolbar) return;
  //if has toolbar add toolbar
  if (fm.toolbar) render_form_toolbar(this);

  //buttons management //todo try using jet tools, for now vanilla
  this.querySelector('.fa-pen-to-square').addEventListener('click', () => {
    this.j_form_data.show_form = true;
    this.render();
  });
}

function render_form_toolbar(com) {
  console.log('com.j_form_data.toolbar: ', com.j_form_data.toolbar);
  let stl = com.j_form_data.toolbar.stl
    ? com.j_form_data.toolbar.stl
    : 'd-center';
  //add classes
  com.classList.add('form-parent');
  let arrows = '';
  if (com.j_form_data.toolbar.move) {
    arrows =
      com.j_form_data.toolbar.move == 'hor'
        ? `<i class="fa-solid fa-angle-left"></i><i class="fa-solid fa-angle-right"></i>`
        : '<i class="fa-solid fa-angle-up"></i><i class="fa-solid fa-angle-down"></i>';
  } else {
    com.j_form_datashow_form = true; //add show trigger by default
  }

  com.insertAdjacentHTML(
    'beforeend',
    `<div class="form-toolbar ${stl}">
      <i class="fa-solid fa-pen-to-square" @click="j_form_data.show_form=true"></i>${arrows}
      </div>
      `
  );
}

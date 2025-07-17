// j_form.js

// This method inserts a <jet-form> component next to the current component
// and links it with the component's form data and editable object.
export default function j_form() {
  const fm = this.j_form_data;
  // Get the tag name of the current component (e.g., 'my-app')
  let parentTag = this.tagName.toLowerCase();

  // Insert the jet-form immediately after the current component
  this.insertAdjacentHTML('afterend', `<jet-form j-form></jet-form>`);

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
  let stl = com.j_form_data.toolbar.stl ? com.j_form_data.toolbar.stl : 'd-center';
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

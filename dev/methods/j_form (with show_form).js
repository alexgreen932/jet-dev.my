// j_form.js

// This method inserts a <jet-form> component next to the current component
// and links it with the component's form data and editable object.
export default function j_form() {
  const fm = this.j_form_data;
  // Get the tag name of the current component (e.g., 'my-app')
  let parentTag = this.tagName.toLowerCase();

  fm.show_form  = true;

  //if has toolbar add toolbar
  if (fm.toolbar) {
    let toolbar = document.createElement('div');

    let style = fm.toolbar.style ? fm.toolbar.style : 'd-center';
    //add classes
    this.classList.add('pos-r');
    toolbar.classList.add('form-toolbar');
    toolbar.classList.add(style)

    //add move arrows if option exists
    let arrows;
    if (fm.toolbar.move) {
    arrows = fm.toolbar.move == 'hor' ? `<i class="fa-solid fa-angle-left"></i><i class="fa-solid fa-angle-right"></i>` : '<i class="fa-solid fa-angle-up"></i><i class="fa-solid fa-angle-down"></i>';
      
    } 

    
    fm.toolbar.show = false;
    fm.show_form = false;//add show value, if toolbar exist it means form activated by click on toolbar icon
    

    toolbar.innerHTML = `<i class="fa-solid fa-pen-to-square" @click="fm.show_form=true"></i>${arrows}`
    this.append(toolbar);
  }
  // Insert the jet-form immediately after the current component
  this.insertAdjacentHTML('afterend', `<jet-form j-form></jet-form>`);

  // Optional cleanup (if needed in production)
  // This removes attributes used only for initialization
  // el.removeAttribute('j-form');
}

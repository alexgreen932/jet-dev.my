// j_form.js

// This method inserts a <jet-form> component next to the current component
// and links it with the component's form data and editable object.
export default function j_form() {
  // Get the tag name of the current component (e.g., 'my-app')
  let parentTag = this.tagName.toLowerCase();

  // Insert the jet-form immediately after the current component
  this.insertAdjacentHTML(
    'afterend',
    `<jet-form j-form></jet-form>`
  );
//   this.insertAdjacentHTML(
//     'afterend',
//     `<jet-form form-parent="${parentTag}" object-key="item" form-data="j_form_data" j-form></jet-form>`
//   );

  // Optional cleanup (if needed in production)
  // This removes attributes used only for initialization
  // const el = this.nextElementSibling;
  // el.removeAttribute('form-parent');
  // el.removeAttribute('form-data');
}

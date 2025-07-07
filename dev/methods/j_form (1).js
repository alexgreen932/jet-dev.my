export default function j_form() {
  let parent = this.tagName.toLowerCase();
  this.insertAdjacentHTML('afterend', `<jet-form form-parent="${parent}" form-data="j_form_data"></jet-form>`);

  //get data in jet-form 
  //todo uncomment in prod mode to clean html
  // el.removeAttribute('form-parent');
  // el.removeAttribute('form-data');
}
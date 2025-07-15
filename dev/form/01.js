 
com({
  name: 'admin-bar',
  data: data,
  tpl() {
    return html`
      <div class="admin-bar">
      admin-bar
      </div>
    `;
  },
  mount() {
    // this.slots.ops
    console.log('this.slots.ops:', this.ops);
    console.log('test 1:', this.ops.test1);
  },
});
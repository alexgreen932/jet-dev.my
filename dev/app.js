const data = {
    items: [
        {
            title: 'Item 1',
            content: {
                title: 'Sub Item',
                content: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit'
            }
        },
        {
            title: 'Item 2',
            content: {
                title: 'Another Sub Item',
                content: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit'
            }
        },
    ],
}

// app.jetConsole();

com({
    name: 'my-app',
    data: data,
    //if has components in iteration and has attribute started with 'i:' create property namad same as val after 'i:' for it could pbe passed
    tpl() {
        return html`     
            <j-for data="items">
                <com-child i:el="content"></com-child>
            </j-for>
        `
    },
    mount() {
        console.log('el in my-app----', this.el);
    }
})

com({
    name: 'com-child',
    tpl() {
        return html`     
            <h3>{{el.title}}</h3>
            <p>{{el.content}}</</p>  
        `
    },
    mount() {
        console.log('el in com-child ----', this.el);
    }
})


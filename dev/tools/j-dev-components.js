import { com } from '../com.js';



com({
    name: 'j-dev-components',
    data: {
        components: null,
    },
    tpl() {
        return html` 
        <h3>App Components</h3>
        <ul j-load="components" class="">
            <li j-for="components">
                <label>Component:</label>
                <span class="jd-com-name">"[e.name]"</span>
                <div class="jd-collapse">
                    <label>Data:</label>
                    <span class="jd-com-name">[e.data]</span>
                </div>
                <div class="jd-collapse">
                    <label>Methods:</label>
                    <span class="jd-com-name">[e.methods]</span>
                </div>
            </li>
        </ul>
         `
    },
    methods: {
        showData(d) {
            //todo beatify
            console.log('d---- ', d);

        },
    },
    created() {
        this.components = app.components;
        console.log('components ------ ', this.components[0]);
        // console.log('app---------', app.components);
    }
})


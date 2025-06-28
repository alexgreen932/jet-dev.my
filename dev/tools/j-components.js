import { com } from '../com.js';



com({
    name: 'j-components',
    data: {
        components: null,
    },
    r: true,
    tpl() {
        return html` 
        <h3>App Components</h3>
        <ul j-load="components" class="dl-components">
            <li j-for="components">
                <div class="dl-com-name dl-collapse">
                    <label>Component:</label>
                    <span>[e.name]</span>
                </div>
                <div class="dl-com-data dl-collapse">
                    <label>Data:</label>
                    <span>[e.data]</span>
                </div>
                <div class="dl-com-data dl-collapse">
                    <label>Props:</label>
                    <span>[e.props]</span>
                </div>
                <div class="dl-com-methods dl-collapse">
                    <label>Methods:</label>
                    <span>[e.methods]</span>
                </div>
            </li>
        </ul>
         `
    },
    methods: {
        //todo
        // ifMethods(str) {
        //     console.log('methods ---- ', str);
        //     if (str) {
        //         return !!str;
        //     }


        // },
        // ifProps(str) {
        //     console.log('str ---- ', str);
        //     return true;

        // },
        // renderProps(str) {
        //     if (str) {
        //         return JSON.parse(str);
        //     }


        // },
        showData(d) {
            //todo beatify
            // console.log('d---- ', d);

        },
    },
    created() {
        this.components = app.components;
        console.log('components ------ ', this.components[0]);
        // console.log('app---------', app.components);
    }
})


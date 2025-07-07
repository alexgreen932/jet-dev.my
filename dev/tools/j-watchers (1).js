import { com } from '../com.js';



com({
    name: 'j-watchers',
    data: {
        els: null,
        els: [
            ['rerender', true],
            ['data_changed', true],
            ['proxy', true],
            ['detect_function_error', true],
            ['error', true],
            ['Loading', true],
            ['Loaded', true]
        ]
        // watchers: [
        //     {title: 'Proxy', watcher: els.proxy },
        //     {title: 'Loading', watcher: els.Loading },
        // ],
    },
    tpl() {
        return html` 
        <h3>Watchers</h3>
        <h5>Switch on/on watchers you need</h5>
        <ul j-load="els" class="">
            <li j-for="els">
                <template j-for="el in e">
                    <label>[e.i]</label>
                </template>
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
        // this.els = Array.from(app.watchers, (v, k) => k)
        // let obj = app.watchers;
        // // this.els = Object.keys(obj).map((key) => [key, obj[key]]);
        // this.els = Object.entries(obj);
        // console.log('watcher Item----- ', this.els[0]);
        // console.log('watchers ------ ', this.els);
        // console.log('app---------', app.components);
    }
})


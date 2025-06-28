import { com } from '../com.js';
import _ from './languages/index.js';


setInterval(() => {
    // console.log('log 42 ', app.watchers);
}, 2000);

com({
    name: 'custom-data',
    data: {
        items: [
            {prop: '', show: 'input'}
        ],
        test: 42,
    },
    r: true,
    tpl() {
        return html` 
        <h3>${_('custom')}</h3>
        <ul j-load="errors" class="j_errors">
            <li j-for="errors">
                <span class="j_log_name">[e.key]</span>
                <span class="j_log_tag">[e.tag]</span>
                <span class="j_log_msg">[e.msg]</span>
                <span class="j_log_data">[e.data]</span>
            </li>
        </ul>
         `
    },
    methods: {
    },
    created() {
        let comp = document.querySelector('j-admin');
        console.log('comp: ', comp);
        console.log('t ------ ', comp.current);
    }
});

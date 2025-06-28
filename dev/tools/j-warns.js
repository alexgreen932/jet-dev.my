import { com } from '../com.js';
import _ from './languages/index.js';
import { j_rerenderLogs } from './helper.js';



setInterval(() => {
    // console.log('log 42 ', app.watchers);
}, 2000);

com({
    name: 'j-warns',
    data: {
        warns: null,
    },
    r: true,
    tpl() {
        return html` 
        <h3>${_('Warnings')}</h3>
        <ul j-load="warns" class="j_warns">
            <li j-for="warns">
                <span class="j_log_name">{{propToText('[e.key]')}}</span>
                <span class="j_log_tag">[e.tag]</span>
                <span class="j_log_msg">[e.msg]</span>
                <span class="j_log_data">[e.data]</span>
            </li>
        </ul>
         `
    },
    methods: {
        propToText(str) {
            return str.replace(/_/g, ' ');
        }
    },
    created() {
        this.warns = app.warns;
    },
    mount(){
        j_rerenderLogs(this);
    }
});

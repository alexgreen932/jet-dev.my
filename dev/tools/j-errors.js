import { com } from '../com.js';
import _ from './languages/index.js';
import { j_rerenderLogs } from './helper.js';



setInterval(() => {
    // console.log('log 42 ', app.watchers);
}, 2000);

com({
    name: 'j-errors',
    data: {
        errors: null,
    },
    r: true,
    tpl() {
        return html` 
        <h3>${_('errors')}</h3>
        <ul j-load="errors" class="j_errors">
            <li j-for="errors">
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
        this.errors = app.errors;
    },
    mount(){
        j_rerenderLogs(this);
    }
});

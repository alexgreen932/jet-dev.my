import { com } from '../com.js';
import _ from './languages/index.js';
import { j_rerenderLogs } from './helper.js';


com({
    name: 'j-logs',
    data: {
        logs: null,
    },
    r: true,
    tpl() {
        return html` 
        <h3>${_('logs')}</h3>
        <ul j-load="logs" class="j_logs">
            <li j-for="logs">
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
        this.logs = app.logs;
    },
    mount() {
        j_rerenderLogs(this);
    }
})


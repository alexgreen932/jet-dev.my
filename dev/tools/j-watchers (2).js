import { com } from '../com.js';

com({
    name: 'j-watchers',
    e: 'j_log',
    r: 'j_log',
    data: {
        watchersArr: [] // [ ['rerender', true], ... ]
    },
    tpl() {
        return html`
        <h3>Watchers</h3>
        <h5>Switch on/off watchers you need</h5>
        <ul>
            <li j-for="watchersArr">
                <label>
                    <input type="checkbox" checked="[e[1]]" @change="toggleWatcher(el[0], $event.target.checked)" /> [e[0]]
                </label>
            </li>
        </ul>
      `;
    },
    methods: {
        toggleWatcher(key, val) {
            app.watchers[key] = val;
            localStorage.setItem('watchers', JSON.stringify(app.watchers));
            console.log('app.watcher------ ', app.watchers);
            // this.dispatchEvent(new Event('j_logs', { bubbles: true }));
        }
    },
    created() {
        // Convert app.watchers to array
        this.watchersArr = Object.entries(app.watchers);
        console.log('this.watchersArr: ', this.watchersArr);
    }
});

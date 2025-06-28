import { com } from '../com.js';
import _ from './languages/index.js';


setInterval(() => {
    // console.log('log 42 ', app.watchers);
}, 2000);

com({
    name: 'j-watchers',
    r: true,
    data: {
        watchersArr: [], // [ ['rerender', true], ... ]
        test: 42,
    },
    tpl() {
        return html`
        <h3>${_('watchers')}</h3>
        <h5>${_('watc_msg')}</h5>
        <ul class="dl-watchers">
            <li j-for="watchersArr">
                <label data-check="[e[1]]">
                    <span></span>
                    {{propToText('[e[0]]')}}
                </label>
            </li>
            <div class="b-blue br-5 d-if fs-0" @click="clean()">${_('reset')}</div>
        </ul>
      `;
    },
    methods: {
        propToText(str) {
            return str.replace(/_/g, ' ');
        },
        clean() {
            localStorage.removeItem('jWatchers');
        }
    },
    created() {
        //load watchers
        if (localStorage.getItem('jWatchers')) {
            app.watchers = JSON.parse(localStorage.getItem('jWatchers'));
        }
        // Convert app.watchers to array
        this.watchersArr = Object.entries(app.watchers);
    },
    mount() {
        const labels = this.querySelectorAll('label[data-check]');

        labels.forEach(label => {
            const key = label.textContent.trim();
            const isChecked = label.dataset.check === 'true';

            const span = label.querySelector('span');
            if (span) {
                span.textContent = isChecked ? '✅' : '⬜️';
            }

            label.addEventListener('click', () => {
                const current = app.watchers[key];
                const updated = !current;
                app.watchers[key] = updated;
                localStorage.setItem('jWatchers', JSON.stringify(app.watchers));

                if (span) {
                    span.textContent = updated ? '✅' : '⬜️';
                }
            });
        });
    }
});

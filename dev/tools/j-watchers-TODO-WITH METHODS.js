import { com } from '../com.js';

//tired actually, can you add in mount simple forEack and listener
//if data-check true add inner text unicode check, if not, some other unicode symbol
//and listener for clicks changing symbol
// it's ok for now, then i'll improve and probably will add it's support in j-model
//thanks 


setInterval(() => {
    console.log('log 42 ', app.watchers);
}, 2000);

com({
    name: 'j-watchers',
    e: 'j_log',
    r: 'j_log',
    data: {
        watchersArr: [], // [ ['rerender', true], ... ]
        test: 42,
    },
    tpl() {
        return html`
        <h3>Watchers</h3>
        <h5>Switch on/off watchers you need</h5>
        <ul>
            <li j-for="watchersArr">
                <label @change="toggleWatcher('[e[0]]')">
                    <span data-check="[e[1]]"> here unicode </span>
                    [e[0]]
                </label>
            </li>
        </ul>
        <input j-model="test " />
      `;
    },

    methods: {
        isChecked(v) {
            console.log('v: ', v);
            if (v) {
                return true;
            }
        },
        notChecked(v) {
            console.log('v: ', v);
            if (!v) {
                return true;
            }
        },
        toggleWatcher(key) {
            //no need 2nd arg as jet can't get value starying with $, seems it saves correctly
            console.log('key ---- ', key);
            if (app.watchers[key]) {
                app.watchers[key] = false;
            } else {
                app.watchers[key] = true;
            }
            //no need to use saveLocally() as it saves this.prop only, but i need to save global app.
            localStorage.setItem('jWatchers', JSON.stringify(app.watchers));
            console.log('check saved ------ ', localStorage.getItem('jWatchers'));
        }
    },
    created() {
        //load watchers
        if (localStorage.getItem('jWatchers')) {
            app.watchers = JSON.parse(localStorage.getItem('jWatchers'));
        }
        // Convert app.watchers to array
        this.watchersArr = Object.entries(app.watchers);
        console.log('app.watchers: ', app.watchers);
    },
    mount() {
        const checks = this.querySelectorAll('label span');
    
        checks.forEach(span => {
            const key = span.nextSibling.textContent.trim(); // assumes label: <span>✓</span> keyName
            const isChecked = span.dataset.check === 'true';
    
            span.textContent = isChecked ? '✅' : '⬜️';
    
            span.style.cursor = 'pointer';
    
            span.addEventListener('click', () => {
                const current = app.watchers[key];
                const updated = !current;
                app.watchers[key] = updated;
                localStorage.setItem('jWatchers', JSON.stringify(app.watchers));
                span.textContent = updated ? '✅' : '⬜️';
            });
        });
    }
    
});

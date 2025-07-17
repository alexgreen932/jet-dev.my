import { com } from '../com.js';
// import * from '../jet-dev.js';
import './j-components.js';
import './j-logs.js';
import './j-watchers.js';
import './j-errors.js';
import './j-warns.js';
import './custom-data.js';

import _ from './languages/index.js';



const data = {
    title: 'My app',
    tabs_out: [
        { title: _('logs'), slug: 'logs', icon: '🖹' },
        { title: _('errors'), slug: 'errors', icon: '⚠' },
        { title: _('Warnings'), slug: 'warns', icon: '⚠' },
        { title: _('watchers'), slug: 'watchers', icon: '👁' },
        { title: _('coms'), slug: 'info', icon: 'ℹ️' },
        // { title: _('custom_data'), slug: 'custom_data', icon: '👁' },
        // { title: _('settings'), slug: 'settings', icon: '⚙' },
    ],
    tabs: [
        { title: _('logs'), slug: 'logs', icon: '🖹' },
        { title: _('errors'), slug: 'errors', icon: '⚠' },
        { title: _('Warnings'), slug: 'warns', icon: '⚠' },
        { title: _('watchers'), slug: 'watchers', icon: '👁' },
        { title: _('coms'), slug: 'info', icon: 'ℹ️' },
        // { title: _('custom_data'), slug: 'custom_data', icon: '👁' },
        // { title: _('settings'), slug: 'settings', icon: '⚙' },
        { title: _('close'), slug: 0, icon: '❌' },
    ],
    state: {
        current: 0,
    },
    error_log: null,
    warn_log: null

    // show_cls: 'info',
}




com({
    name: 'develop-console',
    data: data,
    r: true,
    saveLocally() {
        return [
            ['state', 'j_dev_console_state']
        ];
    },
    tpl() {
        return html` 
            <div class="db-icons">
                <span j-if="error_log" class="de-error-badge" @click="tab('errors')">{{error_log}}</span>
                <span j-if="warn_log" class="de-warn-badge" @click="tab('warns')">{{warn_log}}</span>
                <template j-for="tabs_out">
                    <span j-if="showIf('[e.slug]')" class="de" @click="tab('[e.slug]')">[e.icon]</span>
                </template>
            </div>   

            <div j-if="state.current!==0" id="debug-panel" class="{{show()}}">
                <div class="debug-window db-dark db-bottom-right db-large ">
                    <div class="db-inner">
                        <div class="db-inner-icons">
                    <span j-if="error_log" class="de-error-badge" @click="tab('errors')">{{error_log}}</span>
                    <span j-if="warn_log" class="de-warn-badge" @click="tab('warns')">{{warn_log}}</span>
                            <template j-for="tabs">
                                <span j-if="showIf('[e.slug]')" class="de" @click="tab('[e.slug]')">[e.title]</span>
                            </template>
                        </div>
                        <div class="db-inner-data">
                            <j-components class="j_inherit" j-if="state.current=='info'"></j-components>
                            <j-logs class="j_inherit" j-if="state.current=='logs'"></j-logs>
                            <j-watchers class="j_inherit" j-if="state.current=='watchers'"></j-watchers>
                            <j-errors class="j_inherit" j-if="state.current=='errors'"></j-errors>
                            <j-warns class="j_inherit" j-if="state.current=='warns'"></j-warns>
                            <custom-data class="j_inherit" j-if="state.current=='custom_data'"></custom-data>
                        </div>
                    </div>
                </div>
            
            </div>
            <input j-model="state.current" />
            <input j-model="error_log" />
            <input value="{{show()}}" />
        `
    },
    methods: {
        tab(s) {
            this.state.current = s;
        },
        showIf(slug) {

            switch (slug) {
                case 'errors':
                    if (this.error_log) {
                        return true;
                    }
                    break;
                case 'warns':
                    if (this.warn_log) {
                        return true;
                    }
                    break;
                default:
                    return true;
            }
        },
        show() {
            if (this.state.current) {
                return 'console-active';
            } else {
                return '';
            }
        },
        func() { return 'return method func' },
    },
    created() {
        // console.log('app.errors.length: ', app.errors.length);
        //error counter
        if (app.errors.length) {
            this.error_log = app.errors.length;
        }
        //important warns counter
        if (app.warns.length) {
            this.warn_log = app.warns.length;
        }
    },
})
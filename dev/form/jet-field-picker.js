import { com } from '../com.js';
import './jet-field-input.js';
import { options } from './options-picker.js';

com({
  name: 'jet-field-picker',
  data: {
    options: [],
    warn: false,
    uid: '', // unique ID per instance
  },
  tpl() {
    return html`
      <div j-if="warn" class="note-small">Wrong property ops - {{ops}}</div>

      <div class="picker-select {{key}}" @click="toggleBox()">
        <span>Select / Close</span>
      </div>

      <div class="picker-box hidden" id="box-{{uid}}">
        <ul class="de-{{ops}}">
          <j-for data="options">
            <li class="[v]" @click="setValue('[v]')">
              <span j-if="ops=='col'">ABC abc</span>
            </li>
          </j-for>
        </ul>
      </div>
    `;
  },
  methods: {
    toggleBox() {
      const box = document.getElementById(`box-${this.uid}`);
      if (!box) return;

      box.classList.toggle('hidden');
    },
    setValue(v) {
      this.obj[this.key] = v;

      // auto-close after selection
      const box = document.getElementById(`box-${this.uid}`);
      if (box) box.classList.add('hidden');
    },
  },
  created() {
    if (this.ops in options) {
      this.options = options[this.ops];
    } else {
      this.warn = true;
    }

    // generate unique ID
    this.uid = Math.random().toString(36).substr(2, 9);
  },
});

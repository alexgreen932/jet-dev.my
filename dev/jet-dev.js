import { com } from './com.js';
import jetConsole from './tools/jetConsole.js';
import initializeAnimation from './extras/animate.js';
import inc from './functions/inc.js';

// console.log('jet dev loaded');

// Set up global app object early
window.app = {
  reRender: true,
  path: './src/', // default component directory
  inc, // assign imported function directly
  com,
  components: [],
  dev: false,
  watchers: {
    Data_changed: true,
    Re_render: true,
    rerender: true,
    Iteration: false,
    Proxy: true,
    detect_function_error: true,
    Error: true,
    Warn: true,
    Loading: true,
    Loaded: true,
    LocalStorage: false,
  },
  logs: [],
  errors: [],
  warns: [],
  jetConsole,
};

// Attach globals
window.com = com;
window.html = (strings, ...values) =>
  strings.reduce((out, str, i) => out + str + (values[i] ?? ''), '');

// Set animation init
initializeAnimation();


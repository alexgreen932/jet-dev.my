import { com } from './com.js';
import initializeAnimation from './extras/animate.js';

function jetConsole(){
  console.warn('Production version doe not supports jetConsole, use Jet-Dev for this')
}


// Set up global app object early
window.app = {
  reRender: true,
  com,
  components: [],
  dev: false,
  logs: [],
  errors: [],
  jetConsole: jetConsole,
  // devConsole: () => app.jetConsole(),
};

// Attach globals
window.com = com;
window.html = (strings, ...values) => strings.reduce((out, str, i) => out + str + (values[i] ?? ''), '');

// Set animation init
initializeAnimation();

// Assign dev console loader to app
// app.jetConsole = jetConsole;

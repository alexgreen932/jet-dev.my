import * as componentMethods from './methods/index.js';
import DebugTools from './functions/DebugTools.js';
import { resolveDataPath } from './methods/helpers.js';

/**
 * Main function to register a custom Jet component
 * @param {Object} args - Component definition object
 */
function com(args) {
  customElements.define(
    args.name,
    class extends HTMLElement {
      constructor() {
        super(); // Always call super() in custom element constructor

        // 1. Store provided options
        this.args = args;
        this.methods = args.methods || {}; // Local methods

        this.__jet__ = this; // Attach component instance to DOM element

        this.$data = args.data || {};

        //NEW REACTIVITY SYSTEM
        // 👇 ADDED: Flag to allow controlled rerenders//todo rm
        this.j_isNotRerendered = true;
        this.j_isRendering = false;
         //forced rerender, if true renders by event 'data-updated'
        if (args.r) {
          // If component explicitly defines 'r', always use
          if (args.r == false || args.r == 0) {
            this.j_r = 'data-updated';
          }
          // this.j_deb('com-for', [ [this.j_r, 'this.j_r'] ]);
        }

       

        //css add style if property args.css is provided //todo improve
        if (args.css) {
          const id = `jet-style-${args.name}`;
          if (!document.getElementById(id)) {
            const style = document.createElement('style');
            style.id = id;
            style.innerText = args.css;
            document.head.appendChild(style);
          }
        }

        // Bind shared utility methods from './methods/index.js'
        Object.entries(componentMethods).forEach(([name, fn]) => {
          this[name] = fn.bind(this);
        });

        //new data
        // Reserved keys we should never overwrite with user data and user methods
        const reserved = [
          'args',
          'methods',
          'r',
          'tpl',
          'render',
          'connectedCallback',
          'disconnectedCallback',
          'e',
          'log',
          'jContent',
          'proxy',
          'querySelector',
          'querySelectorAll',
          'jModel',
          ...Object.keys(componentMethods),
        ];

        this.proxyData = this.proxy(this.$data); // Optional: keep a reference for debugging

        for (const key in this.proxyData) {
          if (!reserved.includes(key)) {
            Object.defineProperty(this, key, {
              get: () => this.proxyData[key],
              set: (val) => {
                this.proxyData[key] = val;
              },
            });
          }
        }

        // Bind local component methods
        Object.entries(this.methods).forEach(([name, fn]) => {
          if (!reserved.includes(name)) {
            this[name] = fn.bind(this);
          } else {
            //todo add pusLog
            this.log(
              'Error',
              `Name "${name}" is Jet reserved name, chose another`
            );
            // console.log(`Name "${name}" is Jet reserved name, chose another`);
          }
        });

        this.j_props_arr = []; //dev op

        //used in child components
        this.j_props();

        //activate save data in localstorage if property provided
        if (args.saveLocally) {
          const localArgs =
            typeof args.saveLocally === 'function'
              ? args.saveLocally.call(this)
              : args.saveLocally;
          this.setupLocalSave(localArgs);
        }

        // 4. Shorthand aliases (optional, can be removed later)
        this.l = this.log; //todo remove

        // 5. Lifecycle: created()
        if (typeof args.created === 'function') {
          args.created.call(this);
        }

        // 6. Register lifecycle hooks for later
        if (typeof args.updated === 'function') this.updated = args.updated;
        if (typeof args.destroyed === 'function')
          this.destroyed = args.destroyed;
        if (typeof args.connected === 'function')
          this.connected = args.connected;

        this.tpl =
          args.tpl ||
          (() =>
            `<div><strong>Component "${this.tagName}" template (tpl) is missing</strong></div>`);

        //Slots support
        if (args.slots) {
          this.j_slots(args.slots);
        }

        //wrapper support
        if (args.wrapper) {
          this.innerHTML;
          this.jContent = this.innerHTML;
          // console.log('this.j_inner: ', this.j_inner);
        }

        console.log(`[${this.tagName}] R ARG is---`, args.r);
        console.log(`[${this.tagName}] R is---`, this.r);

        //main element
        this.render(); // Do first render before mount

        //add form
        // Check if a 'form' property is defined on the component
        if (args.form) {
          // Ensure form is a valid object before continuing
          if (typeof args.form !== 'object') return;

          // Store form data on the instance
          this.j_form_data = args.form;

          // Call the method that injects the external <jet-form> component
          this.j_form();
        }

        // 9. Lifecycle: mount()
        if (args.mount) {
          if (typeof args.mount === 'function') {
            args.mount.call(this);
          } else if (Array.isArray(args.mount)) {
            args.mount.forEach((fn) => fn.call(this));
          }
        }

        // 11. Debug inspect mode (Ctrl+Click)//TODO dev with new functs
        this.addEventListener('click', (e) => {
          if (app.devtoolsEnabled && e.ctrlKey) {
            app.inspectComponent(this);
          }
        });

        //dev op - jetConsloe components info
        //new ver

        if (typeof app !== 'undefined' && app.dev) {
          let methods = args.methods ? Object.keys(args.methods) : null;
          let comMainItems = {
            name: args.name,
            data: JSON.stringify(args.data) || 'no data',
            props: JSON.stringify(this.j_props_arr) || 'no props',
            methods: JSON.stringify(methods) || 'no methods',
          };
          app.components.push(comMainItems);
        }
      } //end of constructor ----------------------------------------

      // Native lifecycle hook: element added to DOM
      connectedCallback() {
        if (typeof this.connected === 'function') {
          this.connected();
        }

        if (Array.isArray(this.args.listeners)) {
          this._boundListeners = [];
          for (let entry of this.args.listeners) {
            this.jListener(...entry); // works for 3 or 4 args
          }
        }
      }

      // Native lifecycle hook: element removed from DOM
      disconnectedCallback() {
        if (typeof this.destroyed === 'function') {
          this.destroyed();
        }
      }

      /**
       * Renders component HTML
       */
      render() {
        let tpl = this.template();
        tpl = this.doLoader(tpl);
        tpl = this.doFor(tpl);// Iteration Legacy
        tpl = this.j_for(tpl); // Handle j-for loops //re render added
        tpl = this.doIf(tpl);
        tpl = this.doAttr(tpl);
        tpl = this.doInterpolation(tpl);

        this.innerHTML = tpl;

        this.jModel();
        this.j_events();

        // this.j_props(); // Own props

        const children = [...this.childNodes];

        //MOVE props from component tag to first child element
        // ✅ Delay removal until children connectedCallback runs
        setTimeout(() => {
          // Move props to first child (optional for wrapper components)
          const firstEl = children.find(n => n.nodeType === 1);
          if (firstEl) {
            for (const attr of this.attributes) {
              if (
                attr.name.startsWith('p:') ||
                attr.name.startsWith('#') ||
                attr.name === 'parent-data'
              ) {
                firstEl.setAttribute(attr.name, attr.value);
              }
            }
          }

          this.replaceWith(...children);
        }, 0);
      }

      // render() {
      //   let tpl = this.template(); // Get raw template string
      //   tpl = this.doLoader(tpl); // Handle j-load
      //   tpl = this.doFor(tpl); // Iteration Legacy
      //   tpl = this.j_for(tpl); // Handle j-for loops //re render added
      //   tpl = this.doIf(tpl);
      //   tpl = this.doAttr(tpl); // Handle j-attr (if any)
      //   tpl = this.doInterpolation(tpl); // Replace {{}} with actual data //re render added
      //   // tpl = this.jHtml(tpl);

      //   this.innerHTML = tpl; // Inject into DOM
      //   this.jModel(); // Two-way binding support
      //   //this.doEvents();                       // Add event listeners (@click, etc.)
      //   this.j_events(); // Add event listeners (@click, etc.)
      //   // tpl = this.j_form_toolbar(tpl);
      // }

      /**
       * Returns the component's HTML template string
       */
      template() {
        return typeof this.tpl === 'function' ? this.tpl() : this.tpl;
      }

      /**
       * Triggers reactivity event manually
       */
      //TODO RM IF MOT USED
      e(eventName = this.j_r || 'data-updated') {
        const event = new Event(eventName, { bubbles: true });
        this.dispatchEvent(event);
      }
    } //end of class----------------------
  );
} //end of function com -------------------

/**
 * Debug helper: Track render performance and count
 */
function logComponentRender(name, renderTime) {
  let comp = app.components.find(
    (c) => c.name.toUpperCase() === name.toUpperCase()
  );
  if (comp) {
    comp.renders = (comp.renders || 0) + 1;
    comp.lastRenderTime = renderTime;
  }
}

export { com };

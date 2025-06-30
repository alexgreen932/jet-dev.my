import { updateNestedProperty } from './helpers.js'; // Not used here but can be useful for deeper logic

//replaced doEvents

/**
 * Attach DOM event listeners to elements using custom `data-event` and `event-data` attributes.
 * Supports modifiers (e.g. `.prevent`, `.stop`) and multiple actions.
 * 
 * Example usage:
 *   <div data-event="click.prevent" event-data="current='home'">Click me</div>
 * 
 * When clicked, this will run: this.eventHandler("current='home'", { prevent: true })
 */



export default function j_events(str = null) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(str, 'text/html');

  // Find all elements in the current component that have data-event attributes
  this.querySelectorAll('[data-event]').forEach(item => {
    const rawEvent = item.getAttribute('data-event');
    const eventData = item.getAttribute('event-data') || '';

    // Extract event name and modifiers (e.g., click.prevent => click + prevent)
    const modifiers = [];
    const eventName = rawEvent.replace(/\.(\w+)/g, (_, mod) => {
      modifiers.push(mod);
      return ''; // remove modifier from event name
    });

    const conditions = {
      prevent: modifiers.includes('prevent'),
      stop: modifiers.includes('stop'),
    };

    /**
     * Resolve bracketed values like `[val]` from the context of `this.el`
     * and replace them inside the expression.
     * Example: current='[val]' => current='about'
     */
    const resolveBrackets = (expr) => {
      return expr.replace(/\[([^\]]+)]/g, (_, key) => {
        return this.el?.[key] ?? `[${key}]`; // fallback if not found
      });
    };

    /**
     * Handler to be called for each expression in event-data.
     * Passes the resolved expression and modifiers to this.eventHandler.
     */
    const handler = (rawExpr) => {
      const resolvedExpr = resolveBrackets(rawExpr);
      this.eventHandler(resolvedExpr, conditions);
    };

    // Attach actual listener
    item.addEventListener(eventName, (event) => {
      if (conditions.prevent) event.preventDefault();
      if (conditions.stop) event.stopPropagation();

      // Multiple expressions allowed, separated by semicolons
      const expressions = eventData.split(';').map(s => s.trim()).filter(Boolean);
      expressions.forEach(handler);
    });

    //todo dev only, remove on prod
    // item.removeAttribute('data-event');
    // item.removeAttribute('event-data');
    // item.removeAttribute('element-event');
    // item.removeAttribute('data-prop');
    // item.removeAttribute('data-newvalue');

  });

  return doc.body.innerHTML;
}

import { updateNestedProperty } from './help-functions.js';

// Attaches event listeners based on [data-event] and [event-data] attributes
export default function doEvents(str = null) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, 'text/html');

    this.querySelectorAll('[data-event]').forEach(item => {
        const rawEvent = item.getAttribute('data-event');
        // console.log('rawEvent: ', rawEvent);
        const eventData = item.getAttribute('event-data');
        // console.log('eventData: ', eventData);

        // Extract modifiers (e.g. .prevent, .stop) from event string
        const modifiers = [];
        const eventName = rawEvent.replace(/\.(\w+)/g, (_, mod) => {
            modifiers.push(mod);
            return '';
        });

        // Detect common conditions
        const conditions = {
            prevent: modifiers.includes('prevent'),
            stop: modifiers.includes('stop') // You can add more here
        };

        // Create handler for each event
        const handler = (key) => {
            // Forward the key and conditions to the component's eventHandler
            this.eventHandler(key, conditions);
        };

        item.addEventListener(eventName, (event) => {
            if (conditions.prevent) event.preventDefault();
            if (conditions.stop) event.stopPropagation();

            if (eventData.includes(';')) {
                // Multiple actions separated by ;
                eventData.split(';').map(s => s.trim()).forEach(handler);
            } else {
                handler(eventData);
            }
        });
    });

    return doc.body.innerHTML;
}

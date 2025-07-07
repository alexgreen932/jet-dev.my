/**
 * Attribute handler for shorthand event syntax like @click="prop=val" or "@click=method(args)"
 * Transforms to clear, custom event attributes: data-j-event, data-j-prop, data-j-newvalue, data-j-method, data-j-args.
 */



export default function handleAt(el, attr, value, context) {
  const event = attr.name.slice(1); // from '@click' → 'click'

  if (value.includes('=')) {
    
    const [prop, val] = value.split('=').map((s) => s.trim());
    el.setAttribute('data-j-on', 'click'); // actual event name
    el.setAttribute('data-j-action', '_setProp'); // what to do on event
    el.setAttribute('data-j-prop', prop);
    el.setAttribute('data-j-newvalue', val);
  } else {
	el.setAttribute('data-j-on', 'click');
     // actual event name
    // Method call syntax: func() or func(arg1, arg2)
    const match = value.match(/^([a-zA-Z_$][\w$]*)\((.*)\)$/);
    el.setAttribute('data-j-event', event);

    if (match) {
      // has parentheses with args
      el.setAttribute('data-j-method', match[1]);
      if (match[2]) el.setAttribute('data-j-args', match[2]);
    } else {
      // no args
      el.setAttribute('data-j-method', value);
    }
  }

  // Immediately wire up events
  context.j_events();
}

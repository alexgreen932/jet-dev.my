import resolvePropertyValue from './resolvePropertyValue.js'

// === Parses the value into keyframes + options ===
export default function processData(value) {
  // Remove trailing target like ['.box']
  value = value.replace(/\s*;\s*\[.*?\]\s*$/, '');

  const segments = value.split(';').map(s => s.trim()).filter(Boolean);
  const effects = [];
  const options = {};

  // STEP 1: Separate effects vs. options
  for (let segment of segments) {
    if (/^[a-zA-Z0-9_]+\((.*?)\)$/.test(segment)) {
      effects.push(segment); // e.g. color('red','blue')
    } else if (segment.startsWith('{') && segment.endsWith('}')) {
      const opts = segment.slice(1, -1).split(',');
      for (let opt of opts) {
        const [key, val] = opt.split(':').map(s => s.trim());
        if (!key || !val) continue;
        options[key] = key === 'offset'
          ? val.split(',').map(v => parseFloat(v))
          : JSON.parse(val);
      }
    }
  }

  // STEP 2: Parse each effect into propValues (object of arrays)
  const propValues = {}; // {opacity: [...], color: [...]}
  let maxFrames = 0;

  for (let effect of effects) {
    const match = effect.match(/^([a-zA-Z0-9_]+)\((.*?)\)$/);
    if (!match) continue;

    const prop = match[1];
    const values = match[2]
  .split(',')
  .map(v => {
    v = v.trim();

    // Remove surrounding single or double quotes
    if ((v.startsWith("'") && v.endsWith("'")) || (v.startsWith('"') && v.endsWith('"'))) {
      return v.slice(1, -1);
    }

    // Try to parse numbers/booleans/null via JSON
    try {
      return JSON.parse(v);
    } catch {
      return v; // fallback to string
    }
  });


    propValues[prop] = values;
    maxFrames = Math.max(maxFrames, values.length);
  }

  // STEP 3: Build full keyframes array by merging resolved props per frame
  const keyframes = [];

  for (let i = 0; i < maxFrames; i++) {
    let frame = {};

    for (const prop in propValues) {
      const value = i < propValues[prop].length
        ? propValues[prop][i]
        : propValues[prop][propValues[prop].length - 1];

      const resolved = resolvePropertyValue(prop, value);

      // Merge resolved properties into current frame
      frame = { ...frame, ...resolved };
    }

    // If offset array was provided, assign it
    if (options.offset && options.offset[i] != null) {
      frame.offset = options.offset[i];
    }

    keyframes.push(frame);
  }

  // STEP 4: Clean options and fill animation defaults
  delete options.offset;

  const animationOptions = {
    duration: options.d || 700,
    easing: options.e || 'ease',
    delay: options.dl || 100,
    iterations: options.i || 1,
    direction: options.dr || 'normal',
    fill: options.f || 'forwards'
  };

  return [keyframes, animationOptions];
}


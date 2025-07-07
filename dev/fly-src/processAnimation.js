import processData from './processData.js';
import processPresets from './processPresets.js';

// function processPresets(value){
//   switch (value) {
//     case 'fadeUp' : return 'opacity(0,1);slideBottom(50,0);{d:1000}';
//     default: return value;
//   }
// }


export default function processAnimation(val) {
  console.log('val in process---- ', val);

  if (!val || val.trim() === '') {
    return processData('opacity(0,1); {d:700}');
  }

  let output = processPresets(val.trim());

  if (!val.includes(';')) {
    output = addAnimParams(output); // add default effect params if missing
    output = addOptions(output);    // add default animation options if missing
  }

  return processData(output);
}

// Adds default (0,1) to any property or alias
function addAnimParams(val) {
  const defaultParams = '(0,1)';
  if (val.includes('(')) return val;
  return `${val}${defaultParams}`;
}

// Adds default {d:700} block if no options present
function addOptions(val) {
  if (val.includes('{') && val.includes('}')) return val;
  return val.trim().replace(/;+$/, '') + '; {d:700}';
}




import { resolveDataPath, removeQuotes, isStaticOrDynamic } from './helpers.js';

/**
 * Processes j-if conditions in the template HTML string.
 * Supports method calls, comparisons, or single conditions.
 */
export default function doIf(tpl, alt = null) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(tpl, 'text/html');
  const items = doc.querySelectorAll('[j-if]');

  if (items.length === 0) return tpl;

  items.forEach(item => {
    const raw = item.getAttribute('j-if').trim();
    let condition, value;

    // 1. If method call: @click="someMethod(1)"
    if (/^([a-zA-Z0-9_]+)\((.*?)\)$/.test(raw)) {
      condition = this.executeMethod(raw);
      if (!condition) item.remove();

    // 2. If comparison: j-if="a == b" or "a !== 'x'"
    } else if (raw.includes('==') || raw.includes('!==')) {
      const [left, right] = raw.split(/==|!==/);
      const operator = raw.includes('!==') ? '!==' : '==';

      const leftPath = left.trim().replace(/^!/, '');
      const rightPath = right.trim();

      const leftValue = isStaticOrDynamic(this, leftPath);
      const rightValue = isStaticOrDynamic(this, rightPath);

      const clean = str =>
        typeof str === 'string' && str.startsWith("'") && str.endsWith("'")
          ? str.slice(1, -1)
          : str;

      const l = clean(leftValue);
      const r = clean(rightValue);

      // 👇 ADDED: watch both sides of the expression
      this.data_update_checker(l, leftPath);
      this.data_update_checker(r, rightPath);

      // evaluate
      if (operator === '==') {
        if (l != r) item.remove();
      } else if (operator === '!==') {
        if (l == r) item.remove();
      }

    // 3. Simple flag: j-if="isVisible"
    } else {
      const val = isStaticOrDynamic(this, raw);
      this.data_update_checker(val, raw);
      if (!val) item.remove();
    }

    // item.removeAttribute('j-if'); // optional
  });

  return doc.body.innerHTML;
}

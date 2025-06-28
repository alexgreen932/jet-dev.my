export default function setupLocalSave(saveArgs) {
  const groups = Array.isArray(saveArgs[0]) ? saveArgs : [saveArgs];

  for (let [prop, key, event = 'data-updated'] of groups) {
    if (!prop || !key) continue;

    const target = this[prop];
    if (typeof target === 'undefined') {
      // this.log('LocalStorage', `Property "${prop}" does not exist on this component`);
      continue;
    }

    // Restore data from localStorage
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed === 'object') {
          Object.assign(this[prop], parsed);
        } else {
          this[prop] = parsed;
        }
        this.log('LocalStorage', `Found saved data "${saved}" for "${key}"`);
      } catch (e) {
        // this.log('LocalStorage', `Failed to parse saved data for "${key}"`);
      }
    }

    // Auto-save on event
    document.addEventListener(event, () => {
      try {
        const value = JSON.stringify(this[prop]);
        localStorage.setItem(key, value);
        this.log('LocalStorage', `Property "${prop}" saved in localStorage with value "${value}"`);
      } catch (e) {
        // this.log('LocalStorage', `Failed to save "${prop}" to localStorage`);
      }
    });

    // Optional manual save
    if (!this.saveToLocal) this.saveToLocal = {};
    this.saveToLocal[prop] = () => {
      try {
        const value = JSON.stringify(this[prop]);
        localStorage.setItem(key, value);
        // this.log('LocalStorage', `Property "${prop}" manually saved with value "${value}"`);
      } catch (e) {
        // this.log('LocalStorage', `Manual save failed for "${prop}"`);
      }
    };
  }
}

import { isStaticOrDynamic, resolveDataPath, updateNestedProperty } from './helpers.js';

// Handles event logic: either updating data or calling a method
export default function eventHandler(eventData, conditions = {}) {
    if (eventData.includes('=')) {
        // Set property: e.g. current_page='home'
        let [prop, new_value] = eventData.split('=').map(s => s.trim());
        // console.log('new_value ---- ', new_value);
        new_value = isStaticOrDynamic(this, new_value);
        updateNestedProperty(this, prop, new_value);
        // console.log('----', this.show);
    } else {
        // Call function (local or global)
        this.executeMethod(eventData, conditions);
    }
}

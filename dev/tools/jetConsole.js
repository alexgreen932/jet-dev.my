
import './develop-console.js';

export default function jetConsole() {
  app.dev = true;
  console.log('console loaded-----------');  

  // Wait for both DOM and custom element definition
  document.addEventListener("DOMContentLoaded", () => {
      customElements.whenDefined('develop-console').then(() => {
          document.body.insertAdjacentHTML("beforeend", '<develop-console></develop-console>');
      });
  });
}

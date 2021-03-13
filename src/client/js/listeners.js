import { handleSubmit } from './app';

// Function for event listener;
function eventListenerToForm() {
  // Event listener to form
  document.querySelector('form').addEventListener('submit', handleSubmit);
}

export { eventListenerToForm };

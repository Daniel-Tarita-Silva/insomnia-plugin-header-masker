const React = require('react');
const ReactDOM = require('react-dom/client');
const ToggleMaskingButton = require('./ToggleMaskingButton');

let masked = false;

// Function to inject buttons into each child of the listbox
function injectButtons() {
  const listbox = document.querySelector('div[role="listbox"][aria-label="Key-value pairs"]');

  if (!listbox) {
    console.warn('Listbox not found. Retrying...');
    setTimeout(injectButtons, 500);
    return;
  }

  // Iterate over each child and inject a button
  listbox.childNodes.forEach((child, index) => {
    // Ensure we don't inject multiple buttons
    if (child.querySelector('.masking-button-container')) return;

    // Create a new container for the button
    const container = document.createElement('div');
    container.className = 'masking-button-container';

    // Insert the container inside the child (adjust as needed)
    child.appendChild(container);

    // Render the React button inside the container
    const root = ReactDOM.createRoot(container);
    root.render(
        React.createElement(ToggleMaskingButton, {
          onToggle: () => {
            masked = !masked;
            alert(`Masking is now ${masked ? 'enabled' : 'disabled'}`);
          },
          masked,
        })
    );
  });
}

// Run injection when Insomnia loads
setTimeout(injectButtons, 1000);

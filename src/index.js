const React = require('react');
const ReactDOM = require('react-dom/client');
const ToggleMaskingButton = require('./ToggleMaskingButton');

let masked = false;

function injectButtons() {
  const listbox = document.querySelector('div[role="listbox"][aria-label="Key-value pairs"]');

  if (!listbox) {
    console.warn('Listbox not found. Retrying...');
    setTimeout(injectButtons, 500);
    return;
  }

  listbox.childNodes.forEach((child) => {
    // Find the toolbar inside each listbox item
    const toolbar = child.querySelector('div[role="toolbar"][aria-orientation="horizontal"]');
    if (!toolbar) return;

    // Avoid adding duplicate buttons
    if (toolbar.querySelector('.masking-button-container')) return;

    const container = document.createElement('div');
    container.className = 'masking-button-container';

    // Insert the container inside the child (adjust as needed)
    toolbar.appendChild(container); // Insert into toolbar

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

setTimeout(injectButtons, 1000);

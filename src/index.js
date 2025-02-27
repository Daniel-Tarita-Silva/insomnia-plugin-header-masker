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

    // Create container for button
    const container = document.createElement('div');
    container.className = 'masking-button-container';
    toolbar.appendChild(container);

    // Find all text editors inside the item
    const textEditors = child.querySelectorAll('.editor--single-line[data-editor-type="text"]');

    if (textEditors.length < 2) {
      console.warn('Could not find both text editors.');
      return;
    }

    const secondEditor = textEditors[1]; // Target the 2nd editor

    // Render the React button inside the container
    const root = ReactDOM.createRoot(container);
    root.render(
        React.createElement(ToggleMaskingButton, {
          onToggle: () => {
            masked = !masked;
            secondEditor.setAttribute('data-editor-type', masked ? 'password' : 'text');
          },
          masked,
        })
    );
  });
}

setTimeout(injectButtons, 1000);

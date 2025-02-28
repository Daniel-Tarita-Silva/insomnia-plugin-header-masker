const React = require('react');
const ReactDOM = require('react-dom/client');
const ToggleMaskingButton = require('./ToggleMaskingButton');

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

    // Track the masking state for this specific editor
    let localMasked = false;

    // Render the React button inside the container
    const root = ReactDOM.createRoot(container);
    root.render(
        React.createElement(ToggleMaskingButton, {
          onToggle: () => {
            localMasked = !localMasked;
            secondEditor.setAttribute('data-editor-type', localMasked ? 'password' : 'text');
          },
          masked: localMasked, // Pass the local masked state for this button
        })
    );
  });
}

// Observe changes in the DOM
const observer = new MutationObserver(() => {
  injectButtons(); // Re-run the function when the DOM changes
});

observer.observe(document.body, {
  childList: true,
  subtree: true, // Look for changes in the entire subtree
});

// Initial call to inject the button
setTimeout(injectButtons, 1000);

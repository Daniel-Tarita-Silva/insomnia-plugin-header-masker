const React = require('react');
const ReactDOM = require('react-dom/client'); // Ensure correct ReactDOM import
const ToggleMaskingButton = require('./ToggleMaskingButton');

let masked = false;

// Function to inject the button into the toolbar
function injectButton() {
  // Find the toolbar element
  const toolbar = document.querySelector('div[role="toolbar"][aria-orientation="horizontal"]');

  if (!toolbar) {
    console.warn('Toolbar not found. Retrying...');
    setTimeout(injectButton, 500); // Retry if toolbar isn't loaded yet
    return;
  }

  let container = document.getElementById('masking-button-container');
  if (!container) {
    // Create a new container to hold the masking button
    container = document.createElement('div');
    container.id = 'masking-button-container';
    // Insert the container at the end of the toolbar
    toolbar.append(container);
  }

  // Ensure React can render inside the container
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
}

// Run injection when Insomnia loads
setTimeout(injectButton, 1000);

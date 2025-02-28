const React = require('react');
const ReactDOM = require('react-dom/client');
const ToggleMaskingButton = require('../components/ToggleMaskingButton');
const getCurrentRequestId = require("../utils/utils");
const {loadMaskedState, saveMaskedState} = require("../utils/storage");

/**
 * Main function that injects masking buttons into the Insomnia UI
 * Finds header rows and adds toggle buttons to each one
 */
function injectButtons() {
    // Find the headers listbox in the UI which contains the headers key-value pairs
    const listbox = document.querySelector('div[role="listbox"][aria-label="Key-value pairs"]');

    if (!listbox) {
        console.warn('Listbox not found. Retrying...');
        setTimeout(injectButtons, 500);
        return;
    }

    // Get the selected request ID to use in localStorage keys
    const requestId = getCurrentRequestId();
    console.log('Current request ID:', requestId); // Debug log to verify detection

    // Iterated each child of the listbox (each header row)
    listbox.childNodes.forEach((child) => {
        // Find the toolbar in this header row
        const toolbar = child.querySelector('div[role="toolbar"][aria-orientation="horizontal"]');

        // Skip if toolbar not found or if we've already added a button to this toolbar
        if (!toolbar || toolbar.querySelector('.masking-button-container')) return;

        // Create a container for our button
        const container = document.createElement('div');
        container.className = 'masking-button-container';
        toolbar.appendChild(container);

        // Find the text editors in this header row (key and value)
        const textEditors = child.querySelectorAll('.editor--single-line[data-editor-type="text"]');
        if (textEditors.length < 2) {
            console.warn('Could not find both text editors.');
            return;
        }

        // Get references to the key and value editors
        const headerKeyEditor = textEditors[0];
        const headerValueEditor = textEditors[1];

        // Get the header key name from the editor content
        const headerKeyName = headerKeyEditor.textContent || `header_${Math.random().toString(36).substring(2, 9)}`;

        /**
         * Custom React component to manage button state
         * Uses React hooks for state management and re-rendering
         */
        const MaskingButtonWrapper = () => {
            // Initialize state from localStorage, will trigger re-renders when updated
            const [isMasked, setIsMasked] = React.useState(loadMaskedState(requestId, headerKeyName));

            // Effect to apply initial masked state when component mounts
            React.useEffect(() => {
                if (isMasked) {
                    headerValueEditor.setAttribute('data-editor-type', 'password');
                } else {
                    headerValueEditor.setAttribute('data-editor-type', 'text');
                }
            }, []);

            /**
             * Handler for toggle button click
             * Updates React state, DOM, and persists to localStorage
             */
            const handleToggle = () => {
                const newMaskedState = !isMasked;
                // Update React state to trigger re-render with correct icon
                setIsMasked(newMaskedState);
                // Update the editor to show/hide text
                headerValueEditor.setAttribute('data-editor-type', newMaskedState ? 'password' : 'text');
                // Save state to localStorage for persistence across sessions
                saveMaskedState(requestId, headerKeyName, newMaskedState);
            };

            // Render the actual toggle button component
            return React.createElement(ToggleMaskingButton, {
                onToggle: handleToggle,
                masked: isMasked
            });
        };

        // Create a React root and render our component
        const root = ReactDOM.createRoot(container);
        root.render(React.createElement(MaskingButtonWrapper));
    });
}

module.exports = injectButtons;
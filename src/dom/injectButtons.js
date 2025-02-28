const React = require('react');
const ReactDOM = require('react-dom/client');
const ToggleMaskingButton = require('../components/ToggleMaskingButton');

// Storage key prefix
const STORAGE_KEY_PREFIX = 'insomnia_header_masked_';

// Helper to find the request ID from DOM hierarchy
function findRequestId(element) {
    // Look for closest parent with data-request-id attribute or similar
    let current = element;
    while (current && current !== document.body) {
        const requestId = current.dataset.requestId ||
            current.dataset.id ||
            current.getAttribute('data-request');

        if (requestId) {
            return requestId;
        }
        current = current.parentElement;
    }

    // Fallback: Try to extract from URL or tab name if possible
    const tabTitle = document.querySelector('.tabs__tab--active .tab__title');
    if (tabTitle) {
        return `request_${tabTitle.textContent.trim().replace(/\s+/g, '_')}`;
    }

    // Ultimate fallback
    return 'unknown_request';
}

// Generate a unique ID for each header within each request
function generateHeaderId(requestId, keyName) {
    return `${STORAGE_KEY_PREFIX}${requestId}_${keyName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
}

// Save masked state to localStorage
function saveMaskedState(requestId, keyName, isMasked) {
    const id = generateHeaderId(requestId, keyName);
    localStorage.setItem(id, isMasked ? 'true' : 'false');
}

// Load masked state from localStorage
function loadMaskedState(requestId, keyName) {
    const id = generateHeaderId(requestId, keyName);
    const value = localStorage.getItem(id);
    return value === 'true';
}

function injectButtons() {
    const listbox = document.querySelector('div[role="listbox"][aria-label="Key-value pairs"]');

    if (!listbox) {
        console.warn('Listbox not found. Retrying...');
        setTimeout(injectButtons, 500);
        return;
    }

    // Find the request ID for the current context
    const requestId = findRequestId(listbox);

    listbox.childNodes.forEach((child) => {
        const toolbar = child.querySelector('div[role="toolbar"][aria-orientation="horizontal"]');
        if (!toolbar || toolbar.querySelector('.masking-button-container')) return;

        const container = document.createElement('div');
        container.className = 'masking-button-container';
        toolbar.appendChild(container);

        const textEditors = child.querySelectorAll('.editor--single-line[data-editor-type="text"]');
        if (textEditors.length < 2) {
            console.warn('Could not find both text editors.');
            return;
        }

        // Get key and value editors
        const keyEditor = textEditors[0];
        const valueEditor = textEditors[1];

        // Get the header key name (for storage)
        const keyName = keyEditor.textContent || `header_${Math.random().toString(36).substring(2, 9)}`;

        // Create a custom React component to handle state internally
        const MaskingButtonWrapper = () => {
            // Use React's useState hook to create state that will trigger re-renders
            const [isMasked, setIsMasked] = React.useState(loadMaskedState(requestId, keyName));

            // Apply the initial state when component first mounts
            React.useEffect(() => {
                if (isMasked) {
                    valueEditor.setAttribute('data-editor-type', 'password');
                } else {
                    valueEditor.setAttribute('data-editor-type', 'text');
                }
            }, []);

            // Handle toggle with proper state updates
            const handleToggle = () => {
                const newMaskedState = !isMasked;
                setIsMasked(newMaskedState);
                valueEditor.setAttribute('data-editor-type', newMaskedState ? 'password' : 'text');
                saveMaskedState(requestId, keyName, newMaskedState);
            };

            return React.createElement(ToggleMaskingButton, {
                onToggle: handleToggle,
                masked: isMasked
            });
        };

        const root = ReactDOM.createRoot(container);
        root.render(React.createElement(MaskingButtonWrapper));
    });
}

module.exports = injectButtons;
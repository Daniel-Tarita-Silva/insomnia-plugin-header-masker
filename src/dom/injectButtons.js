const React = require('react');
const ReactDOM = require('react-dom/client');
const ToggleMaskingButton = require('../components/ToggleMaskingButton');

function injectButtons() {
    const listbox = document.querySelector('div[role="listbox"][aria-label="Key-value pairs"]');

    if (!listbox) {
        console.warn('Listbox not found. Retrying...');
        setTimeout(injectButtons, 500);
        return;
    }

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

        const secondEditor = textEditors[1];
        let localMasked = false;

        const root = ReactDOM.createRoot(container);
        root.render(
            React.createElement(ToggleMaskingButton, {
                onToggle: () => {
                    localMasked = !localMasked;
                    secondEditor.setAttribute('data-editor-type', localMasked ? 'password' : 'text');
                },
                masked: localMasked,
            })
        );
    });
}

module.exports = injectButtons;

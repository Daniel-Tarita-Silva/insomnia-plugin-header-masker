const injectButtons = require("../dom/injectButtons");

function startObserver() {
    // Target the tablist specifically
    const tablist = document.querySelector('[role="tablist"]');

    if (!tablist) {
        console.warn('Tablist not found. Retrying observer setup...');
        setTimeout(startObserver, 500);
        return;
    }

    const observer = new MutationObserver((mutations) => {
        // Look for changes that might indicate tab selection
        const headersTab = document.querySelector('[role="tablist"] [data-key="headers"][aria-selected="true"]');

        if (headersTab) {
            // Headers tab is selected, inject buttons
            injectButtons();

        }
    });

    // Configure the observer to watch for attribute changes (like aria-selected)
    observer.observe(tablist, {
        attributes: true,
        attributeFilter: ['aria-selected'],
        subtree: true, // Important to catch changes in child elements
        childList: true // Capture structural changes
    });
}

module.exports = startObserver;
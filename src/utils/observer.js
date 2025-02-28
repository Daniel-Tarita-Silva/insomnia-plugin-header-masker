const injectButtons = require("../dom/injectButtons");

function startObserver() {
    const observer = new MutationObserver(() => {
        injectButtons();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
}

module.exports = startObserver;

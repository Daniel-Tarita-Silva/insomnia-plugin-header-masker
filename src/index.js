const injectButtons = require('./dom/injectButtons');
const startObserver = require('./utils/observer');

setTimeout(injectButtons, 1000);
startObserver();

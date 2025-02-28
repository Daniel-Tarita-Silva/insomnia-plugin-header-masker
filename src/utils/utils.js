/**
 * Finds the currently selected request ID in Insomnia's UI
 *
 * @returns {string} The ID of the currently selected request
 */
function getCurrentRequestId() {
    // First attempt: Look for sidebar request grid items with data-selected="true"
    const selectedRequest = document.querySelector('[id="sidebar-request-gridlist"][data-selected="true"][data-key]');

    if (selectedRequest && selectedRequest.dataset.key) {
        return selectedRequest.dataset.key; // Return the data-key value if found
    }

    // Second attempt: Search through all request elements that have both data-key and data-testid
    const allRequests = document.querySelectorAll('[data-key][data-testid]');
    for (const request of allRequests) {
        // Look for any children with data-selected="true" indicating this request is selected
        const selectedChild = request.querySelector('[data-selected="true"]');
        if (selectedChild) {
            return request.dataset.key;
        }
    }

    // Fallback if no selected request could be found
    console.warn('Could not determine current request ID, using fallback');
    return 'unknown_request';
}

module.exports = getCurrentRequestId;
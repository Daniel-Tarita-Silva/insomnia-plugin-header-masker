// Storage key prefix for localStorage to avoid conflicts with other data
const STORAGE_KEY_PREFIX = 'insomnia_header_masked_';

/**
 * Generates a unique identifier for storing masked state of a specific header in a specific request
 *
 * @param {string} requestId - The ID of the request
 * @param {string} keyName - The header name
 * @returns {string} A unique storage key
 */
function generateHeaderId(requestId, keyName) {
    // Combine request ID and header name, normalizing the header name to avoid special characters
    return `${STORAGE_KEY_PREFIX}${requestId}_${keyName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
}

/**
 * Saves the masked state of a header to localStorage
 *
 * @param {string} requestId - The ID of the request
 * @param {string} keyName - The header name
 * @param {boolean} isMasked - Whether the header value is masked
 */
function saveMaskedState(requestId, keyName, isMasked) {
    const id = generateHeaderId(requestId, keyName);
    localStorage.setItem(id, isMasked ? 'true' : 'false');
}

/**
 * Loads the masked state of a header from localStorage
 *
 * @param {string} requestId - The ID of the request
 * @param {string} keyName - The header name
 * @returns {boolean} Whether the header value should be masked
 */
function loadMaskedState(requestId, keyName) {
    const id = generateHeaderId(requestId, keyName);
    const value = localStorage.getItem(id);
    return value === 'true';
}

module.exports = {
    saveMaskedState,
    loadMaskedState,
};
// Utilities Module

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * @param {Function} func The function to debounce
 * @param {number} wait The number of milliseconds to delay
 * @returns {Function} The debounced function
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Safely retrieves an element by ID and throws a descriptive error if not found
 * @param {string} id The ID of the element to find
 * @returns {HTMLElement} The found element
 */
export function getRequiredElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        throw new Error(`Required element #${id} was not found in the document`);
    }
    return element;
}

/**
 * Checks if the device is mobile based on screen width
 * @returns {boolean} True if device is considered mobile
 */
export function isMobileDevice() {
    return window.innerWidth < 640;
}

/**
 * Safely adds event listener with error handling
 * @param {HTMLElement} element The element to attach the listener to
 * @param {string} event The event type
 * @param {Function} handler The event handler
 * @param {Object} options Event listener options
 */
export function safeAddEventListener(element, event, handler, options = {}) {
    try {
        element.addEventListener(event, handler, options);
    } catch (error) {
        console.error(`Error adding ${event} listener:`, error);
    }
}

/**
 * Kinetic Typography Module
 * Automatically wraps text in spans for letter-by-letter animations
 */

const KineticTypography = (function () {
    /**
     * Split text into individual letter spans
     * @param {HTMLElement} element - Element to split
     */
    function splitLetters(element) {
        const text = element.textContent;
        const letters = text.split('');

        element.innerHTML = letters.map(letter =>
            letter === ' ' ? ' ' : `<span>${letter}</span>`
        ).join('');
    }

    /**
     * Initialize all kinetic text elements
     */
    function init() {
        // Auto-split elements with wave or bounce classes
        const waveElements = document.querySelectorAll('.kinetic-wave, .kinetic-wave-hover');
        const bounceElements = document.querySelectorAll('.kinetic-bounce, .kinetic-bounce-hover');

        waveElements.forEach(splitLetters);
        bounceElements.forEach(splitLetters);

        // Initialize rotating words containers
        initRotatingWords();
    }

    /**
     * Initialize rotating words effect
     */
    function initRotatingWords() {
        const containers = document.querySelectorAll('.kinetic-rotate-words');

        containers.forEach(container => {
            // Words should already be in spans
            const words = container.querySelectorAll('span');
            if (words.length > 0) {
                // Ensure first word is visible initially
                words[0].style.opacity = '1';
                words[0].style.transform = 'translateY(0)';
            }
        });
    }

    /**
     * Apply wave effect to an element dynamically
     * @param {HTMLElement|string} element - Element or selector
     */
    function applyWave(element) {
        const el = typeof element === 'string' ? document.querySelector(element) : element;
        if (!el) return;

        el.classList.add('kinetic-wave');
        splitLetters(el);
    }

    /**
     * Apply bounce effect to an element dynamically
     * @param {HTMLElement|string} element - Element or selector
     */
    function applyBounce(element) {
        const el = typeof element === 'string' ? document.querySelector(element) : element;
        if (!el) return;

        el.classList.add('kinetic-bounce');
        splitLetters(el);
    }

    /**
     * Apply color shift effect
     * @param {HTMLElement|string} element - Element or selector
     */
    function applyColorShift(element) {
        const el = typeof element === 'string' ? document.querySelector(element) : element;
        if (!el) return;

        el.classList.add('kinetic-color-shift');
    }

    // Public API
    return {
        init,
        splitLetters,
        applyWave,
        applyBounce,
        applyColorShift
    };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    KineticTypography.init();
});

// Export for global use
window.KineticTypography = KineticTypography;

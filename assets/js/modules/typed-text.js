/**
 * Typed Text Module
 * Handles Typed.js initialization for animated text
 */

/**
 * Wait for Typed.js to be available
 * @param {number} maxWait - Maximum wait time in ms
 * @returns {Promise<boolean>}
 */
const waitForTyped = (maxWait = 5000) => {
    return new Promise((resolve) => {
        if (window.Typed) {
            resolve(true);
            return;
        }

        const startTime = Date.now();
        const checkInterval = setInterval(() => {
            if (window.Typed) {
                clearInterval(checkInterval);
                resolve(true);
            } else if (Date.now() - startTime > maxWait) {
                clearInterval(checkInterval);
                resolve(false);
            }
        }, 100);
    });
};

/**
 * Initialize Typed.js for hero section text animation
 * @param {string[]} strings - Array of strings to type
 * @param {Object} options - Typed.js options
 */
export const initTypedText = async (
    strings = [
        "AI \u0026amp; Machine Learning",
        "LLM \u0026amp; Reinforcement Learning",
        "Backend Development",
        "Android Development",
        "Game Development",
        "Web Scraping \u0026amp; Automation"
    ],
    options = {}
) => {
    const element = document.querySelector(".typing-text");
    if (!element) {
        console.warn('Typed text element not found');
        return;
    }

    // Guard against double initialization
    if (element._typed) {
        console.warn('Typed.js already initialized on element, destroying previous instance');
        element._typed.destroy();
        delete element._typed;
    }

    // Clear any existing content to prevent conflicts
    element.textContent = '';

    // Wait for Typed.js to load
    const isLoaded = await waitForTyped();
    if (!isLoaded) {
        console.warn('Typed.js failed to load after timeout');
        return;
    }

    const defaultOptions = {
        strings,
        loop: true,
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 2000,
        startDelay: 1000,
        smartBackspace: true,
        showCursor: true,
        cursorChar: '|',
        fadeOut: false,
        fadeOutClass: 'typed-fade-out',
        fadeOutDelay: 500,
        onStringTyped: (arrayPos) => {
            console.log(`Typed string ${arrayPos + 1}/${strings.length}`);
        },
        ...options
    };

    const typed = new window.Typed(".typing-text", defaultOptions);

    // Store instance for debugging
    element._typed = typed;

    console.log('✅ Typed.js initialized with loop:', typed.loop);

    return typed;
};

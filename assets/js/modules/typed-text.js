/**
 * Typed Text Module
 * Handles Typed.js initialization for animated text
 */

/**
 * Initialize Typed.js for hero section text animation
 * @param {string[]} strings - Array of strings to type
 * @param {Object} options - Typed.js options
 */
export const initTypedText = (
    strings = [
        "AI & Machine Learning",
        "LLM & Reinforcement Learning",
        "Backend Development",
        "Android Development",
        "Game Development",
        "Web Scraping & Automation"
    ],
    options = {}
) => {
    const element = document.querySelector(".typing-text");

    // Access Typed from window object since it's loaded as a global script
    const TypedJS = window.Typed;

    if (typeof TypedJS === 'undefined' || !element) {
        console.warn('Typed.js not loaded or element not found');
        return;
    }

    const defaultOptions = {
        strings,
        loop: true,
        typeSpeed: 30,
        backSpeed: 15,
        backDelay: 1200,
        startDelay: 500,
        smartBackspace: true,
        ...options
    };

    return new TypedJS(".typing-text", defaultOptions);
};

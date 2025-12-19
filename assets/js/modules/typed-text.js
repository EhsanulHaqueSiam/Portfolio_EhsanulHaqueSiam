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

    if (typeof Typed === 'undefined' || !element) return;

    const defaultOptions = {
        strings,
        loop: true,
        typeSpeed: 30,
        backSpeed: 15,
        backDelay: 1200,
        ...options
    };

    return new Typed(".typing-text", defaultOptions);
};

/**
 * Page Visibility Module
 * Handles tab visibility change effects (title and favicon changes)
 * Uses modern SVG emoji favicons for a fancy touch
 */

/**
 * Create an SVG favicon from an emoji
 * @param {string} emoji - The emoji to use as favicon
 * @returns {string} - Data URL for the SVG favicon
 */
const createEmojiFavicon = (emoji) => {
    return `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${emoji}</text></svg>`;
};

/**
 * Initialize page visibility change handler
 * Changes title and favicon when user leaves/returns to tab
 * Uses emoji favicons for a modern, fancy look
 */
export const initVisibilityHandler = () => {
    const originalTitle = "Ehsanul Haque | Portfolio";
    const awayTitle = "👋 Come back!";

    // Fancy emoji favicons
    const originalFavicon = createEmojiFavicon('🚀'); // Rocket for main site
    const awayFavicon = createEmojiFavicon('👋');     // Wave when leaving

    // Set initial favicon to emoji
    const setFavicon = (href) => {
        let favicon = document.querySelector("#favicon");
        if (!favicon) {
            favicon = document.createElement('link');
            favicon.id = 'favicon';
            favicon.rel = 'icon';
            document.head.appendChild(favicon);
        }
        favicon.setAttribute("href", href);
    };

    // Set initial rocket favicon
    setFavicon(originalFavicon);

    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
            document.title = originalTitle;
            setFavicon(originalFavicon);
        } else {
            document.title = awayTitle;
            setFavicon(awayFavicon);
        }
    });
};

/**
 * Set a custom emoji favicon
 * Can be called from anywhere to dynamically change the favicon
 * @param {string} emoji - The emoji to set as favicon
 */
export const setEmojiFavicon = (emoji) => {
    const favicon = createEmojiFavicon(emoji);
    const faviconEl = document.querySelector("#favicon");
    if (faviconEl) {
        faviconEl.setAttribute("href", favicon);
    }
};

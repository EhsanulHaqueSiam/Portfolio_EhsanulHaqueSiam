/**
 * Animations Module
 * Handles ScrollReveal initialization for scroll animations
 */

/**
 * Initialize ScrollReveal animations for various sections
 */
export const initScrollAnimations = () => {
    if (typeof ScrollReveal === 'undefined') {
        console.warn("ScrollReveal not loaded");
        return;
    }

    const sr = ScrollReveal();

    // Home and About sections
    sr.reveal(
        ".home .content h3, .about .content h3, .skills .container, .education .box",
        { interval: 100 }
    );
};

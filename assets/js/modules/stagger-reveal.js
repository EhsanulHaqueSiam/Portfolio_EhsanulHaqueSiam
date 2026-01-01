/**
 * Stagger Reveal Animation Module
 * Handles IntersectionObserver-based staggered reveal animations
 * for cards and elements throughout the portfolio.
 */

const StaggerReveal = (function () {
    'use strict';

    // Configuration
    const config = {
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1,
        staggerDelay: 50, // ms between each element
        selectors: [
            '.skills .bar',
            '.work .box',
            '.award .box',
            '.publications .box',
            '.education .box',
            '.timeline .container',
            '.contact-card',
            '.footer-col',
            '.stat-item',
            '.github-stat-card',
            '.heading'
        ]
    };

    // Track initialized state
    let initialized = false;
    let observer = null;

    /**
     * Initialize stagger reveal for all configured elements
     */
    function init() {
        if (initialized) return;

        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            console.log('[StaggerReveal] Reduced motion preferred, skipping animations');
            return;
        }

        // Create IntersectionObserver
        observer = new IntersectionObserver(handleIntersection, {
            rootMargin: config.rootMargin,
            threshold: config.threshold
        });

        // Find and observe all elements
        config.selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((el, index) => {
                // Add base class
                el.classList.add('stagger-reveal');

                // Calculate stagger index within parent section
                const parent = el.closest('section') || el.closest('.box-container') || el.parentElement;
                const siblings = parent ? parent.querySelectorAll(selector) : [el];
                const siblingIndex = Array.from(siblings).indexOf(el);

                // Set stagger delay attribute (capped at 10)
                const staggerIndex = Math.min(siblingIndex + 1, 10);
                el.setAttribute('data-stagger', staggerIndex);

                // Observe element
                observer.observe(el);
            });
        });

        initialized = true;
        console.log('[StaggerReveal] Initialized');
    }

    /**
     * Handle intersection events
     * @param {IntersectionObserverEntry[]} entries 
     */
    function handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add revealed class to trigger animation
                entry.target.classList.add('revealed');

                // Stop observing once revealed
                observer.unobserve(entry.target);
            }
        });
    }

    /**
     * Manually reveal elements (for dynamically loaded content)
     * @param {string} selector - CSS selector for elements to reveal
     * @param {HTMLElement} container - Container to search within (default: document)
     */
    function revealElements(selector, container = document) {
        const elements = container.querySelectorAll(selector);
        elements.forEach((el, index) => {
            if (!el.classList.contains('stagger-reveal')) {
                el.classList.add('stagger-reveal');
                el.setAttribute('data-stagger', Math.min(index + 1, 10));

                if (observer) {
                    observer.observe(el);
                }
            }
        });
    }

    /**
     * Immediately reveal all elements (skip animation)
     */
    function revealAll() {
        document.querySelectorAll('.stagger-reveal').forEach(el => {
            el.classList.add('revealed');
        });
    }

    /**
     * Reset and re-observe elements (for page transitions)
     */
    function reset() {
        document.querySelectorAll('.stagger-reveal').forEach(el => {
            el.classList.remove('revealed');
            if (observer) {
                observer.observe(el);
            }
        });
    }

    /**
     * Add stagger reveal to new dynamically loaded content
     * @param {HTMLElement} container - Container with new elements
     */
    function observeNewContent(container) {
        config.selectors.forEach(selector => {
            const elements = container.querySelectorAll(selector);
            elements.forEach((el, index) => {
                if (!el.classList.contains('stagger-reveal')) {
                    el.classList.add('stagger-reveal');
                    el.setAttribute('data-stagger', Math.min(index + 1, 10));
                    if (observer) {
                        observer.observe(el);
                    }
                }
            });
        });
    }

    // Public API
    return {
        init,
        revealElements,
        revealAll,
        reset,
        observeNewContent
    };
})();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Delay slightly to let other content load first
        setTimeout(() => StaggerReveal.init(), 100);
    });
} else {
    setTimeout(() => StaggerReveal.init(), 100);
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StaggerReveal;
}

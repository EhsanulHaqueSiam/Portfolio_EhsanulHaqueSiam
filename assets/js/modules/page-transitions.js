/**
 * Page Transitions Module
 * Barba.js integration for smooth page transitions
 * Future-proofed for multi-page portfolio expansion
 */

const PageTransitions = (function () {
    let isInitialized = false;
    let loadingBar = null;
    let transitionOverlay = null;

    /**
     * Initialize Barba.js page transitions
     */
    function init() {
        if (typeof barba === 'undefined') {
            console.warn('Barba.js not loaded - page transitions disabled');
            return;
        }

        if (isInitialized) return;
        isInitialized = true;

        createTransitionElements();
        initBarba();

        console.log('✅ Barba.js page transitions initialized');
    }

    /**
     * Create transition UI elements
     */
    function createTransitionElements() {
        // Loading bar
        loadingBar = document.createElement('div');
        loadingBar.className = 'page-loading-bar';
        document.body.appendChild(loadingBar);

        // Transition overlay
        transitionOverlay = document.createElement('div');
        transitionOverlay.className = 'page-transition-overlay';
        document.body.appendChild(transitionOverlay);
    }

    /**
     * Initialize Barba.js with transitions
     */
    function initBarba() {
        barba.init({
            // Prevent same-page transitions (for anchor links)
            preventRunning: true,

            // Define transitions
            transitions: [
                {
                    name: 'default-transition',

                    // Before leaving current page
                    async leave(data) {
                        // Show loading bar
                        loadingBar.classList.add('is-loading');

                        // Animate out current content
                        data.current.container.classList.add('is-leaving');

                        // Wait for animation
                        await delay(400);

                        // Show overlay
                        transitionOverlay.classList.add('is-visible');
                        await delay(500);
                    },

                    // After entering new page
                    async enter(data) {
                        // Scroll to top
                        window.scrollTo(0, 0);

                        // Prepare new content
                        data.next.container.classList.add('transition-fade', 'is-entering');

                        // Hide overlay
                        transitionOverlay.classList.add('is-hiding');
                        await delay(300);
                        transitionOverlay.classList.remove('is-visible', 'is-hiding');

                        // Complete loading bar
                        loadingBar.classList.remove('is-loading');
                        loadingBar.classList.add('is-complete');

                        // Animate in new content
                        await delay(50);
                        data.next.container.classList.remove('is-entering');

                        // Hide loading bar
                        await delay(200);
                        loadingBar.classList.add('is-hiding');
                        await delay(300);
                        loadingBar.classList.remove('is-complete', 'is-hiding');
                    },

                    // After transition complete
                    after(data) {
                        // Re-initialize components for new page
                        reinitializeComponents();
                    }
                },

                // Slide transition for specific pages
                {
                    name: 'slide-transition',
                    to: { namespace: ['projects', 'about'] },

                    async leave(data) {
                        data.current.container.classList.add('transition-slide', 'is-leaving');
                        await delay(400);
                    },

                    async enter(data) {
                        data.next.container.classList.add('transition-slide', 'is-entering');
                        await delay(50);
                        data.next.container.classList.remove('is-entering');
                    }
                }
            ],

            // View definitions (for namespace-based transitions)
            views: [
                {
                    namespace: 'home',
                    beforeEnter() {
                        // Home-specific initialization
                    }
                },
                {
                    namespace: 'projects',
                    beforeEnter() {
                        // Projects page initialization
                    }
                }
            ]
        });

        // Hook into Barba events
        barba.hooks.before(() => {
            document.body.classList.add('is-transitioning');
        });

        barba.hooks.after(() => {
            document.body.classList.remove('is-transitioning');
        });
    }

    /**
     * Re-initialize JS components after page transition
     */
    function reinitializeComponents() {
        // Re-init AOS
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }

        // Re-init VanillaTilt
        if (typeof VanillaTilt !== 'undefined') {
            VanillaTilt.init(document.querySelectorAll('.tilt'));
        }

        // Re-init GLightbox
        if (typeof GLightbox !== 'undefined') {
            GLightbox();
        }

        // Re-init Swiper
        if (typeof Swiper !== 'undefined') {
            // Reinitialize swipers as needed
        }

        // Re-init custom modules
        if (window.MicroInteractions) {
            window.MicroInteractions.init();
        }

        if (window.KineticTypography) {
            window.KineticTypography.init();
        }

        // Dispatch custom event for other modules
        document.dispatchEvent(new CustomEvent('barba:pageEnter'));
    }

    /**
     * Utility: Delay promise
     */
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Prefetch linked pages for faster navigation
     */
    function enablePrefetch() {
        if (typeof barba !== 'undefined' && barba.prefetch) {
            barba.prefetch();
        }
    }

    // Public API
    return {
        init,
        enablePrefetch
    };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure other scripts are loaded
    setTimeout(() => {
        PageTransitions.init();
    }, 100);
});

// Export for global use
window.PageTransitions = PageTransitions;

/**
 * Lazy CSS Loader Module
 * Loads non-critical CSS on demand for better performance
 */

// Track which CSS files have been loaded
const loadedCSS = new Set();

/**
 * Dynamically load a CSS file
 * @param {string} href - URL of the CSS file
 * @param {string} id - Unique ID for the link element
 * @returns {Promise} - Resolves when CSS is loaded
 */
export const loadCSS = (href, id) => {
    return new Promise((resolve, reject) => {
        // Skip if already loaded
        if (loadedCSS.has(id)) {
            resolve();
            return;
        }

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.id = id;

        link.onload = () => {
            loadedCSS.add(id);
            console.log(`✅ Lazy loaded CSS: ${id}`);
            resolve();
        };

        link.onerror = () => {
            console.warn(`⚠️ Failed to load CSS: ${id}`);
            reject(new Error(`Failed to load ${href}`));
        };

        document.head.appendChild(link);
    });
};

/**
 * CSS files to load lazily with their triggers
 */
const lazyCSSConfig = {
    swiper: {
        href: 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css',
        id: 'lazy-swiper-css',
        triggers: ['.swiper', '.work', '#work']
    },
    glightbox: {
        href: 'https://cdn.jsdelivr.net/npm/glightbox@3.2.0/dist/css/glightbox.min.css',
        id: 'lazy-glightbox-css',
        triggers: ['[data-gallery]', '.gallery', '.lightbox']
    },
    leaflet: {
        href: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
        id: 'lazy-leaflet-css',
        triggers: ['#worldMap', '#contact', '.contact']
    },
    atropos: {
        href: 'https://unpkg.com/atropos@2/atropos.min.css',
        id: 'lazy-atropos-css',
        triggers: ['.atropos', '[data-atropos]']
    },
    tippy: {
        href: 'https://unpkg.com/tippy.js@6/dist/tippy.css',
        id: 'lazy-tippy-css',
        triggers: ['[data-tippy-content]', '[title]']
    }
};

/**
 * Setup IntersectionObserver to load CSS when sections are near viewport
 */
export const initLazyCSS = () => {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
        // Fallback: load all CSS immediately
        Object.values(lazyCSSConfig).forEach(config => {
            loadCSS(config.href, config.id);
        });
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;

                // Check which CSS should be loaded based on element
                Object.entries(lazyCSSConfig).forEach(([name, config]) => {
                    const shouldLoad = config.triggers.some(selector =>
                        element.matches(selector) || element.querySelector(selector)
                    );

                    if (shouldLoad && !loadedCSS.has(config.id)) {
                        loadCSS(config.href, config.id);
                    }
                });

                // Unobserve after checking
                observer.unobserve(element);
            }
        });
    }, {
        rootMargin: '200px' // Start loading 200px before element enters viewport
    });

    // Observe main sections that might need lazy CSS
    const sectionsToObserve = [
        '#work',
        '#contact',
        '#about',
        '#skills',
        '.gallery'
    ];

    sectionsToObserve.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
            observer.observe(element);
        }
    });

    console.log('✅ Lazy CSS loader initialized');
};

/**
 * Preload CSS that will definitely be needed soon
 * Called after critical content is visible
 */
export const preloadDeferredCSS = () => {
    // Use requestIdleCallback if available, otherwise setTimeout
    const scheduleLoad = window.requestIdleCallback || ((cb) => setTimeout(cb, 100));

    scheduleLoad(() => {
        // Load Tippy CSS after page is interactive (tooltips are common)
        loadCSS(lazyCSSConfig.tippy.href, lazyCSSConfig.tippy.id);
    });
};

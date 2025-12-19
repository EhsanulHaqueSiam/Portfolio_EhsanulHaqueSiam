/**
 * Progressive Image Loading with Intersection Observer
 * Shows content immediately, images fade in smoothly
 */

class ImageLazyLoader {
    constructor() {
        this.imageObserver = null;
        this.init();
    }

    init() {
        // Check for Intersection Observer support
        if ('IntersectionObserver' in window) {
            this.imageObserver = new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.loadImage(entry.target);
                            observer.unobserve(entry.target);
                        }
                    });
                },
                {
                    rootMargin: '100px 0px', // Start loading 100px before visible
                    threshold: 0.01
                }
            );
        }
    }

    /**
     * Load image with smooth fade-in (no blur to avoid hiding content)
     */
    loadImage(img) {
        const src = img.dataset.src || img.src;

        if (!src || src === '') return;

        // Create new image to preload
        const tempImg = new Image();

        tempImg.onload = () => {
            img.src = src;
            img.classList.add('loaded');
        };

        tempImg.onerror = () => {
            img.classList.add('img-error');
            console.warn('Failed to load image:', src);
        };

        tempImg.src = src;
    }

    /**
     * Observe images for lazy loading
     */
    observe(images) {
        if (!this.imageObserver) {
            // Fallback for older browsers - load immediately
            images.forEach(img => this.loadImage(img));
            return;
        }

        images.forEach(img => {
            this.imageObserver.observe(img);
        });
    }

    /**
     * Static method to enhance all lazy images on page
     */
    static enhanceAll() {
        const loader = new ImageLazyLoader();
        const lazyImages = document.querySelectorAll('img[loading="lazy"]:not(.loaded)');
        loader.observe(lazyImages);
        return loader;
    }
}

/**
 * Prefetch next page resources on hover
 */
class LinkPrefetcher {
    constructor() {
        this.prefetchedUrls = new Set();
        this.init();
    }

    init() {
        // Prefetch on mouse enter for navigation links
        document.querySelectorAll('a[href^="/"], a[href^="./"]').forEach(link => {
            link.addEventListener('mouseenter', () => this.prefetch(link.href), { once: true });
        });
    }

    prefetch(url) {
        if (this.prefetchedUrls.has(url)) return;

        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        document.head.appendChild(link);

        this.prefetchedUrls.add(url);
    }
}

/**
 * Critical Resource Prioritizer
 * Dynamically prioritizes above-fold content
 */
class ResourcePrioritizer {
    static prioritizeAboveFold() {
        // Find all images in viewport
        const viewportHeight = window.innerHeight;
        const images = document.querySelectorAll('img');

        images.forEach(img => {
            const rect = img.getBoundingClientRect();
            if (rect.top < viewportHeight) {
                // Above fold - load immediately with high priority
                img.loading = 'eager';
                if ('fetchPriority' in img) {
                    img.fetchPriority = 'high';
                }
            }
        });
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Prioritize above-fold images first
    ResourcePrioritizer.prioritizeAboveFold();

    // Initialize link prefetching
    new LinkPrefetcher();
});

// Re-run after dynamic content loads
document.addEventListener('contentLoaded', () => {
    ImageLazyLoader.enhanceAll();
});

// Also run when new content is added
const originalSetInnerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
if (originalSetInnerHTML) {
    // Observe DOM changes for lazy loading new images
    const mutationObserver = new MutationObserver((mutations) => {
        let hasNewImages = false;
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        if (node.tagName === 'IMG' || node.querySelectorAll?.('img').length) {
                            hasNewImages = true;
                        }
                    }
                });
            }
        });
        if (hasNewImages) {
            ImageLazyLoader.enhanceAll();
        }
    });

    mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
}

export { ImageLazyLoader, LinkPrefetcher, ResourcePrioritizer };

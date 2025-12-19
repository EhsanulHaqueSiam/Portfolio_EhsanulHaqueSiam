/**
 * Progressive Image Loading with Intersection Observer
 * Provides blur-up effect and smarter lazy loading
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
                    rootMargin: '50px 0px', // Start loading 50px before visible
                    threshold: 0.01
                }
            );
        }
    }

    /**
     * Load image with blur-up effect
     */
    loadImage(img) {
        const src = img.dataset.src || img.src;

        if (!src || src === '') return;

        // Add loading class for animation
        img.classList.add('img-loading');

        // Create new image to preload
        const tempImg = new Image();

        tempImg.onload = () => {
            img.src = src;
            img.classList.remove('img-loading');
            img.classList.add('loaded');

            // Trigger fade-in animation
            requestAnimationFrame(() => {
                img.style.opacity = '1';
                img.style.filter = 'blur(0)';
            });
        };

        tempImg.onerror = () => {
            img.classList.remove('img-loading');
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
            // Set initial blur state
            img.style.opacity = '0';
            img.style.filter = 'blur(10px)';
            img.style.transition = 'opacity 0.3s ease, filter 0.3s ease';

            this.imageObserver.observe(img);
        });
    }

    /**
     * Static method to enhance all lazy images on page
     */
    static enhanceAll() {
        const loader = new ImageLazyLoader();
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
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
                img.fetchpriority = 'high';
            }
        });
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Enhance lazy images with Intersection Observer
    ImageLazyLoader.enhanceAll();

    // Initialize link prefetching
    new LinkPrefetcher();

    // Prioritize above-fold images
    ResourcePrioritizer.prioritizeAboveFold();
});

// Re-run after dynamic content loads
document.addEventListener('contentLoaded', () => {
    ImageLazyLoader.enhanceAll();
});

export { ImageLazyLoader, LinkPrefetcher, ResourcePrioritizer };

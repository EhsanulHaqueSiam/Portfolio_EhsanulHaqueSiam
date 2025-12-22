/**
 * Image Loader Utility
 * 
 * Provides automatic WebP fallback for images.
 * Checks if WebP version exists and uses it if supported.
 */

/**
 * Get the WebP version of an image path if it exists
 * @param {string} src - Original image source
 * @returns {string} - WebP path or original
 */
export const getOptimizedImageSrc = (src) => {
    // Skip if already WebP or SVG
    if (src.endsWith('.webp') || src.endsWith('.svg')) {
        return src;
    }

    // Check WebP support
    if (!supportsWebP) {
        return src;
    }

    // Convert path to WebP
    return src.replace(/\.(png|jpg|jpeg|PNG|JPG|JPEG)$/i, '.webp');
};

/**
 * Check WebP support
 */
let supportsWebP = false;

// Async WebP support check
const checkWebPSupport = () => {
    return new Promise((resolve) => {
        const webP = new Image();
        webP.onload = webP.onerror = () => {
            supportsWebP = webP.height === 2;
            resolve(supportsWebP);
        };
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
};

/**
 * Lazy load images with WebP fallback
 * Call this after DOM is ready
 */
export const initImageOptimization = async () => {
    await checkWebPSupport();

    // Find all images that could use WebP
    const images = document.querySelectorAll('img[data-src], img[loading="lazy"]');

    images.forEach(img => {
        const originalSrc = img.dataset.src || img.src;

        if (supportsWebP && !originalSrc.endsWith('.webp') && !originalSrc.endsWith('.svg')) {
            // Try WebP version
            const webpSrc = originalSrc.replace(/\.(png|jpg|jpeg)$/i, '.webp');

            // Create a test image to check if WebP exists
            const testImg = new Image();
            testImg.onload = () => {
                img.src = webpSrc;
            };
            testImg.onerror = () => {
                img.src = originalSrc;
            };
            testImg.src = webpSrc;
        }
    });

    console.log(`🖼️ Image optimization: WebP ${supportsWebP ? 'supported' : 'not supported'}`);
};

/**
 * Create a picture element with WebP and fallback
 * @param {string} src - Original image source
 * @param {string} alt - Alt text
 * @param {string} className - CSS classes
 * @returns {HTMLPictureElement}
 */
export const createOptimizedPicture = (src, alt = '', className = '') => {
    const picture = document.createElement('picture');

    // Add WebP source
    if (!src.endsWith('.webp') && !src.endsWith('.svg')) {
        const webpSource = document.createElement('source');
        webpSource.srcset = src.replace(/\.(png|jpg|jpeg)$/i, '.webp');
        webpSource.type = 'image/webp';
        picture.appendChild(webpSource);
    }

    // Add fallback img
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.className = className;
    img.loading = 'lazy';
    picture.appendChild(img);

    return picture;
};

export default {
    getOptimizedImageSrc,
    initImageOptimization,
    createOptimizedPicture
};

/**
 * Data Fetcher Module
 * Handles fetching JSON data and resolving image paths
 * Now with WebP optimization support
 */

// Cache for fetched data
const dataCache = {};

// WebP support detection (cached)
let webpSupport = null;

/**
 * Check if browser supports WebP
 * @returns {Promise<boolean>}
 */
const checkWebPSupport = async () => {
    if (webpSupport !== null) return webpSupport;

    return new Promise((resolve) => {
        const webP = new Image();
        webP.onload = webP.onerror = () => {
            webpSupport = webP.height === 2;
            resolve(webpSupport);
        };
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
};

// Initialize WebP check on load
if (typeof window !== 'undefined') {
    checkWebPSupport();
}

/**
 * Fetch JSON data from the assets/data directory
 * @param {string} type - Type of data to fetch (skills, projects, achievements, publications, experience)
 * @returns {Promise<Object[]>} - Array of data objects
 */
export const fetchData = async (type = "skills") => {
    // Return cached data if available
    if (dataCache[type]) {
        return dataCache[type];
    }

    try {
        // Add cache-buster to ensure fresh fetch
        const cacheBuster = `?v=${Date.now()}`;
        const response = await fetch(`/assets/data/${type}.json${cacheBuster}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${type} data`);
        }
        const data = await response.json();
        dataCache[type] = data;
        return data;
    } catch (error) {
        console.error(`Error fetching ${type}:`, error);
        return [];
    }
};

/**
 * Resolve image path based on type
 * Automatically uses WebP version if browser supports it
 * @param {string} img - Image filename or path
 * @param {string} type - Type of content (projects, achievements, publications)
 * @returns {string} - Full image path (WebP if supported)
 */
export const resolveImage = (img, type) => {
    // If already a full path or URL, return as-is
    if (img.startsWith('http') || img.startsWith('/') || img.startsWith('./')) {
        return img;
    }

    // Add extension if not present
    const hasExtension = /\.\w+$/.test(img);
    const filename = hasExtension ? img : `${img}.png`;

    // Map type to directory
    const dirMap = {
        projects: 'projects',
        achievements: 'achievements',
        publications: 'publications',
        experience: 'experience'
    };

    const dir = dirMap[type] || 'projects';
    const basePath = `/assets/images/${dir}/${filename}`;

    // If WebP is supported and file isn't already WebP/SVG, use WebP version
    if (webpSupport && !filename.endsWith('.webp') && !filename.endsWith('.svg')) {
        return basePath.replace(/\.(png|jpg|jpeg|PNG|JPG|JPEG)$/i, '.webp');
    }

    return basePath;
};

/**
 * Create a resolved image function bound to a specific type
 * @param {string} type - Type of content
 * @returns {function} - Function that resolves image paths for that type
 */
export const createImageResolver = (type) => {
    return (img) => resolveImage(img, type);
};

/**
 * Get WebP support status
 * @returns {boolean|null} - true if supported, false if not, null if unknown
 */
export const getWebPSupport = () => webpSupport;

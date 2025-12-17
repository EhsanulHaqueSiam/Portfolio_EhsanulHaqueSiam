/**
 * Data Fetcher Module
 * Handles fetching JSON data and resolving image paths
 */

// Cache for fetched data
const dataCache = {};

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
 * @param {string} img - Image filename or path
 * @param {string} type - Type of content (projects, achievements, publications)
 * @returns {string} - Full image path
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
    return `/assets/images/${dir}/${filename}`;
};

/**
 * Create a resolved image function bound to a specific type
 * @param {string} type - Type of content
 * @returns {function} - Function that resolves image paths for that type
 */
export const createImageResolver = (type) => {
    return (img) => resolveImage(img, type);
};

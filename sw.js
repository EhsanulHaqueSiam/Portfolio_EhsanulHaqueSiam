/**
 * Service Worker for Portfolio Site
 * Provides offline caching and instant repeat visits
 */

const CACHE_NAME = 'portfolio-cache-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/assets/css/main.css',
    '/assets/images/profile2.jpg',
    '/assets/images/favicon.png',
    '/manifest.json'
];

const CACHE_STRATEGIES = {
    // Cache first for static assets
    static: [
        /\.css$/,
        /\.js$/,
        /\.woff2?$/,
        /\.ttf$/
    ],
    // Network first for dynamic content
    network: [
        /\/assets\/data\//,
        /\.json$/
    ],
    // Stale while revalidate for images
    staleWhileRevalidate: [
        /\.png$/,
        /\.jpg$/,
        /\.jpeg$/,
        /\.gif$/,
        /\.webp$/,
        /\.svg$/
    ]
};

// Install event - cache static assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[SW] Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(name => name !== CACHE_NAME)
                        .map(name => caches.delete(name))
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache with various strategies
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip external requests
    if (url.origin !== location.origin) {
        // For CDN resources, try network first then cache
        event.respondWith(networkFirst(request));
        return;
    }

    // Determine caching strategy
    if (matchesPatterns(url.pathname, CACHE_STRATEGIES.static)) {
        event.respondWith(cacheFirst(request));
    } else if (matchesPatterns(url.pathname, CACHE_STRATEGIES.network)) {
        event.respondWith(networkFirst(request));
    } else if (matchesPatterns(url.pathname, CACHE_STRATEGIES.staleWhileRevalidate)) {
        event.respondWith(staleWhileRevalidate(request));
    } else {
        // Default: network first
        event.respondWith(networkFirst(request));
    }
});

/**
 * Cache-first strategy
 * Best for static assets that rarely change
 */
async function cacheFirst(request) {
    const cached = await caches.match(request);
    if (cached) return cached;

    try {
        const response = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone());
        return response;
    } catch (error) {
        console.error('[SW] Cache-first fetch failed:', error);
        throw error;
    }
}

/**
 * Network-first strategy
 * Best for dynamic content
 */
async function networkFirst(request) {
    try {
        const response = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone());
        return response;
    } catch (error) {
        const cached = await caches.match(request);
        if (cached) return cached;
        throw error;
    }
}

/**
 * Stale-while-revalidate strategy
 * Best for images - serve cached immediately, update in background
 */
async function staleWhileRevalidate(request) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);

    // Fetch in background
    const fetchPromise = fetch(request)
        .then(response => {
            cache.put(request, response.clone());
            return response;
        })
        .catch(() => cached);

    // Return cached immediately if available, otherwise wait
    return cached || fetchPromise;
}

/**
 * Check if pathname matches any pattern
 */
function matchesPatterns(pathname, patterns) {
    return patterns.some(pattern => pattern.test(pathname));
}

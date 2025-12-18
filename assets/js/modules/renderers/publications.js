/**
 * Publications Renderer Module
 * Handles rendering publications section with image sliders and gallery
 */

import { fetchData, resolveImage } from '../data-fetcher.js';
import { openGallery, createImageResolver } from '../gallery.js';

/**
 * Initialize touch-friendly image slider for a container
 * Supports both hover (desktop) and tap/swipe (mobile)
 * @param {HTMLElement} sliderEl - Slider container element
 */
const initHoverSlider = (sliderEl) => {
    if (!sliderEl) return;

    let current = 0;
    let hoverInterval = null;
    let touchStartX = 0;
    const imgs = sliderEl.querySelectorAll('img');
    if (imgs.length <= 1) return;

    const navigate = (direction) => {
        imgs[current].classList.remove('active');
        current = (current + direction + imgs.length) % imgs.length;
        imgs[current].classList.add('active');
    };

    // Desktop: Hover auto-slide
    sliderEl.addEventListener('mouseenter', () => {
        hoverInterval = setInterval(() => navigate(1), 1200);
    });

    sliderEl.addEventListener('mouseleave', () => {
        if (hoverInterval) {
            clearInterval(hoverInterval);
            hoverInterval = null;
        }
    });

    // Mobile: Touch swipe support
    sliderEl.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        if (hoverInterval) {
            clearInterval(hoverInterval);
            hoverInterval = null;
        }
    }, { passive: true });

    sliderEl.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 30) navigate(diff > 0 ? 1 : -1);
    }, { passive: true });

    // Mobile: Tap to advance
    sliderEl.addEventListener('click', (e) => {
        if (e.target.tagName !== 'A') navigate(1);
    });

    sliderEl.classList.add('swipeable');
};

/**
 * Attach gallery click handlers to trigger elements
 * @param {HTMLElement} container - Container with gallery triggers
 */
const attachGalleryHandlers = (container) => {
    container.querySelectorAll('.gallery-trigger').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const images = JSON.parse(trigger.dataset.images.replace(/&quot;/g, '"'));
            const type = trigger.dataset.type;
            openGallery(images, 0, createImageResolver(type));
        });
    });
};

/**
 * Generate image HTML for a publication
 * @param {Object} pub - Publication data object
 * @param {number} index - Publication index
 * @returns {string} - HTML string for publication image
 */
const generatePublicationImageHtml = (pub, index) => {
    const images = pub.images || [pub.image];
    const hasSlider = images.length > 1;
    const imagesJson = JSON.stringify(images).replace(/"/g, '&quot;');

    if (hasSlider) {
        return `
            <div class="image-slider gallery-trigger" id="pub-slider-${index}" data-images="${imagesJson}" data-type="publications">
                ${images.map((img, i) => `
                    <img src="${resolveImage(img, 'publications')}" class="${i === 0 ? 'active' : ''}" alt="${pub.title}">
                `).join('')}
                <div class="gallery-expand-icon"><i class="fas fa-expand"></i></div>
            </div>
        `;
    }

    return `
        <div class="image gallery-trigger" data-images="${imagesJson}" data-type="publications">
            <img src="${resolveImage(images[0], 'publications')}" alt="${pub.title}" 
                 onerror="this.src='https://via.placeholder.com/400x250?text=Certificate+Coming+Soon'">
            <div class="gallery-expand-icon"><i class="fas fa-expand"></i></div>
        </div>
    `;
};

/**
 * Generate HTML for a single publication box
 * @param {Object} pub - Publication data object
 * @param {number} index - Publication index
 * @returns {string} - HTML string for publication box
 */
const generatePublicationHtml = (pub, index) => {
    const imageHtml = generatePublicationImageHtml(pub, index);

    return `
        <div class="box">
            ${imageHtml}
            <div class="content">
                <h3>${pub.title}</h3>
                <p>${pub.conference}</p>
                <h4>${pub.date}</h4>
                <p style="margin-top: 1rem; font-size: 1.3rem;">${pub.desc}</p>
            </div>
        </div>
    `;
};

/**
 * Render publications section
 */
export const renderPublications = async () => {
    try {
        const publications = await fetchData("publications");
        const container = document.querySelector("#publications .box-container");

        if (!container || !publications.length) return;

        // Filter publications based on current page
        const isPublicationsPage = window.location.pathname.includes("publications");
        const filteredPubs = isPublicationsPage
            ? publications
            : publications.filter(pub => pub.showInHome === true);

        // Render publication boxes
        container.innerHTML = filteredPubs
            .map((pub, index) => generatePublicationHtml(pub, index))
            .join("");

        // Initialize hover sliders for multi-image publications
        filteredPubs.forEach((pub, index) => {
            const images = pub.images || [pub.image];
            if (images.length > 1) {
                const sliderEl = document.getElementById(`pub-slider-${index}`);
                initHoverSlider(sliderEl);
            }
        });

        // Attach gallery click handlers
        attachGalleryHandlers(container);

        // Initialize ScrollReveal with reduced delay for faster card appearance
        if (typeof ScrollReveal !== 'undefined') {
            ScrollReveal().reveal(container.querySelectorAll(".box"), {
                origin: "bottom",
                distance: "30px",
                duration: 500,
                delay: 50,
                interval: 80, // Reduced from default for faster sequential reveal
                easing: "ease-out",
                reset: false
            });
        }

    } catch (error) {
        console.error("Failed to render publications:", error);
        const container = document.querySelector("#publications .box-container");
        if (container) {
            container.innerHTML = `<p style="color:red; text-align:center; font-size:1.5rem;">Error loading publications: ${error.message}</p>`;
        }
    }
};

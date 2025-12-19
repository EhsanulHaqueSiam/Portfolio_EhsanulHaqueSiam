/**
 * Achievements Renderer Module
 * Handles rendering achievements/awards section with image sliders and gallery
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
 * Generate image HTML for an achievement
 * @param {Object} achievement - Achievement data object
 * @param {number} index - Achievement index
 * @returns {string} - HTML string for achievement image
 */
const generateAchievementImageHtml = (achievement, index) => {
    const images = achievement.images || [achievement.image];
    const hasSlider = images.length > 1;
    const imagesJson = JSON.stringify(images).replace(/"/g, '&quot;');

    if (hasSlider) {
        return `
            <div class="image-slider gallery-trigger" id="achieve-slider-${index}" data-images="${imagesJson}" data-type="achievements">
                ${images.map((img, i) => `
                    <img src="${resolveImage(img, 'achievements')}" class="${i === 0 ? 'active' : ''}" alt="${achievement.name}" loading="lazy">
                `).join('')}
            </div>
        `;
    }

    return `
        <div class="image gallery-trigger" data-images="${imagesJson}" data-type="achievements">
            <img draggable="false" src="${resolveImage(images[0], 'achievements')}" alt="${achievement.name}" loading="lazy" />
        </div>
    `;
};

/**
 * Generate HTML for a single achievement box
 * @param {Object} achievement - Achievement data object
 * @param {number} index - Achievement index
 * @returns {string} - HTML string for achievement box
 */
const generateAchievementHtml = (achievement, index) => {
    const imageHtml = generateAchievementImageHtml(achievement, index);

    return `
        <div class="box tilt">
            ${imageHtml}
            <div class="content">
                <div class="tag"><h3>${achievement.name}</h3></div>
                <div class="desc">
                    <p>${achievement.desc}</p>
                </div>
            </div>
        </div>
    `;
};

/**
 * Render achievements section
 */
export const renderAchievements = async () => {
    try {
        const achievements = await fetchData("achievements");
        const achievementsContainer = document.querySelector("#award .box-container");

        if (!achievementsContainer || !achievements.length) return;

        // Filter achievements based on current page
        const isAchievementsPage = window.location.pathname.includes("achievements");
        const filteredAchievements = isAchievementsPage
            ? achievements
            : achievements.filter(a => a.showInHome === true);

        // Render achievement boxes
        const displayAchievements = filteredAchievements
            .filter(achievement => achievement.category !== "android")
            .slice(0, 10);

        achievementsContainer.innerHTML = displayAchievements
            .map((achievement, index) => generateAchievementHtml(achievement, index))
            .join("");

        // Initialize hover sliders for multi-image achievements
        displayAchievements.forEach((achievement, index) => {
            const images = achievement.images || [achievement.image];
            if (images.length > 1) {
                const sliderEl = document.getElementById(`achieve-slider-${index}`);
                initHoverSlider(sliderEl);
            }
        });

        // Initialize VanillaTilt - only for elements in this container to prevent duplicates
        if (typeof VanillaTilt !== 'undefined') {
            VanillaTilt.init(achievementsContainer.querySelectorAll(".tilt"), {
                max: 15,
                speed: 400,
                glare: true,
                "max-glare": 0.3
            });
        }

        // Initialize ScrollReveal with reduced delay for faster card appearance
        if (typeof ScrollReveal !== 'undefined') {
            ScrollReveal().reveal(achievementsContainer.querySelectorAll(".box"), {
                interval: 50,
                distance: '20px',
                origin: 'bottom',
                duration: 400
            });
        }

        // Attach gallery click handlers
        attachGalleryHandlers(achievementsContainer);

    } catch (error) {
        console.error("Failed to render achievements:", error);
        const container = document.querySelector("#award .box-container");
        if (container) {
            container.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
        }
    }
};

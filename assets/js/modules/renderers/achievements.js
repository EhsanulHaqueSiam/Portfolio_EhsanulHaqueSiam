/**
 * Achievements Renderer Module
 * Handles rendering achievements/awards section with image sliders and gallery
 */

import { fetchData, resolveImage } from '../data-fetcher.js';
import { openGallery, createImageResolver } from '../gallery.js';

/**
 * Initialize hover-based image slider for a container
 * @param {HTMLElement} sliderEl - Slider container element
 */
const initHoverSlider = (sliderEl) => {
    if (!sliderEl) return;

    let current = 0;
    let hoverInterval = null;

    sliderEl.addEventListener('mouseenter', () => {
        hoverInterval = setInterval(() => {
            const imgs = sliderEl.querySelectorAll('img');
            if (imgs.length > 0) {
                imgs[current].classList.remove('active');
                current = (current + 1) % imgs.length;
                imgs[current].classList.add('active');
            }
        }, 1200);
    });

    sliderEl.addEventListener('mouseleave', () => {
        if (hoverInterval) {
            clearInterval(hoverInterval);
            hoverInterval = null;
        }
    });
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
                    <img src="${resolveImage(img, 'achievements')}" class="${i === 0 ? 'active' : ''}" alt="${achievement.name}">
                `).join('')}
            </div>
        `;
    }

    return `
        <div class="image gallery-trigger" data-images="${imagesJson}" data-type="achievements">
            <img draggable="false" src="${resolveImage(images[0], 'achievements')}" alt="${achievement.name}" />
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
            : achievements.filter(a => a.showInHome !== false);

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

        // Initialize VanillaTilt
        if (typeof VanillaTilt !== 'undefined') {
            VanillaTilt.init(document.querySelectorAll(".tilt"), {
                max: 15,
                speed: 400,
                glare: true,
                "max-glare": 0.3
            });
        }

        // Initialize ScrollReveal
        if (typeof ScrollReveal !== 'undefined') {
            ScrollReveal().reveal(".award .box", { interval: 100 });
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

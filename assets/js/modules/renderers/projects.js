/**
 * Projects Renderer Module
 * Handles rendering projects section with image sliders and gallery
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
 * Generate image HTML for a project
 * @param {Object} project - Project data object
 * @param {number} index - Project index
 * @returns {string} - HTML string for project image
 */
const generateProjectImageHtml = (project, index) => {
    const images = project.images || [project.image];
    const hasSlider = images.length > 1;
    const imagesJson = JSON.stringify(images).replace(/"/g, '&quot;');

    if (hasSlider) {
        return `
            <div class="image-slider gallery-trigger" id="proj-slider-${index}" data-images="${imagesJson}" data-type="projects">
                ${images.map((img, i) => `
                    <img src="${resolveImage(img, 'projects')}" class="${i === 0 ? 'active' : ''}" alt="${project.name}">
                `).join('')}
            </div>
        `;
    }

    return `
        <div class="image gallery-trigger" data-images="${imagesJson}" data-type="projects">
            <img draggable="false" src="${resolveImage(images[0], 'projects')}" alt="${project.name}" />
        </div>
    `;
};

/**
 * Generate HTML for a single project box
 * @param {Object} project - Project data object
 * @param {number} index - Project index
 * @returns {string} - HTML string for project box
 */
const generateProjectHtml = (project, index) => {
    const imageHtml = generateProjectImageHtml(project, index);

    // Check if links exist and are valid (not empty, not just "#")
    const hasViewLink = project.links?.view && project.links.view.trim() !== '' && project.links.view !== '#';
    const hasCodeLink = project.links?.code && project.links.code.trim() !== '' && project.links.code !== '#';
    const hasAnyLink = hasViewLink || hasCodeLink;

    // Generate buttons HTML only for valid links
    const viewBtnHtml = hasViewLink ? `
        <a href="${project.links.view}" class="btn" target="_blank">
            <i class="fas fa-eye"></i> View
        </a>
    ` : '';

    const codeBtnHtml = hasCodeLink ? `
        <a href="${project.links.code}" class="btn" target="_blank">
            Code <i class="fas fa-code"></i>
        </a>
    ` : '';

    // Only show btns div if at least one button exists
    const btnsHtml = hasAnyLink ? `
        <div class="btns">
            ${viewBtnHtml}
            ${codeBtnHtml}
        </div>
    ` : '';

    return `
        <div class="box tilt">
            ${imageHtml}
            <div class="content">
                <div class="tag"><h3>${project.name}</h3></div>
                <div class="desc">
                    <p>${project.desc}</p>
                    ${btnsHtml}
                </div>
            </div>
        </div>
    `;
};

/**
 * Render projects section
 */
export const renderProjects = async () => {
    try {
        const projects = await fetchData("projects");
        const projectsContainer = document.querySelector("#work .box-container");

        if (!projectsContainer || !projects.length) return;

        // Filter projects based on current page
        const isProjectsPage = window.location.pathname.includes("projects");
        const filteredProjects = isProjectsPage
            ? projects
            : projects.filter(p => p.showInHome !== false);

        // Render project boxes
        const displayProjects = filteredProjects
            .filter(project => project.category !== "android")
            .slice(0, 10);

        projectsContainer.innerHTML = displayProjects
            .map((project, index) => generateProjectHtml(project, index))
            .join("");

        // Initialize hover sliders for multi-image projects
        displayProjects.forEach((project, index) => {
            const images = project.images || [project.image];
            if (images.length > 1) {
                const sliderEl = document.getElementById(`proj-slider-${index}`);
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
            ScrollReveal().reveal(".work .box", { interval: 100 });
        }

        // Attach gallery click handlers
        attachGalleryHandlers(projectsContainer);

    } catch (error) {
        console.error("Failed to render projects:", error);
        const container = document.querySelector("#work .box-container");
        if (container) {
            container.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
        }
    }
};

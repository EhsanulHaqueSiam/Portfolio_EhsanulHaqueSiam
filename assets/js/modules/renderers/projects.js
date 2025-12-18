/**
 * Projects Renderer Module
 * Handles rendering projects section with image sliders and gallery
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

    // Navigate to next/previous image
    const navigate = (direction) => {
        imgs[current].classList.remove('active');
        current = (current + direction + imgs.length) % imgs.length;
        imgs[current].classList.add('active');
    };

    // === Desktop: Hover auto-slide ===
    sliderEl.addEventListener('mouseenter', () => {
        hoverInterval = setInterval(() => navigate(1), 1200);
    });

    sliderEl.addEventListener('mouseleave', () => {
        if (hoverInterval) {
            clearInterval(hoverInterval);
            hoverInterval = null;
        }
    });

    // === Mobile: Touch swipe support ===
    sliderEl.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        // Stop auto-slide on touch
        if (hoverInterval) {
            clearInterval(hoverInterval);
            hoverInterval = null;
        }
    }, { passive: true });

    sliderEl.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        const minSwipe = 30;

        if (Math.abs(diff) > minSwipe) {
            navigate(diff > 0 ? 1 : -1);
        }
    }, { passive: true });

    // === Mobile: Tap to advance ===
    sliderEl.addEventListener('click', (e) => {
        // Only advance on tap, not on link clicks
        if (e.target.tagName !== 'A') {
            navigate(1);
        }
    });

    // Add visual indicator for slideable images
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

    // Generate language tags HTML
    const tagsHtml = project.tags && project.tags.length > 0 ? `
        <div class="project-tags">
            ${project.tags.map(tag => `<span class="lang-tag">${tag}</span>`).join('')}
        </div>
    ` : '';

    // Generate metrics badges HTML
    const metricsHtml = project.metrics && project.metrics.length > 0 ? `
        <div class="project-metrics">
            ${project.metrics.map(metric => `<span class="metric-badge"><i class="fas fa-chart-line"></i> ${metric}</span>`).join('')}
        </div>
    ` : '';

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
                <div class="tag">
                    <h3>${project.name}</h3>
                    ${tagsHtml}
                </div>
                <div class="desc">
                    <p>${project.desc}</p>
                    ${metricsHtml}
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
        const searchInput = document.getElementById('project-search');

        if (!projectsContainer || !projects.length) return;

        // Check if all necessary elements are present
        const isProjectsPage = !!searchInput;

        // Filter for homepage vs projects page
        let displayProjects = isProjectsPage
            ? projects
            : projects.filter(p => p.showInHome === true);

        // Store original projects for filtering (projects page only)
        if (isProjectsPage) {
            window.allProjects = [...projects];
            initProjectFilters(projectsContainer);
        } else {
            // Homepage: limit to 10
            displayProjects = displayProjects.slice(0, 10);
        }

        // Render projects
        renderProjectCards(projectsContainer, displayProjects);

        // Initialize effects
        initProjectEffects(projectsContainer, displayProjects);

        // Attach gallery handlers
        attachGalleryHandlers(projectsContainer);

    } catch (error) {
        console.error("Failed to render projects:", error);
        const container = document.querySelector("#work .box-container");
        if (container) {
            container.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
        }
    }
};

/**
 * Render project cards to container
 */
const renderProjectCards = (container, projects) => {
    if (projects.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>No projects found matching your criteria.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = projects
        .map((project, index) => generateProjectHtml(project, index))
        .join("");
};

/**
 * Initialize project tilt and slider effects
 */
const initProjectEffects = (container, projects) => {
    // Initialize hover sliders
    projects.forEach((project, index) => {
        const images = project.images || [project.image];
        if (images.length > 1) {
            const sliderEl = document.getElementById(`proj-slider-${index}`);
            initHoverSlider(sliderEl);
        }
    });

    // Initialize VanillaTilt
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(container.querySelectorAll(".tilt"), {
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
};

/**
 * Initialize project filters (search, category, sort, tags)
 */
const initProjectFilters = (container) => {
    const searchInput = document.getElementById('project-search');
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');
    const tagsContainer = document.getElementById('tags-filter');



    if (!searchInput) {

        return; // Not on projects page
    }

    // Extract all unique tags from projects
    const allTags = [...new Set(window.allProjects.flatMap(p => p.tags || []))];

    // Render tag buttons
    if (tagsContainer) {
        tagsContainer.innerHTML = allTags.map(tag =>
            `<button class="tag-btn" data-tag="${tag}">${tag}</button>`
        ).join('');

        // Tag click handlers
        tagsContainer.querySelectorAll('.tag-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.classList.toggle('active');
                applyFilters(container);
            });
        });
    }

    // Search input handler with debounce
    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => applyFilters(container), 300);
    });

    // Category filter handler
    categoryFilter?.addEventListener('change', () => applyFilters(container));

    // Sort filter handler
    sortFilter?.addEventListener('change', () => applyFilters(container));
};

/**
 * Apply all filters and re-render projects
 */
const applyFilters = (container) => {
    const searchQuery = document.getElementById('project-search')?.value.toLowerCase() || '';
    const categoryValue = document.getElementById('category-filter')?.value || 'all';
    const sortValue = document.getElementById('sort-filter')?.value || 'default';
    const activeTags = [...document.querySelectorAll('.tag-btn.active')].map(btn => btn.dataset.tag);



    let filtered = [...window.allProjects];

    // Search filter
    if (searchQuery) {
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(searchQuery) ||
            p.desc.toLowerCase().includes(searchQuery) ||
            (p.tags || []).some(tag => tag.toLowerCase().includes(searchQuery))
        );
    }

    // Category filter
    if (categoryValue !== 'all') {
        filtered = filtered.filter(p =>
            (p.categories || [p.category]).includes(categoryValue)
        );
    }

    // Tags filter
    if (activeTags.length > 0) {
        filtered = filtered.filter(p =>
            activeTags.every(tag => (p.tags || []).includes(tag))
        );
    }

    // Sort
    if (sortValue === 'name-asc') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortValue === 'name-desc') {
        filtered.sort((a, b) => b.name.localeCompare(a.name));
    }

    // Re-render
    renderProjectCards(container, filtered);
    initProjectEffects(container, filtered);
    attachGalleryHandlers(container);
};

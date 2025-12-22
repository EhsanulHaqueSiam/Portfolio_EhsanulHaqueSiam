/**
 * Interactive Case Study Module
 * Handles modal display, data population, and slider interactions
 */

import { resolveImage } from '/assets/js/modules/data-fetcher.js';

let modal = null;
let currentProject = null;

/**
 * Initialize Case Study Modal structure
 */
const initModal = () => {
    if (document.getElementById('case-study-modal')) {
        modal = document.getElementById('case-study-modal');
        return;
    }

    modal = document.createElement('div');
    modal.id = 'case-study-modal';
    modal.className = 'case-study-modal';
    modal.innerHTML = `
        <div class="case-study-content">
            <button class="close-modal" aria-label="Close Case Study">
                <i class="fas fa-times"></i>
            </button>
            <div class="cs-header" id="cs-header">
                <h2 id="cs-title">Project Title</h2>
                <div class="cs-tags" id="cs-tags"></div>
            </div>
            <div class="cs-body">
                <!-- Problem & Solution -->
                <section class="cs-section cs-problem-solution">
                    <div class="cs-card">
                        <h3><i class="fas fa-exclamation-circle"></i> The Problem</h3>
                        <p id="cs-problem">Loading...</p>
                    </div>
                    <div class="cs-card">
                        <h3><i class="fas fa-check-circle"></i> The Solution</h3>
                        <p id="cs-solution">Loading...</p>
                    </div>
                </section>

                <!-- Comparison Slider (Optional) -->
                <section class="cs-section" id="cs-comparison-section" style="display:none;">
                    <h3><i class="fas fa-sliders-h"></i> Transformation</h3>
                    <div class="cs-comparison-container" id="cs-comparison-container">
                        <img src="" alt="After" class="cs-comparison-image" id="cs-img-after">
                        <span class="cs-label after">After</span>
                        
                        <div class="cs-comparison-overlay" id="cs-overlay">
                            <img src="" alt="Before" id="cs-img-before">
                            <span class="cs-label before">Before</span>
                        </div>
                        
                        <div class="cs-comparison-slider" id="cs-slider">
                            <div class="cs-slider-handle">
                                <i class="fas fa-arrows-alt-h"></i>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Process -->
                <section class="cs-section">
                    <h3><i class="fas fa-cogs"></i> The Process</h3>
                    <div class="cs-process-grid" id="cs-process">
                        <!-- Process steps injected here -->
                    </div>
                </section>

                <!-- Results -->
                <section class="cs-section">
                    <h3><i class="fas fa-chart-line"></i> Results & Impact</h3>
                    <div class="cs-results-grid" id="cs-results">
                        <!-- Results injected here -->
                    </div>
                </section>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Event Listeners
    modal.querySelector('.close-modal').addEventListener('click', closeCaseStudy);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeCaseStudy();
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeCaseStudy();
        }
    });

    // ROBUST scroll isolation - always prevent wheel on modal backdrop, manually scroll content
    modal.addEventListener('wheel', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const content = modal.querySelector('.case-study-content');
        if (content) {
            // Manually scroll the content element
            content.scrollTop += e.deltaY;
        }
    }, { passive: false });

    // Also prevent touch scrolling from bleeding through
    modal.addEventListener('touchmove', (e) => {
        const content = modal.querySelector('.case-study-content');
        if (content && !content.contains(e.target)) {
            e.preventDefault();
        }
    }, { passive: false });
};

/**
 * Open Case Study for a generic project object
 */
export const openCaseStudy = (project) => {
    if (!modal) initModal();
    if (!project.caseStudy) return;

    currentProject = project;

    // Reset scroll position
    const content = modal.querySelector('.case-study-content');
    if (content) content.scrollTop = 0;

    // Populate Data
    document.getElementById('cs-title').textContent = project.name;
    document.getElementById('cs-problem').textContent = project.caseStudy.problem;
    document.getElementById('cs-solution').textContent = project.caseStudy.solution;

    // Process Steps
    const processContainer = document.getElementById('cs-process');
    processContainer.innerHTML = project.caseStudy.process.map(step => `
        <div class="cs-process-step">
            <div class="cs-process-icon"><i class="${step.icon}"></i></div>
            <h4>${step.title}</h4>
            <p>${step.desc}</p>
        </div>
    `).join('');

    // Results
    const resultsContainer = document.getElementById('cs-results');
    resultsContainer.innerHTML = project.caseStudy.results.map(res => `
        <div class="cs-metric">
            <span class="cs-metric-value">${res.value}</span>
            <span class="cs-metric-label">${res.label}</span>
        </div>
    `).join('');

    // Comparison Slider
    const comparisonSection = document.getElementById('cs-comparison-section');
    if (project.caseStudy.comparison) {
        comparisonSection.style.display = 'block';
        const imgBefore = document.getElementById('cs-img-before');
        const imgAfter = document.getElementById('cs-img-after');

        // Use resolveImage if appropriate, assuming paths are relative assets
        imgBefore.src = project.caseStudy.comparison.before;
        imgAfter.src = project.caseStudy.comparison.after;

        initComparisonLogic();
    } else {
        comparisonSection.style.display = 'none';
    }

    // Show Modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scroll

    // GSAP entrance animations
    if (typeof gsap !== 'undefined') {
        const tl = gsap.timeline();

        // Content container entrance
        tl.fromTo(content,
            { scale: 0.9, opacity: 0, y: 30 },
            { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.2)' }
        );

        // Header slide in
        tl.fromTo('.cs-header',
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' },
            '-=0.2'
        );

        // Cards stagger
        tl.fromTo('.cs-card',
            { opacity: 0, y: 20, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.35, stagger: 0.1, ease: 'power2.out' },
            '-=0.1'
        );

        // Process steps stagger
        tl.fromTo('.cs-process-step',
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.3, stagger: 0.08, ease: 'power2.out' },
            '-=0.2'
        );

        // Metrics with count-up effect
        tl.fromTo('.cs-metric',
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1, duration: 0.3, stagger: 0.1, ease: 'back.out(1.5)' },
            '-=0.2'
        );
    }
};

/**
 * Close Case Study Modal
 */
const closeCaseStudy = () => {
    if (!modal) return;

    // GSAP exit animation
    if (typeof gsap !== 'undefined') {
        const content = modal.querySelector('.case-study-content');
        gsap.to(content, {
            scale: 0.9,
            opacity: 0,
            y: 20,
            duration: 0.25,
            ease: 'power2.in',
            onComplete: () => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
                // Reset for next open
                gsap.set(content, { clearProps: 'all' });
            }
        });
    } else {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
};

/**
 * Initialize Slider Logic (Drag and Touch)
 */
const initComparisonLogic = () => {
    const container = document.getElementById('cs-comparison-container');
    const overlay = document.getElementById('cs-overlay');
    const slider = document.getElementById('cs-slider');
    const imgBefore = document.getElementById('cs-img-before');

    let isDragging = false;

    const moveSlider = (x) => {
        const rect = container.getBoundingClientRect();
        let percentage = ((x - rect.left) / rect.width) * 100;

        // Clamp between 0 and 100
        percentage = Math.max(0, Math.min(100, percentage));

        overlay.style.width = `${percentage}%`;
        slider.style.left = `${percentage}%`;

        // Fix image width in overlay to prevent squishing
        imgBefore.style.width = `${container.offsetWidth}px`;
    }

    // Mouse Events
    slider.addEventListener('mousedown', () => isDragging = true);
    window.addEventListener('mouseup', () => isDragging = false);
    container.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        moveSlider(e.clientX);
    });

    // Touch Events
    slider.addEventListener('touchstart', () => isDragging = true, { passive: true });
    window.addEventListener('touchend', () => isDragging = false);
    container.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        moveSlider(e.touches[0].clientX);
    }, { passive: true });

    // Ensure overlay image matches container width on resize
    window.addEventListener('resize', () => {
        imgBefore.style.width = `${container.offsetWidth}px`;
    });
};

document.addEventListener('DOMContentLoaded', initModal);

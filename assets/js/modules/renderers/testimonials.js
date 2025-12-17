/**
 * Testimonials Renderer Module
 * Handles rendering testimonials section with carousel/cards
 */

import { fetchData } from '../data-fetcher.js';

/**
 * Render testimonials section
 */
export const renderTestimonials = async () => {
    try {
        const testimonials = await fetchData("testimonials");
        const container = document.querySelector("#testimonials .testimonials-container");

        if (!container || !testimonials.length) return;

        // Filter testimonials for homepage
        const filteredTestimonials = testimonials.filter(t => t.showInHome === true);

        // Render testimonial cards
        container.innerHTML = filteredTestimonials
            .map((testimonial, index) => generateTestimonialHtml(testimonial, index))
            .join("");

        // Initialize carousel if needed
        initTestimonialCarousel();

    } catch (error) {
        console.error("Failed to render testimonials:", error);
        const container = document.querySelector("#testimonials .testimonials-container");
        if (container) {
            container.innerHTML = `<p style="color:red; text-align:center;">Error loading testimonials</p>`;
        }
    }
};

/**
 * Generate HTML for a single testimonial card
 */
const generateTestimonialHtml = (testimonial, index) => {
    const imageHtml = testimonial.image
        ? `<img src="${testimonial.image}" alt="${testimonial.name}" class="testimonial-avatar" />`
        : `<div class="testimonial-avatar-placeholder"><i class="fas fa-user"></i></div>`;

    return `
        <div class="testimonial-card" data-index="${index}">
            <div class="testimonial-quote">
                <i class="fas fa-quote-left quote-icon"></i>
                <p>${testimonial.quote}</p>
            </div>
            <div class="testimonial-author">
                ${imageHtml}
                <div class="testimonial-info">
                    <h4>${testimonial.name}</h4>
                    <p>${testimonial.role}, ${testimonial.organization}</p>
                </div>
            </div>
        </div>
    `;
};

/**
 * Initialize testimonial carousel for mobile
 */
const initTestimonialCarousel = () => {
    const container = document.querySelector(".testimonials-container");
    if (!container) return;

    let touchStartX = 0;
    let currentIndex = 0;
    const cards = container.querySelectorAll('.testimonial-card');

    if (cards.length <= 1) return;

    // Touch swipe support
    container.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) {
            currentIndex = diff > 0
                ? Math.min(currentIndex + 1, cards.length - 1)
                : Math.max(currentIndex - 1, 0);
            scrollToCard(container, currentIndex);
        }
    }, { passive: true });
};

/**
 * Scroll to specific card index
 */
const scrollToCard = (container, index) => {
    const cards = container.querySelectorAll('.testimonial-card');
    if (cards[index]) {
        cards[index].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
};

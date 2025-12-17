/**
 * Portfolio Main Entry Point
 * Initializes all modules and renders dynamic content
 * 
 * This file serves as the central orchestrator that imports
 * and initializes all modular components of the portfolio.
 */

// ==================== MODULE IMPORTS ====================

// Navigation and UI
import { initNavigation } from './modules/navigation.js';
import { initScrollSpy, initSmoothScrolling } from './modules/scroll-spy.js';
import { initScrollAnimations, initParallax, initMicroInteractions, initSmoothScroll, initPageLoadAnimation } from './modules/animations.js';

// Forms and Interaction
import { initContactForm } from './modules/contact-form.js';
import { initTypedText } from './modules/typed-text.js';
import { initVisibilityHandler } from './modules/visibility.js';
import { initDevToolsProtection } from './modules/dev-tools.js';
import { initThemeToggle } from './modules/theme-toggle.js';
import { initCustomCursor } from './modules/cursor.js';
import { initCopyToClipboard } from './modules/toast.js';

// Content Renderers
import {
  renderSkills,
  renderProjects,
  renderAchievements,
  renderPublications,
  renderExperience,
  renderTestimonials
} from './modules/renderers/index.js';

// ==================== INITIALIZATION ====================

/**
 * Initialize the entire portfolio application
 * This function orchestrates all module initialization
 */
const initPortfolio = async () => {
  console.log("🚀 Initializing Portfolio...");

  // Initialize theme first (before any rendering)
  initThemeToggle();

  // Initialize navigation and scroll functionality
  initNavigation();
  initScrollSpy();
  initSmoothScrolling();
  initSmoothScroll();

  // Initialize visual effects and animations (before content load)
  initTypedText();
  initVisibilityHandler();
  initParallax();

  // Initialize form handling
  initContactForm();

  // Initialize dev tools protection
  initDevToolsProtection();

  // Initialize custom cursor (desktop only)
  initCustomCursor();

  // Render dynamic content sections
  console.log("📄 Rendering content sections...");

  await Promise.all([
    renderSkills(),
    renderProjects(),
    renderAchievements(),
    renderPublications(),
    renderExperience()
    // renderTestimonials() // Uncomment when testimonials are ready
  ]);

  // Initialize micro-interactions AFTER content is loaded
  // This ensures tilt effects apply to dynamically rendered cards
  initScrollAnimations();
  initMicroInteractions();
  initCopyToClipboard();

  console.log("✅ Portfolio initialization complete!");
};

// ==================== DOCUMENT READY ====================

/**
 * Execute initialization when DOM is ready
 */
if (document.readyState === 'loading') {
  document.addEventListener("DOMContentLoaded", initPortfolio);
} else {
  initPortfolio();
}

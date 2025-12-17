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

// Content Renderers
import {
  renderSkills,
  renderProjects,
  renderAchievements,
  renderPublications,
  renderExperience
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

  // Initialize visual effects and animations
  initTypedText();
  initVisibilityHandler();
  initScrollAnimations();
  initParallax();
  initMicroInteractions();

  // Initialize form handling
  initContactForm();

  // Initialize dev tools protection
  initDevToolsProtection();

  // Render dynamic content sections
  console.log("📄 Rendering content sections...");

  await Promise.all([
    renderSkills(),
    renderProjects(),
    renderAchievements(),
    renderPublications(),
    renderExperience()
  ]);

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

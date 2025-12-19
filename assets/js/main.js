/**
 * Portfolio Main Entry Point
 * Initializes all modules and renders dynamic content
 * 
 * This file serves as the central orchestrator that imports
 * and initializes all modular components of the portfolio.
 */

// ==================== MODULE IMPORTS ====================
// Note: Version params ensure browser loads updated modules

// Navigation and UI
import { initNavigation } from './modules/navigation.js?v=4.0';
import { initScrollSpy, initSmoothScrolling } from './modules/scroll-spy.js?v=4.0';
import { initScrollAnimations, initParallax, initMicroInteractions, initSmoothScroll, initPageLoadAnimation } from './modules/animations.js?v=4.0';

// Forms and Interaction
import { initContactForm } from './modules/contact-form.js?v=4.0';
import { initTypedText } from './modules/typed-text.js?v=4.0';
import { initVisibilityHandler } from './modules/visibility.js?v=4.0';
import { initDevToolsProtection } from './modules/dev-tools.js?v=4.0';
import { initThemeToggle } from './modules/theme-toggle.js?v=4.0';
import { initCustomCursor } from './modules/cursor.js?v=4.0';
import { initCopyToClipboard } from './modules/toast.js?v=4.0';

// Content Renderers
import {
  renderSkills,
  renderProjects,
  renderAchievements,
  renderPublications,
  renderExperience
  // renderTestimonials - commented out until testimonials section is ready
} from './modules/renderers/index.js?v=4.0';

// Performance Optimization
import { ImageLazyLoader, LinkPrefetcher, ResourcePrioritizer } from './modules/performance.js?v=4.0';

// Register Service Worker for offline caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('✅ Service Worker registered:', reg.scope))
      .catch(err => console.warn('⚠️ Service Worker registration failed:', err));
  });
}

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

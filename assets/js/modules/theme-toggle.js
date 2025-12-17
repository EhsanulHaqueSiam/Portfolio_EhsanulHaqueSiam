/**
 * Theme Toggle Module
 * Handles dark/light theme switching with localStorage persistence
 */

const THEME_KEY = 'portfolio-theme';
const DARK_THEME = 'dark';
const LIGHT_THEME = 'light';

/**
 * Get the current theme from localStorage or system preference
 */
const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) {
        return savedTheme;
    }
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK_THEME : LIGHT_THEME;
};

/**
 * Apply theme to document
 */
const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);

    // Update toggle button icon
    const toggleBtn = document.getElementById('themeToggle');
    if (toggleBtn) {
        const icon = toggleBtn.querySelector('i');
        if (icon) {
            icon.className = theme === DARK_THEME ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
};

/**
 * Toggle between dark and light themes
 */
const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || LIGHT_THEME;
    const newTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
    applyTheme(newTheme);
};

/**
 * Create and inject the theme toggle button
 */
const createThemeToggle = () => {
    const header = document.querySelector('header');
    if (!header) return;

    // Create toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'themeToggle';
    toggleBtn.className = 'theme-toggle';
    toggleBtn.setAttribute('aria-label', 'Toggle dark mode');
    toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';

    // Add click handler
    toggleBtn.addEventListener('click', toggleTheme);

    // Insert before the menu toggle button
    const menuToggle = header.querySelector('#menu');
    if (menuToggle) {
        header.insertBefore(toggleBtn, menuToggle);
    } else {
        header.appendChild(toggleBtn);
    }
};

/**
 * Initialize theme system
 */
export const initThemeToggle = () => {
    // Apply preferred theme immediately (before page renders)
    const preferredTheme = getPreferredTheme();
    applyTheme(preferredTheme);

    // Create toggle button when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createThemeToggle);
    } else {
        createThemeToggle();
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(THEME_KEY)) {
            applyTheme(e.matches ? DARK_THEME : LIGHT_THEME);
        }
    });
};

export { toggleTheme, applyTheme };

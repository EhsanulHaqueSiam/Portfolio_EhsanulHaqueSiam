/**
 * Navigation Module
 * Handles menu toggle, scroll behavior, and scroll progress indicator
 */

let menu, navbar, scrollTopBtn, scrollProgress;

/**
 * Initialize navigation elements
 */
export const initNavigation = () => {
    menu = document.querySelector("#menu");
    navbar = document.querySelector(".navbar");
    scrollTopBtn = document.querySelector("#scroll-top");
    scrollProgress = document.querySelector("#scroll-progress");

    // Menu toggle
    if (menu) {
        menu.addEventListener("click", () => {
            menu.classList.toggle("fa-times");
            navbar.classList.toggle("nav-toggle");
        });
    }

    // Click outside to close menu
    document.addEventListener("click", (e) => {
        if (navbar && !navbar.contains(e.target) && !menu.contains(e.target)) {
            menu?.classList.remove("fa-times");
            navbar.classList.remove("nav-toggle");
        }
    });

    // Scroll event handler
    window.addEventListener("scroll", handleScroll);

    // Scroll to top button
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
};

/**
 * Handle scroll events for scroll-top button and progress bar
 */
const handleScroll = () => {
    // Scroll progress
    if (scrollProgress) {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight =
            document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        scrollProgress.style.width = scrollPercent + "%";
    }

    // Scroll-to-top button visibility
    if (scrollTopBtn) {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add("active");
        } else {
            scrollTopBtn.classList.remove("active");
        }
    }

    // Close mobile menu on scroll
    if (menu) {
        menu.classList.remove("fa-times");
    }
    if (navbar) {
        navbar.classList.remove("nav-toggle");
    }
};

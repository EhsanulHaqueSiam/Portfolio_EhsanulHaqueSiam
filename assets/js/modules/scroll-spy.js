/**
 * Scroll Spy Module
 * Handles highlighting active navigation items based on scroll position
 */

let scrollSpyTicking = false;

/**
 * Initialize scroll spy functionality
 * Highlights active nav link based on current scroll position
 */
export const initScrollSpy = () => {
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;

    const updateActiveLink = () => {
        const sections = document.querySelectorAll("section");

        sections.forEach(section => {
            const height = section.offsetHeight;
            const offset = section.offsetTop - 200;
            const top = window.scrollY;
            const id = section.getAttribute("id");

            if (top > offset && top < offset + height) {
                document.querySelectorAll(".navbar ul li a").forEach(link => {
                    link.classList.remove("active");
                });
                navbar.querySelector(`[href="#${id}"]`)?.classList.add("active");
            }
        });
    };

    // Throttled scroll handler
    window.addEventListener("scroll", () => {
        if (!scrollSpyTicking) {
            window.requestAnimationFrame(() => {
                updateActiveLink();
                scrollSpyTicking = false;
            });
            scrollSpyTicking = true;
        }
    }, { passive: true });

    window.addEventListener("load", updateActiveLink);
};

/**
 * Initialize smooth scrolling for anchor links
 */
export const initSmoothScrolling = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute("href"));
            target?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    });
};

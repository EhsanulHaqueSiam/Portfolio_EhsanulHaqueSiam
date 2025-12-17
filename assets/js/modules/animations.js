/**
 * Animations Module
 * Handles smooth scroll, parallax effects, and micro-animations
 */

/**
 * Initialize smooth scroll behavior
 */
export const initSmoothScroll = () => {
    // Add smooth scroll to CSS
    document.documentElement.style.scrollBehavior = 'smooth';

    // Handle anchor links with smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
};

/**
 * Initialize parallax effects
 */
export const initParallax = () => {
    const particles = document.getElementById('particles-js');
    const heroImage = document.querySelector('.home .image img');

    if (!particles && !heroImage) return;

    let ticking = false;

    const handleScroll = () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;

                // Parallax on particles (slower movement)
                if (particles && scrolled < window.innerHeight) {
                    particles.style.transform = `translateY(${scrolled * 0.3}px)`;
                }

                // Parallax on hero image (subtle float)
                if (heroImage && scrolled < window.innerHeight) {
                    heroImage.style.transform = `translateY(${scrolled * 0.15}px)`;
                }

                ticking = false;
            });
            ticking = true;
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
};

/**
 * Initialize scroll-triggered animations
 */
export const initScrollAnimations = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.skill-category, .box, .timeline-item, .contact-card, .publication-card'
    );

    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
};

/**
 * Add micro-interactions to buttons
 */
export const initMicroInteractions = () => {
    // Ripple effect on buttons
    document.querySelectorAll('.btn-ripple').forEach(button => {
        button.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.left = `${e.clientX - rect.left}px`;
            ripple.style.top = `${e.clientY - rect.top}px`;
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Magnetic effect on social icons
    document.querySelectorAll('.social-icons a').forEach(icon => {
        icon.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            this.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        icon.addEventListener('mouseleave', function () {
            this.style.transform = '';
        });
    });
};

/**
 * Initialize all animations
 */
export const initAllAnimations = () => {
    initSmoothScroll();
    initParallax();
    initScrollAnimations();
    initMicroInteractions();
};

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
 * Initialize scroll-triggered animations with stagger effect
 */
export const initScrollAnimations = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add stagger delay based on element index within its container
                const siblings = entry.target.parentElement?.children;
                let staggerIndex = 0;
                if (siblings) {
                    staggerIndex = Array.from(siblings).indexOf(entry.target);
                }
                entry.target.style.transitionDelay = `${staggerIndex * 0.1}s`;
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.skill-category, .box, .timeline-item, .contact-card, .publication-card, .award-card'
    );

    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
};

/**
 * Add micro-interactions to buttons and cards
 */
export const initMicroInteractions = () => {
    // Enhanced ripple effect on buttons
    document.querySelectorAll('.btn, button[type="submit"], .social-icons a').forEach(button => {
        button.classList.add('btn-ripple');
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

    // Tilt effect on project cards
    document.querySelectorAll('.box, .publication-card, .award-card').forEach(card => {
        card.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = '';
            this.style.transition = 'transform 0.5s ease';
        });

        card.addEventListener('mouseenter', function () {
            this.style.transition = 'transform 0.1s ease';
        });
    });

    // Magnetic effect on social icons
    document.querySelectorAll('.social-icons a').forEach(icon => {
        icon.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            this.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.1)`;
        });

        icon.addEventListener('mouseleave', function () {
            this.style.transform = '';
        });
    });

    // Underline hover effect on nav links
    document.querySelectorAll('.navbar a').forEach(link => {
        link.classList.add('underline-hover');
    });
};

/**
 * Initialize page load animation
 */
export const initPageLoadAnimation = () => {
    document.body.classList.add('page-transition');

    // Animate hero section elements on load
    const heroContent = document.querySelector('.home .content');
    const heroImage = document.querySelector('.home .image');

    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateX(-50px)';
        setTimeout(() => {
            heroContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateX(0)';
        }, 200);
    }

    if (heroImage) {
        heroImage.style.opacity = '0';
        heroImage.style.transform = 'translateX(50px)';
        setTimeout(() => {
            heroImage.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            heroImage.style.opacity = '1';
            heroImage.style.transform = 'translateX(0)';
        }, 400);
    }
};

/**
 * Initialize all animations
 */
export const initAllAnimations = () => {
    initPageLoadAnimation();
    initSmoothScroll();
    initParallax();
    initScrollAnimations();
    initMicroInteractions();
};

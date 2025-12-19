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
 * Initialize parallax effects (multi-layer)
 */
export const initParallax = () => {
    const particles = document.getElementById('particles-js');
    const heroImage = document.querySelector('.home .image img');
    const heroContent = document.querySelector('.home .content');
    const skillsSection = document.querySelector('.skills');

    let ticking = false;

    const handleScroll = () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const windowHeight = window.innerHeight;

                // Layer 1: Particles (slowest - creates depth)
                if (particles && scrolled < windowHeight) {
                    particles.style.transform = `translateY(${scrolled * 0.4}px)`;
                }

                // Layer 2: Hero image (medium speed)
                if (heroImage && scrolled < windowHeight) {
                    heroImage.style.transform = `translateY(${scrolled * 0.15}px) scale(${1 + scrolled * 0.0001})`;
                }

                // Layer 3: Hero content (subtle opposite direction)
                if (heroContent && scrolled < windowHeight) {
                    heroContent.style.transform = `translateY(${scrolled * -0.05}px)`;
                }

                // Section-specific parallax: Skills background
                if (skillsSection) {
                    const skillsTop = skillsSection.offsetTop;
                    const skillsOffset = scrolled - skillsTop + windowHeight;
                    if (skillsOffset > 0 && skillsOffset < skillsSection.offsetHeight + windowHeight) {
                        skillsSection.style.backgroundPosition = `center ${skillsOffset * 0.1}px`;
                    }
                }

                // About image parallax removed - now using VanillaTilt for 3D effect

                ticking = false;
            });
            ticking = true;
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial call to set positions
    handleScroll();
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

    // Throttled tilt effect on award cards only
    // Note: .work .box and .publications .box use VanillaTilt instead
    document.querySelectorAll('.award-card').forEach(card => {
        let ticking = false;

        card.addEventListener('mousemove', function (e) {
            if (ticking) return;
            ticking = true;

            requestAnimationFrame(() => {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                // Reduced rotation values for subtler, less laggy effect
                const rotateX = (y - centerY) / 30;
                const rotateY = (centerX - x) / 30;

                this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(5px)`;
                ticking = false;
            });
        }, { passive: true });

        card.addEventListener('mouseleave', function () {
            this.style.transform = '';
            this.style.transition = 'transform 0.5s ease';
        });

        card.addEventListener('mouseenter', function () {
            this.style.transition = 'transform 0.15s ease';
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

    // Initialize VanillaTilt for about section image
    const initAboutTilt = (retryCount = 0) => {
        console.log(`🔍 initAboutTilt attempt ${retryCount}, VanillaTilt available:`, typeof VanillaTilt !== 'undefined');

        if (typeof VanillaTilt !== 'undefined') {
            // Specifically target the About section image (not the hero image which also has .tilt)
            const aboutSection = document.querySelector('section.about, section#about');
            const aboutImage = aboutSection ? aboutSection.querySelector('img.tilt') : null;

            console.log(`🔍 About section found:`, !!aboutSection, 'About image found:', !!aboutImage);

            if (aboutImage && !aboutImage.vanillaTilt) {
                VanillaTilt.init(aboutImage, {
                    max: 15,
                    speed: 400,
                    scale: 1.05,
                    glare: true,
                    "max-glare": 0.2,
                    perspective: 1000
                });
                console.log('✅ VanillaTilt initialized on About image');
            } else if (!aboutImage && retryCount < 10) {
                // Retry if element not found yet (might be loading)
                setTimeout(() => initAboutTilt(retryCount + 1), 200);
            }
        } else if (retryCount < 20) {
            // Retry after a short delay if VanillaTilt isn't loaded yet
            setTimeout(() => initAboutTilt(retryCount + 1), 100);
        }
    };
    initAboutTilt();

    // Hero image glow effect on hover (fallback for browsers without CSS :has() support)
    const heroImage = document.querySelector('.home .image img');
    const heroImageContainer = document.querySelector('.home .image');
    if (heroImage && heroImageContainer) {
        heroImage.addEventListener('mouseenter', () => {
            heroImageContainer.classList.add('glow-active');
        });
        heroImage.addEventListener('mouseleave', () => {
            heroImageContainer.classList.remove('glow-active');
        });
    }
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
 * Initialize text reveal animation for headings
 */
export const initTextReveal = () => {
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add reveal class to all headings
    document.querySelectorAll('.heading').forEach(heading => {
        heading.classList.add('text-reveal-target');
        observer.observe(heading);
    });
};

/**
 * Animate a counter from 0 to target value
 */
const animateCounter = (element, target, duration = 2000) => {
    const start = 0;
    const startTime = performance.now();
    const suffix = element.dataset.suffix || '';
    const prefix = element.dataset.prefix || '';

    const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easeOut * target);

        element.textContent = prefix + current.toLocaleString() + suffix;

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = prefix + target.toLocaleString() + suffix;
        }
    };

    requestAnimationFrame(updateCounter);
};

/**
 * Initialize counter animations for statistics
 */
export const initCounterAnimations = () => {
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.count, 10);
                if (!isNaN(target)) {
                    animateCounter(entry.target, target);
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Find all elements with data-count attribute
    document.querySelectorAll('[data-count]').forEach(counter => {
        counter.classList.add('counter');
        observer.observe(counter);
    });
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
    initTextReveal();
    initCounterAnimations();
};

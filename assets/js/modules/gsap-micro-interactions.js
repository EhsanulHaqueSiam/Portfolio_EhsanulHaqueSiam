/**
 * GSAP Micro-Interactions Module
 * Premium animations for enhanced user experience
 * Use across all pages - homepage and subpages
 */

/**
 * Initialize all GSAP micro-interactions
 */
export const initGSAPMicroInteractions = () => {
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded, skipping micro-interactions');
        return;
    }

    console.log('✨ Initializing GSAP Micro-interactions');

    // Core animations
    initButtonHoverEffects();
    initCardRevealAnimations();
    initMagneticButtons();
    initSectionTitleAnimations();
    initFloatingElements();
    initContactCardAnimations();
    initSkillBadgeAnimations();
    initTimelineAnimations();

    // NEW: Additional premium animations
    initHeroAnimations();
    initSocialIconHover();
    initNavbarHover();
    initScrollIndicatorAnimation();
    initEducationCardAnimations();
    initFooterAnimations();
    initImageRevealAnimations();
    initGitHubStatsAnimations();
    initFormInputAnimations();
    initTagHoverEffects();
    initScrollProgressAnimation();
    initParallaxSections();

    console.log('✅ GSAP Micro-interactions initialized');
};

/**
 * Premium button hover effects
 */
const initButtonHoverEffects = () => {
    const buttons = document.querySelectorAll('.btn, .btn-primary, .btn-secondary, .viewall .btn, .morebtn .btn');

    buttons.forEach(btn => {
        // Create shine overlay if not exists
        if (!btn.querySelector('.btn-shine')) {
            const shine = document.createElement('div');
            shine.className = 'btn-shine';
            shine.style.cssText = `
                position: absolute;
                top: 0;
                left: -100%;
                width: 50%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                pointer-events: none;
            `;
            btn.style.position = 'relative';
            btn.style.overflow = 'hidden';
            btn.appendChild(shine);
        }

        const shine = btn.querySelector('.btn-shine');

        btn.addEventListener('mouseenter', () => {
            gsap.to(shine, {
                left: '100%',
                duration: 0.5,
                ease: 'power2.out'
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.set(shine, { left: '-100%' });
        });
    });
};

/**
 * Card reveal animations with stagger
 */
const initCardRevealAnimations = () => {
    if (!window.ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);

    // Project cards
    const cardContainers = document.querySelectorAll('#work .box-container, #publications .box-container, #award .box-container');

    cardContainers.forEach(container => {
        const cards = container.querySelectorAll('.box');

        if (cards.length === 0) return;

        gsap.fromTo(cards,
            { y: 40, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: container,
                    start: 'top 80%',
                    once: true
                }
            }
        );
    });
};

/**
 * Magnetic button effect on View All buttons
 */
const initMagneticButtons = () => {
    const magneticButtons = document.querySelectorAll('.viewall .btn, .morebtn .btn, .btn-view-paper, .back-btn .btn');

    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.5)'
            });
        });
    });
};

/**
 * Section title animations
 */
const initSectionTitleAnimations = () => {
    if (!window.ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);

    const headings = document.querySelectorAll('.heading');

    headings.forEach(heading => {
        // Icon bounce animation
        const icon = heading.querySelector('i');
        if (icon) {
            gsap.fromTo(icon,
                { scale: 0, rotate: -180 },
                {
                    scale: 1,
                    rotate: 0,
                    duration: 0.6,
                    ease: 'back.out(2)',
                    scrollTrigger: {
                        trigger: heading,
                        start: 'top 80%',
                        once: true
                    }
                }
            );
        }
    });
};

/**
 * Floating animation for decorative elements
 */
const initFloatingElements = () => {
    // Hero availability badge
    const availabilityBadge = document.querySelector('.availability-badge');
    if (availabilityBadge) {
        gsap.to(availabilityBadge, {
            y: -5,
            duration: 2,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1
        });
    }

    // Pulse dot glow animation
    const pulseDots = document.querySelectorAll('.pulse-dot');
    pulseDots.forEach(dot => {
        gsap.to(dot, {
            boxShadow: '0 0 20px 5px rgba(34, 197, 94, 0.6)',
            duration: 1,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1
        });
    });

    // Contact cards subtle hover enhancement
    const contactCards = document.querySelectorAll('.contact-card');
    contactCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                scale: 1.02,
                y: -5,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                scale: 1,
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
};

/**
 * Contact card arrow animation on hover
 */
const initContactCardAnimations = () => {
    const contactCards = document.querySelectorAll('.contact-card');

    contactCards.forEach(card => {
        const arrow = card.querySelector('.contact-arrow');
        if (!arrow) return;

        card.addEventListener('mouseenter', () => {
            gsap.to(arrow, {
                x: 5,
                duration: 0.3,
                ease: 'power2.out',
                yoyo: true,
                repeat: 1
            });
        });
    });
};

/**
 * Skill badges pop-in animation
 */
const initSkillBadgeAnimations = () => {
    if (!window.ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);

    const skillBars = document.querySelectorAll('.skills .bar');

    if (skillBars.length === 0) return;

    gsap.fromTo(skillBars,
        { scale: 0.8, opacity: 0, y: 20 },
        {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: 'back.out(1.5)',
            scrollTrigger: {
                trigger: '#skills',
                start: 'top 70%',
                once: true
            }
        }
    );
};

/**
 * Timeline animations for Experience section
 */
const initTimelineAnimations = () => {
    if (!window.ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);

    const timelineItems = document.querySelectorAll('.timeline-item, .experience .box');

    if (timelineItems.length === 0) return;

    timelineItems.forEach((item, index) => {
        const isLeft = index % 2 === 0;

        gsap.fromTo(item,
            {
                x: isLeft ? -50 : 50,
                opacity: 0
            },
            {
                x: 0,
                opacity: 1,
                duration: 0.6,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    once: true
                }
            }
        );
    });
};

/**
 * Hero section entrance animations
 */
const initHeroAnimations = () => {
    const heroSection = document.querySelector('.home');
    if (!heroSection) return;

    // Animate hero content elements with stagger
    const heroElements = heroSection.querySelectorAll('.content > *, .image');

    gsap.fromTo(heroElements,
        { y: 30, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            delay: 0.3
        }
    );
};

/**
 * Social icon hover effects
 */
const initSocialIconHover = () => {
    const socialIcons = document.querySelectorAll('.social-icons a, .footer-social-link');

    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            gsap.to(icon, {
                scale: 1.2,
                y: -3,
                duration: 0.3,
                ease: 'back.out(2)'
            });

            // Rotate icon inside
            const iconEl = icon.querySelector('i');
            if (iconEl) {
                gsap.to(iconEl, {
                    rotate: 15,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });

        icon.addEventListener('mouseleave', () => {
            gsap.to(icon, {
                scale: 1,
                y: 0,
                duration: 0.4,
                ease: 'elastic.out(1, 0.5)'
            });

            const iconEl = icon.querySelector('i');
            if (iconEl) {
                gsap.to(iconEl, {
                    rotate: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });
    });
};

/**
 * Navbar link hover effects
 */
const initNavbarHover = () => {
    const navLinks = document.querySelectorAll('.navbar a');

    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            gsap.to(link, {
                y: -2,
                duration: 0.2,
                ease: 'power2.out'
            });
        });

        link.addEventListener('mouseleave', () => {
            gsap.to(link, {
                y: 0,
                duration: 0.3,
                ease: 'elastic.out(1, 0.5)'
            });
        });
    });
};

/**
 * Scroll indicator bounce animation
 */
const initScrollIndicatorAnimation = () => {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (!scrollIndicator) return;

    const arrow = scrollIndicator.querySelector('.scroll-arrow');
    if (arrow) {
        gsap.to(arrow, {
            y: 10,
            duration: 0.8,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1
        });
    }
};

/**
 * Education card animations - Staggered scale reveal
 */
const initEducationCardAnimations = () => {
    if (!window.ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);

    const educationBoxes = document.querySelectorAll('#education .box');

    // Staggered reveal with scale and fade
    gsap.fromTo(educationBoxes,
        {
            y: 50,
            opacity: 0,
            scale: 0.95
        },
        {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.7,
            stagger: 0.2,
            ease: 'back.out(1.2)',
            scrollTrigger: {
                trigger: '#education',
                start: 'top 70%',
                once: true
            }
        }
    );
};

/**
 * Footer animations
 */
const initFooterAnimations = () => {
    if (!window.ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);

    const footerCols = document.querySelectorAll('.footer-col');

    gsap.fromTo(footerCols,
        { y: 40, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.footer',
                start: 'top 90%',
                once: true
            }
        }
    );

    // Footer tags hover
    const footerTags = document.querySelectorAll('.footer-tag');
    footerTags.forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            gsap.to(tag, {
                scale: 1.1,
                duration: 0.2,
                ease: 'back.out(2)'
            });
        });

        tag.addEventListener('mouseleave', () => {
            gsap.to(tag, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
};

/**
 * Image reveal animations
 */
const initImageRevealAnimations = () => {
    if (!window.ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);

    // Education and About images
    const revealImages = document.querySelectorAll('.education .image img, .about .image img');

    revealImages.forEach(img => {
        gsap.fromTo(img,
            { clipPath: 'inset(100% 0 0 0)', opacity: 0.5 },
            {
                clipPath: 'inset(0% 0 0 0)',
                opacity: 1,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: img,
                    start: 'top 80%',
                    once: true
                }
            }
        );
    });
};

/**
 * GitHub stats card animations
 */
const initGitHubStatsAnimations = () => {
    if (!window.ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);

    const statCards = document.querySelectorAll('.github-stat-card');

    gsap.fromTo(statCards,
        { scale: 0.9, opacity: 0, y: 30 },
        {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: 'back.out(1.5)',
            scrollTrigger: {
                trigger: '.github-stats-container',
                start: 'top 80%',
                once: true
            }
        }
    );
};

/**
 * Form input focus animations
 */
const initFormInputAnimations = () => {
    const inputs = document.querySelectorAll('input, textarea, select');

    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            gsap.to(input, {
                scale: 1.02,
                boxShadow: '0 0 20px rgba(115, 3, 167, 0.3)',
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        input.addEventListener('blur', () => {
            gsap.to(input, {
                scale: 1,
                boxShadow: 'none',
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
};

/**
 * Tag hover effects
 */
const initTagHoverEffects = () => {
    const tags = document.querySelectorAll('.tag, .tag-btn, .skill-tag');

    tags.forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            gsap.to(tag, {
                y: -3,
                scale: 1.05,
                duration: 0.2,
                ease: 'power2.out'
            });
        });

        tag.addEventListener('mouseleave', () => {
            gsap.to(tag, {
                y: 0,
                scale: 1,
                duration: 0.3,
                ease: 'elastic.out(1, 0.5)'
            });
        });
    });
};

/**
 * Scroll progress bar animation
 */
const initScrollProgressAnimation = () => {
    const progressBar = document.getElementById('scroll-progress');
    if (!progressBar) return;

    // Animate on scroll
    gsap.to(progressBar, {
        width: '100%',
        ease: 'none',
        scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.3
        }
    });
};

/**
 * Parallax sections on scroll
 */
const initParallaxSections = () => {
    if (!window.ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);

    // Parallax for section backgrounds
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const bg = section.querySelector('.wave-divider, .section-bg');
        if (!bg) return;

        gsap.to(bg, {
            y: 50,
            ease: 'none',
            scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    });
};

/**
 * Count-up animation for metrics (case study, stats)
 */
export const animateCountUp = (element, target, duration = 1.5) => {
    if (typeof gsap === 'undefined') return;

    const obj = { value: 0 };

    gsap.to(obj, {
        value: target,
        duration: duration,
        ease: 'power2.out',
        onUpdate: () => {
            element.textContent = Math.round(obj.value).toLocaleString();
        }
    });
};

/**
 * Stagger reveal for lists
 */
export const staggerReveal = (selector, options = {}) => {
    if (typeof gsap === 'undefined') return;

    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) return;

    gsap.fromTo(elements,
        { y: 20, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: options.duration || 0.4,
            stagger: options.stagger || 0.1,
            ease: options.ease || 'power2.out',
            delay: options.delay || 0
        }
    );
};

/**
 * Text scramble effect for elements
 */
export const textScramble = (element, finalText) => {
    if (typeof gsap === 'undefined') return;

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let iteration = 0;

    const interval = setInterval(() => {
        element.textContent = finalText
            .split('')
            .map((letter, index) => {
                if (index < iteration) {
                    return finalText[index];
                }
                return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');

        if (iteration >= finalText.length) {
            clearInterval(interval);
        }

        iteration += 1 / 3;
    }, 30);
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGSAPMicroInteractions);
} else {
    // Small delay to ensure GSAP is loaded
    setTimeout(initGSAPMicroInteractions, 100);
}

export default {
    init: initGSAPMicroInteractions,
    animateCountUp,
    staggerReveal,
    textScramble
};


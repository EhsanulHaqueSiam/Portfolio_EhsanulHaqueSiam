/**
 * Premium Scroll Effects Module
 * Combines Scrollama reliable detection with Locomotive-style premium visual effects
 * Features: Parallax, section reveals, smooth opacity transitions, velocity-based effects
 */

let scrollamaInstance = null;
let currentSection = null;
let scrollVelocity = 0;
let lastScrollY = 0;
let velocityTimer = null;

// Section color themes for premium feel
const sectionThemes = {
    'home': { primary: '#7303a7', accent: '#ffd700', gradient: 'linear-gradient(135deg, #7303a7, #2506ad)' },
    'about': { primary: '#2506ad', accent: '#ff7b00', gradient: 'linear-gradient(135deg, #2506ad, #7303a7)' },
    'skills': { primary: '#7303a7', accent: '#ffae00', gradient: 'linear-gradient(135deg, #7303a7, #ff7b00)' },
    'education': { primary: '#4a00e0', accent: '#ffd700', gradient: 'linear-gradient(135deg, #4a00e0, #7303a7)' },
    'publications': { primary: '#6b21a8', accent: '#f59e0b', gradient: 'linear-gradient(135deg, #6b21a8, #2506ad)' },
    'work': { primary: '#7c3aed', accent: '#ff7b00', gradient: 'linear-gradient(135deg, #7c3aed, #6366f1)' },
    'award': { primary: '#ffd700', accent: '#7303a7', gradient: 'linear-gradient(135deg, #ffd700, #ff7b00)' },
    'experience': { primary: '#8b5cf6', accent: '#f97316', gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
    'video': { primary: '#6366f1', accent: '#fcd34d', gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
    'contact': { primary: '#ff7b00', accent: '#7303a7', gradient: 'linear-gradient(135deg, #ff7b00, #ffd700)' }
};

/**
 * Initialize premium parallax effects on elements
 */
const initParallaxElements = () => {
    if (!window.gsap || !window.ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);

    // Section headings - elegant slide (no opacity fade to prevent flicker)
    document.querySelectorAll('.heading').forEach(heading => {
        gsap.fromTo(heading,
            { y: 30 },
            {
                y: 0,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: heading,
                    start: "top 85%",
                    end: "top 40%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    // Cards and boxes - staggered reveal with 3D (no opacity to prevent flicker)
    document.querySelectorAll('#work .box, #publications .box, #award .box, #education .box, .skill-category, .github-stat-card').forEach((box, index) => {
        gsap.fromTo(box,
            {
                y: 40,
                rotationX: 3,
                transformPerspective: 1000
            },
            {
                y: 0,
                rotationX: 0,
                duration: 0.6,
                ease: "power3.out",
                delay: (index % 4) * 0.08,
                scrollTrigger: {
                    trigger: box,
                    start: "top 90%",
                    toggleActions: "play none none none"
                }
            }
        );
    });

    // Images - subtle scale effect (exclude profile images)
    document.querySelectorAll('section img:not(.lazyload):not(.tilt):not(.about img)').forEach(img => {
        // Skip if already animated or in About section
        if (img.closest('.about') || img.closest('.image')) return;

        gsap.fromTo(img,
            { scale: 1.05 },
            {
                scale: 1,
                duration: 1.2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: img,
                    start: "top 80%",
                    end: "top 30%",
                    scrub: 0.5
                }
            }
        );
    });

    console.log('✅ Premium parallax effects initialized');
};

/**
 * Create velocity-based scroll effects (Locomotive-style)
 */
const initVelocityEffects = () => {
    if (!window.gsap) return;

    // Track scroll velocity
    const updateVelocity = () => {
        const currentY = window.scrollY;
        scrollVelocity = currentY - lastScrollY;
        lastScrollY = currentY;

        // Apply velocity-based skew to elements
        const skewAmount = Math.min(Math.max(scrollVelocity * 0.05, -3), 3);

        document.querySelectorAll('[data-scroll-skew]').forEach(el => {
            gsap.to(el, {
                skewY: skewAmount,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        // Apply velocity-based scale to progress indicator
        const progressFill = document.getElementById('section-progress-fill');
        if (progressFill) {
            const scaleX = 1 + Math.abs(scrollVelocity) * 0.002;
            gsap.to(progressFill, {
                scaleX: Math.min(scaleX, 1.5),
                duration: 0.2,
                ease: "power2.out"
            });
        }

        // Reset after scrolling stops
        clearTimeout(velocityTimer);
        velocityTimer = setTimeout(() => {
            document.querySelectorAll('[data-scroll-skew]').forEach(el => {
                gsap.to(el, { skewY: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
            });
            if (progressFill) {
                gsap.to(progressFill, { scaleX: 1, duration: 0.4, ease: "power2.out" });
            }
        }, 100);
    };

    window.addEventListener('scroll', updateVelocity, { passive: true });
    console.log('✅ Velocity-based scroll effects initialized');
};

/**
 * Premium section enter/leave animations with Scrollama
 */
const initScrollamaPremium = () => {
    if (typeof scrollama === 'undefined') {
        console.warn('Scrollama not loaded, skipping premium scroll effects');
        return;
    }

    scrollamaInstance = scrollama();

    scrollamaInstance
        .setup({
            step: 'section[id]:not(.footer)',
            offset: 0.5,
            progress: true,
            debug: false
        })
        .onStepEnter(response => {
            const sectionId = response.element.getAttribute('id');
            const theme = sectionThemes[sectionId] || sectionThemes['home'];

            // Premium section enter - just add class, no opacity animation to prevent flicker
            response.element.classList.add('section-active');

            // Update CSS custom properties for theme colors
            document.documentElement.style.setProperty('--current-section-primary', theme.primary);
            document.documentElement.style.setProperty('--current-section-accent', theme.accent);

            // Animate section indicator with premium effect
            const activeDot = document.querySelector(`.section-indicator__dot[data-section="${sectionId}"]`);
            if (activeDot) {
                const pulse = activeDot.querySelector('.section-indicator__pulse');
                if (pulse) {
                    gsap.fromTo(pulse,
                        { scale: 0.5, opacity: 1 },
                        {
                            scale: 2,
                            opacity: 0,
                            duration: 0.8,
                            ease: "power2.out"
                        }
                    );
                }
            }

            currentSection = sectionId;
            response.element.classList.add('section-in-view');

            // Dispatch custom event for other modules
            window.dispatchEvent(new CustomEvent('sectionChange', {
                detail: { section: sectionId, theme }
            }));
        })
        .onStepExit(response => {
            response.element.classList.remove('section-in-view');
            response.element.classList.remove('section-active');
            // No opacity animation to prevent flicker
        })
        .onStepProgress(response => {
            const progress = response.progress;
            const element = response.element;

            // Parallax effect based on scroll progress
            if (window.gsap) {
                const heading = element.querySelector('.heading');
                if (heading) {
                    // Subtle parallax on headings
                    gsap.to(heading, {
                        y: (0.5 - progress) * 20,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            }

            // Update progress bar with smooth interpolation
            updateScrollProgress();
        });

    // Handle resize
    window.addEventListener('resize', () => {
        if (scrollamaInstance) {
            scrollamaInstance.resize();
        }
    }, { passive: true });

    console.log('✅ Scrollama premium effects initialized');
};

/**
 * Update scroll progress with smooth animation
 */
const updateScrollProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min((scrollTop / docHeight) * 100, 100);

    const progressFill = document.getElementById('section-progress-fill');
    if (progressFill && window.gsap) {
        gsap.to(progressFill, {
            height: `${progress}%`,
            duration: 0.1,
            ease: "none"
        });
    }
};

/**
 * Add premium CSS for scroll effects
 */
const addPremiumStyles = () => {
    if (document.getElementById('premium-scroll-styles')) return;

    const style = document.createElement('style');
    style.id = 'premium-scroll-styles';
    style.textContent = `
        /* Premium Section Transitions - minimal to avoid layout issues */
        section.section-in-view {
            /* Just add class, don't force opacity */
        }

        /* Smooth heading parallax */
        .heading {
            will-change: transform;
            transform-style: preserve-3d;
        }

        /* Premium scroll velocity skew effect */
        [data-scroll-skew] {
            will-change: transform;
            transform-origin: center center;
        }

        /* Enhanced progress indicator */
        .section-indicator__progress-fill {
            will-change: transform, height;
            transform-origin: top center;
            transition: background 0.3s ease;
            background: var(--current-section-primary, #7303a7);
        }

        /* Theme-aware accent glow */
        .section-indicator__dot.active .section-indicator__dot-inner {
            box-shadow: 0 0 20px var(--current-section-primary, #7303a7),
                        0 0 40px var(--current-section-accent, #ffd700);
        }

        /* Smooth card reveal - only for specific sections */
        #work .box, #publications .box, #education .box, #award .box,
        .skill-category, .github-stat-card {
            will-change: transform;
            transform-style: preserve-3d;
        }

        /* Premium image reveal - exclude about images */
        section img:not(.tilt) {
            will-change: transform;
        }

        /* Locomotive-style text reveal line */
        @keyframes lineReveal {
            from {
                transform: scaleX(0);
            }
            to {
                transform: scaleX(1);
            }
        }

        .section-in-view .heading::after {
            animation: lineReveal 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
            section,
            .heading,
            [data-scroll-skew],
            .box,
            .skill-category,
            section img {
                transition: none !important;
                animation: none !important;
                will-change: auto !important;
            }
        }
    `;

    document.head.appendChild(style);
    console.log('✅ Premium scroll styles added');
};

/**
 * Initialize all premium scroll effects
 */
export const initPremiumScrollEffects = () => {
    // Add premium styles first
    addPremiumStyles();

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initScrollamaPremium();
            initParallaxElements();
            initVelocityEffects();
        });
    } else {
        initScrollamaPremium();
        initParallaxElements();
        initVelocityEffects();
    }

    console.log('🚀 Premium scroll effects module loaded');
};

// Auto-initialize on load
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        // Small delay to ensure all libraries are ready
        setTimeout(initPremiumScrollEffects, 100);
    });
}

export default initPremiumScrollEffects;

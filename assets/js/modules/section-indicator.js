/**
 * Section Progress Indicator Module - GSAP Enhanced
 * Shows which section the user is currently viewing with smooth GSAP animations
 */

let sectionIndicator = null;
let sections = [];
let currentActiveIndex = -1;

// Section icons mapping
const sectionIcons = {
    'home': 'fa-home',
    'about': 'fa-user',
    'skills': 'fa-code',
    'education': 'fa-graduation-cap',
    'publications': 'fa-book-open',
    'work': 'fa-laptop-code',
    'award': 'fa-trophy',
    'experience': 'fa-briefcase',
    'video': 'fa-play-circle',
    'contact': 'fa-envelope'
};

// Section display names
const sectionNames = {
    'home': 'Home',
    'about': 'About',
    'skills': 'Skills',
    'education': 'Education',
    'publications': 'Publications',
    'work': 'Projects',
    'award': 'Awards',
    'experience': 'Experience',
    'video': 'Journey',
    'contact': 'Contact'
};

/**
 * Create the section indicator HTML
 */
const createIndicatorHTML = () => {
    // Get all sections except footer (footer is not a content section)
    sections = Array.from(document.querySelectorAll('section[id]:not(.footer)'));
    if (sections.length === 0) return null;

    const indicator = document.createElement('aside');
    indicator.className = 'section-indicator';
    indicator.id = 'section-indicator';
    indicator.setAttribute('aria-label', 'Section navigation');

    // Create progress line
    const progressLine = document.createElement('div');
    progressLine.className = 'section-indicator__progress';
    progressLine.innerHTML = '<div class="section-indicator__progress-fill" id="section-progress-fill"></div>';
    indicator.appendChild(progressLine);

    // Create dots container
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'section-indicator__dots';

    sections.forEach((section, index) => {
        const id = section.getAttribute('id');
        const name = sectionNames[id] || id.charAt(0).toUpperCase() + id.slice(1);
        const icon = sectionIcons[id] || 'fa-circle';

        const dot = document.createElement('a');
        dot.href = `#${id}`;
        dot.className = 'section-indicator__dot';
        dot.setAttribute('data-section', id);
        dot.setAttribute('data-index', index);
        dot.setAttribute('aria-label', `Navigate to ${name}`);
        dot.setAttribute('title', name);

        dot.innerHTML = `
            <span class="section-indicator__dot-inner">
                <i class="fas ${icon}"></i>
            </span>
            <span class="section-indicator__tooltip">${name}</span>
            <span class="section-indicator__pulse"></span>
        `;

        // GSAP-powered smooth scroll on click
        dot.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(`#${id}`);
            const targetIndex = index;

            if (target && window.gsap) {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: { y: target, offsetY: 80 },
                    ease: "power3.inOut",
                    onComplete: () => {
                        // Force update active section after scroll completes
                        currentActiveIndex = -1; // Reset to force update
                        updateActiveSection();
                    }
                });
            } else if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Force update after a delay
                setTimeout(() => {
                    currentActiveIndex = -1;
                    updateActiveSection();
                }, 500);
            }
        });

        dotsContainer.appendChild(dot);
    });

    indicator.appendChild(dotsContainer);

    // Add current section label
    const currentLabel = document.createElement('div');
    currentLabel.className = 'section-indicator__current';
    currentLabel.id = 'section-indicator-current';
    currentLabel.innerHTML = '<span class="section-indicator__current-text">Home</span>';
    indicator.appendChild(currentLabel);

    return indicator;
};

/**
 * Animate dot activation with GSAP
 */
const animateDotActivation = (dot, isActive) => {
    if (!window.gsap) return;

    const inner = dot.querySelector('.section-indicator__dot-inner');
    const pulse = dot.querySelector('.section-indicator__pulse');
    const icon = dot.querySelector('i');

    if (isActive) {
        // Activate animation
        gsap.to(inner, {
            scale: 1.2,
            duration: 0.4,
            ease: "back.out(1.7)"
        });

        gsap.to(icon, {
            color: "#fff",
            duration: 0.3,
            ease: "power2.out"
        });

        // Pulse animation
        if (pulse) {
            gsap.fromTo(pulse,
                { scale: 0.8, opacity: 0.8 },
                {
                    scale: 2,
                    opacity: 0,
                    duration: 1.5,
                    repeat: -1,
                    ease: "power2.out"
                }
            );
        }

        dot.classList.add('active');
    } else {
        // Deactivate animation
        gsap.to(inner, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
        });

        gsap.to(icon, {
            color: "rgba(200, 200, 200, 0.7)",
            duration: 0.3,
            ease: "power2.out"
        });

        // Stop pulse
        if (pulse) {
            gsap.killTweensOf(pulse);
            gsap.set(pulse, { scale: 0.8, opacity: 0 });
        }

        dot.classList.remove('active');
    }
};

/**
 * Update active section indicator with GSAP animations
 */
const updateActiveSection = () => {
    if (!sectionIndicator || sections.length === 0) return;

    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight - windowHeight;

    // Animate progress bar with GSAP
    const progress = Math.min((scrollTop / docHeight) * 100, 100);
    const progressFill = document.getElementById('section-progress-fill');
    if (progressFill && window.gsap) {
        gsap.to(progressFill, {
            height: `${progress}%`,
            duration: 0.3,
            ease: "power2.out"
        });
    }

    // Find current section
    let currentSection = null;
    let currentIndex = 0;
    // Use 0.5 (center of viewport) for better detection of bottom sections
    const viewportCenter = scrollTop + (windowHeight * 0.5);

    sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const sectionTop = scrollTop + rect.top;
        const sectionBottom = sectionTop + rect.height;

        if (viewportCenter >= sectionTop && viewportCenter < sectionBottom) {
            currentSection = section;
            currentIndex = index;
        }
    });

    // Check if contact section is visible (special case for footer)
    const contactSection = sections.find(s => s.getAttribute('id') === 'contact');
    if (contactSection) {
        const contactRect = contactSection.getBoundingClientRect();
        // If contact section is visible in viewport (any part), prioritize it when at bottom
        if (contactRect.top < windowHeight && contactRect.bottom > 0) {
            // Check if we're in the lower portion of the page
            if (scrollTop + windowHeight >= document.documentElement.scrollHeight - 200) {
                currentSection = contactSection;
                currentIndex = sections.indexOf(contactSection);
            }
        }
    }

    // Fallback to first or last section
    if (!currentSection) {
        if (scrollTop < 100) {
            currentSection = sections[0];
            currentIndex = 0;
        } else if (scrollTop + windowHeight >= document.documentElement.scrollHeight - 50) {
            // At the very bottom - prioritize the Contact section
            if (contactSection) {
                currentSection = contactSection;
                currentIndex = sections.indexOf(contactSection);
            } else {
                // Fallback to actual last section
                currentSection = sections[sections.length - 1];
                currentIndex = sections.length - 1;
            }
        } else {
            // Find section whose top is closest to being just above viewport center
            let bestMatch = null;
            let bestIndex = 0;
            let bestScore = -Infinity;

            sections.forEach((section, index) => {
                const rect = section.getBoundingClientRect();
                const sectionTop = scrollTop + rect.top;
                const sectionBottom = sectionTop + rect.height;

                // Section is in view if any part of it is visible
                if (sectionTop < scrollTop + windowHeight && sectionBottom > scrollTop) {
                    // Score based on how much of the section is in the top half of viewport
                    const visibleTop = Math.max(sectionTop, scrollTop);
                    const visibleBottom = Math.min(sectionBottom, scrollTop + windowHeight);
                    const score = (visibleBottom - visibleTop) + (index * 10); // Slight preference for lower sections

                    if (score > bestScore) {
                        bestScore = score;
                        bestMatch = section;
                        bestIndex = index;
                    }
                }
            });

            if (bestMatch) {
                currentSection = bestMatch;
                currentIndex = bestIndex;
            } else {
                currentSection = sections[sections.length - 1];
                currentIndex = sections.length - 1;
            }
        }
    }

    // Only update if section changed
    if (currentIndex !== currentActiveIndex) {
        currentActiveIndex = currentIndex;

        // Update dots with GSAP animations
        const dots = sectionIndicator.querySelectorAll('.section-indicator__dot');
        const currentId = currentSection?.getAttribute('id');

        dots.forEach((dot, index) => {
            const isActive = index === currentIndex;
            animateDotActivation(dot, isActive);
        });

        // Update current section label with animation
        const currentLabel = document.getElementById('section-indicator-current');
        if (currentLabel && currentSection && window.gsap) {
            const textEl = currentLabel.querySelector('.section-indicator__current-text');
            const name = sectionNames[currentId] || currentId;

            gsap.to(textEl, {
                opacity: 0,
                y: -10,
                duration: 0.2,
                ease: "power2.in",
                onComplete: () => {
                    textEl.textContent = name;
                    gsap.to(textEl, {
                        opacity: 1,
                        y: 0,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            });
        }
    }
};

/**
 * Show/hide indicator with GSAP
 */
const toggleVisibility = () => {
    if (!sectionIndicator || !window.gsap) return;

    const shouldShow = window.scrollY > 200;
    const isVisible = sectionIndicator.classList.contains('visible');

    if (shouldShow && !isVisible) {
        sectionIndicator.classList.add('visible');
        gsap.fromTo(sectionIndicator,
            { opacity: 0, x: 50 },
            {
                opacity: 1,
                x: 0,
                duration: 0.5,
                ease: "power3.out"
            }
        );

        // Stagger animate the dots in
        const dots = sectionIndicator.querySelectorAll('.section-indicator__dot');
        gsap.fromTo(dots,
            { opacity: 0, x: 20, scale: 0.5 },
            {
                opacity: 1,
                x: 0,
                scale: 1,
                duration: 0.4,
                stagger: 0.05,
                ease: "back.out(1.7)",
                delay: 0.2
            }
        );
    } else if (!shouldShow && isVisible) {
        gsap.to(sectionIndicator, {
            opacity: 0,
            x: 50,
            duration: 0.3,
            ease: "power3.in",
            onComplete: () => {
                sectionIndicator.classList.remove('visible');
            }
        });
    }
};

/**
 * Setup hover animations with GSAP
 */
const setupHoverAnimations = () => {
    if (!window.gsap) return;

    const dots = sectionIndicator.querySelectorAll('.section-indicator__dot');

    dots.forEach(dot => {
        const inner = dot.querySelector('.section-indicator__dot-inner');
        const tooltip = dot.querySelector('.section-indicator__tooltip');

        dot.addEventListener('mouseenter', () => {
            if (!dot.classList.contains('active')) {
                gsap.to(inner, {
                    scale: 1.15,
                    borderColor: "rgba(115, 3, 167, 0.6)",
                    duration: 0.3,
                    ease: "power2.out"
                });
            }

            gsap.to(tooltip, {
                opacity: 1,
                x: 0,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        dot.addEventListener('mouseleave', () => {
            if (!dot.classList.contains('active')) {
                gsap.to(inner, {
                    scale: 1,
                    borderColor: "rgba(150, 150, 150, 0.3)",
                    duration: 0.3,
                    ease: "power2.out"
                });
            }

            gsap.to(tooltip, {
                opacity: 0,
                x: 10,
                duration: 0.2,
                ease: "power2.in"
            });
        });
    });
};

/**
 * Initialize the section progress indicator with GSAP
 */
export const initSectionIndicator = () => {
    // Only show on pages with multiple sections
    if (document.querySelectorAll('section[id]').length < 3) return;

    // Wait for GSAP to be available
    if (!window.gsap) {
        console.warn('GSAP not loaded, section indicator will use CSS fallbacks');
    }

    // Register ScrollToPlugin if available
    if (window.gsap && window.ScrollToPlugin) {
        gsap.registerPlugin(ScrollToPlugin);
    }

    // Create and append the indicator
    sectionIndicator = createIndicatorHTML();
    if (!sectionIndicator) return;

    document.body.appendChild(sectionIndicator);

    // Setup hover animations
    setupHoverAnimations();

    // Use Scrollama for reliable section detection
    if (typeof scrollama !== 'undefined') {
        const scroller = scrollama();

        scroller
            .setup({
                step: 'section[id]:not(.footer)',
                offset: 0.5, // Trigger when section is in center of viewport
                progress: true,
                debug: false
            })
            .onStepEnter(response => {
                // Get the section ID and find its index
                const sectionId = response.element.getAttribute('id');
                const newIndex = sections.findIndex(s => s.getAttribute('id') === sectionId);

                if (newIndex !== -1 && newIndex !== currentActiveIndex) {
                    currentActiveIndex = newIndex;

                    // Update dots with GSAP animations
                    const dots = sectionIndicator.querySelectorAll('.section-indicator__dot');
                    dots.forEach((dot, index) => {
                        const isActive = index === newIndex;
                        animateDotActivation(dot, isActive);
                    });

                    // Update tooltip visibility
                    const currentDot = dots[newIndex];
                    if (currentDot) {
                        const tooltip = currentDot.querySelector('.section-indicator__tooltip');
                        if (tooltip && window.gsap) {
                            gsap.to(tooltip, {
                                opacity: 1,
                                x: 0,
                                duration: 0.3,
                                ease: "power2.out"
                            });
                            setTimeout(() => {
                                gsap.to(tooltip, {
                                    opacity: 0,
                                    x: 10,
                                    duration: 0.2
                                });
                            }, 1500);
                        }
                    }
                }
            })
            .onStepProgress(response => {
                // Update progress bar based on overall scroll position
                const scrollTop = window.scrollY;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const progress = Math.min((scrollTop / docHeight) * 100, 100);

                const progressFill = document.getElementById('section-progress-fill');
                if (progressFill && window.gsap) {
                    gsap.to(progressFill, {
                        height: `${progress}%`,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            });

        // Handle resize
        window.addEventListener('resize', scroller.resize, { passive: true });

        // Handle visibility toggle on scroll
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    toggleVisibility();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        console.log('✅ Section indicator initialized with Scrollama');
    } else {
        // Fallback to GSAP ScrollTrigger if Scrollama not available
        if (window.gsap && window.ScrollTrigger) {
            gsap.registerPlugin(ScrollTrigger);

            ScrollTrigger.create({
                trigger: document.body,
                start: "top top",
                end: "bottom bottom",
                onUpdate: () => {
                    updateActiveSection();
                    toggleVisibility();
                }
            });
            console.log('✅ Section indicator initialized with GSAP ScrollTrigger (fallback)');
        } else {
            // Pure JS fallback
            let ticking = false;
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        updateActiveSection();
                        toggleVisibility();
                        ticking = false;
                    });
                    ticking = true;
                }
            }, { passive: true });
            console.log('✅ Section indicator initialized with scroll events (fallback)');
        }
    }

    // Initial update
    window.addEventListener('load', () => {
        updateActiveSection();
        toggleVisibility();
    });

    // Handle resize
    window.addEventListener('resize', updateActiveSection, { passive: true });
};

/**
 * UI Enhancement Libraries Integration Module
 * Initializes: AOS, GLightbox, Swiper, Tippy, Pristine, Lenis, Splitting
 */

/**
 * Initialize AOS.js - Animate on Scroll
 */
export const initAOS = () => {
    if (typeof AOS === 'undefined') return;

    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 50,
        delay: 0,
        anchorPlacement: 'top-bottom',
        disable: 'mobile' // Disable on mobile for performance
    });

    console.log('✅ AOS.js initialized');
};

/**
 * Initialize GLightbox - Image Lightbox
 */
export const initGLightbox = () => {
    if (typeof GLightbox === 'undefined') return;

    const lightbox = GLightbox({
        selector: '.glightbox',
        touchNavigation: true,
        loop: true,
        autoplayVideos: true,
        openEffect: 'zoom',
        closeEffect: 'fade',
        cssEfects: {
            fade: { in: 'fadeIn', out: 'fadeOut' },
            zoom: { in: 'zoomIn', out: 'zoomOut' }
        }
    });

    console.log('✅ GLightbox initialized');
    return lightbox;
};

/**
 * Initialize Swiper.js - Touch Slider
 * Call this function with a container selector when needed
 */
export const initSwiper = (selector = '.swiper', options = {}) => {
    if (typeof Swiper === 'undefined') return null;

    const defaultOptions = {
        loop: true,
        speed: 600,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        },
        effect: 'slide',
        grabCursor: true
    };

    return new Swiper(selector, { ...defaultOptions, ...options });
};

/**
 * Initialize Tippy.js - Tooltips
 */
export const initTippy = () => {
    if (typeof tippy === 'undefined') return;

    // Initialize tooltips on elements with data-tippy-content
    tippy('[data-tippy-content]', {
        animation: 'scale',
        duration: [200, 150],
        arrow: true,
        theme: 'custom'
    });

    // Add tooltips to social icons
    tippy('.social-icons a', {
        animation: 'scale',
        duration: [200, 150],
        arrow: true,
        theme: 'custom',
        placement: 'bottom'
    });

    // Add tooltips to skill items
    tippy('.skill-item', {
        animation: 'scale',
        duration: [200, 150],
        arrow: true,
        theme: 'custom',
        placement: 'top',
        content: (reference) => reference.getAttribute('data-skill') || 'Skill'
    });

    console.log('✅ Tippy.js initialized');
};

/**
 * Initialize Pristine.js - Form Validation
 */
export const initPristine = () => {
    if (typeof Pristine === 'undefined') return null;

    const form = document.getElementById('contact-form');
    if (!form) return null;

    const pristine = new Pristine(form, {
        classTo: 'form-group',
        errorClass: 'has-error',
        successClass: 'has-success',
        errorTextParent: 'form-group',
        errorTextTag: 'span',
        errorTextClass: 'form-error'
    });

    // Override form submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (pristine.validate()) {
            // Form is valid, trigger existing submit handler
            form.dispatchEvent(new CustomEvent('validated-submit'));
        }
    });

    console.log('✅ Pristine.js initialized');
    return pristine;
};

/**
 * Initialize Lenis - Smooth Scroll
 */
export const initLenis = () => {
    if (typeof Lenis === 'undefined') return null;

    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 2
    });

    // Animation loop
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Integrate with GSAP ScrollTrigger if available
    if (typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
    }

    // Handle anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                lenis.scrollTo(target, { offset: -80 });
            }
        });
    });

    console.log('✅ Lenis smooth scroll initialized');
    return lenis;
};

/**
 * Initialize Splitting.js - Enhanced Text Effects with Scroll Triggers
 * Only for elements explicitly marked with data-splitting attribute
 * NOTE: Headings use the hacker-text effect instead, so we don't target them here
 */
export const initSplitting = () => {
    if (typeof Splitting === 'undefined') return;

    // Only split text for elements explicitly marked with data-splitting
    // Avoid targeting .heading to prevent conflict with hacker-text animations
    const results = Splitting({
        target: '[data-splitting]',
        by: 'chars'
    });

    // Setup Intersection Observer for scroll-triggered text reveal
    const textRevealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const el = entry.target;
                el.classList.add('text-revealed');

                // Animate each character with staggered delay
                const chars = el.querySelectorAll('.char');
                chars.forEach((char, i) => {
                    char.style.setProperty('--char-index', i);
                    char.style.animationDelay = `${i * 30}ms`;
                    char.classList.add('char-animate');
                });

                textRevealObserver.unobserve(el);
            }
        });
    }, { threshold: 0.3, rootMargin: '0px 0px -50px 0px' });

    // Observe all split elements
    results.forEach(result => {
        if (result.el) {
            // Initially hide characters
            result.el.classList.add('text-split-ready');
            textRevealObserver.observe(result.el);
        }
    });

    console.log('✅ Splitting.js initialized (for data-splitting elements only)');
};

/**
 * Add data attributes for AOS animations with enhanced stagger effects
 */
export const addAOSAttributes = () => {
    // Section titles - fade up
    document.querySelectorAll('.section-title').forEach((el, i) => {
        el.setAttribute('data-aos', 'fade-up');
        el.setAttribute('data-aos-delay', String(i * 100));
    });

    // Skill categories - staggered fade with scale
    document.querySelectorAll('.skill-category').forEach((el, i) => {
        el.setAttribute('data-aos', 'zoom-in-up');
        el.setAttribute('data-aos-delay', String(100 + i * 80));
    });

    // Project cards - staggered cascade reveal
    document.querySelectorAll('#work .box, .project-card').forEach((el, i) => {
        const row = Math.floor(i / 3);
        const col = i % 3;
        el.setAttribute('data-aos', 'fade-up');
        el.setAttribute('data-aos-delay', String(row * 100 + col * 60));
        el.setAttribute('data-aos-duration', '600');
    });

    // Publication cards - alternating slide-in from sides
    document.querySelectorAll('#publications .box, .publication-card').forEach((el, i) => {
        el.setAttribute('data-aos', i % 2 === 0 ? 'fade-right' : 'fade-left');
        el.setAttribute('data-aos-delay', String(i * 100));
        el.setAttribute('data-aos-duration', '500');
    });

    // Award cards - zoom cascade
    document.querySelectorAll('#award .box, .achievement-card').forEach((el, i) => {
        el.setAttribute('data-aos', 'zoom-in');
        el.setAttribute('data-aos-delay', String(i * 80));
        el.setAttribute('data-aos-duration', '500');
    });

    // Timeline items - slide from alternating sides
    document.querySelectorAll('.timeline-item, .experience .container').forEach((el, i) => {
        el.setAttribute('data-aos', i % 2 === 0 ? 'fade-right' : 'fade-left');
        el.setAttribute('data-aos-delay', String(i * 120));
    });

    // Contact cards - pop-in effect
    document.querySelectorAll('.contact-card').forEach((el, i) => {
        el.setAttribute('data-aos', 'zoom-in');
        el.setAttribute('data-aos-delay', String(i * 100));
    });

    // Footer columns - wave reveal from left
    document.querySelectorAll('.footer-col').forEach((el, i) => {
        el.setAttribute('data-aos', 'fade-up');
        el.setAttribute('data-aos-delay', String(i * 100));
    });

    // Education boxes - staggered fade
    document.querySelectorAll('.education .box').forEach((el, i) => {
        el.setAttribute('data-aos', 'fade-up');
        el.setAttribute('data-aos-delay', String(i * 150));
    });

    // Skills bars - staggered reveal
    document.querySelectorAll('.bar').forEach((el, i) => {
        el.setAttribute('data-aos', 'fade-right');
        el.setAttribute('data-aos-delay', String(50 + i * 40));
    });
};

/**
 * Initialize CountUp.js - Animated Number Counters
 */
export const initCountUp = () => {
    if (typeof countUp === 'undefined' && typeof CountUp === 'undefined') return;

    const CountUpClass = window.countUp?.CountUp || window.CountUp;
    if (!CountUpClass) return;

    // Find elements with data-countup attribute
    document.querySelectorAll('[data-countup]').forEach((el) => {
        const endValue = parseFloat(el.getAttribute('data-countup'));
        const suffix = el.getAttribute('data-suffix') || '';
        const prefix = el.getAttribute('data-prefix') || '';

        const counter = new CountUpClass(el, endValue, {
            duration: 2.5,
            suffix: suffix,
            prefix: prefix,
            enableScrollSpy: true,
            scrollSpyOnce: true
        });

        if (!counter.error) {
            counter.start();
        }
    });

    console.log('✅ CountUp.js initialized');
};

/**
 * Initialize Atropos.js - 3D Tilt Effects
 * DISABLED on About section - Vanilla Tilt handles it instead and Atropos breaks the grid layout
 */
export const initAtropos = () => {
    if (typeof Atropos === 'undefined') return;

    // NOTE: Atropos is NOT applied to About section anymore
    // The About image uses the simpler .tilt class with Vanilla Tilt
    // Atropos was wrapping elements in nested divs that broke the CSS grid

    console.log('✅ Atropos.js loaded (not applied to avoid layout issues)');
};

/**
 * Initialize Plyr.js - Video Player
 */
export const initPlyr = () => {
    if (typeof Plyr === 'undefined') return;

    // Initialize on video elements
    const players = Plyr.setup('.plyr-video, video.plyr', {
        controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
        autoplay: false,
        muted: true,
        hideControls: true,
        clickToPlay: true
    });

    console.log('✅ Plyr.js initialized');
    return players;
};

/**
 * Initialize Rellax.js - Parallax Scrolling
 */
export const initRellax = () => {
    if (typeof Rellax === 'undefined') return null;

    // Add parallax class to background elements
    document.querySelectorAll('.parallax-bg, [data-rellax-speed]').forEach((el) => {
        if (!el.classList.contains('rellax')) {
            el.classList.add('rellax');
        }
    });

    // Only initialize if there are rellax elements to prevent console warning
    const rellaxElements = document.querySelectorAll('.rellax');
    if (rellaxElements.length === 0) {
        // No elements to parallax - skip silently
        return null;
    }

    const rellax = new Rellax('.rellax', {
        speed: -2,
        center: true,
        wrapper: null,
        round: true,
        vertical: true,
        horizontal: false
    });

    console.log('✅ Rellax.js initialized');
    return rellax;
};

/**
 * Trigger Confetti Celebration
 */
export const triggerConfetti = () => {
    if (typeof confetti === 'undefined') return;

    // Fire multiple confetti bursts
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
        confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#ff7b00', '#7303a7', '#ffd700', '#00ff88']
        });
        confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#ff7b00', '#7303a7', '#ffd700', '#00ff88']
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    };
    frame();

    console.log('🎉 Confetti triggered!');
};

/**
 * Initialize Anime.js Hero Animations
 */
export const initAnimeHero = () => {
    if (typeof anime === 'undefined') return;

    // Animate hero title letters (if Splitting.js has split them)
    anime({
        targets: '.hero .title .char',
        opacity: [0, 1],
        translateY: [40, 0],
        rotateX: [-90, 0],
        delay: anime.stagger(50, { start: 500 }),
        easing: 'easeOutExpo',
        duration: 1200
    });

    // Animate hero subtitle
    anime({
        targets: '.hero .subtitle, .hero .typed-text-wrapper',
        opacity: [0, 1],
        translateY: [30, 0],
        delay: 1200,
        duration: 800,
        easing: 'easeOutQuad'
    });

    // Animate hero buttons
    anime({
        targets: '.hero .btn, .hero .social-icons a',
        opacity: [0, 1],
        translateY: [20, 0],
        delay: anime.stagger(100, { start: 1500 }),
        duration: 600,
        easing: 'easeOutQuad'
    });

    // Animate hero image
    anime({
        targets: '.hero .image img',
        opacity: [0, 1],
        scale: [0.8, 1],
        delay: 800,
        duration: 1000,
        easing: 'easeOutElastic(1, .5)'
    });

    console.log('✅ Anime.js hero animations initialized');
};

/**
 * Add Hover.css classes to buttons
 */
export const addHoverClasses = () => {
    // Add hover effects to primary buttons
    document.querySelectorAll('.btn').forEach((btn) => {
        if (!btn.classList.contains('hvr-sweep-to-right')) {
            btn.classList.add('hvr-sweep-to-right');
        }
    });

    // Add hover effects to social icons
    document.querySelectorAll('.social-icons a, .footer-social-link').forEach((icon) => {
        if (!icon.classList.contains('hvr-float')) {
            icon.classList.add('hvr-float');
        }
    });

    console.log('✅ Hover.css classes added');
};

/**
 * Setup confetti on form success
 */
const setupFormConfetti = () => {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('validated-submit', () => {
        // Trigger confetti after a brief delay
        setTimeout(() => {
            triggerConfetti();
        }, 500);
    });

    console.log('✅ Form confetti setup complete');
};

// ==================== PHASE 3 LIBRARIES ====================

/**
 * Global Notyf instance for toast notifications
 */
let notyfInstance = null;

/**
 * Initialize Notyf - Toast Notifications
 */
export const initNotyf = () => {
    if (typeof Notyf === 'undefined') return null;

    notyfInstance = new Notyf({
        duration: 4000,
        position: { x: 'right', y: 'top' },
        dismissible: true,
        ripple: true,
        types: [
            {
                type: 'success',
                background: 'linear-gradient(135deg, #00ff88, #00d4aa)',
                icon: { className: 'fas fa-check-circle', tagName: 'i' }
            },
            {
                type: 'error',
                background: 'linear-gradient(135deg, #ff4757, #ff6b81)',
                icon: { className: 'fas fa-exclamation-circle', tagName: 'i' }
            },
            {
                type: 'info',
                background: 'linear-gradient(135deg, #7303a7, #9303d7)',
                icon: { className: 'fas fa-info-circle', tagName: 'i' }
            }
        ]
    });

    // Expose globally for easy access
    window.showToast = (message, type = 'success') => {
        if (notyfInstance) {
            notyfInstance.open({ type, message });
        }
    };

    console.log('✅ Notyf initialized');
    return notyfInstance;
};

/**
 * Initialize Headroom.js - Auto-hide Navbar
 */
export const initHeadroom = () => {
    if (typeof Headroom === 'undefined') return null;

    const navbar = document.querySelector('.navbar, header, nav');
    if (!navbar) return null;

    const headroom = new Headroom(navbar, {
        offset: 100,
        tolerance: { up: 10, down: 5 },
        classes: {
            initial: 'headroom',
            pinned: 'headroom--pinned',
            unpinned: 'headroom--unpinned',
            top: 'headroom--top',
            notTop: 'headroom--not-top',
            bottom: 'headroom--bottom',
            notBottom: 'headroom--not-bottom'
        }
    });

    headroom.init();
    console.log('✅ Headroom.js initialized');
    return headroom;
};

/**
 * Initialize ProgressBar.js - Skill Progress Circles
 */
export const initProgressBars = () => {
    if (typeof ProgressBar === 'undefined') return;

    // Find skill items with progress data
    document.querySelectorAll('[data-progress]').forEach((el) => {
        const value = parseFloat(el.getAttribute('data-progress')) / 100;
        const color = el.getAttribute('data-color') || '#ff7b00';

        const circle = new ProgressBar.Circle(el, {
            color: color,
            strokeWidth: 6,
            trailWidth: 2,
            trailColor: 'rgba(115, 3, 167, 0.2)',
            duration: 2000,
            easing: 'easeInOut',
            text: {
                value: '',
                style: {
                    color: '#fff',
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '1.6rem',
                    fontWeight: 'bold'
                }
            },
            step: (state, circle) => {
                circle.setText(Math.round(circle.value() * 100) + '%');
            }
        });

        // Animate when visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    circle.animate(value);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(el);
    });

    console.log('✅ ProgressBar.js initialized');
};

/**
 * Initialize clipboard.js - Copy Functionality
 */
export const initClipboard = () => {
    if (typeof ClipboardJS === 'undefined') return null;

    const clipboard = new ClipboardJS('[data-clipboard-text], .copy-btn');

    clipboard.on('success', (e) => {
        // Show success toast
        if (window.showToast) {
            window.showToast('Copied to clipboard!', 'success');
        }
        e.clearSelection();
    });

    clipboard.on('error', () => {
        if (window.showToast) {
            window.showToast('Failed to copy', 'error');
        }
    });

    console.log('✅ clipboard.js initialized');
    return clipboard;
};

/**
 * Add lazyload class to images (lazysizes auto-initializes)
 */
export const setupLazysizes = () => {
    // Add lazyload class to images that don't have it
    document.querySelectorAll('img[data-src]:not(.lazyload)').forEach((img) => {
        img.classList.add('lazyload');
    });

    // Convert regular images to lazy (skip images marked for eager loading)
    document.querySelectorAll('img:not(.lazyload):not([data-src]):not([loading="eager"])').forEach((img) => {
        if (img.src && !img.src.includes('data:')) {
            img.setAttribute('data-src', img.src);
            img.classList.add('lazyload');
            // Keep a tiny placeholder
            img.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
        }
    });

    console.log('✅ lazysizes configured');
};

/**
 * Phase 1: Critical Libraries - Run immediately for core UX
 * These are essential for the page to feel interactive
 */
export const initCriticalLibraries = () => {
    console.log('🚀 Initializing critical libraries...');

    // Add AOS attributes dynamically
    addAOSAttributes();

    // Add Hover.css classes
    addHoverClasses();

    // Core scroll and animation libraries
    try { initAOS(); } catch (e) { console.warn('AOS init failed:', e); }
    try { initLenis(); } catch (e) { console.warn('Lenis init failed:', e); }
    try { initHeadroom(); } catch (e) { console.warn('Headroom init failed:', e); }
    try { setupLazysizes(); } catch (e) { console.warn('lazysizes setup failed:', e); }

    console.log('✅ Critical libraries initialized');
};

/**
 * Phase 2: Deferred Libraries - Run after page is interactive
 * These enhance the experience but aren't needed immediately
 */
export const initDeferredLibraries = () => {
    console.log('⏳ Initializing deferred libraries...');

    // UI Enhancement libraries
    try { initTippy(); } catch (e) { console.warn('Tippy init failed:', e); }
    try { initSplitting(); } catch (e) { console.warn('Splitting init failed:', e); }
    try { initCountUp(); } catch (e) { console.warn('CountUp init failed:', e); }
    try { initNotyf(); } catch (e) { console.warn('Notyf init failed:', e); }
    try { initClipboard(); } catch (e) { console.warn('clipboard.js init failed:', e); }
    try { initRellax(); } catch (e) { console.warn('Rellax init failed:', e); }
    try { initAnimeHero(); } catch (e) { console.warn('Anime.js init failed:', e); }

    console.log('✅ Deferred libraries initialized');
};

/**
 * Phase 3: Lazy Libraries - Initialize only when section is visible
 * Uses IntersectionObserver for optimal performance
 */
export const setupLazyLibraries = () => {
    if (!('IntersectionObserver' in window)) {
        // Fallback: initialize all immediately
        initAllLazyLibraries();
        return;
    }

    const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;

                switch (sectionId) {
                    case 'work':
                    case 'projects':
                        try { initGLightbox(); } catch (e) { console.warn('GLightbox init failed:', e); }
                        break;
                    case 'about':
                        try { initAtropos(); } catch (e) { console.warn('Atropos init failed:', e); }
                        break;
                    case 'contact':
                        try { initPristine(); } catch (e) { console.warn('Pristine init failed:', e); }
                        break;
                    case 'skills':
                        try { initProgressBars(); } catch (e) { console.warn('ProgressBar init failed:', e); }
                        break;
                }

                lazyObserver.unobserve(entry.target);
            }
        });
    }, { rootMargin: '100px' });

    // Observe main sections for lazy initialization
    ['work', 'about', 'contact', 'skills', 'projects'].forEach(id => {
        const section = document.getElementById(id);
        if (section) lazyObserver.observe(section);
    });

    // Setup form confetti (contact form dependent)
    try { setupFormConfetti(); } catch (e) { console.warn('Form confetti setup failed:', e); }

    console.log('✅ Lazy library observers set up');
};

/**
 * Fallback: Initialize all lazy libraries at once
 */
const initAllLazyLibraries = () => {
    try { initGLightbox(); } catch (e) { console.warn('GLightbox init failed:', e); }
    try { initAtropos(); } catch (e) { console.warn('Atropos init failed:', e); }
    try { initPristine(); } catch (e) { console.warn('Pristine init failed:', e); }
    try { initProgressBars(); } catch (e) { console.warn('ProgressBar init failed:', e); }
    try { initPlyr(); } catch (e) { console.warn('Plyr init failed:', e); }
    try { setupFormConfetti(); } catch (e) { console.warn('Form confetti setup failed:', e); }
};

/**
 * Initialize all libraries (Phase 1 + Phase 2 + Phase 3)
 * @deprecated Use phased initialization instead: initCriticalLibraries, initDeferredLibraries, setupLazyLibraries
 */
export const initAllLibraries = () => {
    console.log('🚀 Initializing UI Enhancement Libraries...');

    // Add AOS attributes dynamically
    addAOSAttributes();

    // Add Hover.css classes
    addHoverClasses();

    // Phase 1 Libraries
    try { initAOS(); } catch (e) { console.warn('AOS init failed:', e); }
    try { initGLightbox(); } catch (e) { console.warn('GLightbox init failed:', e); }
    try { initTippy(); } catch (e) { console.warn('Tippy init failed:', e); }
    try { initPristine(); } catch (e) { console.warn('Pristine init failed:', e); }
    try { initLenis(); } catch (e) { console.warn('Lenis init failed:', e); }
    try { initSplitting(); } catch (e) { console.warn('Splitting init failed:', e); }

    // Note: GitHub Stats uses static layout, no Swiper needed

    // Phase 2 Libraries
    try { initCountUp(); } catch (e) { console.warn('CountUp init failed:', e); }
    try { initAtropos(); } catch (e) { console.warn('Atropos init failed:', e); }
    try { initPlyr(); } catch (e) { console.warn('Plyr init failed:', e); }
    try { initRellax(); } catch (e) { console.warn('Rellax init failed:', e); }
    try { initAnimeHero(); } catch (e) { console.warn('Anime.js init failed:', e); }
    try { setupFormConfetti(); } catch (e) { console.warn('Form confetti setup failed:', e); }

    // Phase 3 Libraries
    try { initNotyf(); } catch (e) { console.warn('Notyf init failed:', e); }
    try { initHeadroom(); } catch (e) { console.warn('Headroom init failed:', e); }
    try { initProgressBars(); } catch (e) { console.warn('ProgressBar init failed:', e); }
    try { initClipboard(); } catch (e) { console.warn('clipboard.js init failed:', e); }
    try { setupLazysizes(); } catch (e) { console.warn('lazysizes setup failed:', e); }

    console.log('✅ All UI Enhancement Libraries initialized!');
};


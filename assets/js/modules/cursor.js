/**
 * Custom Cursor Module
 * Creates a smooth following cursor with interactive states
 * Features premium magnetic button effect with morphing cursor
 * Includes particle trails, click ripples, and contextual cursor states
 */

let cursor = null;
let cursorDot = null;
let cursorVisible = true;
let mouseX = 0;
let mouseY = 0;
let prevMouseX = 0;
let prevMouseY = 0;
let endX = 0;
let endY = 0;
let animationId = null;

// Magnetic effect state
let isMagnetic = false;
let magneticTarget = null;
let magneticRect = null;

// Particle trail state
let particleCount = 0;
const MAX_PARTICLES = 30;
let lastParticleTime = 0;
const PARTICLE_THROTTLE = 20; // ms between particles (faster = more particles)

// Scroll state
let isScrolling = false;
let scrollTimeout = null;

// Section-based color theming
let currentSection = 'home';
const sectionColors = {
    'home': { primary: '#9303d7', accent: '#ffd700' },
    'about': { primary: '#2506ad', accent: '#ff7b00' },
    'skills': { primary: '#7303a7', accent: '#ffae00' },
    'education': { primary: '#4a00e0', accent: '#ffd700' },
    'publications': { primary: '#6b21a8', accent: '#f59e0b' },
    'work': { primary: '#7c3aed', accent: '#ff7b00' },
    'award': { primary: '#a855f7', accent: '#fbbf24' },
    'experience': { primary: '#8b5cf6', accent: '#f97316' },
    'video': { primary: '#6366f1', accent: '#fcd34d' },
    'contact': { primary: '#ff7b00', accent: '#7303a7' }
};

/**
 * Create cursor elements
 */
const createCursor = () => {
    // Only on desktop
    if (window.matchMedia('(pointer: coarse)').matches) return false;

    // Create outer cursor (ring)
    cursor = document.createElement('div');
    cursor.className = 'cursor-ring';
    document.body.appendChild(cursor);

    // Create inner cursor (dot)
    cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorDot);

    return true;
};

/**
 * Check if element is a magnetic button
 */
const isMagneticElement = (element) => {
    if (!element) return false;
    return element.closest('.social-icons a, .btn, .contact-card, .tag-btn, .share a, [role="button"], button, .theme-toggle');
};

/**
 * Check if element is an image/gallery item
 * Excludes hero section image and education section images which are not viewable
 */
const isViewableElement = (element) => {
    if (!element) return false;
    // Exclude hero and education section images - they are not lightbox/viewable
    if (element.closest('.home .image, #home .image, .education .image, #education .image')) return false;
    return element.closest('.image, .image-slider, [data-lightbox], .gallery-item, .project-image');
};

/**
 * Check if element is an external link
 */
const isExternalLink = (element) => {
    if (!element) return false;
    const link = element.closest('a[target="_blank"], a[href^="http"]:not([href*="' + window.location.hostname + '"])');
    return link && !isMagneticElement(element);
};

/**
 * Get button properties for morphing
 */
const getButtonProps = (element) => {
    const rect = element.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(element);
    const borderRadius = computedStyle.borderRadius;

    // Determine if it's a circular button (social icons)
    const isCircular = element.closest('.social-icons a, .share a');

    return {
        rect,
        width: rect.width,
        height: rect.height,
        centerX: rect.left + rect.width / 2,
        centerY: rect.top + rect.height / 2,
        borderRadius: isCircular ? '50%' : borderRadius,
        isCircular
    };
};

/**
 * Create click ripple effect
 */
const createClickRipple = (x, y) => {
    const ripple = document.createElement('div');
    ripple.className = 'cursor-click-ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    document.body.appendChild(ripple);

    // Remove after animation
    ripple.addEventListener('animationend', () => {
        ripple.remove();
    });
};

/**
 * Detect which section the cursor is currently over
 */
const detectCurrentSection = (x, y) => {
    const sections = document.querySelectorAll('section[id]');
    for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (y >= rect.top && y <= rect.bottom) {
            const newSection = section.getAttribute('id');
            if (newSection !== currentSection) {
                currentSection = newSection;
                updateCursorColors();
            }
            return;
        }
    }
};

/**
 * Update cursor colors based on current section
 */
const updateCursorColors = () => {
    const colors = sectionColors[currentSection] || sectionColors['home'];

    // Update CSS custom properties on cursor elements
    if (cursor) {
        cursor.style.setProperty('--section-primary', colors.primary);
        cursor.style.setProperty('--section-accent', colors.accent);
    }
    if (cursorDot) {
        cursorDot.style.setProperty('--section-primary', colors.primary);
        cursorDot.style.setProperty('--section-accent', colors.accent);
    }

    // Also add section class for CSS-based styling
    document.body.setAttribute('data-cursor-section', currentSection);
};

/**
 * Create particle at position with section-based colors
 */
const createParticle = (x, y, velocityX = 0, velocityY = 0) => {
    if (particleCount >= MAX_PARTICLES) return;

    const now = Date.now();
    if (now - lastParticleTime < PARTICLE_THROTTLE) return;
    lastParticleTime = now;

    const particle = document.createElement('div');
    particle.className = 'cursor-particle';

    // Get section colors
    const colors = sectionColors[currentSection] || sectionColors['home'];

    // Alternate between primary and accent colors
    const useAccent = particleCount % 2 === 0;
    const color = useAccent ? colors.accent : colors.primary;

    particle.style.backgroundColor = color;
    particle.style.boxShadow = `0 0 10px ${color}`;

    // Position with slight offset based on movement direction
    const offsetX = (Math.random() - 0.5) * 15 - velocityX * 0.5;
    const offsetY = (Math.random() - 0.5) * 15 - velocityY * 0.5;

    particle.style.left = `${x + offsetX}px`;
    particle.style.top = `${y + offsetY}px`;

    // Random size variation
    const size = 3 + Math.random() * 5;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    document.body.appendChild(particle);
    particleCount++;

    // Remove after animation
    particle.addEventListener('animationend', () => {
        particle.remove();
        particleCount--;
    });
};

/**
 * Animate cursor to follow mouse with smooth delay
 * Includes magnetic effect for buttons
 */
const animateCursor = () => {
    if (!cursor || !cursorDot) return;

    let targetX = mouseX;
    let targetY = mouseY;

    // Apply magnetic effect - cursor follows button center with slight offset
    if (isMagnetic && magneticRect) {
        const magnetStrength = 0.4; // How much the cursor is pulled toward center
        targetX = mouseX + (magneticRect.centerX - mouseX) * magnetStrength;
        targetY = mouseY + (magneticRect.centerY - mouseY) * magnetStrength;
    }

    // Smooth easing for outer ring
    endX += (targetX - endX) * 0.15;
    endY += (targetY - endY) * 0.15;

    cursor.style.left = `${endX}px`;
    cursor.style.top = `${endY}px`;

    // Dot follows immediately (or also has slight magnetic pull)
    if (isMagnetic && magneticRect) {
        cursorDot.style.left = `${targetX}px`;
        cursorDot.style.top = `${targetY}px`;
    } else {
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    }

    animationId = requestAnimationFrame(animateCursor);
};

/**
 * Handle mouse position updates with particle trail
 */
const handleMouseMove = (e) => {
    prevMouseX = mouseX;
    prevMouseY = mouseY;
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!cursorVisible) {
        cursor?.classList.add('visible');
        cursorDot?.classList.add('visible');
        cursorVisible = true;
    }

    // Detect which section we're in for color theming
    detectCurrentSection(mouseX, mouseY);

    // Calculate velocity for particle trail direction
    const velocityX = mouseX - prevMouseX;
    const velocityY = mouseY - prevMouseY;
    const speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);

    // Create particles on movement (lower threshold = more particles)
    if (speed > 8 && !isMagnetic && !isScrolling) {
        createParticle(mouseX, mouseY, velocityX, velocityY);
    }
};

/**
 * Handle mouse enter/leave window
 */
const handleMouseLeave = () => {
    cursor?.classList.remove('visible');
    cursorDot?.classList.remove('visible');
    cursorVisible = false;

    // Reset magnetic state
    resetMagneticState();
};

const handleMouseEnter = () => {
    cursor?.classList.add('visible');
    cursorDot?.classList.add('visible');
    cursorVisible = true;
};

/**
 * Reset magnetic cursor state
 */
const resetMagneticState = () => {
    isMagnetic = false;
    magneticTarget = null;
    magneticRect = null;

    cursor?.classList.remove('cursor-magnetic');
    cursorDot?.classList.remove('cursor-magnetic');

    // Reset custom properties
    if (cursor) {
        cursor.style.removeProperty('--btn-width');
        cursor.style.removeProperty('--btn-height');
        cursor.style.removeProperty('--btn-radius');
    }
};

/**
 * Apply magnetic effect to cursor
 */
const applyMagneticEffect = (element) => {
    const props = getButtonProps(element);

    isMagnetic = true;
    magneticTarget = element;
    magneticRect = props;

    cursor?.classList.add('cursor-magnetic');
    cursorDot?.classList.add('cursor-magnetic');

    // Set CSS custom properties for dynamic sizing
    if (cursor) {
        // Add padding to cursor size (slightly larger than button)
        const padding = props.isCircular ? 12 : 16;
        cursor.style.setProperty('--btn-width', `${props.width + padding}px`);
        cursor.style.setProperty('--btn-height', `${props.height + padding}px`);
        cursor.style.setProperty('--btn-radius', props.borderRadius);
    }
};

/**
 * Handle hover state using event delegation (single listener on document)
 * This prevents memory leaks from accumulating listeners
 */
const handleHoverState = (e) => {
    const target = e.target;

    // Reset all special states first
    cursor?.classList.remove('cursor-hover', 'cursor-view', 'cursor-link', 'cursor-focus');
    cursorDot?.classList.remove('cursor-hover', 'cursor-view', 'cursor-link');

    // Check if hovering over viewable elements (images/gallery)
    if (isViewableElement(target)) {
        resetMagneticState();
        cursor?.classList.add('cursor-view');
        cursorDot?.classList.add('cursor-view');
        return;
    }

    // Check if hovering over external links
    if (isExternalLink(target)) {
        resetMagneticState();
        cursor?.classList.add('cursor-link');
        cursorDot?.classList.add('cursor-link');
        return;
    }

    // Check if hovering over magnetic (interactive) elements
    const magneticElement = isMagneticElement(target);

    if (magneticElement) {
        const element = target.closest('.social-icons a, .btn, .contact-card, .tag-btn, .share a, [role="button"], button, .theme-toggle');

        if (element && element !== magneticTarget) {
            applyMagneticEffect(element);
        }

        cursor?.classList.add('cursor-hover', 'cursor-focus');
        cursorDot?.classList.add('cursor-hover');
    } else {
        resetMagneticState();
    }
};

/**
 * Handle click events for ripple effect
 */
const handleClick = (e) => {
    createClickRipple(e.clientX, e.clientY);

    // Brief click animation on cursor
    cursor?.classList.add('clicking');
    setTimeout(() => {
        cursor?.classList.remove('clicking');
    }, 150);
};

/**
 * Handle scroll events for cursor state
 */
const handleScroll = () => {
    if (!isScrolling) {
        isScrolling = true;
        cursor?.classList.add('cursor-scrolling');
        cursorDot?.classList.add('cursor-scrolling');
    }

    // Clear existing timeout
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }

    // Reset scrolling state after scroll ends
    scrollTimeout = setTimeout(() => {
        isScrolling = false;
        cursor?.classList.remove('cursor-scrolling');
        cursorDot?.classList.remove('cursor-scrolling');
    }, 80); // Reduced from 150ms for faster ring appearance
};

/**
 * Handle mouse down for drag state
 */
const handleMouseDown = (e) => {
    // Only apply dragging state if not clicking a button
    if (!isMagneticElement(e.target)) {
        cursor?.classList.add('cursor-dragging');
    }
};

const handleMouseUp = () => {
    cursor?.classList.remove('cursor-dragging');
};

/**
 * Initialize custom cursor
 */
export const initCustomCursor = () => {
    // Create cursor elements
    if (!createCursor()) return;

    // Start animation loop
    animateCursor();

    // Add event listeners with passive flag for better performance
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Use event delegation for hover states - single listener instead of many
    document.addEventListener('mouseover', handleHoverState, { passive: true });

    // Click ripple effect
    document.addEventListener('click', handleClick);

    // Scroll detection for cursor state
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Drag/mousedown states
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    // Hide default cursor
    document.body.style.cursor = 'none';

    // Add cursor-page class for styling
    document.body.classList.add('custom-cursor-enabled');

    // Make cursor visible immediately (fixes cursor missing after navigation)
    // The cursor starts at 0,0 but becomes truly visible on first mouse move
    cursor?.classList.add('visible');
    cursorDot?.classList.add('visible');
    cursorVisible = true;

    // Handle page show event (for back/forward navigation)
    window.addEventListener('pageshow', () => {
        cursor?.classList.add('visible');
        cursorDot?.classList.add('visible');
        cursorVisible = true;
    });
};

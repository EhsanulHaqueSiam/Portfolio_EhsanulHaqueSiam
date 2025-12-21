/**
 * Custom Cursor Module
 * Creates a smooth following cursor with interactive states
 * Features premium magnetic button effect with morphing cursor
 */

let cursor = null;
let cursorDot = null;
let cursorVisible = true;
let mouseX = 0;
let mouseY = 0;
let endX = 0;
let endY = 0;
let animationId = null;

// Magnetic effect state
let isMagnetic = false;
let magneticTarget = null;
let magneticRect = null;

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
 * Handle mouse position updates
 */
const handleMouseMove = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!cursorVisible) {
        cursor?.classList.add('visible');
        cursorDot?.classList.add('visible');
        cursorVisible = true;
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

    // Check if hovering over magnetic (interactive) elements
    const magneticElement = isMagneticElement(target);

    if (magneticElement) {
        const element = target.closest('.social-icons a, .btn, .contact-card, .tag-btn, .share a, [role="button"], button, .theme-toggle');
        
        if (element && element !== magneticTarget) {
            applyMagneticEffect(element);
        }
        
        cursor?.classList.add('cursor-hover');
        cursorDot?.classList.add('cursor-hover');
    } else {
        resetMagneticState();
        cursor?.classList.remove('cursor-hover');
        cursorDot?.classList.remove('cursor-hover');
    }
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

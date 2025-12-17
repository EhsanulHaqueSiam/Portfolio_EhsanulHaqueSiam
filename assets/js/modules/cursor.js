/**
 * Custom Cursor Module
 * Creates a smooth following cursor with interactive states
 * Uses CSS-based hover detection for better performance
 */

let cursor = null;
let cursorDot = null;
let cursorVisible = true;
let mouseX = 0;
let mouseY = 0;
let endX = 0;
let endY = 0;
let animationId = null;

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
 * Animate cursor to follow mouse with smooth delay
 */
const animateCursor = () => {
    if (!cursor || !cursorDot) return;

    // Smooth easing for outer ring
    endX += (mouseX - endX) * 0.15;
    endY += (mouseY - endY) * 0.15;

    cursor.style.left = `${endX}px`;
    cursor.style.top = `${endY}px`;

    // Dot follows immediately
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;

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
};

const handleMouseEnter = () => {
    cursor?.classList.add('visible');
    cursorDot?.classList.add('visible');
    cursorVisible = true;
};

/**
 * Handle hover state using event delegation (single listener on document)
 * This prevents memory leaks from accumulating listeners
 */
const handleHoverState = (e) => {
    const target = e.target;

    // Check if hovering over interactive elements
    const isInteractive = target.closest('a, button, .btn, input, textarea, .social-icons a, .theme-toggle, [role="button"]');

    if (isInteractive) {
        cursor?.classList.add('cursor-hover');
        cursorDot?.classList.add('cursor-hover');
    } else {
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


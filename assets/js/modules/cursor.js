/**
 * Custom Cursor Module
 * Creates a smooth following cursor with interactive states
 */

let cursor = null;
let cursorDot = null;
let cursorVisible = true;
let cursorEnlarged = false;
let mouseX = 0;
let mouseY = 0;
let endX = 0;
let endY = 0;

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

    requestAnimationFrame(animateCursor);
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
 * Add hover effects to interactive elements
 */
const addHoverEffects = () => {
    const interactiveElements = document.querySelectorAll(
        'a, button, .btn, .box, input, textarea, .social-icons a, .theme-toggle, [role="button"]'
    );

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor?.classList.add('cursor-hover');
            cursorDot?.classList.add('cursor-hover');
        });

        el.addEventListener('mouseleave', () => {
            cursor?.classList.remove('cursor-hover');
            cursorDot?.classList.remove('cursor-hover');
        });
    });

    // Text elements get different effect
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, li');
    textElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor?.classList.add('cursor-text');
        });

        el.addEventListener('mouseleave', () => {
            cursor?.classList.remove('cursor-text');
        });
    });
};

/**
 * Initialize custom cursor
 */
export const initCustomCursor = () => {
    // Create cursor elements
    if (!createCursor()) return;

    // Start animation loop
    animateCursor();

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Add hover effects after DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addHoverEffects);
    } else {
        addHoverEffects();
    }

    // Re-add hover effects when content changes (for dynamically loaded content)
    const observer = new MutationObserver(() => {
        addHoverEffects();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Hide default cursor
    document.body.style.cursor = 'none';

    // Add cursor-page class for styling
    document.body.classList.add('custom-cursor-enabled');
};

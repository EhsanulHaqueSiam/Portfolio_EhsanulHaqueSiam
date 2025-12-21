/**
 * Micro-Interactions Module
 * Magnetic buttons, enhanced hover effects, and subtle animations
 */

const MicroInteractions = (function () {
    /**
     * Initialize all micro-interactions
     */
    function init() {
        initMagneticButtons();
        initRippleEffect();
        initLinkHoverSound(); // Optional - can be enabled
    }

    /**
     * Magnetic Button Effect
     * Buttons slightly follow the cursor when hovered
     */
    function initMagneticButtons() {
        const magneticStrength = 0.3;
        const buttons = document.querySelectorAll('.btn, .social-icons a, .contact-card');

        buttons.forEach(button => {
            button.classList.add('btn-magnetic');

            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                button.style.transform = `translate(${x * magneticStrength}px, ${y * magneticStrength}px)`;
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0, 0)';
            });
        });
    }

    /**
     * Enhanced Ripple Effect
     * Creates expanding ripple on button click
     */
    function initRippleEffect() {
        const rippleButtons = document.querySelectorAll('.btn-ripple, .btn');

        rippleButtons.forEach(button => {
            button.addEventListener('click', function (e) {
                // Remove existing ripples
                const existingRipple = this.querySelector('.ripple');
                if (existingRipple) {
                    existingRipple.remove();
                }

                // Create ripple
                const ripple = document.createElement('span');
                ripple.className = 'ripple';

                // Calculate position
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.cssText = `
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                `;

                this.appendChild(ripple);

                // Remove after animation
                ripple.addEventListener('animationend', () => {
                    ripple.remove();
                });
            });
        });
    }

    /**
     * Optional: Subtle hover sound effect
     * Disabled by default - can be enabled for extra premium feel
     */
    function initLinkHoverSound() {
        // Disabled by default - uncomment to enable
        /*
        const hoverSound = new Audio('data:audio/wav;base64,...'); // Tiny click sound
        hoverSound.volume = 0.1;
        
        const links = document.querySelectorAll('a, button');
        links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                hoverSound.currentTime = 0;
                hoverSound.play().catch(() => {}); // Ignore autoplay errors
            });
        });
        */
    }

    /**
     * Add tilt effect to cards
     * Uses VanillaTilt if available, fallback to CSS
     */
    function initCardTilt() {
        if (typeof VanillaTilt !== 'undefined') {
            const cards = document.querySelectorAll('.box, .card, .publication-card');
            VanillaTilt.init(cards, {
                max: 5,
                speed: 400,
                glare: true,
                'max-glare': 0.1,
            });
        }
    }

    /**
     * Parallax effect on mouse move
     */
    function initParallaxHover(element, intensity = 0.02) {
        if (!element) return;

        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            const children = element.querySelectorAll('[data-parallax]');
            children.forEach(child => {
                const depth = parseFloat(child.dataset.parallax) || 1;
                child.style.transform = `translate(${x * intensity * depth * 100}px, ${y * intensity * depth * 100}px)`;
            });
        });

        element.addEventListener('mouseleave', () => {
            const children = element.querySelectorAll('[data-parallax]');
            children.forEach(child => {
                child.style.transform = 'translate(0, 0)';
            });
        });
    }

    /**
     * Stagger animation for elements
     */
    function staggerElements(selector, delay = 100) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, index) => {
            el.style.animationDelay = `${index * delay}ms`;
            el.style.transitionDelay = `${index * delay}ms`;
        });
    }

    // Public API
    return {
        init,
        initMagneticButtons,
        initRippleEffect,
        initCardTilt,
        initParallaxHover,
        staggerElements
    };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    MicroInteractions.init();
});

/**
 * Hacker Text Effect - Decryption/Scramble Animation
 * Creates a "matrix-style" text reveal effect that fits the tech aesthetic
 * Memory-leak safe with proper interval cleanup
 */

class HackerTextEffect {
    constructor(options = {}) {
        this.characters = options.characters || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*<>[]{}';
        this.duration = options.duration || 1500; // Total animation duration in ms
        this.staggerDelay = options.staggerDelay || 50; // Delay between each character reveal
        this.scrambleSpeed = options.scrambleSpeed || 30; // Speed of scramble animation
        // Track active intervals for cleanup
        this.activeIntervals = new WeakMap();
    }

    /**
     * Clear any existing animation on an element
     * @param {HTMLElement} element - The element to clear animation from
     */
    clearAnimation(element) {
        const existingInterval = this.activeIntervals.get(element);
        if (existingInterval) {
            clearInterval(existingInterval);
            this.activeIntervals.delete(element);
        }
    }

    /**
     * Apply hacker effect to an element
     * @param {HTMLElement} element - The element to animate
     * @param {Object} options - Override default options
     * @returns {number} - The interval ID for manual cleanup if needed
     */
    animate(element, options = {}) {
        // Clear any existing animation first to prevent memory leaks
        this.clearAnimation(element);

        const text = element.getAttribute('data-text') || element.textContent;
        const duration = options.duration || this.duration;
        const scrambleSpeed = options.scrambleSpeed || this.scrambleSpeed;

        // Store original text
        element.setAttribute('data-text', text);

        let iteration = 0;
        const letters = text.split('');
        const totalIterations = letters.length;
        const incrementPerFrame = totalIterations / (duration / scrambleSpeed);

        // Don't pre-scramble - keep original text visible until animation starts

        // Create interval for animation
        const interval = setInterval(() => {
            element.textContent = letters
                .map((letter, index) => {
                    // If we've passed this character's reveal point, show the real letter
                    if (index < iteration) {
                        return letter;
                    }
                    // If it's a space, keep it as space
                    if (letter === ' ') {
                        return ' ';
                    }
                    // Otherwise show a random character
                    return this.characters[Math.floor(Math.random() * this.characters.length)];
                })
                .join('');

            iteration += incrementPerFrame;

            // Stop when complete
            if (iteration >= totalIterations) {
                clearInterval(interval);
                this.activeIntervals.delete(element);
                // Ensure final text is correct
                element.textContent = text;
            }
        }, scrambleSpeed);

        // Track the interval for cleanup
        this.activeIntervals.set(element, interval);

        return interval;
    }

    /**
     * Apply effect on hover - replays animation each time
     * @param {HTMLElement} element - The element to add hover effect to
     */
    applyHoverEffect(element) {
        const self = this;

        // Store original text immediately
        if (!element.getAttribute('data-text')) {
            element.setAttribute('data-text', element.textContent);
        }

        element.addEventListener('mouseenter', function handleMouseEnter() {
            self.animate(element, { duration: 800 });
        });

        element.addEventListener('mouseleave', function handleMouseLeave() {
            // Clear animation and restore text
            self.clearAnimation(element);
            const originalText = element.getAttribute('data-text');
            if (originalText) {
                element.textContent = originalText;
            }
        });
    }

    /**
     * Initialize all elements with data-hacker-text attribute
     */
    initAll() {
        const self = this;

        // Elements that animate on page load AND replay on hover
        document.querySelectorAll('[data-hacker-text="load"]').forEach(element => {
            // Store original text
            element.setAttribute('data-text', element.textContent);
            // Animate after a short delay
            setTimeout(() => {
                self.animate(element);
            }, 300);
            // Also add hover replay
            self.applyHoverEffect(element);
        });

        // Elements that animate on hover only
        document.querySelectorAll('[data-hacker-text="hover"]').forEach(element => {
            element.setAttribute('data-text', element.textContent);
            self.applyHoverEffect(element);
        });

        // Elements that animate on scroll into view (animates ONLY ONCE)
        document.querySelectorAll('[data-hacker-text="scroll"]').forEach(element => {
            element.setAttribute('data-text', element.textContent);
            self.observeElement(element);
            // NOTE: No hover replay for scroll elements to keep headings readable
        });
    }

    /**
     * Use Intersection Observer to trigger animation on scroll
     * Animates ONLY ONCE when element first scrolls into view
     * @param {HTMLElement} element - Element to observe
     */
    observeElement(element) {
        const self = this;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Element came into view - animate it ONCE
                    self.animate(element);
                    // Stop observing to prevent re-animation
                    observer.unobserve(element);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(element);

        // Track observer for cleanup
        if (!this.observers) this.observers = [];
        this.observers.push(observer);
    }

    /**
     * Cleanup all tracked intervals and observers
     */
    cleanup() {
        // Disconnect all IntersectionObservers
        if (this.observers) {
            this.observers.forEach(observer => observer.disconnect());
            this.observers = [];
        }
        // Note: WeakMap intervals are auto-cleaned when elements are removed
    }
}

// Neon Glow Pulse Effect (CSS-based, JS for initialization)
class NeonGlowEffect {
    constructor() {
        this.addStyles();
    }

    addStyles() {
        // Check if styles already added
        if (document.getElementById('neon-glow-styles')) return;

        const style = document.createElement('style');
        style.id = 'neon-glow-styles';
        style.textContent = `
            .neon-glow {
                animation: neonPulse 2s ease-in-out infinite alternate;
            }

            @keyframes neonPulse {
                0% {
                    text-shadow: 
                        0 0 5px var(--color-primary, #7303a7),
                        0 0 10px var(--color-primary, #7303a7),
                        0 0 20px var(--color-primary, #7303a7);
                }
                100% {
                    text-shadow: 
                        0 0 10px var(--color-accent, #ff7b00),
                        0 0 20px var(--color-accent, #ff7b00),
                        0 0 40px var(--color-accent, #ff7b00);
                }
            }

            .neon-glow-hover:hover {
                animation: neonPulse 1s ease-in-out infinite alternate;
            }

            /* Glitch effect */
            .glitch {
                position: relative;
            }

            .glitch::before,
            .glitch::after {
                content: attr(data-text);
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }

            .glitch::before {
                left: 2px;
                text-shadow: -2px 0 var(--color-accent, #ff7b00);
                clip: rect(24px, 550px, 90px, 0);
                animation: glitch-anim-1 2s infinite linear alternate-reverse;
            }

            .glitch::after {
                left: -2px;
                text-shadow: -2px 0 var(--color-primary, #7303a7);
                clip: rect(85px, 550px, 140px, 0);
                animation: glitch-anim-2 2s infinite linear alternate-reverse;
            }

            @keyframes glitch-anim-1 {
                0% { clip: rect(30px, 9999px, 10px, 0); }
                10% { clip: rect(54px, 9999px, 98px, 0); }
                20% { clip: rect(23px, 9999px, 45px, 0); }
                30% { clip: rect(76px, 9999px, 12px, 0); }
                40% { clip: rect(12px, 9999px, 87px, 0); }
                50% { clip: rect(35px, 9999px, 23px, 0); }
                60% { clip: rect(67px, 9999px, 76px, 0); }
                70% { clip: rect(21px, 9999px, 54px, 0); }
                80% { clip: rect(87px, 9999px, 32px, 0); }
                90% { clip: rect(43px, 9999px, 65px, 0); }
                100% { clip: rect(65px, 9999px, 43px, 0); }
            }

            @keyframes glitch-anim-2 {
                0% { clip: rect(65px, 9999px, 43px, 0); }
                10% { clip: rect(23px, 9999px, 87px, 0); }
                20% { clip: rect(76px, 9999px, 21px, 0); }
                30% { clip: rect(12px, 9999px, 54px, 0); }
                40% { clip: rect(54px, 9999px, 76px, 0); }
                50% { clip: rect(87px, 9999px, 12px, 0); }
                60% { clip: rect(32px, 9999px, 67px, 0); }
                70% { clip: rect(45px, 9999px, 35px, 0); }
                80% { clip: rect(10px, 9999px, 98px, 0); }
                90% { clip: rect(98px, 9999px, 23px, 0); }
                100% { clip: rect(30px, 9999px, 54px, 0); }
            }

            /* Subtle glitch on hover only - simple text-shadow based effect */
            .glitch-hover {
                position: relative;
                display: inline;
                transition: text-shadow 0.1s ease;
            }

            .glitch-hover:hover {
                animation: glitch-text 0.4s ease-in-out infinite;
            }

            @keyframes glitch-text {
                0%, 100% {
                    text-shadow: 
                        2px 0 #ff7b00,
                        -2px 0 #7303a7;
                }
                25% {
                    text-shadow: 
                        -2px -1px #ff7b00,
                        2px 1px #7303a7;
                }
                50% {
                    text-shadow: 
                        1px 2px #ff7b00,
                        -1px -2px #7303a7;
                }
                75% {
                    text-shadow: 
                        -1px 1px #ff7b00,
                        1px -1px #7303a7;
                }
            }

            /* Dark theme adjustments */
            [data-theme="dark"] .glitch-hover:hover {
                animation: glitch-text-dark 0.4s ease-in-out infinite;
            }

            @keyframes glitch-text-dark {
                0%, 100% {
                    text-shadow: 
                        2px 0 #ff9b40,
                        -2px 0 #a855f7;
                }
                25% {
                    text-shadow: 
                        -2px -1px #ff9b40,
                        2px 1px #a855f7;
                }
                50% {
                    text-shadow: 
                        1px 2px #ff9b40,
                        -1px -2px #a855f7;
                }
                75% {
                    text-shadow: 
                        -1px 1px #ff9b40,
                        1px -1px #a855f7;
                }
            }

            /* Reduced motion support */
            @media (prefers-reduced-motion: reduce) {
                .neon-glow,
                .neon-glow-hover:hover,
                .glitch::before,
                .glitch::after,
                .glitch-hover:hover {
                    animation: none !important;
                    text-shadow: none !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    initAll() {
        document.querySelectorAll('.glitch, .glitch-hover').forEach(element => {
            element.setAttribute('data-text', element.textContent);
        });
    }
}

// Text Reveal Effect (Mask/Slide)
class TextRevealEffect {
    constructor() {
        this.addStyles();
        this.observers = []; // Track observers for cleanup
    }

    addStyles() {
        if (document.getElementById('text-reveal-styles')) return;

        const style = document.createElement('style');
        style.id = 'text-reveal-styles';
        style.textContent = `
            .text-slide-reveal {
                overflow: hidden;
                display: inline-block;
            }

            .text-slide-reveal > span {
                display: inline-block;
                transform: translateY(100%);
                opacity: 0;
                transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), 
                            opacity 0.6s ease;
            }

            .text-slide-reveal.revealed > span {
                transform: translateY(0);
                opacity: 1;
            }

            .text-fade-up {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.8s ease, transform 0.8s ease;
            }

            .text-fade-up.revealed {
                opacity: 1;
                transform: translateY(0);
            }

            /* Gradient shimmer for headings */
            .text-shimmer-gradient {
                background: linear-gradient(
                    90deg,
                    var(--color-primary, #7303a7) 0%,
                    var(--color-accent, #ff7b00) 25%,
                    var(--color-primary, #7303a7) 50%,
                    var(--color-accent, #ff7b00) 75%,
                    var(--color-primary, #7303a7) 100%
                );
                background-size: 200% auto;
                -webkit-background-clip: text;
                background-clip: text;
                -webkit-text-fill-color: transparent;
                animation: shimmerGradient 4s ease-in-out infinite;
            }

            @keyframes shimmerGradient {
                0% { background-position: 0% center; }
                100% { background-position: 200% center; }
            }

            @media (prefers-reduced-motion: reduce) {
                .text-slide-reveal > span,
                .text-fade-up,
                .text-shimmer-gradient {
                    animation: none !important;
                    transform: none !important;
                    opacity: 1 !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    initAll() {
        // Observe elements for reveal on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        this.observers.push(observer);

        document.querySelectorAll('.text-slide-reveal, .text-fade-up').forEach(el => {
            observer.observe(el);
        });
    }

    /**
     * Cleanup observers to prevent memory leaks
     */
    cleanup() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
    }
}

// Global instance for cleanup on page unload
let hackerEffectInstance = null;
let revealEffectInstance = null;

// Initialize all text effects
function initTextEffects() {
    hackerEffectInstance = new HackerTextEffect();
    const neonEffect = new NeonGlowEffect();
    revealEffectInstance = new TextRevealEffect();

    hackerEffectInstance.initAll();
    neonEffect.initAll();
    revealEffectInstance.initAll();

    // Export for manual use
    window.HackerTextEffect = HackerTextEffect;
    window.NeonGlowEffect = NeonGlowEffect;
    window.TextRevealEffect = TextRevealEffect;
    window.hackerEffectInstance = hackerEffectInstance;
}

// Cleanup on page unload to prevent memory leaks
window.addEventListener('beforeunload', () => {
    if (hackerEffectInstance) {
        hackerEffectInstance.cleanup();
    }
    if (revealEffectInstance) {
        revealEffectInstance.cleanup();
    }
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTextEffects);
} else {
    initTextEffects();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HackerTextEffect, NeonGlowEffect, TextRevealEffect };
}

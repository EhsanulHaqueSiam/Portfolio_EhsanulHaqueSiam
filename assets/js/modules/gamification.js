/**
 * Gamification Module
 * Easter eggs, achievements, and interactive fun elements
 */

const Gamification = (function () {
    // State
    let clickCount = 0;
    let konamiPosition = 0;
    let achievements = [];
    let hiddenMessagesFound = 0;

    // Konami Code sequence
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

    // Achievement definitions - Exploration-based
    const achievementDefinitions = [
        { id: 'first_visit', name: 'Welcome!', desc: 'Started exploring the portfolio', type: 'auto', icon: '👋' },
        { id: 'scroll_explorer', name: 'Scroll Explorer', desc: 'Scrolled through 50% of the page', type: 'scroll', threshold: 50, icon: '📜' },
        { id: 'deep_diver', name: 'Deep Diver', desc: 'Scrolled to the very bottom', type: 'scroll', threshold: 95, icon: '🏊' },
        { id: 'section_visitor', name: 'Section Tourist', desc: 'Visited 5 different sections', type: 'sections', threshold: 5, icon: '🗺️' },
        { id: 'theme_switcher', name: 'Theme Switcher', desc: 'Toggled between light and dark mode', type: 'theme', icon: '🌓' },
        { id: 'time_spent', name: 'Quality Time', desc: 'Spent 2+ minutes exploring', type: 'time', threshold: 120, icon: '⏱️' },
    ];

    // Hidden messages
    const hiddenMessages = [
        { trigger: 'logo', message: '🎮 You found a secret! I love making games too.' },
        { trigger: 'profile-image', message: '📸 Fun fact: This photo was taken after my first hackathon!' },
        { trigger: 'footer', message: '🔮 Thanks for scrolling all the way down!' },
    ];

    /**
     * Initialize gamification
     */
    function init() {
        loadProgress();
        initKonamiCode();
        initExplorationTracking();
        initHiddenMessages();
        initMiniGame();
        createAchievementUI();
    }

    /**
     * Load saved progress from localStorage
     */
    function loadProgress() {
        try {
            const saved = localStorage.getItem('portfolio-gamification');
            if (saved) {
                const data = JSON.parse(saved);
                clickCount = data.clickCount || 0;
                achievements = data.achievements || [];
                hiddenMessagesFound = data.hiddenMessagesFound || 0;
            }
        } catch (e) {
            console.warn('Could not load gamification progress');
        }
    }

    /**
     * Save progress to localStorage
     */
    function saveProgress() {
        try {
            localStorage.setItem('portfolio-gamification', JSON.stringify({
                clickCount,
                achievements,
                hiddenMessagesFound
            }));
        } catch (e) {
            console.warn('Could not save gamification progress');
        }
    }

    /**
     * Konami Code Easter Egg
     */
    function initKonamiCode() {
        document.addEventListener('keydown', (e) => {
            if (e.key === konamiCode[konamiPosition]) {
                konamiPosition++;
                if (konamiPosition === konamiCode.length) {
                    triggerKonamiEasterEgg();
                    konamiPosition = 0;
                }
            } else {
                konamiPosition = 0;
            }
        });
    }

    /**
     * Trigger Konami Code reward
     */
    function triggerKonamiEasterEgg() {
        // Confetti explosion
        if (typeof confetti === 'function') {
            // Multiple bursts
            const duration = 3000;
            const end = Date.now() + duration;

            const colors = ['#7303a7', '#ff7b00', '#ffd700', '#22d3ee', '#ec4899'];

            (function frame() {
                confetti({
                    particleCount: 5,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: colors
                });
                confetti({
                    particleCount: 5,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: colors
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            }());
        }

        // Show secret message
        showAchievementToast('🎮 KONAMI CODE ACTIVATED!', 'You found the secret! You are a true gamer.');

        // Unlock special achievement
        unlockAchievement({
            id: 'konami',
            name: 'Retro Gamer',
            desc: 'Entered the Konami Code',
            icon: '🎮'
        });

        // Add rainbow effect to body temporarily
        document.body.classList.add('rainbow-mode');
        setTimeout(() => {
            document.body.classList.remove('rainbow-mode');
        }, 5000);
    }

    /**
     * Exploration-based Achievement Tracker
     */
    let visitedSections = new Set();
    let maxScrollPercent = 0;
    let startTime = Date.now();

    function initExplorationTracking() {
        // First visit achievement (auto)
        if (!achievements.includes('first_visit')) {
            unlockAchievement(achievementDefinitions.find(a => a.id === 'first_visit'));
        }

        // Scroll tracking
        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            if (scrollPercent > maxScrollPercent) {
                maxScrollPercent = scrollPercent;
                checkScrollAchievements();
            }

            // Track visible sections
            document.querySelectorAll('section[id]').forEach(section => {
                const rect = section.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.5 && rect.bottom > window.innerHeight * 0.5) {
                    visitedSections.add(section.id);
                    checkSectionAchievements();
                }
            });
        }, { passive: true });

        // Theme toggle tracking
        const themeToggle = document.querySelector('[data-theme-toggle], .theme-toggle, #theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                if (!achievements.includes('theme_switcher')) {
                    unlockAchievement(achievementDefinitions.find(a => a.id === 'theme_switcher'));
                }
            });
        }

        // Time spent tracking
        setInterval(() => {
            const timeSpent = (Date.now() - startTime) / 1000;
            if (timeSpent >= 120 && !achievements.includes('time_spent')) {
                unlockAchievement(achievementDefinitions.find(a => a.id === 'time_spent'));
            }
        }, 10000); // Check every 10 seconds
    }

    function checkScrollAchievements() {
        if (maxScrollPercent >= 50 && !achievements.includes('scroll_explorer')) {
            unlockAchievement(achievementDefinitions.find(a => a.id === 'scroll_explorer'));
        }
        if (maxScrollPercent >= 95 && !achievements.includes('deep_diver')) {
            unlockAchievement(achievementDefinitions.find(a => a.id === 'deep_diver'));
        }
    }

    function checkSectionAchievements() {
        if (visitedSections.size >= 5 && !achievements.includes('section_visitor')) {
            unlockAchievement(achievementDefinitions.find(a => a.id === 'section_visitor'));
        }
    }

    /**
     * Unlock an achievement
     */
    function unlockAchievement(achievement) {
        if (achievements.includes(achievement.id)) return;

        achievements.push(achievement.id);
        saveProgress();

        // Show toast notification
        showAchievementToast(
            `${achievement.icon} Achievement Unlocked!`,
            `${achievement.name}: ${achievement.desc}`
        );

        // Optional: Confetti for special achievements
        if (['superfan', 'konami'].includes(achievement.id) && typeof confetti === 'function') {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    }

    /**
     * Play achievement sound effect - very subtle and quiet
     */
    function playAchievementSound() {
        try {
            // Create a very subtle, quiet ding using Web Audio API
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();

            // Single oscillator for a simple, subtle ding
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();

            osc.connect(gain);
            gain.connect(audioContext.destination);

            // Higher frequency for a subtle "ding" (G6)
            osc.frequency.setValueAtTime(1568, audioContext.currentTime);
            osc.type = 'sine';

            // Very quiet and short - barely audible
            gain.gain.setValueAtTime(0, audioContext.currentTime);
            gain.gain.linearRampToValueAtTime(0.06, audioContext.currentTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);

            osc.start(audioContext.currentTime);
            osc.stop(audioContext.currentTime + 0.25);
        } catch (e) {
            // Audio not supported, ignore silently
            console.debug('Achievement sound not supported');
        }
    }

    /**
     * Show achievement toast notification
     */
    function showAchievementToast(title, message) {
        // Play achievement sound
        playAchievementSound();

        // Use Notyf if available
        if (typeof Notyf !== 'undefined') {
            const notyf = new Notyf({
                duration: 4000,
                position: { x: 'right', y: 'top' },
                types: [{
                    type: 'achievement',
                    background: 'linear-gradient(135deg, #7303a7, #2506ad)',
                    icon: false
                }]
            });
            notyf.open({
                type: 'achievement',
                message: `<strong>${title}</strong><br>${message}`
            });
            return;
        }

        // Fallback toast
        const toast = document.createElement('div');
        toast.className = 'achievement-toast';
        toast.innerHTML = `
            <div class="achievement-toast-content">
                <strong>${title}</strong>
                <p>${message}</p>
            </div>
        `;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    /**
     * Hidden Messages (Triple-click easter eggs)
     */
    function initHiddenMessages() {
        // Logo triple-click
        const logo = document.querySelector('.logo');
        if (logo) {
            let clickTimer = null;
            let clickCounter = 0;

            logo.addEventListener('click', (e) => {
                clickCounter++;
                if (clickCounter === 3) {
                    revealHiddenMessage('logo');
                    clickCounter = 0;
                }
                clearTimeout(clickTimer);
                clickTimer = setTimeout(() => clickCounter = 0, 500);
            });
        }

        // Profile image double-click
        const profileImages = document.querySelectorAll('.home .image img, .about .image img');
        profileImages.forEach(img => {
            img.addEventListener('dblclick', () => {
                revealHiddenMessage('profile-image');
            });
        });

        // Footer easter egg (scroll to bottom + wait)
        let footerTimer = null;
        const footer = document.querySelector('.footer');
        if (footer) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        footerTimer = setTimeout(() => {
                            revealHiddenMessage('footer');
                        }, 3000);
                    } else {
                        clearTimeout(footerTimer);
                    }
                });
            }, { threshold: 0.9 });
            observer.observe(footer);
        }
    }

    /**
     * Reveal a hidden message
     */
    function revealHiddenMessage(triggerId) {
        const message = hiddenMessages.find(m => m.trigger === triggerId);
        if (!message) return;

        // Check if already found
        const foundKey = `hidden_${triggerId}`;
        if (achievements.includes(foundKey)) return;

        achievements.push(foundKey);
        hiddenMessagesFound++;
        saveProgress();

        showAchievementToast('🔍 Secret Found!', message.message);

        // Unlock collector achievement
        if (hiddenMessagesFound >= 3 && !achievements.includes('secret_hunter')) {
            unlockAchievement({
                id: 'secret_hunter',
                name: 'Secret Hunter',
                desc: 'Found all hidden messages',
                icon: '🕵️'
            });
        }
    }

    /**
     * Mini-Game: Click Target Challenge
     */
    function initMiniGame() {
        // Create floating mini-game trigger (appears after 60 seconds on page)
        setTimeout(() => {
            if (achievements.includes('mini_game_master')) return; // Already beaten

            const trigger = document.createElement('div');
            trigger.className = 'mini-game-trigger';
            trigger.innerHTML = '🎯';
            trigger.title = 'Click to play a mini-game!';
            trigger.addEventListener('click', startMiniGame);
            document.body.appendChild(trigger);

            // Animate in
            setTimeout(() => trigger.classList.add('visible'), 100);
        }, 60000); // Appears after 1 minute
    }

    /**
     * Start the click target mini-game
     */
    function startMiniGame() {
        const overlay = document.createElement('div');
        overlay.className = 'mini-game-overlay';
        overlay.innerHTML = `
            <div class="mini-game-container">
                <h3>🎯 Target Practice</h3>
                <p>Click <span id="targets-remaining">5</span> targets as fast as you can!</p>
                <div class="mini-game-arena" id="game-arena"></div>
                <p class="mini-game-time">Time: <span id="game-time">0.0</span>s</p>
                <button class="mini-game-close" onclick="Gamification.closeMiniGame()">✕ Close</button>
            </div>
        `;
        document.body.appendChild(overlay);

        // Start game
        let targetsHit = 0;
        const totalTargets = 5;
        const startTime = Date.now();
        const arena = document.getElementById('game-arena');
        const timeDisplay = document.getElementById('game-time');
        const remainingDisplay = document.getElementById('targets-remaining');

        // Update timer
        const timerInterval = setInterval(() => {
            timeDisplay.textContent = ((Date.now() - startTime) / 1000).toFixed(1);
        }, 100);

        // Spawn target
        function spawnTarget() {
            if (targetsHit >= totalTargets) return;

            const target = document.createElement('div');
            target.className = 'mini-game-target';

            // Random position within arena
            const maxX = arena.offsetWidth - 50;
            const maxY = arena.offsetHeight - 50;
            target.style.left = Math.random() * maxX + 'px';
            target.style.top = Math.random() * maxY + 'px';

            target.addEventListener('click', () => {
                target.remove();
                targetsHit++;
                remainingDisplay.textContent = totalTargets - targetsHit;

                if (targetsHit >= totalTargets) {
                    clearInterval(timerInterval);
                    const finalTime = ((Date.now() - startTime) / 1000).toFixed(2);
                    gameComplete(finalTime);
                } else {
                    spawnTarget();
                }
            });

            arena.appendChild(target);
        }

        // Start first target
        setTimeout(spawnTarget, 500);

        // Game complete
        function gameComplete(time) {
            arena.innerHTML = `
                <div class="mini-game-result">
                    <h2>🎉 Complete!</h2>
                    <p>Your time: <strong>${time}s</strong></p>
                    ${time < 3 ? '<p class="mini-game-bonus">⚡ Lightning fast!</p>' : ''}
                </div>
            `;

            unlockAchievement({
                id: 'mini_game_master',
                name: 'Sharpshooter',
                desc: `Completed target practice in ${time}s`,
                icon: '🎯'
            });

            // Remove trigger button
            const trigger = document.querySelector('.mini-game-trigger');
            if (trigger) trigger.remove();
        }
    }

    /**
     * Close mini-game
     */
    function closeMiniGame() {
        const overlay = document.querySelector('.mini-game-overlay');
        if (overlay) overlay.remove();
    }

    /**
     * Create achievement UI (trophy icon in corner)
     */
    function createAchievementUI() {
        const ui = document.createElement('div');
        ui.className = 'achievements-button';
        ui.innerHTML = `<i class="fas fa-trophy"></i><span class="achievement-count">${achievements.length}</span>`;
        ui.title = 'View Achievements';
        ui.addEventListener('click', showAchievementsModal);
        document.body.appendChild(ui);
    }

    /**
     * Show achievements modal
     */
    function showAchievementsModal() {
        const allAchievements = [
            ...achievementDefinitions,
            { id: 'konami', name: 'Retro Gamer', desc: 'Entered the Konami Code', icon: '🎮' },
            { id: 'secret_hunter', name: 'Secret Hunter', desc: 'Found all hidden messages', icon: '🕵️' },
            { id: 'mini_game_master', name: 'Sharpshooter', desc: 'Completed target practice', icon: '🎯' },
        ];

        // Find the index of first locked achievement (next to unlock)
        let nextLockedIndex = -1;
        for (let i = 0; i < allAchievements.length; i++) {
            if (!achievements.includes(allAchievements[i].id)) {
                nextLockedIndex = i;
                break;
            }
        }

        const modal = document.createElement('div');
        modal.className = 'achievements-modal';
        modal.innerHTML = `
            <div class="achievements-modal-content">
                <h2>🏆 Achievements</h2>
                <p class="achievements-progress">${achievements.length} / ${allAchievements.length} unlocked</p>
                <div class="achievements-list">
                    ${allAchievements.map((a, index) => {
            const isUnlocked = achievements.includes(a.id);
            const isNextToUnlock = index === nextLockedIndex;

            if (isUnlocked) {
                // Unlocked: show full details
                return `
                                <div class="achievement-item unlocked">
                                    <span class="achievement-icon">${a.icon}</span>
                                    <div class="achievement-info">
                                        <strong>${a.name}</strong>
                                        <p>${a.desc}</p>
                                    </div>
                                </div>
                            `;
            } else if (isNextToUnlock) {
                // Next to unlock: show grayed out with hint
                return `
                                <div class="achievement-item next-unlock">
                                    <span class="achievement-icon grayed">${a.icon}</span>
                                    <div class="achievement-info">
                                        <strong class="grayed">${a.name}</strong>
                                        <p class="hint">${a.desc}</p>
                                    </div>
                                </div>
                            `;
            } else {
                // Fully locked: show only lock icon
                return `
                                <div class="achievement-item locked">
                                    <span class="achievement-icon">🔒</span>
                                    <div class="achievement-info">
                                        <strong>???</strong>
                                        <p>Keep exploring to unlock!</p>
                                    </div>
                                </div>
                            `;
            }
        }).join('')}
                </div>
                <p class="achievements-hint">💡 Tip: Try the Konami Code!</p>
                <button class="achievements-close">Close</button>
            </div>
        `;

        // Prevent page scrolling when modal is open (robust approach)
        const scrollY = window.scrollY;
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.top = `-${scrollY}px`;
        document.body.dataset.modalScrollY = scrollY;

        // Stop Lenis smooth scroll if it exists
        if (window.lenis) {
            window.lenis.stop();
        }

        document.body.appendChild(modal);

        // Close modal function
        const closeModal = () => {
            // Restore body scroll
            const savedScrollY = document.body.dataset.modalScrollY || 0;
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.top = '';
            window.scrollTo(0, parseInt(savedScrollY));

            // Resume Lenis smooth scroll if it exists
            if (window.lenis) {
                window.lenis.start();
            }

            modal.remove();
        };

        // Close button click
        modal.querySelector('.achievements-close').addEventListener('click', closeModal);

        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Close on Escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);

        // Prevent background scroll - allow scrolling inside achievements-list but not the background
        const preventScroll = (e) => {
            const list = modal.querySelector('.achievements-list');
            // If scrolling inside the list, allow it naturally
            if (list && list.contains(e.target)) {
                // Let the list scroll naturally - don't prevent
                e.stopPropagation();
                return;
            }
            // Outside list area, prevent all scroll
            e.preventDefault();
            e.stopPropagation();
        };

        modal.addEventListener('wheel', preventScroll, { passive: false });
        modal.addEventListener('touchmove', preventScroll, { passive: false });
    }

    /**
     * Get current stats
     */
    function getStats() {
        return {
            clickCount,
            achievements: achievements.length,
            hiddenMessagesFound
        };
    }

    // Public API
    return {
        init,
        getStats,
        closeMiniGame,
        showAchievementsModal
    };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Gamification.init();
});

// Export for global use
window.Gamification = Gamification;

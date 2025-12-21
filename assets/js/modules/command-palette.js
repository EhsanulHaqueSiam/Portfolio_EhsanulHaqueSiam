/**
 * Command Palette Module
 * Cmd+K style navigation for developer portfolios
 */

const CommandPalette = (function () {
    // Configuration - Expanded commands list
    const commands = [
        // Navigation - Main sections
        { id: 'home', title: 'Home', desc: 'Go to hero section', icon: 'fa-home', section: 'Navigation', href: '/#home' },
        { id: 'about', title: 'About', desc: 'Learn about me', icon: 'fa-user', section: 'Navigation', href: '/#about' },
        { id: 'skills', title: 'Skills', desc: 'View my skills & abilities', icon: 'fa-laptop-code', section: 'Navigation', href: '/#skills' },
        { id: 'education', title: 'Education', desc: 'My educational background', icon: 'fa-graduation-cap', section: 'Navigation', href: '/#education' },
        { id: 'publications', title: 'Publications', desc: 'Research papers & articles', icon: 'fa-book-open', section: 'Navigation', href: '/#publications' },
        { id: 'projects', title: 'Projects', desc: 'View my work & projects', icon: 'fa-code', section: 'Navigation', href: '/#work' },
        { id: 'awards', title: 'Awards', desc: 'Achievements & recognition', icon: 'fa-trophy', section: 'Navigation', href: '/#award' },
        { id: 'experience', title: 'Experience', desc: 'Professional experience', icon: 'fa-briefcase', section: 'Navigation', href: '/#experience' },
        { id: 'contact', title: 'Contact', desc: 'Get in touch with me', icon: 'fa-envelope', section: 'Navigation', href: '/#contact' },

        // Pages - Full page views
        { id: 'projects-page', title: 'All Projects', desc: 'View all projects with filters', icon: 'fa-folder-open', section: 'Pages', href: '/projects/', external: false },
        { id: 'publications-page', title: 'All Publications', desc: 'View all research papers', icon: 'fa-file-alt', section: 'Pages', href: '/publications/', external: false },
        { id: 'experience-page', title: 'Full Experience', desc: 'Complete work history', icon: 'fa-id-badge', section: 'Pages', href: '/experience/', external: false },
        { id: 'achievements-page', title: 'All Achievements', desc: 'View all awards & achievements', icon: 'fa-medal', section: 'Pages', href: '/achievements/', external: false },

        // Actions
        { id: 'theme', title: 'Toggle Theme', desc: 'Switch between light and dark mode', icon: 'fa-moon', section: 'Actions', action: 'toggleTheme' },
        { id: 'resume-view', title: 'View Resume', desc: 'View my resume in a new tab', icon: 'fa-file-pdf', section: 'Actions', href: 'https://flowcv.com/resume/61p1hietib2o', external: true },
        { id: 'resume-download', title: 'Download Resume', desc: 'Download my resume/CV', icon: 'fa-download', section: 'Actions', href: 'https://flowcv.com/resume/61p1hietib2o', external: true },
        { id: 'achievements-modal', title: 'View Achievements 🏆', desc: 'See unlocked achievements', icon: 'fa-star', section: 'Actions', action: 'showAchievements' },

        // Social Links
        { id: 'linkedin', title: 'LinkedIn', desc: 'Connect on LinkedIn', icon: 'fa-linkedin', section: 'Social', href: 'https://www.linkedin.com/in/EhsanulHaqueSiam/', external: true },
        { id: 'github', title: 'GitHub', desc: 'View my repositories', icon: 'fa-github', section: 'Social', href: 'https://github.com/EhsanulHaqueSiam', external: true },
        { id: 'twitter', title: 'X (Twitter)', desc: 'Follow on X', icon: 'fa-x-twitter', section: 'Social', href: 'https://x.com/mdehaquesiam', external: true },
        { id: 'devto', title: 'Dev.to', desc: 'Read my blog posts', icon: 'fa-dev', section: 'Social', href: 'https://dev.to/ehsanulhaquesiam', external: true },
        { id: 'instagram', title: 'Instagram', desc: 'Follow on Instagram', icon: 'fa-instagram', section: 'Social', href: 'https://www.instagram.com/siam_2111', external: true },
        { id: 'email', title: 'Send Email', desc: 'ehsanul.siamdev@gmail.com', icon: 'fa-envelope', section: 'Social', href: 'mailto:ehsanul.siamdev@gmail.com', external: true },
        { id: 'whatsapp', title: 'WhatsApp', desc: 'Message on WhatsApp', icon: 'fa-whatsapp', section: 'Social', href: 'https://wa.me/8801721199215', external: true },
    ];

    let isOpen = false;
    let selectedIndex = 0;
    let filteredCommands = [...commands];
    let overlay, palette, input, results;

    /**
     * Initialize the command palette
     */
    function init() {
        createDOM();
        bindEvents();
    }

    /**
     * Create DOM elements
     */
    function createDOM() {
        // Create overlay
        overlay = document.createElement('div');
        overlay.className = 'command-palette-overlay';
        overlay.setAttribute('aria-hidden', 'true');

        // Create palette container
        palette = document.createElement('div');
        palette.className = 'command-palette';
        palette.setAttribute('role', 'dialog');
        palette.setAttribute('aria-modal', 'true');
        palette.setAttribute('aria-label', 'Command Palette');

        palette.innerHTML = `
            <div class="command-palette-header">
                <i class="fas fa-search"></i>
                <input type="text" class="command-palette-input" placeholder="Search commands, pages, actions..." autocomplete="off" spellcheck="false">
                <div class="command-palette-shortcut">
                    <kbd>ESC</kbd>
                </div>
            </div>
            <div class="command-palette-results" role="listbox"></div>
            <div class="command-palette-footer">
                <div class="command-palette-footer-hints">
                    <span class="command-palette-footer-hint"><kbd>↑↓</kbd> Navigate</span>
                    <span class="command-palette-footer-hint"><kbd>↵</kbd> Select</span>
                    <span class="command-palette-footer-hint"><kbd>ESC</kbd> Close</span>
                </div>
                <span>Cmd+K to open</span>
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(palette);

        input = palette.querySelector('.command-palette-input');
        results = palette.querySelector('.command-palette-results');

        renderResults();
    }

    /**
     * Bind event listeners
     */
    function bindEvents() {
        // Global keyboard shortcut
        document.addEventListener('keydown', handleGlobalKeydown);

        // Overlay click to close
        overlay.addEventListener('click', close);

        // Input events
        input.addEventListener('input', handleSearch);
        input.addEventListener('keydown', handleInputKeydown);

        // Click on items
        results.addEventListener('click', handleResultClick);

        // Prevent background scroll when palette is open
        overlay.addEventListener('wheel', preventBackgroundScroll, { passive: false });
        overlay.addEventListener('touchmove', preventBackgroundScroll, { passive: false });
        palette.addEventListener('wheel', handlePaletteScroll, { passive: false });
        palette.addEventListener('touchmove', handlePaletteScroll, { passive: false });
    }

    /**
     * Prevent background scroll
     */
    function preventBackgroundScroll(e) {
        if (isOpen) {
            e.preventDefault();
            e.stopPropagation();
        }
    }

    /**
     * Handle scroll within the palette - allow results to scroll but prevent page scroll
     */
    function handlePaletteScroll(e) {
        if (!isOpen) return;

        // Check if scrolling inside results
        const resultsEl = palette.querySelector('.command-palette-results');
        if (resultsEl && resultsEl.contains(e.target)) {
            const { scrollTop, scrollHeight, clientHeight } = resultsEl;
            const isAtTop = scrollTop === 0;
            const isAtBottom = scrollTop + clientHeight >= scrollHeight;

            // Prevent scroll if at boundaries
            if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
                e.preventDefault();
            }
            // Otherwise allow scrolling within results
        } else {
            // Outside results area, prevent scroll
            e.preventDefault();
        }
        e.stopPropagation();
    }

    /**
     * Handle global keyboard shortcuts
     */
    function handleGlobalKeydown(e) {
        // Cmd+K or Ctrl+K to open
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            toggle();
        }

        // ESC to close
        if (e.key === 'Escape' && isOpen) {
            e.preventDefault();
            close();
        }
    }

    /**
     * Handle keyboard navigation in input
     */
    function handleInputKeydown(e) {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                selectNext();
                break;
            case 'ArrowUp':
                e.preventDefault();
                selectPrev();
                break;
            case 'Enter':
                e.preventDefault();
                executeSelected();
                break;
        }
    }

    /**
     * Handle search input
     */
    function handleSearch() {
        const query = input.value.toLowerCase().trim();

        if (!query) {
            filteredCommands = [...commands];
        } else {
            filteredCommands = commands.filter(cmd =>
                cmd.title.toLowerCase().includes(query) ||
                cmd.desc.toLowerCase().includes(query) ||
                cmd.section.toLowerCase().includes(query)
            );
        }

        selectedIndex = 0;
        renderResults();
    }

    /**
     * Handle click on result items
     */
    function handleResultClick(e) {
        const item = e.target.closest('.command-palette-item');
        if (item) {
            const index = parseInt(item.dataset.index, 10);
            selectedIndex = index;
            executeSelected();
        }
    }

    /**
     * Render the results list
     */
    function renderResults() {
        if (filteredCommands.length === 0) {
            results.innerHTML = `
                <div class="command-palette-empty">
                    <i class="fas fa-search"></i>
                    <p>No results found</p>
                </div>
            `;
            return;
        }

        // Group by section
        const sections = {};
        filteredCommands.forEach((cmd, index) => {
            if (!sections[cmd.section]) {
                sections[cmd.section] = [];
            }
            sections[cmd.section].push({ ...cmd, globalIndex: index });
        });

        let html = '';
        for (const [section, items] of Object.entries(sections)) {
            html += `<div class="command-palette-section">${section}</div>`;
            items.forEach(item => {
                const isSelected = item.globalIndex === selectedIndex ? 'selected' : '';
                const iconClass = item.icon.startsWith('fa-') ?
                    (item.section === 'Social' && !['fa-envelope'].includes(item.icon) ? 'fab' : 'fas') + ' ' + item.icon :
                    'fas ' + item.icon;

                html += `
                    <div class="command-palette-item ${isSelected}" data-index="${item.globalIndex}" role="option" aria-selected="${item.globalIndex === selectedIndex}">
                        <div class="command-palette-item-icon">
                            <i class="${iconClass}"></i>
                        </div>
                        <div class="command-palette-item-content">
                            <div class="command-palette-item-title">${item.title}</div>
                            <div class="command-palette-item-desc">${item.desc}</div>
                        </div>
                        ${item.external ? '<i class="fas fa-external-link-alt" style="opacity: 0.5; font-size: 1.2rem;"></i>' : ''}
                    </div>
                `;
            });
        }

        results.innerHTML = html;
        scrollToSelected();
    }

    /**
     * Select next item
     */
    function selectNext() {
        if (selectedIndex < filteredCommands.length - 1) {
            selectedIndex++;
            renderResults();
        }
    }

    /**
     * Select previous item
     */
    function selectPrev() {
        if (selectedIndex > 0) {
            selectedIndex--;
            renderResults();
        }
    }

    /**
     * Scroll to keep selected item visible
     */
    function scrollToSelected() {
        const selectedItem = results.querySelector('.command-palette-item.selected');
        if (selectedItem) {
            selectedItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }

    /**
     * Execute the selected command
     */
    function executeSelected() {
        const cmd = filteredCommands[selectedIndex];
        if (!cmd) return;

        close();

        // Handle different action types
        if (cmd.action) {
            executeAction(cmd.action);
        } else if (cmd.href) {
            if (cmd.external) {
                window.open(cmd.href, '_blank', 'noopener,noreferrer');
            } else {
                // Check if it's a page navigation (starts with /) or section navigation (starts with #)
                if (cmd.href.startsWith('/')) {
                    // Page navigation - check if we need to navigate to a different page
                    const currentPath = window.location.pathname;
                    const targetUrl = new URL(cmd.href, window.location.origin);
                    const targetPath = targetUrl.pathname;
                    const targetHash = targetUrl.hash;

                    if (currentPath === '/' && targetPath === '/' && targetHash) {
                        // Same page, just scroll to section
                        const target = document.querySelector(targetHash);
                        if (target) {
                            target.scrollIntoView({ behavior: 'smooth' });
                            history.pushState(null, '', targetHash);
                        }
                    } else {
                        // Navigate to different page or page with hash
                        window.location.href = cmd.href;
                    }
                } else {
                    // Section navigation (hash only)
                    const target = document.querySelector(cmd.href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                        history.pushState(null, '', cmd.href);
                    }
                }
            }
        }
    }

    /**
     * Execute special actions
     */
    function executeAction(action) {
        switch (action) {
            case 'toggleTheme':
                // Use existing theme toggle if available
                const themeToggle = document.querySelector('.theme-toggle');
                if (themeToggle) {
                    themeToggle.click();
                } else {
                    // Fallback toggle
                    const current = document.documentElement.getAttribute('data-theme');
                    const newTheme = current === 'dark' ? 'light' : 'dark';
                    document.documentElement.setAttribute('data-theme', newTheme);
                    localStorage.setItem('portfolio-theme', newTheme);
                }
                break;

            case 'showAchievements':
                // Open achievements modal if Gamification is available
                if (typeof Gamification !== 'undefined' && Gamification.showAchievementsModal) {
                    setTimeout(() => Gamification.showAchievementsModal(), 100);
                } else {
                    console.warn('Gamification module not available');
                }
                break;
        }
    }

    /**
     * Open the command palette
     */
    function open() {
        isOpen = true;
        overlay.classList.add('active');
        palette.classList.add('active');

        // Lock body scroll - more robust approach
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.top = `-${window.scrollY}px`;
        document.body.dataset.scrollY = window.scrollY;

        // Stop Lenis smooth scroll if it exists
        if (window.lenis) {
            window.lenis.stop();
        }

        // Reset state
        input.value = '';
        filteredCommands = [...commands];
        selectedIndex = 0;
        renderResults();

        // Focus input
        setTimeout(() => input.focus(), 50);
    }

    /**
     * Close the command palette
     */
    function close() {
        isOpen = false;
        overlay.classList.remove('active');
        palette.classList.remove('active');

        // Restore body scroll
        const scrollY = document.body.dataset.scrollY || 0;
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        window.scrollTo(0, parseInt(scrollY));

        // Resume Lenis smooth scroll if it exists
        if (window.lenis) {
            window.lenis.start();
        }
    }

    /**
     * Toggle the command palette
     */
    function toggle() {
        if (isOpen) {
            close();
        } else {
            open();
        }
    }

    // Public API
    return {
        init,
        open,
        close,
        toggle
    };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    CommandPalette.init();
});

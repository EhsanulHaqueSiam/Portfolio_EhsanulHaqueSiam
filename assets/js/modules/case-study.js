/**
 * Case Study Module
 * Interactive before/after sliders and case study templates
 */

const CaseStudy = (function () {
    /**
     * Initialize all case study components
     */
    function init() {
        initBeforeAfterSliders();
        initMetricCounters();
        console.log('✅ Case Study components initialized');
    }

    /**
     * Initialize before/after comparison sliders
     */
    function initBeforeAfterSliders() {
        const sliders = document.querySelectorAll('.before-after-slider');

        sliders.forEach(slider => {
            const handle = slider.querySelector('.before-after-slider-handle');
            const beforeContainer = slider.querySelector('.before-after-before');

            if (!handle || !beforeContainer) return;

            let isDragging = false;

            // Mouse events
            handle.addEventListener('mousedown', startDrag);
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDrag);

            // Touch events
            handle.addEventListener('touchstart', startDrag, { passive: true });
            document.addEventListener('touchmove', drag, { passive: true });
            document.addEventListener('touchend', stopDrag);

            // Click on slider to move handle
            slider.addEventListener('click', (e) => {
                if (e.target === handle) return;
                updateSliderPosition(e);
            });

            function startDrag(e) {
                isDragging = true;
                slider.style.cursor = 'ew-resize';
            }

            function stopDrag() {
                isDragging = false;
                slider.style.cursor = '';
            }

            function drag(e) {
                if (!isDragging) return;
                updateSliderPosition(e);
            }

            function updateSliderPosition(e) {
                const rect = slider.getBoundingClientRect();
                let x;

                if (e.type.includes('touch')) {
                    x = e.touches[0].clientX - rect.left;
                } else {
                    x = e.clientX - rect.left;
                }

                // Clamp between 0 and width
                const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));

                handle.style.left = `${percentage}%`;
                beforeContainer.style.width = `${percentage}%`;
            }
        });
    }

    /**
     * Animate metric counters on scroll
     */
    function initMetricCounters() {
        const metricValues = document.querySelectorAll('.metric-card-value[data-value]');

        if (metricValues.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateMetric(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        metricValues.forEach(el => observer.observe(el));
    }

    /**
     * Animate a single metric value
     */
    function animateMetric(element) {
        const finalValue = parseFloat(element.dataset.value);
        const suffix = element.dataset.suffix || '';
        const prefix = element.dataset.prefix || '';
        const decimals = (element.dataset.decimals !== undefined) ? parseInt(element.dataset.decimals) : 0;
        const duration = 2000;
        const start = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = finalValue * easeProgress;

            element.textContent = prefix + currentValue.toFixed(decimals) + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    /**
     * Create a case study HTML template
     */
    function createCaseStudyHTML(data) {
        return `
            <article class="case-study" data-aos="fade-up">
                <!-- Header -->
                <div class="case-study-header">
                    <div class="case-study-icon">
                        <i class="${data.icon || 'fas fa-project-diagram'}"></i>
                    </div>
                    <div class="case-study-title-section">
                        <h3 class="case-study-title">${data.title}</h3>
                        <p class="case-study-subtitle">${data.subtitle || ''}</p>
                        <div class="case-study-tags">
                            ${data.tags.map(tag => `<span class="case-study-tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                </div>

                <!-- Process Flow -->
                <div class="process-flow">
                    <div class="process-step">
                        <div class="process-step-icon"><i class="fas fa-exclamation-triangle"></i></div>
                        <span class="process-step-label">Problem</span>
                        <span class="process-step-desc">${data.problem.short || 'Challenge identified'}</span>
                    </div>
                    <span class="process-arrow"><i class="fas fa-arrow-right"></i></span>
                    <div class="process-step">
                        <div class="process-step-icon"><i class="fas fa-cogs"></i></div>
                        <span class="process-step-label">Process</span>
                        <span class="process-step-desc">${data.process.short || 'Solution developed'}</span>
                    </div>
                    <span class="process-arrow"><i class="fas fa-arrow-right"></i></span>
                    <div class="process-step">
                        <div class="process-step-icon"><i class="fas fa-check-circle"></i></div>
                        <span class="process-step-label">Solution</span>
                        <span class="process-step-desc">${data.solution.short || 'Results delivered'}</span>
                    </div>
                </div>

                <!-- Problem Section -->
                <section class="case-study-section">
                    <h4 class="case-study-section-title">
                        <i class="fas fa-bullseye"></i> Problem Statement
                    </h4>
                    <p>${data.problem.description}</p>
                </section>

                ${data.beforeAfter ? `
                <!-- Before/After Comparison -->
                <section class="case-study-section">
                    <h4 class="case-study-section-title">
                        <i class="fas fa-exchange-alt"></i> Before & After
                    </h4>
                    <div class="before-after-slider">
                        <img src="${data.beforeAfter.after}" alt="After" />
                        <div class="before-after-before">
                            <img src="${data.beforeAfter.before}" alt="Before" />
                        </div>
                        <div class="before-after-slider-handle"></div>
                        <span class="before-after-label before">Before</span>
                        <span class="before-after-label after">After</span>
                    </div>
                </section>
                ` : ''}

                <!-- Solution Section -->
                <section class="case-study-section">
                    <h4 class="case-study-section-title">
                        <i class="fas fa-lightbulb"></i> Solution Approach
                    </h4>
                    <p>${data.solution.description}</p>
                </section>

                <!-- Metrics -->
                <section class="case-study-section">
                    <h4 class="case-study-section-title">
                        <i class="fas fa-chart-line"></i> Results & Metrics
                    </h4>
                    <div class="metrics-grid">
                        ${data.metrics.map(metric => `
                            <div class="metric-card">
                                <div class="metric-card-icon"><i class="${metric.icon || 'fas fa-chart-bar'}"></i></div>
                                <div class="metric-card-value" data-value="${metric.value}" data-suffix="${metric.suffix || ''}" data-prefix="${metric.prefix || ''}" data-decimals="${metric.decimals || 0}">
                                    ${metric.prefix || ''}0${metric.suffix || ''}
                                </div>
                                <div class="metric-card-label">${metric.label}</div>
                                ${metric.change ? `
                                    <span class="metric-card-change ${metric.changeType || 'positive'}">
                                        <i class="fas fa-${metric.changeType === 'negative' ? 'arrow-down' : 'arrow-up'}"></i>
                                        ${metric.change}
                                    </span>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                </section>

                ${data.learnings ? `
                <!-- Key Learnings -->
                <div class="learnings-box">
                    <h4><i class="fas fa-graduation-cap"></i> Key Learnings</h4>
                    <ul>
                        ${data.learnings.map(learning => `<li>${learning}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}

                <!-- Actions -->
                <div class="case-study-actions">
                    ${data.links?.github ? `<a href="${data.links.github}" class="btn btn-secondary" target="_blank"><i class="fab fa-github"></i> View Code</a>` : ''}
                    ${data.links?.demo ? `<a href="${data.links.demo}" class="btn btn-primary" target="_blank"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ''}
                    ${data.links?.paper ? `<a href="${data.links.paper}" class="btn btn-secondary" target="_blank"><i class="fas fa-file-alt"></i> Read Paper</a>` : ''}
                </div>
            </article>
        `;
    }

    /**
     * Sample case study data
     */
    const sampleCaseStudies = [
        {
            title: 'LLM Fine-Tuning Pipeline',
            subtitle: 'Domain-Specific Language Model Optimization',
            icon: 'fas fa-robot',
            tags: ['NLP', 'LLaMA 2', 'QLoRA', 'PyTorch'],
            problem: {
                short: 'Generic LLM responses',
                description: 'Generic large language models lacked domain-specific knowledge for technical documentation, resulting in inaccurate responses and poor user experience for specialized queries.'
            },
            process: {
                short: 'QLoRA fine-tuning',
                description: 'Implemented a custom fine-tuning pipeline using QLoRA with 4-bit quantization to efficiently adapt the base model while maintaining quality.'
            },
            solution: {
                short: '94% accuracy',
                description: 'Created a specialized fine-tuning workflow with custom datasets, progressive training, and comprehensive evaluation metrics. The final model showed significant improvement in domain-specific tasks.'
            },
            metrics: [
                { label: 'Accuracy', value: 94.2, suffix: '%', decimals: 1, icon: 'fas fa-bullseye', change: '+12%', changeType: 'positive' },
                { label: 'Latency', value: 45, suffix: 'ms', icon: 'fas fa-tachometer-alt', change: '-35%', changeType: 'positive' },
                { label: 'Training Time', value: 4, suffix: ' hrs', icon: 'fas fa-clock' },
                { label: 'Model Size', value: 7, suffix: 'B', icon: 'fas fa-microchip' }
            ],
            learnings: [
                'QLoRA significantly reduces memory requirements without sacrificing quality',
                'Data quality matters more than quantity for fine-tuning',
                'Progressive training with curriculum learning improves convergence'
            ],
            links: {
                github: 'https://github.com/EhsanulHaqueSiam',
                demo: '#'
            }
        },
        {
            title: 'RL Trading Agent',
            subtitle: 'Deep Reinforcement Learning for Algorithmic Trading',
            icon: 'fas fa-chart-line',
            tags: ['Reinforcement Learning', 'PPO', 'Finance', 'PyTorch'],
            problem: {
                short: 'Manual trading bias',
                description: 'Traditional trading strategies were affected by emotional bias and couldn\'t adapt to rapidly changing market conditions in real-time.'
            },
            process: {
                short: 'PPO agent training',
                description: 'Developed a custom trading environment with realistic market simulation and trained a PPO agent with specialized reward shaping.'
            },
            solution: {
                short: '2.1 Sharpe ratio',
                description: 'Built a robust RL trading agent that consistently outperforms baseline strategies across various market conditions, with proper risk management built into the reward function.'
            },
            metrics: [
                { label: 'Sharpe Ratio', value: 2.1, decimals: 1, icon: 'fas fa-chart-bar', change: '+0.8', changeType: 'positive' },
                { label: 'Win Rate', value: 67, suffix: '%', icon: 'fas fa-trophy' },
                { label: 'Max Drawdown', value: 8, suffix: '%', icon: 'fas fa-arrow-down', changeType: 'positive' },
                { label: 'Trades/Day', value: 12, icon: 'fas fa-exchange-alt' }
            ],
            learnings: [
                'Reward shaping is critical for stable training in financial environments',
                'Proper position sizing prevents catastrophic losses',
                'Ensemble of agents provides more robust performance'
            ],
            links: {
                github: 'https://github.com/EhsanulHaqueSiam',
                paper: '#'
            }
        }
    ];

    /**
     * Render case studies to a container
     */
    function renderCaseStudies(containerId, data = sampleCaseStudies) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = data.map(study => createCaseStudyHTML(study)).join('');

        // Re-initialize sliders
        initBeforeAfterSliders();
        initMetricCounters();

        // Refresh AOS
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }

    // Public API
    return {
        init,
        createCaseStudyHTML,
        renderCaseStudies,
        initBeforeAfterSliders,
        sampleCaseStudies
    };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    CaseStudy.init();
});

// Export for global use
window.CaseStudy = CaseStudy;

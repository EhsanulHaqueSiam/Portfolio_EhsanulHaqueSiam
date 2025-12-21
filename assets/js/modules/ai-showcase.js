/**
 * AI Developer Showcase Module
 * GitHub Stats, Interactive Charts, and Model Cards
 */

const AIShowcase = (function () {
    const GITHUB_USERNAME = 'EhsanulHaqueSiam';

    /**
     * Initialize all showcase components
     */
    function init() {
        initSkillsChart();
        console.log('✅ AI Showcase initialized');
    }

    /**
     * Initialize Skills Radar/Polar Chart
     */
    function initSkillsChart() {
        const chartContainer = document.getElementById('skills-chart');
        if (!chartContainer || typeof Chart === 'undefined') return;

        const ctx = chartContainer.getContext('2d');

        // Detect dark mode
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

        const data = {
            labels: ['AI/ML', 'Python', 'LLMs', 'Backend', 'RL', 'Java'],
            datasets: [{
                label: 'Skill Level',
                data: [90, 95, 85, 80, 75, 85],
                backgroundColor: isDark
                    ? 'rgba(139, 92, 246, 0.3)'
                    : 'rgba(115, 3, 167, 0.2)',
                borderColor: isDark
                    ? '#a78bfa'
                    : '#7303a7',
                borderWidth: 2,
                pointBackgroundColor: isDark ? '#a78bfa' : '#7303a7',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: isDark ? '#a78bfa' : '#7303a7',
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        };

        const options = {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `${context.label}: ${context.raw}%`;
                        }
                    }
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20,
                        display: true,
                        color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                        backdropColor: 'transparent',
                        font: {
                            size: 10
                        }
                    },
                    grid: {
                        color: isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(115, 3, 167, 0.2)'
                    },
                    angleLines: {
                        color: isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(115, 3, 167, 0.2)'
                    },
                    pointLabels: {
                        font: {
                            size: 14,
                            weight: 700
                        },
                        color: isDark ? '#f0f6fc' : '#1a1a2e'
                    }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeOutQuart'
            }
        };

        new Chart(ctx, {
            type: 'radar',
            data: data,
            options: options
        });
    }

    /**
     * Create GitHub Stats HTML
     * Call this to generate the stats section
     */
    function createGitHubStatsHTML() {
        const theme = document.documentElement.getAttribute('data-theme') === 'dark'
            ? 'github_dark'
            : 'default';

        return `
            <div class="github-stats-container">
                <div class="github-stat-card" data-aos="fade-up">
                    <img src="https://github-readme-stats.vercel.app/api?username=${GITHUB_USERNAME}&show_icons=true&theme=${theme}&hide_border=true&include_all_commits=true" 
                         alt="GitHub Stats" loading="lazy" />
                </div>
                <div class="github-stat-card" data-aos="fade-up" data-aos-delay="100">
                    <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${GITHUB_USERNAME}&layout=compact&theme=${theme}&hide_border=true" 
                         alt="Top Languages" loading="lazy" />
                </div>
                <div class="github-stat-card github-contribution-graph" data-aos="fade-up" data-aos-delay="200">
                    <img src="https://github-readme-streak-stats.herokuapp.com/?user=${GITHUB_USERNAME}&theme=${theme === 'github_dark' ? 'dark' : 'default'}&hide_border=true" 
                         alt="GitHub Streak" loading="lazy" />
                </div>
            </div>
        `;
    }

    /**
     * Create Model Card HTML
     * @param {Object} model - Model details
     */
    function createModelCardHTML(model) {
        return `
            <div class="model-card" data-aos="fade-up">
                <div class="model-card-header">
                    <div class="model-card-icon">
                        <i class="${model.icon || 'fas fa-brain'}"></i>
                    </div>
                    <div class="model-card-title">
                        <h4>${model.name}</h4>
                        <span class="model-version">
                            v${model.version || '1.0'}
                            ${model.status ? `<span class="badge">${model.status}</span>` : ''}
                        </span>
                    </div>
                </div>
                <p class="model-card-description">${model.description}</p>
                <div class="model-card-specs">
                    ${model.specs.map(spec => `
                        <div class="model-spec">
                            <div class="model-spec-label">${spec.label}</div>
                            <div class="model-spec-value">${spec.value}</div>
                        </div>
                    `).join('')}
                </div>
                <div class="model-card-metrics">
                    ${model.metrics.map(metric => `
                        <span class="metric-badge">
                            <i class="${metric.icon || 'fas fa-chart-line'}"></i>
                            ${metric.label}: ${metric.value}
                        </span>
                    `).join('')}
                </div>
                <div class="model-card-tags">
                    ${model.tags.map(tag => `<span class="model-tag">${tag}</span>`).join('')}
                </div>
                ${model.links ? `
                    <div class="model-card-actions">
                        ${model.links.github ? `<a href="${model.links.github}" class="btn btn-secondary" target="_blank"><i class="fab fa-github"></i> Code</a>` : ''}
                        ${model.links.demo ? `<a href="${model.links.demo}" class="btn btn-primary" target="_blank"><i class="fas fa-play"></i> Demo</a>` : ''}
                        ${model.links.paper ? `<a href="${model.links.paper}" class="btn btn-secondary" target="_blank"><i class="fas fa-file-alt"></i> Paper</a>` : ''}
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Sample model data (customize with your actual models)
     */
    const sampleModels = [
        {
            name: 'LLM Fine-Tuning Pipeline',
            version: '2.0',
            status: 'Production',
            icon: 'fas fa-robot',
            description: 'Custom fine-tuning pipeline for domain-specific LLMs using LoRA/QLoRA techniques with optimized training strategies.',
            specs: [
                { label: 'Framework', value: 'PyTorch' },
                { label: 'Base Model', value: 'LLaMA 2' },
                { label: 'Parameters', value: '7B-13B' },
                { label: 'Training', value: 'QLoRA' }
            ],
            metrics: [
                { label: 'Accuracy', value: '94.2%', icon: 'fas fa-bullseye' },
                { label: 'Latency', value: '45ms', icon: 'fas fa-tachometer-alt' }
            ],
            tags: ['NLP', 'Transformers', 'Fine-tuning', 'LoRA'],
            links: {
                github: 'https://github.com/EhsanulHaqueSiam',
                demo: '#'
            }
        },
        {
            name: 'RL Trading Agent',
            version: '1.5',
            status: 'Research',
            icon: 'fas fa-chart-line',
            description: 'Deep reinforcement learning agent for algorithmic trading using PPO and custom reward shaping.',
            specs: [
                { label: 'Algorithm', value: 'PPO' },
                { label: 'Environment', value: 'Custom' },
                { label: 'Action Space', value: 'Discrete' },
                { label: 'Observations', value: 'OHLCV' }
            ],
            metrics: [
                { label: 'Sharpe Ratio', value: '2.1', icon: 'fas fa-chart-bar' },
                { label: 'Win Rate', value: '67%', icon: 'fas fa-trophy' }
            ],
            tags: ['Reinforcement Learning', 'Finance', 'PPO', 'Gym'],
            links: {
                github: 'https://github.com/EhsanulHaqueSiam',
                paper: '#'
            }
        },
        {
            name: 'Multi-Modal Vision Model',
            version: '1.0',
            status: 'Development',
            icon: 'fas fa-eye',
            description: 'Vision-language model for image captioning and visual question answering using CLIP embeddings.',
            specs: [
                { label: 'Architecture', value: 'ViT + GPT' },
                { label: 'Input', value: 'Image + Text' },
                { label: 'Output', value: 'Text' },
                { label: 'Embedding', value: 'CLIP' }
            ],
            metrics: [
                { label: 'BLEU-4', value: '0.42', icon: 'fas fa-language' },
                { label: 'CIDEr', value: '1.21', icon: 'fas fa-star' }
            ],
            tags: ['Computer Vision', 'VQA', 'CLIP', 'Transformers'],
            links: {
                github: 'https://github.com/EhsanulHaqueSiam'
            }
        }
    ];

    /**
     * Render all model cards
     */
    function renderModelCards(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = sampleModels.map(model => createModelCardHTML(model)).join('');
    }

    // Public API
    return {
        init,
        createGitHubStatsHTML,
        createModelCardHTML,
        renderModelCards,
        sampleModels
    };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    AIShowcase.init();
});

// Export for global use
window.AIShowcase = AIShowcase;

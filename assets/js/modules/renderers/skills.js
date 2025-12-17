/**
 * Skills Renderer Module
 * Handles rendering skills section with categories and proficiency levels
 */

import { fetchData } from '../data-fetcher.js';

/**
 * Get level bar width and color based on proficiency
 */
const getLevelStyles = (level) => {
    const levels = {
        expert: { width: '95%', color: '#7303a7', label: 'Expert' },
        advanced: { width: '80%', color: '#2506ad', label: 'Advanced' },
        intermediate: { width: '60%', color: '#ff7b00', label: 'Intermediate' }
    };
    return levels[level] || levels.intermediate;
};

/**
 * Render skills section with categories and levels
 */
export const renderSkills = async () => {
    try {
        const data = await fetchData("skills");
        const skillsContainer = document.getElementById("skillsContainer");

        if (!skillsContainer) return;

        // Handle both old array format and new category format
        const categories = data.categories || data;

        if (Array.isArray(categories) && !categories[0]?.skills) {
            // Old format - render simple grid
            skillsContainer.innerHTML = categories
                .map(skill => `
                    <div class="bar">
                        <div class="info">
                            <img src="${skill.icon}" alt="${skill.name}" />
                            <span>${skill.name}</span>
                        </div>
                    </div>
                `)
                .join("");
            return;
        }

        // New category format
        skillsContainer.innerHTML = categories
            .map(category => `
                <div class="skill-category">
                    <div class="category-header">
                        <i class="${category.icon}"></i>
                        <h3>${category.name}</h3>
                    </div>
                    <div class="category-skills">
                        ${category.skills.map(skill => {
                const levelStyle = getLevelStyles(skill.level);
                return `
                                <div class="skill-item">
                                    <div class="skill-info">
                                        <img src="${skill.icon}" alt="${skill.name}" loading="lazy" />
                                        <span class="skill-name">${skill.name}</span>
                                        <span class="skill-level" data-level="${skill.level}">${levelStyle.label}</span>
                                    </div>
                                    <div class="skill-bar">
                                        <div class="skill-progress" style="width: ${levelStyle.width}; background: linear-gradient(90deg, ${levelStyle.color}, ${levelStyle.color}88);"></div>
                                    </div>
                                </div>
                            `;
            }).join("")}
                    </div>
                </div>
            `)
            .join("");

        // Animate skill bars on scroll
        animateSkillBars();
    } catch (error) {
        console.error("Failed to render skills:", error);
        const container = document.getElementById("skillsContainer");
        if (container) {
            container.innerHTML = `<p style="color:red;">Error loading skills: ${error.message}</p>`;
        }
    }
};

/**
 * Animate skill bars when they come into view
 */
const animateSkillBars = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBars = entry.target.querySelectorAll('.skill-progress');
                progressBars.forEach((bar, index) => {
                    setTimeout(() => {
                        bar.style.transform = 'scaleX(1)';
                        bar.style.opacity = '1';
                    }, index * 100);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.skill-category').forEach(cat => observer.observe(cat));
};

/**
 * Skills Renderer Module
 * Handles rendering skills section with categories and proficiency levels
 */

import { fetchData } from '/assets/js/modules/data-fetcher.js';

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

        // Check if new category format (has categories property)
        if (data.categories && Array.isArray(data.categories)) {
            renderCategorySkills(skillsContainer, data.categories);
            animateSkillBars();
            return;
        }
        // Old format - render simple grid
        if (Array.isArray(data)) {
            skillsContainer.innerHTML = data
                .map(skill => `
                    <div class="bar">
                        <div class="info">
                            <img src="${skill.icon}" alt="${skill.name}" />
                            <span>${skill.name}</span>
                        </div>
                    </div>
                `)
                .join("");
        }
    } catch (error) {
        console.error("Failed to render skills:", error);
        const container = document.getElementById("skillsContainer");
        if (container) {
            container.innerHTML = `<p style="color:red;">Error loading skills: ${error.message}</p>`;
        }
    }
};

/**
 * Render category-based skills layout (compact design)
 */
const renderCategorySkills = (container, categories) => {
    container.innerHTML = categories
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
                                <img src="${skill.icon}" alt="${skill.name}" loading="lazy" />
                                <span class="skill-name">${skill.name}</span>
                                <span class="skill-level" data-level="${skill.level}">${levelStyle.label}</span>
                            </div>
                        `;
        }).join("")}
                </div>
            </div>
        `)
        .join("");
};

/**
 * Animate skill bars when they come into view
 */
const animateSkillBars = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.skill-category').forEach(cat => observer.observe(cat));
};

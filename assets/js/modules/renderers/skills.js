/**
 * Skills Renderer Module
 * Handles rendering skills section from JSON data
 */

import { fetchData } from '../data-fetcher.js';

/**
 * Render skills section with icons and names
 */
export const renderSkills = async () => {
    try {
        const skills = await fetchData("skills");
        const skillsContainer = document.getElementById("skillsContainer");

        if (!skillsContainer || !skills.length) return;

        skillsContainer.innerHTML = skills
            .map(skill => `
                <div class="bar">
                    <div class="info">
                        <img src="${skill.icon}" alt="${skill.name}" />
                        <span>${skill.name}</span>
                    </div>
                </div>
            `)
            .join("");
    } catch (error) {
        console.error("Failed to render skills:", error);
        const container = document.getElementById("skillsContainer");
        if (container) {
            container.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
        }
    }
};

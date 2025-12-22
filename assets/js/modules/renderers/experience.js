/**
 * Experience Renderer Module
 * Handles rendering experience timeline section
 */

import { fetchData } from '/assets/js/modules/data-fetcher.js';

/**
 * Generate HTML for a single experience item
 * @param {Object} exp - Experience data object
 * @returns {string} - HTML string for experience item
 */
const generateExperienceHtml = (exp) => {
    return `
        <div class="container ${exp.alignment || "right"}">
            <div class="content">
                <div class="tag">
                    <h2>${exp.company}</h2>
                </div>
                <div class="desc">
                    <h3>${exp.role}</h3>
                    <p>${exp.date}</p>
                    <p>${exp.desc || ""}</p>
                </div>
            </div>
        </div>
    `;
};

/**
 * Render experience timeline section
 */
export const renderExperience = async () => {
    try {
        const experience = await fetchData("experience");
        const container = document.querySelector("#experience .timeline");

        if (!container || !experience.length) return;

        // Filter experience based on current page
        // Homepage: only show experience with showInHome === true
        // Experience page: show all experience
        const isExperiencePage = window.location.pathname.includes("experience");
        const filteredExperience = isExperiencePage
            ? experience
            : experience.filter(exp => exp.showInHome === true);

        container.innerHTML = filteredExperience
            .map(exp => generateExperienceHtml(exp))
            .join("");

    } catch (error) {
        console.error("Failed to render experience:", error);
        const container = document.querySelector("#experience .timeline");
        if (container) {
            container.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
        }
    }
};

/**
 * Toast Notification Module
 * Provides toast notifications for user feedback
 */

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {string} type - 'success' or 'error'
 * @param {number} duration - Duration in ms (default 3000)
 */
export const showToast = (message, type = 'success', duration = 3000) => {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    // Remove toast after animation
    setTimeout(() => {
        toast.remove();
    }, duration);
};

/**
 * Copy text to clipboard and show toast
 * @param {string} text - Text to copy
 * @param {string} label - Label for the toast (e.g., "Email")
 */
export const copyToClipboard = async (text, label = 'Text') => {
    try {
        await navigator.clipboard.writeText(text);
        showToast(`${label} copied to clipboard!`, 'success');
    } catch (err) {
        showToast('Failed to copy to clipboard', 'error');
    }
};

/**
 * Initialize copy-to-clipboard functionality for contact elements
 */
export const initCopyToClipboard = () => {
    // Add click-to-copy for contact info
    document.querySelectorAll('.contact-card[data-copy]').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const text = card.dataset.copy;
            const label = card.dataset.label || 'Text';
            copyToClipboard(text, label);
        });
    });

    // Add click-to-copy for footer contact info
    document.querySelectorAll('.footer .box p[data-copy]').forEach(el => {
        el.style.cursor = 'pointer';
        el.addEventListener('click', () => {
            const text = el.dataset.copy;
            const label = el.dataset.label || 'Text';
            copyToClipboard(text, label);
        });
    });
};

/**
 * Dev Tools Protection Module
 * Handles disabling common developer tools shortcuts
 */

/**
 * Blocked key combinations
 */
const blockedCombinations = [
    { code: "F12" },                                    // F12 Developer Tools
    { ctrl: true, shift: true, code: "KeyI" },          // Ctrl+Shift+I
    { ctrl: true, shift: true, code: "KeyC" },          // Ctrl+Shift+C
    { ctrl: true, shift: true, code: "KeyJ" },          // Ctrl+Shift+J
    { ctrl: true, code: "KeyU" }                        // Ctrl+U View Source
];

/**
 * Check if a key event matches a blocked combination
 * @param {KeyboardEvent} e - Keyboard event
 * @param {Object} combo - Combination to check
 * @returns {boolean} - Whether the combination matches
 */
const matchesCombination = (e, combo) => {
    const ctrlMatch = combo.ctrl ? e.ctrlKey : !e.ctrlKey || !combo.ctrl;
    const shiftMatch = combo.shift ? e.shiftKey : !e.shiftKey || !combo.shift;
    const codeMatch = e.code === combo.code;

    return ctrlMatch && shiftMatch && codeMatch;
};

/**
 * Initialize developer tools protection
 * Blocks common keyboard shortcuts for opening dev tools
 */
export const initDevToolsProtection = () => {
    document.onkeydown = (e) => {
        for (const combo of blockedCombinations) {
            if (matchesCombination(e, combo)) {
                e.preventDefault();
                return false;
            }
        }
    };
};

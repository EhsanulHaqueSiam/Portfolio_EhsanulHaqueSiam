/**
 * Page Visibility Module
 * Handles tab visibility change effects (title and favicon changes)
 */

/**
 * Initialize page visibility change handler
 * Changes title and favicon when user leaves/returns to tab
 */
export const initVisibilityHandler = () => {
    const originalTitle = "Portfolio | Ehsanul Haque";
    const awayTitle = "Come Back To Portfolio";
    const originalFavicon = "assets/images/favicon.png";
    const awayFavicon = "assets/images/favhand.png";

    document.addEventListener("visibilitychange", () => {
        const favicon = document.querySelector("#favicon");

        if (document.visibilityState === "visible") {
            document.title = originalTitle;
            if (favicon) favicon.setAttribute("href", originalFavicon);
        } else {
            document.title = awayTitle;
            if (favicon) favicon.setAttribute("href", awayFavicon);
        }
    });
};

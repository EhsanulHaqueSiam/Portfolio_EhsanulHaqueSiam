/**
 * Contact Form Module
 * Handles contact form submission via EmailJS
 */

/**
 * Initialize EmailJS contact form
 * @param {string} userId - EmailJS user ID
 * @param {string} serviceId - EmailJS service ID
 * @param {string} templateId - EmailJS template ID
 */
export const initContactForm = (
    userId = "user_#############",
    serviceId = "contact_service",
    templateId = "template_contact"
) => {
    const contactForm = document.querySelector("#contact-form");

    if (!contactForm) return;

    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        try {
            // Initialize EmailJS
            if (typeof emailjs !== 'undefined') {
                emailjs.init(userId);

                const response = await emailjs.sendForm(
                    serviceId,
                    templateId,
                    "#contact-form"
                );

                console.log("SUCCESS!", response.status, response.text);
                e.target.reset();
                alert("Form Submitted Successfully");
            } else {
                console.error("EmailJS not loaded");
                alert("Email service not available");
            }
        } catch (error) {
            console.error("FAILED...", error);
            alert("Form Submission Failed! Try Again");
        }
    });
};

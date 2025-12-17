$(document).ready(function () {
  // Toggle menu and navbar
  $("#menu").click(function () {
    $(this).toggleClass("fa-times");
    $(".navbar").toggleClass("nav-toggle");
  });

  // Scroll behavior for navbar and scroll-to-top button
  $(window).on("scroll load", function () {
    $("#menu").removeClass("fa-times");
    $(".navbar").removeClass("nav-toggle");

    if (window.scrollY > 60) {
      document.querySelector("#scroll-top").classList.add("active");
    } else {
      document.querySelector("#scroll-top").classList.remove("active");
    }
  });
});

/* Fetch and Render Experience Data */
const renderExperience = async () => {
  try {
    const response = await fetch("/assets/data/experience.json");
    if (!response.ok) throw new Error("Failed to fetch experience");
    const experience = await response.json();
    const container = document.querySelector(".experience .timeline");
    if (!container || !experience.length) return;

    container.innerHTML = experience
      .map(
        (exp) => `
      <div class="container ${exp.alignment ? exp.alignment.toLowerCase() : "right"}">
        <div class="content">
          <div class="tag">
            <h2>${exp.company}</h2>
          </div>
          <div class="desc">
            <h3>${exp.role}</h3>
            <p>${exp.date}</p>
            ${exp.desc ? `<p>${exp.desc}</p>` : ''}
          </div>
        </div>
      </div>`
      )
      .join("");

    // Trigger animations with Intersection Observer
    const timelineItems = document.querySelectorAll('.experience .container');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          const item = entry.target;
          const delay = index * 150;
          setTimeout(() => {
            if (item.classList.contains('left')) {
              item.classList.add('animate-left');
            } else {
              item.classList.add('animate-right');
            }
          }, delay);
          observer.unobserve(item);
        }
      });
    }, { threshold: 0.2 });

    timelineItems.forEach(item => observer.observe(item));

  } catch (error) {
    console.error("Failed to render experience:", error);
  }
};

renderExperience();

/* ===== SCROLL REVEAL ANIMATION ===== */
const srtop = ScrollReveal({
  origin: "top",
  distance: "80px",
  duration: 800,
  reset: true,
});

/* SCROLL EXPERIENCE */
srtop.reveal(".experience .timeline", { delay: 400 });
srtop.reveal(".experience .timeline .container", { interval: 200 });

/* Live Chat Widget Removed */

/* ===== Disable Developer Mode ===== */
document.onkeydown = function (e) {
  if (
    e.code === "F12" ||
    (e.ctrlKey &&
      e.shiftKey &&
      (e.code === "KeyI" || e.code === "KeyC" || e.code === "KeyJ")) ||
    (e.ctrlKey && e.code === "KeyU")
  ) {
    e.preventDefault();
    return false;
  }
};

/* ===== Visibility Change Event ===== */
document.addEventListener("visibilitychange", function () {
  if (document.visibilityState === "visible") {
    document.title = "Experience | Portfolio Ehsanul Haque";
    $("#favicon").attr("href", "/assets/images/favicon.png");
  } else {
    document.title = "Come Back To Portfolio";
    $("#favicon").attr("href", "/assets/images/favhand.png");
  }
});

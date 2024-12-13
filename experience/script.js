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

/* ===== SCROLL REVEAL ANIMATION ===== */
const srtop = ScrollReveal({
  origin: "top",
  distance: "80px",
  duration: 1000,
  reset: true,
});s

/* SCROLL EXPERIENCE */
srtop.reveal(".experience .timeline", { delay: 400 });
srtop.reveal(".experience .timeline .container", { interval: 400 });

/* ===== Tawk.to Live Chat ===== */
var Tawk_API = Tawk_API || {},
  Tawk_LoadStart = new Date();
(function () {
  var s1 = document.createElement("script"),
    s0 = document.getElementsByTagName("script")[0];
  s1.async = true;
  s1.src = "https://embed.tawk.to/60df10bf7f4b000ac03ab6a8/1f9jlirg6";
  s1.setAttribute("crossorigin", "*");
  s0.parentNode.insertBefore(s1, s0);
})();

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

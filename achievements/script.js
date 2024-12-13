$(document).ready(function () {
  $("#menu").click(function () {
    $(this).toggleClass("fa-times");
    $(".navbar").toggleClass("nav-toggle");
  });

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

document.addEventListener("visibilitychange", function () {
  if (document.visibilityState === "visible") {
    document.title = "achievements | Portfolio Ehsanul Haque";
    $("#favicon").attr("href", "/assets/images/favicon.png");
  } else {
    document.title = "Come Back To Portfolio";
    $("#favicon").attr("href", "/assets/images/favhand.png");
  }
});

// Fetch achievements start
function getAchievements() {
  return fetch("achievements.json")
    .then((response) => response.json())
    .then((data) => data);
}

function showAchievements(achievements) {
  let achievementsContainer = document.querySelector(".award .box-container");
  let achievementsHTML = "";

  achievements.forEach((achievement) => {
    achievementsHTML += `
        <div class="grid-item ${achievement.category}">
        <div class="box tilt" style="width: 380px; margin: 1rem">
          <img draggable="false" src="/assets/images/achievements/${achievement.image}.png" alt="achievement" />
          <div class="content">
            <div class="tag">
              <h3>${achievement.name}</h3>
            </div>
            <div class="desc">
              <p>${achievement.desc}</p>
            </div>
          </div>
        </div>
        </div>`;
  });

  achievementsContainer.innerHTML = achievementsHTML;

  // Isotope filter products
  var $grid = $(".box-container").isotope({
    itemSelector: ".grid-item",
    layoutMode: "fitRows",
    masonry: {
      columnWidth: 200,
    },
  });

  // Filter items on button click
  $(".button-group").on("click", "button", function () {
    $(".button-group").find(".is-checked").removeClass("is-checked");
    $(this).addClass("is-checked");
    var filterValue = $(this).attr("data-filter");
    $grid.isotope({ filter: filterValue });
  });
}

getAchievements().then((data) => {
  showAchievements(data);
});

// Start of Tawk.to Live Chat
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

// Disable developer mode
document.onkeydown = function (e) {
  // Disable F12
  if (e.code === "F12") {
    return false;
  }

  // Disable Ctrl+Shift+I, Ctrl+Shift+C, Ctrl+Shift+J
  if (
    e.ctrlKey &&
    e.shiftKey &&
    (e.code === "KeyI" || e.code === "KeyC" || e.code === "KeyJ")
  ) {
    return false;
  }

  // Disable Ctrl+U
  if (e.ctrlKey && e.code === "KeyU") {
    return false;
  }
};

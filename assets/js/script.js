document.addEventListener("DOMContentLoaded", () => {
  const menu = document.querySelector("#menu");
  const navbar = document.querySelector(".navbar");
  const scrollTopBtn = document.querySelector("#scroll-top");
  const scrollProgress = document.querySelector("#scroll-progress");

  // Menu toggle
  menu.addEventListener("click", () => {
    menu.classList.toggle("fa-times");
    navbar.classList.toggle("nav-toggle");
  });

  // Scroll and load event
  window.addEventListener("scroll", () => handleScroll());
  window.addEventListener("load", () => handleScroll());

  const handleScroll = () => {
    menu.classList.remove("fa-times");
    navbar.classList.remove("nav-toggle");

    // Scroll progress bar
    if (scrollProgress) {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      scrollProgress.style.width = scrollPercent + "%";
    }

    if (window.scrollY > 60) {
      scrollTopBtn.classList.add("active");
    } else {
      scrollTopBtn.classList.remove("active");
    }

    // Scroll spy
    document.querySelectorAll("section").forEach((section) => {
      const height = section.offsetHeight;
      const offset = section.offsetTop - 200;
      const top = window.scrollY;
      const id = section.getAttribute("id");

      if (top > offset && top < offset + height) {
        document.querySelectorAll(".navbar ul li a").forEach((link) => {
          link.classList.remove("active");
        });
        navbar.querySelector(`[href="#${id}"]`)?.classList.add("active");
      }
    });
  };

  // Smooth scrolling
  document.querySelectorAll('a[href*="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelector(anchor.getAttribute("href"))?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });

  // EmailJS form submission
  document
    .querySelector("#contact-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        // TODO: Replace with your actual EmailJS user ID
        emailjs.init("user_#############");
        const response = await emailjs.sendForm(
          "contact_service",
          "template_contact",
          "#contact-form"
        );
        console.log("SUCCESS!", response.status, response.text);
        e.target.reset();
        alert("Form Submitted Successfully");
      } catch (error) {
        console.error("FAILED...", error);
        alert("Form Submission Failed! Try Again");
      }
    });

  // Visibility change
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      document.title = "Portfolio | Ehsanul Haque";
      document
        .querySelector("#favicon")
        .setAttribute("href", "assets/images/favicon.png");
    } else {
      document.title = "Come Back To Portfolio";
      document
        .querySelector("#favicon")
        .setAttribute("href", "assets/images/favhand.png");
    }
  });

  // Typed.js initialization
  new Typed(".typing-text", {
    strings: [
      "Android development",
      "Game development",
      "Backend development"
    ],
    loop: true,
    typeSpeed: 50,
    backSpeed: 25,
    backDelay: 500,
  });

  // Fetch data and render
  const fetchData = async (type = "skills") => {
    const urls = {
      skills: "skills.json",
      projects: "./projects/projects.json",
      achievements: "./achievements/achievements.json",
    };
    try {
      const response = await fetch(urls[type]);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error(`Failed to fetch ${type}:`, error);
      return [];
    }
  };

  const renderSkills = async () => {
    try {
      const skills = await fetchData("skills");
      const skillsContainer = document.getElementById("skillsContainer");
      if (!skillsContainer || !skills.length) return;
      skillsContainer.innerHTML = skills
        .map(
          (skill) => `
                <div class="bar">
                    <div class="info">
                        <img src="${skill.icon}" alt="skill" />
                        <span>${skill.name}</span>
                    </div>
                </div>`
        )
        .join("");
    } catch (error) {
      console.error("Failed to render skills:", error);
    }
  };

  const renderProjects = async () => {
    try {
      const projects = await fetchData("projects");
      const projectsContainer = document.querySelector("#work .box-container");
      if (!projectsContainer || !projects.length) return;
      projectsContainer.innerHTML = projects
        .filter((project) => project.category !== "android")
        .slice(0, 10)
        .map(
          (project) => `
                <div class="box tilt">
                    <img draggable="false" src="/assets/images/projects/${project.image}.png" alt="${project.name}" />
                    <div class="content">
                        <div class="tag"><h3>${project.name}</h3></div>
                        <div class="desc">
                            <p>${project.desc}</p>
                            <div class="btns">
                                <a href="${project.links.view}" class="btn" target="_blank"><i class="fas fa-eye"></i> View</a>
                                <a href="${project.links.code}" class="btn" target="_blank">Code <i class="fas fa-code"></i></a>
                            </div>
                        </div>
                    </div>
                </div>`
        )
        .join("");

      VanillaTilt.init(document.querySelectorAll(".tilt"), { max: 15 });
      ScrollReveal().reveal(".work .box", { interval: 200 });
    } catch (error) {
      console.error("Failed to render projects:", error);
    }
  };

  const renderAchievements = async () => {
    try {
      const achievements = await fetchData("achievements");
      const achievementsContainer = document.querySelector(
        "#award .box-container"
      );
      if (!achievementsContainer || !achievements.length) return;
      achievementsContainer.innerHTML = achievements
        .filter((achievement) => achievement.category !== "android")
        .slice(0, 10)
        .map(
          (achievement) => `
                <div class="box tilt">
                    <img draggable="false" src="/assets/images/achievements/${achievement.image}.png" alt="${achievement.name}" />
                    <div class="content">
                        <div class="tag"><h3>${achievement.name}</h3></div>
                        <div class="desc">
                            <p>${achievement.desc}</p>
                        </div>
                    </div>
                </div>`
        )
        .join("");

      VanillaTilt.init(document.querySelectorAll(".tilt"), { max: 15 });
      ScrollReveal().reveal(".award .box", { interval: 200 });
    } catch (error) {
      console.error("Failed to render achievements:", error);
    }
  };

  renderSkills();
  renderProjects();
  renderAchievements();

  // Disable developer mode
  document.onkeydown = function (e) {
    // Prevent default behavior for specific key combinations
    if (e.code === "F12") {
      // F12 for Developer Tools
      e.preventDefault();
      return false;
    }
    if (e.ctrlKey && e.shiftKey && e.code === "KeyI") {
      // Ctrl+Shift+I
      e.preventDefault();
      return false;
    }
    if (e.ctrlKey && e.shiftKey && e.code === "KeyC") {
      // Ctrl+Shift+C
      e.preventDefault();
      return false;
    }
    if (e.ctrlKey && e.shiftKey && e.code === "KeyJ") {
      // Ctrl+Shift+J
      e.preventDefault();
      return false;
    }
    if (e.ctrlKey && e.code === "KeyU") {
      // Ctrl+U
      e.preventDefault();
      return false;
    }
  };

  // Initialize ScrollReveal animations
  ScrollReveal().reveal(
    ".home .content h3, .about .content h3, .skills .container, .education .box",
    { interval: 200 }
  );
});

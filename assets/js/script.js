document.addEventListener("DOMContentLoaded", () => {
  const menu = document.querySelector("#menu");
  const navbar = document.querySelector(".navbar");
  const scrollTopBtn = document.querySelector("#scroll-top");

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
      "Backend development",
      "Frontend development",
      "Web development",
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
    const response = await fetch(urls[type]);
    return response.json();
  };

  const renderSkills = async () => {
    const skills = await fetchData("skills");
    const skillsContainer = document.getElementById("skillsContainer");
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
  };

  const renderProjects = async () => {
    const projects = await fetchData("projects");
    const projectsContainer = document.querySelector("#work .box-container");
    projectsContainer.innerHTML = projects
      .filter((project) => project.category !== "android")
      .slice(0, 10)
      .map(
        (project) => `
                <div class="box tilt">
                    <img draggable="false" src="/assets/images/projects/${project.image}.png" alt="project" />
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
  };

  const renderAchievements = async () => {
    const achievements = await fetchData("achievements");
    const achievementsContainer = document.querySelector(
      "#award .box-container"
    );
    achievementsContainer.innerHTML = achievements
      .filter((achievement) => achievement.category !== "android")
      .slice(0, 10)
      .map(
        (achievement) => `
                <div class="box tilt">
                    <img draggable="false" src="/assets/images/achievements/${achievement.image}.png" alt="achievement" />
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

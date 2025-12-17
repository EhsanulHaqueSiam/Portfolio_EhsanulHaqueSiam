const initPortfolio = () => {
  // ==================== PHOTO GALLERY LIGHTBOX ====================
  let currentGalleryImages = [];
  let currentGalleryIndex = 0;
  let lightboxElement = null;

  const createGalleryLightbox = () => {
    if (lightboxElement) return;

    const lightbox = document.createElement('div');
    lightbox.className = 'gallery-lightbox';
    lightbox.id = 'gallery-lightbox';
    lightbox.innerHTML = `
      <div class="gallery-lightbox-content">
        <button class="gallery-lightbox-close" aria-label="Close gallery">&times;</button>
        <button class="gallery-lightbox-nav prev" aria-label="Previous image"><i class="fas fa-chevron-left"></i></button>
        <img class="gallery-lightbox-image" src="" alt="Gallery image">
        <button class="gallery-lightbox-nav next" aria-label="Next image"><i class="fas fa-chevron-right"></i></button>
        <div class="gallery-lightbox-counter"></div>
        <div class="gallery-lightbox-thumbnails"></div>
      </div>
    `;
    document.body.appendChild(lightbox);
    lightboxElement = lightbox;

    // Event listeners
    lightbox.querySelector('.gallery-lightbox-close').addEventListener('click', closeGallery);
    lightbox.querySelector('.gallery-lightbox-nav.prev').addEventListener('click', () => navigateGallery(-1));
    lightbox.querySelector('.gallery-lightbox-nav.next').addEventListener('click', () => navigateGallery(1));

    // Close on background click
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeGallery();
    });

    // Keyboard navigation
    document.addEventListener('keydown', handleGalleryKeyboard);
  };

  const handleGalleryKeyboard = (e) => {
    if (!lightboxElement || !lightboxElement.classList.contains('active')) return;

    switch (e.key) {
      case 'Escape':
        closeGallery();
        break;
      case 'ArrowLeft':
        navigateGallery(-1);
        break;
      case 'ArrowRight':
        navigateGallery(1);
        break;
    }
  };

  const openGallery = (images, startIndex = 0, type = 'projects') => {
    createGalleryLightbox();
    currentGalleryImages = images.map(img => resolveImage(img, type));
    currentGalleryIndex = startIndex;
    updateGalleryDisplay();
    lightboxElement.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeGallery = () => {
    if (lightboxElement) {
      lightboxElement.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  const navigateGallery = (direction) => {
    currentGalleryIndex += direction;
    if (currentGalleryIndex < 0) currentGalleryIndex = currentGalleryImages.length - 1;
    if (currentGalleryIndex >= currentGalleryImages.length) currentGalleryIndex = 0;
    updateGalleryDisplay();
  };

  const updateGalleryDisplay = () => {
    if (!lightboxElement || !currentGalleryImages.length) return;

    const mainImage = lightboxElement.querySelector('.gallery-lightbox-image');
    const counter = lightboxElement.querySelector('.gallery-lightbox-counter');
    const thumbnailContainer = lightboxElement.querySelector('.gallery-lightbox-thumbnails');
    const prevBtn = lightboxElement.querySelector('.gallery-lightbox-nav.prev');
    const nextBtn = lightboxElement.querySelector('.gallery-lightbox-nav.next');

    // Update main image with fade effect
    mainImage.style.opacity = '0';
    setTimeout(() => {
      mainImage.src = currentGalleryImages[currentGalleryIndex];
      mainImage.style.opacity = '1';
    }, 150);

    // Update counter
    counter.textContent = `${currentGalleryIndex + 1} / ${currentGalleryImages.length}`;

    // Hide nav buttons if only one image
    const singleImage = currentGalleryImages.length <= 1;
    prevBtn.style.display = singleImage ? 'none' : 'flex';
    nextBtn.style.display = singleImage ? 'none' : 'flex';

    // Update thumbnails
    if (currentGalleryImages.length > 1) {
      thumbnailContainer.innerHTML = currentGalleryImages.map((img, idx) =>
        `<img src="${img}" class="gallery-lightbox-thumb ${idx === currentGalleryIndex ? 'active' : ''}" data-index="${idx}" alt="Thumbnail ${idx + 1}">`
      ).join('');
      thumbnailContainer.style.display = 'flex';

      // Add click handlers to thumbnails
      thumbnailContainer.querySelectorAll('.gallery-lightbox-thumb').forEach(thumb => {
        thumb.addEventListener('click', () => {
          currentGalleryIndex = parseInt(thumb.dataset.index);
          updateGalleryDisplay();
        });
      });
    } else {
      thumbnailContainer.style.display = 'none';
    }
  };

  // ==================== END PHOTO GALLERY LIGHTBOX ====================

  const menu = document.querySelector("#menu");
  const navbar = document.querySelector(".navbar");
  const scrollTopBtn = document.querySelector("#scroll-top");
  const scrollProgress = document.querySelector("#scroll-progress");

  // Menu toggle
  if (menu) {
    menu.addEventListener("click", () => {
      menu.classList.toggle("fa-times");
      navbar.classList.toggle("nav-toggle");
    });
  }

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
        navbar.querySelector(`[href = "#${id}"]`)?.classList.add("active");
      }
    });
  };

  // Smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelector(anchor.getAttribute("href"))?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });

  // EmailJS form submission
  const contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
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
  }

  // Visibility change
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      document.title = "Portfolio | Ehsanul Haque";
      const favicon = document.querySelector("#favicon");
      if (favicon) favicon.setAttribute("href", "assets/images/favicon.png");
    } else {
      document.title = "Come Back To Portfolio";
      const favicon = document.querySelector("#favicon");
      if (favicon) favicon.setAttribute("href", "assets/images/favhand.png");
    }
  });

  // Typed.js initialization
  if (typeof Typed !== 'undefined' && document.querySelector(".typing-text")) {
    var typed = new Typed(".typing-text", {
      strings: ["frontend development", "backend development", "web designing", "android development", "web development"],
      loop: true,
      typeSpeed: 30,
      backSpeed: 15,
      backDelay: 1200,
    });
  }

  // Fetch data and render
  const fetchData = async (type = "skills") => {
    const urls = {
      skills: "/assets/data/skills.json",
      projects: "/assets/data/projects.json",
      achievements: "/assets/data/achievements.json",
      publications: "/assets/data/publications.json",
      experience: "/assets/data/experience.json",
    };
    try {
      const response = await fetch(urls[type]);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} `);
      }
      return response.json();
    } catch (error) {
      console.error(`Failed to fetch ${type}: `, error);
      if (type === 'publications') {
        const container = document.querySelector("#publications .box-container");
        if (container) container.innerHTML = "<h1>FETCH ERROR: " + error.message + "</h1>";
      }
      return [];
    }
  };

  const resolveImage = (img, type) => {
    if (!img) return "";
    // If it's a full URL or absolute path, use as is (fix relative dot if present)
    if (img.startsWith("http") || img.startsWith("/")) return img;
    if (img.startsWith("./")) return img.substring(1); // Remove dot, make absolute

    // If it has an extension, assume it's a path relative to assets/images/{type}/ or root? 
    // Actually, legacy data just had "name".
    if (img.includes(".")) return `/assets/images/${type}/${img}`;

    // Default: append .png and usage correct folder
    return `/assets/images/${type}/${img}.png`;
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
      const container = document.getElementById("skillsContainer");
      if (container) container.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
    }
  };

  const renderProjects = async () => {
    try {
      const projects = await fetchData("projects");
      const projectsContainer = document.querySelector("#work .box-container");
      if (!projectsContainer || !projects.length) return;
      const filteredProjects = window.location.pathname.includes("projects")
        ? projects
        : projects.filter(p => p.showInHome !== false);

      projectsContainer.innerHTML = filteredProjects
        .filter((project) => project.category !== "android")
        .slice(0, 10)
        .map((project, index) => {
          const images = project.images || [project.image];
          const hasSlider = images.length > 1;
          const imagesJson = JSON.stringify(images).replace(/"/g, '&quot;');
          const imageHtml = hasSlider
            ? `<div class="image-slider gallery-trigger" id="proj-slider-${index}" data-images="${imagesJson}" data-type="projects">
                  ${images.map((img, i) => `<img src="${resolveImage(img, 'projects')}" class="${i === 0 ? 'active' : ''}" alt="${project.name}">`).join('')}
                </div>`
            : `<div class="image gallery-trigger" data-images="${imagesJson}" data-type="projects">
                  <img draggable="false" src="${resolveImage(images[0], 'projects')}" alt="${project.name}" />
                </div>`;
          return `
                <div class="box tilt">
                    ${imageHtml}
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
                </div>`;
        })
        .join("");

      // Initialize Hover-based Sliders for Projects
      const projectSliders = filteredProjects
        .filter((project) => project.category !== "android")
        .slice(0, 10);

      projectSliders.forEach((proj, index) => {
        const images = proj.images || [proj.image];
        if (images.length > 1) {
          const sliderId = `proj-slider-${index}`;
          const sliderEl = document.getElementById(sliderId);
          if (!sliderEl) return;

          let current = 0;
          let hoverInterval = null;

          sliderEl.addEventListener('mouseenter', () => {
            hoverInterval = setInterval(() => {
              const imgs = sliderEl.querySelectorAll('img');
              if (imgs.length > 0) {
                imgs[current].classList.remove('active');
                current = (current + 1) % imgs.length;
                imgs[current].classList.add('active');
              }
            }, 1200);
          });

          sliderEl.addEventListener('mouseleave', () => {
            if (hoverInterval) {
              clearInterval(hoverInterval);
              hoverInterval = null;
            }
          });
        }
      });

      if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll(".tilt"), { max: 15, speed: 400, glare: true, "max-glare": 0.3 });
      }
      if (typeof ScrollReveal !== 'undefined') {
        ScrollReveal().reveal(".work .box", { interval: 100 });
      }

      // Attach gallery click handlers
      projectsContainer.querySelectorAll('.gallery-trigger').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
          e.stopPropagation();
          const images = JSON.parse(trigger.dataset.images.replace(/&quot;/g, '"'));
          const type = trigger.dataset.type;
          openGallery(images, 0, type);
        });
      });
    } catch (error) {
      console.error("Failed to render projects:", error);
      const container = document.querySelector("#work .box-container");
      if (container) container.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
    }
  };

  const renderAchievements = async () => {
    try {
      const achievements = await fetchData("achievements");
      const achievementsContainer = document.querySelector("#award .box-container");
      if (!achievementsContainer || !achievements.length) return;

      const filteredAchievements = window.location.pathname.includes("achievements")
        ? achievements
        : achievements.filter(a => a.showInHome !== false);

      achievementsContainer.innerHTML = filteredAchievements
        .filter((achievement) => achievement.category !== "android")
        .slice(0, 10)
        .map((achievement, index) => {
          const images = achievement.images || [achievement.image];
          const hasSlider = images.length > 1;
          const imagesJson = JSON.stringify(images).replace(/"/g, '&quot;');
          const imageHtml = hasSlider
            ? `<div class="image-slider gallery-trigger" id="achieve-slider-${index}" data-images="${imagesJson}" data-type="achievements">
                  ${images.map((img, i) => `<img src="${resolveImage(img, 'achievements')}" class="${i === 0 ? 'active' : ''}" alt="${achievement.name}">`).join('')}
                </div>`
            : `<div class="image gallery-trigger" data-images="${imagesJson}" data-type="achievements">
                  <img draggable="false" src="${resolveImage(images[0], 'achievements')}" alt="${achievement.name}" />
                </div>`;
          return `
                <div class="box tilt">
                    ${imageHtml}
                    <div class="content">
                        <div class="tag"><h3>${achievement.name}</h3></div>
                        <div class="desc">
                            <p>${achievement.desc}</p>
                        </div>
                    </div>
                </div>`;
        })
        .join("");

      // Initialize Hover-based Sliders for Achievements
      const achievementSliders = filteredAchievements
        .filter((achievement) => achievement.category !== "android")
        .slice(0, 10);

      achievementSliders.forEach((ach, index) => {
        const images = ach.images || [ach.image];
        if (images.length > 1) {
          const sliderId = `achieve-slider-${index}`;
          const sliderEl = document.getElementById(sliderId);
          if (!sliderEl) return;

          let current = 0;
          let hoverInterval = null;

          sliderEl.addEventListener('mouseenter', () => {
            hoverInterval = setInterval(() => {
              const imgs = sliderEl.querySelectorAll('img');
              if (imgs.length > 0) {
                imgs[current].classList.remove('active');
                current = (current + 1) % imgs.length;
                imgs[current].classList.add('active');
              }
            }, 1200);
          });

          sliderEl.addEventListener('mouseleave', () => {
            if (hoverInterval) {
              clearInterval(hoverInterval);
              hoverInterval = null;
            }
          });
        }
      });

      if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll(".tilt"), { max: 15, speed: 400, glare: true, "max-glare": 0.3 });
      }
      if (typeof ScrollReveal !== 'undefined') {
        ScrollReveal().reveal(".award .box", { interval: 100 });
      }

      // Attach gallery click handlers
      achievementsContainer.querySelectorAll('.gallery-trigger').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
          e.stopPropagation();
          const images = JSON.parse(trigger.dataset.images.replace(/&quot;/g, '"'));
          const type = trigger.dataset.type;
          openGallery(images, 0, type);
        });
      });
    } catch (error) {
      console.error("Failed to render achievements:", error);
      const container = document.querySelector("#award .box-container");
      if (container) container.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
    }
  };

  const renderPublications = async () => {
    try {
      const publications = await fetchData("publications");
      const container = document.querySelector("#publications .box-container");
      if (!container || !publications.length) return;

      const filteredPubs = window.location.pathname.includes("publications")
        ? publications
        : publications.filter(pub => pub.showInHome !== false);

      container.innerHTML = filteredPubs
        .map((pub, index) => {
          const images = pub.images || [pub.image];
          const hasSlider = images.length > 1;
          const imagesJson = JSON.stringify(images).replace(/"/g, '&quot;');
          const imageHtml = hasSlider
            ? `<div class="image-slider gallery-trigger" id="pub-slider-${index}" data-images="${imagesJson}" data-type="publications">
                  ${images.map((img, i) => `<img src="${resolveImage(img, 'publications')}" class="${i === 0 ? 'active' : ''}" alt="${pub.title}">`).join('')}
                  <div class="gallery-expand-icon"><i class="fas fa-expand"></i></div>
                </div>`
            : `<div class="image gallery-trigger" data-images="${imagesJson}" data-type="publications">
                  <img src="${resolveImage(images[0], 'publications')}" alt="${pub.title}" onerror="this.src='https://via.placeholder.com/400x250?text=Certificate+Coming+Soon'">
                  <div class="gallery-expand-icon"><i class="fas fa-expand"></i></div>
                </div>`;

          return `
        <div class="box">
          ${imageHtml}
          <div class="content">
            <h3>${pub.title}</h3>
            <p>${pub.conference}</p>
            <h4>${pub.date}</h4>
            <p style="margin-top: 1rem; font-size: 1.3rem;">${pub.desc}</p>
          </div>
        </div>`;
        })
        .join("");

      // Initialize Hover-based Sliders for Publications
      filteredPubs.forEach((pub, index) => {
        const images = pub.images || [pub.image];
        if (images.length > 1) {
          const sliderId = `pub-slider-${index}`;
          const sliderEl = document.getElementById(sliderId);
          if (!sliderEl) return;

          let current = 0;
          let hoverInterval = null;

          sliderEl.addEventListener('mouseenter', () => {
            hoverInterval = setInterval(() => {
              const imgs = sliderEl.querySelectorAll('img');
              if (imgs.length > 0) {
                imgs[current].classList.remove('active');
                current = (current + 1) % imgs.length;
                imgs[current].classList.add('active');
              }
            }, 1200);
          });

          sliderEl.addEventListener('mouseleave', () => {
            if (hoverInterval) {
              clearInterval(hoverInterval);
              hoverInterval = null;
            }
          });
        }
      });

      // Attach gallery click handlers for publications
      container.querySelectorAll('.gallery-trigger').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
          e.stopPropagation();
          const images = JSON.parse(trigger.dataset.images.replace(/&quot;/g, '"'));
          const type = trigger.dataset.type;
          openGallery(images, 0, type);
        });
      });

    } catch (error) {
      console.error("Failed to render publications:", error);
      const container = document.querySelector("#publications .box-container");
      if (container) container.innerHTML = `<p style="color:red; text-align:center; font-size:1.5rem;">Error loading publications: ${error.message}</p>`;
    }
  };

  const renderExperience = async () => {
    try {
      const experience = await fetchData("experience");
      const container = document.querySelector("#experience .timeline");
      if (!container || !experience.length) return;

      container.innerHTML = experience
        .map(
          (exp) => `
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
        </div>`
        )
        .join("");
    } catch (error) {
      console.error("Failed to render experience:", error);
      const container = document.querySelector("#experience .timeline");
      if (container) container.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
    }
  };

  console.log("Calling renderSkills...");
  renderSkills();
  console.log("Calling renderProjects...");
  renderProjects();
  console.log("Calling renderAchievements...");
  renderAchievements();
  console.log("Calling renderPublications...");
  renderPublications();
  console.log("Called renderPublications.");
  renderExperience();

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
    { interval: 100 }
  );
};

if (document.readyState === 'loading') {
  document.addEventListener("DOMContentLoaded", initPortfolio);
} else {
  initPortfolio();
}

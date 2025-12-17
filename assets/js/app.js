/* -----------------------------------------------
/* How to use? : Check the GitHub README
/* ----------------------------------------------- */

/* -----------------------------------------------
/* Theme-aware Particles Configuration
/* ----------------------------------------------- */

// Apply saved theme IMMEDIATELY before anything else runs
// This must happen synchronously before particles init
(function applyThemeEarly() {
  const savedTheme = localStorage.getItem('portfolio-theme');
  console.log('[Particles] Saved theme from localStorage:', savedTheme);

  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    console.log('[Particles] Applied theme:', savedTheme);
  } else {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      console.log('[Particles] Applied system dark preference');
    }
  }
})();

/**
 * Get particle color based on current theme
 */
function getParticleColor() {
  const theme = document.documentElement.getAttribute('data-theme');
  const color = theme === 'dark' ? '#ffffff' : '#000000';
  console.log('[Particles] getParticleColor - theme:', theme, 'color:', color);
  return color;
}

/**
 * Initialize particles with current theme colors
 */
function initParticles() {
  // Check if particles container exists
  const container = document.getElementById('particles-js');
  if (!container) {
    console.log('[Particles] No particles-js container found');
    return;
  }

  // Check if particlesJS is available
  if (typeof particlesJS === 'undefined') {
    console.log('[Particles] particlesJS library not loaded');
    return;
  }

  const particleColor = getParticleColor();
  console.log('[Particles] Initializing with color:', particleColor);

  particlesJS(
    "particles-js",
    {
      particles: {
        number: {
          value: 80,
          density: {
            enable: true,
            value_area: 800,
          },
        },
        color: {
          value: particleColor,
        },
        shape: {
          type: "circle",
          stroke: {
            width: 0,
            color: particleColor,
          },
          polygon: {
            nb_sides: 5,
          },
          image: {
            src: "img/github.svg",
            width: 100,
            height: 100,
          },
        },
        opacity: {
          value: 0.5,
          random: false,
          anim: {
            enable: false,
            speed: 1,
            opacity_min: 0.1,
            sync: false,
          },
        },
        size: {
          value: 5,
          random: true,
          anim: {
            enable: false,
            speed: 40,
            size_min: 0.1,
            sync: false,
          },
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: particleColor,
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: true,
          speed: 6,
          direction: "none",
          random: false,
          straight: false,
          out_mode: "out",
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200,
          },
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: true,
            mode: "repulse",
          },
          onclick: {
            enable: true,
            mode: "push",
          },
          resize: true,
        },
        modes: {
          grab: {
            distance: 400,
            line_linked: {
              opacity: 1,
            },
          },
          bubble: {
            distance: 400,
            size: 40,
            duration: 2,
            opacity: 8,
            speed: 3,
          },
          repulse: {
            distance: 200,
          },
          push: {
            particles_nb: 4,
          },
          remove: {
            particles_nb: 2,
          },
        },
      },
      retina_detect: true,
      config_demo: {
        hide_card: false,
        background_color: "#000000",
        background_image: "",
        background_position: "50% 50%",
        background_repeat: "no-repeat",
        background_size: "cover",
      },
    }
  );

  console.log('[Particles] Initialization complete');
}

// Wait for DOM ready, then initialize particles with a small delay
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('[Particles] DOM ready, waiting 50ms before init');
    setTimeout(initParticles, 50);
  });
} else {
  // DOM already ready
  console.log('[Particles] DOM already ready, waiting 50ms before init');
  setTimeout(initParticles, 50);
}

// Listen for theme changes and reinitialize particles
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
      console.log('[Particles] Theme changed, reinitializing');
      // Clear existing particles and reinitialize
      const particlesContainer = document.getElementById('particles-js');
      if (particlesContainer) {
        // Remove old canvas
        const oldCanvas = particlesContainer.querySelector('canvas');
        if (oldCanvas) {
          oldCanvas.remove();
        }
        // Reinitialize with new colors
        initParticles();
      }
    }
  });
});

// Start observing theme changes on the html element
observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

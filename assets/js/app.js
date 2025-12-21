/* -----------------------------------------------
/* TSParticles Configuration with Cursor Interactivity
/* Better performance than particles.js with interactive features
/* ----------------------------------------------- */

// Apply saved theme IMMEDIATELY before anything else runs
(function applyThemeEarly() {
  const savedTheme = localStorage.getItem('portfolio-theme');

  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }
})();

/**
 * Get particle color based on current theme
 */
function getParticleColor() {
  const theme = document.documentElement.getAttribute('data-theme');
  return theme === 'dark' ? '#ffffff' : '#000000';
}

/**
 * Get accent color for interactive effects
 */
function getAccentColor() {
  const theme = document.documentElement.getAttribute('data-theme');
  return theme === 'dark' ? '#a855f7' : '#7303a7';
}

/**
 * TSParticles configuration with cursor interactivity
 */
function getParticlesConfig() {
  const particleColor = getParticleColor();
  const accentColor = getAccentColor();

  return {
    fpsLimit: 60,
    particles: {
      number: {
        value: 80,
        density: {
          enable: true,
          area: 800,
        },
      },
      color: {
        value: particleColor,
      },
      shape: {
        type: "circle",
      },
      opacity: {
        value: 0.5,
        random: false,
      },
      size: {
        value: { min: 1, max: 5 },
        random: true,
      },
      links: {
        enable: true,
        distance: 150,
        color: particleColor,
        opacity: 0.4,
        width: 1,
      },
      move: {
        enable: true,
        speed: 3,
        direction: "none",
        random: false,
        straight: false,
        outModes: {
          default: "out",
        },
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 1200,
        },
      },
    },
    interactivity: {
      detectsOn: "canvas",
      events: {
        onHover: {
          enable: true,
          mode: ["repulse", "connect"], // Particles repulse AND connect on hover
        },
        onClick: {
          enable: true,
          mode: "push", // Add particles on click
        },
        resize: true,
      },
      modes: {
        // Cursor repulse effect - particles move away from cursor
        repulse: {
          distance: 120,
          duration: 0.4,
          speed: 0.5,
        },
        // Connect particles near cursor with lines
        connect: {
          distance: 100,
          links: {
            opacity: 0.5,
          },
          radius: 150,
        },
        // Grab effect - draw lines between cursor and particles
        grab: {
          distance: 200,
          links: {
            opacity: 0.8,
            color: accentColor,
          },
        },
        // Push new particles on click
        push: {
          quantity: 4,
        },
        // Bubble effect on hover
        bubble: {
          distance: 200,
          size: 8,
          duration: 0.3,
          opacity: 0.8,
        },
      },
    },
    detectRetina: true,
    smooth: true, // Smooth animations
  };
}

// Store the particles instance for cleanup
let particlesInstance = null;

/**
 * Initialize TSParticles with cursor interactivity
 */
async function initParticles() {
  const container = document.getElementById('particles-js');
  if (!container) return;

  // Check if tsParticles is available
  if (typeof tsParticles === 'undefined') {
    console.warn('TSParticles not loaded');
    return;
  }

  try {
    // Destroy existing instance if any
    if (particlesInstance) {
      await particlesInstance.destroy();
    }

    // Initialize with new config
    particlesInstance = await tsParticles.load("particles-js", getParticlesConfig());
    console.log('✅ TSParticles initialized with cursor interactivity');
  } catch (error) {
    console.error('Failed to initialize TSParticles:', error);
  }
}

// Wait for DOM ready, then initialize particles
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initParticles, 50);
  });
} else {
  setTimeout(initParticles, 50);
}

// Listen for theme changes and reinitialize particles
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
      // Reinitialize with new colors
      initParticles();
    }
  });
});

// Start observing theme changes on the html element
observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

// Cleanup on page unload
window.addEventListener('beforeunload', async () => {
  if (particlesInstance) {
    await particlesInstance.destroy();
  }
});

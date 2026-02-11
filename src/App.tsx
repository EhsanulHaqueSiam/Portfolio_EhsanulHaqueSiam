import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Awards } from './components/Awards';
import { Publications } from './components/Publications';
import { Education } from './components/Education';
import { Experience } from './components/Experience';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { SocialLinks } from './components/SocialLinks';
import { CustomCursor, ScrollProgress, SmoothScroll, NoiseOverlay } from './components/ui';
import { profileImage, profileHeroImage, featuredProjects, getProjectImage } from './data/content';

// Preload critical images in background (non-blocking)
if (typeof document !== 'undefined') {
  [profileHeroImage, profileImage, ...(featuredProjects[0]?.images[0] ? [getProjectImage(featuredProjects[0].images[0])] : [])].forEach((src) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    if (src.endsWith('.webp')) {
      link.type = 'image/webp';
    }
    document.head.appendChild(link);
  });
}

function App() {
  return (
    <SmoothScroll>
      <div className="relative">
        {/* Film grain overlay */}
        <NoiseOverlay />

        {/* Custom cursor - only on desktop */}
        <CustomCursor />

        {/* Scroll progress indicator */}
        <ScrollProgress />

        {/* Social links - fixed position, outside main content flow */}
        <SocialLinks />

        {/* Main content - renders immediately, no loading screen */}
        <div className="relative z-10">
          <Navbar />
          <main id="main-content">
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Awards />
            <Publications />
            <Education />
            <Experience />
            <Contact />
          </main>
          <Footer />
        </div>
      </div>
    </SmoothScroll>
  );
}

export default App;

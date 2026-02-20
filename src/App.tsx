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
        {/* Fixed background gradients - uses GPU compositing instead of background-attachment: fixed */}
        <div
          className="fixed inset-0 -z-10 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage:
              'radial-gradient(ellipse at 20% 0%, rgba(139, 92, 246, 0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(245, 158, 11, 0.04) 0%, transparent 50%)',
            willChange: 'transform',
          }}
        />

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
            <div className="cv-auto"><About /></div>
            <div className="cv-auto"><Experience /></div>
            <div className="cv-auto"><Skills /></div>
            <div className="cv-auto"><Projects /></div>
            <div className="cv-auto"><Awards /></div>
            <div className="cv-auto"><Publications /></div>
            <div className="cv-auto"><Education /></div>
            <div className="cv-auto"><Contact /></div>
          </main>
          <Footer />
        </div>
      </div>
    </SmoothScroll>
  );
}

export default App;

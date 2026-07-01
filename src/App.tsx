import { LazyMotion, domAnimation, MotionConfig, useReducedMotion } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SocialLinks } from './components/SocialLinks';
import { CustomCursor, ScrollProgress, SmoothScroll } from './components/ui';
// Direct (non-lazy) imports so Astro server-renders every section into the
// static HTML at build time — critical for SEO/AEO/GEO crawlers.
import { About } from './components/About';
import { WhyMe } from './components/WhyMe';
import { Experience } from './components/Experience';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Testimonials } from './components/Testimonials';
import { Awards } from './components/Awards';
import { Publications } from './components/Publications';
import { Education } from './components/Education';
import { FAQ } from './components/FAQ';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Resume } from './components/Resume';

function App() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <LazyMotion features={domAnimation} strict>
    <MotionConfig reducedMotion="user">
    <SmoothScroll>
      <div className="relative">
        {/* Fixed background gradients - uses GPU compositing instead of background-attachment: fixed */}
        <div
          className="fixed inset-0 -z-10 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage:
              'radial-gradient(ellipse at 20% 0%, rgba(139, 92, 246, 0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(245, 158, 11, 0.04) 0%, transparent 50%)',
          }}
        />

        {/* Custom cursor - only on desktop, disabled for reduced motion */}
        {!shouldReduceMotion && <CustomCursor />}

        {/* Scroll progress indicator */}
        <ScrollProgress />

        {/* Social links - fixed position, outside main content flow */}
        <SocialLinks />

        {/* Main content */}
        <div className="relative z-10">
          <Navbar />
          <main id="main-content">
            <Hero />
            <div className="cv-auto"><About /></div>
            <div className="cv-auto"><WhyMe /></div>
            <div className="cv-auto"><Experience /></div>
            <div className="cv-auto"><Skills /></div>
            <div className="cv-auto"><Projects /></div>
            <div className="cv-auto"><Testimonials /></div>
            <div className="cv-auto"><Awards /></div>
            <div className="cv-auto"><Publications /></div>
            <div className="cv-auto"><Education /></div>
            <div className="cv-auto"><FAQ /></div>
            <div className="cv-auto"><Contact /></div>
          </main>
          <Footer />
        </div>

        {/* Resume overlay - self-managed via URL hash */}
        <Resume />
      </div>
    </SmoothScroll>
    </MotionConfig>
    </LazyMotion>
  );
}

export default App;

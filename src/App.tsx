import { lazy, Suspense } from 'react';
import { LazyMotion, domAnimation, MotionConfig, useReducedMotion } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SocialLinks } from './components/SocialLinks';
import { CustomCursor, ScrollProgress, SmoothScroll } from './components/ui';

// Lazy-load below-fold sections to reduce initial JS parse/execute time
const About = lazy(() => import('./components/About').then(m => ({ default: m.About })));
const Experience = lazy(() => import('./components/Experience').then(m => ({ default: m.Experience })));
const Skills = lazy(() => import('./components/Skills').then(m => ({ default: m.Skills })));
const Projects = lazy(() => import('./components/Projects').then(m => ({ default: m.Projects })));
const Awards = lazy(() => import('./components/Awards').then(m => ({ default: m.Awards })));
const Publications = lazy(() => import('./components/Publications').then(m => ({ default: m.Publications })));
const Education = lazy(() => import('./components/Education').then(m => ({ default: m.Education })));
const Contact = lazy(() => import('./components/Contact').then(m => ({ default: m.Contact })));
const Footer = lazy(() => import('./components/Footer').then(m => ({ default: m.Footer })));
const Resume = lazy(() => import('./components/Resume').then(m => ({ default: m.Resume })));

function SectionFallback({ minHeight = '800px' }: { minHeight?: string }) {
  return <div style={{ minHeight }} />;
}

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

        {/* Main content - renders immediately, no loading screen */}
        <div className="relative z-10">
          <Navbar />
          <main id="main-content">
            <Hero />
            <Suspense fallback={<SectionFallback />}>
              <div className="cv-auto"><About /></div>
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <div className="cv-auto"><Experience /></div>
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <div className="cv-auto"><Skills /></div>
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <div className="cv-auto"><Projects /></div>
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <div className="cv-auto"><Awards /></div>
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <div className="cv-auto"><Publications /></div>
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <div className="cv-auto"><Education /></div>
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <div className="cv-auto"><Contact /></div>
            </Suspense>
          </main>
          <Suspense fallback={<SectionFallback minHeight="200px" />}>
            <Footer />
          </Suspense>
        </div>

        {/* Resume overlay - self-managed via URL hash */}
        <Suspense fallback={null}>
          <Resume />
        </Suspense>
      </div>
    </SmoothScroll>
    </MotionConfig>
    </LazyMotion>
  );
}

export default App;

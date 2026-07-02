import { LazyMotion, domAnimation, MotionConfig, useReducedMotion } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SocialLinks } from './components/SocialLinks';
import { CustomCursor, ScrollProgress, SmoothScroll, Marquee, CommandPalette, Spotlight } from './components/ui';
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
import { Blog } from './components/Blog';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Resume } from './components/Resume';

/** Hairline-bounded mono ticker strip between editorial spreads. */
function Ticker({ items, direction = 'left' }: { items: string[]; direction?: 'left' | 'right' }) {
  return (
    <div className="border-t border-b rule-strong py-3 sm:py-4" aria-hidden="true">
      <Marquee speed={38} direction={direction} pauseOnHover={false}>
        {items.map((item) => (
          <span key={item} className="folio !text-ink-600 mx-6 inline-flex items-center gap-6">
            {item}
            <span className="text-vermilion">✦</span>
          </span>
        ))}
      </Marquee>
    </div>
  );
}

function App() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <LazyMotion features={domAnimation} strict>
    <MotionConfig reducedMotion="user">
    <SmoothScroll>
      <div className="relative">
        {/* Ambient furniture: aurora glows + blueprint columns + film grain */}
        <div className="aurora-backdrop" aria-hidden="true" />
        <div className="ruled-columns" aria-hidden="true" />
        <div className="grain-overlay" aria-hidden="true" />

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
            <Ticker
              items={[
                'AI engineering',
                'LLM / RAG systems',
                'Full-stack development',
                'Published research',
                'Dhaka to worldwide',
              ]}
            />
            <div className="cv-auto"><About /></div>
            <div className="cv-auto"><WhyMe /></div>
            <div className="cv-auto"><Experience /></div>
            <div className="cv-auto"><Skills /></div>
            <Ticker
              direction="right"
              items={[
                'Selected works',
                'Since 2023',
                'Shipped & measured',
                '50,000+ users served',
                'Production-grade',
              ]}
            />
            <div className="dither-edge" aria-hidden="true" />
            <div className="cv-auto"><Projects /></div>
            <div className="dither-edge dither-edge-flip" aria-hidden="true" />
            <div className="cv-auto"><Testimonials /></div>
            <div className="cv-auto"><Awards /></div>
            <div className="cv-auto"><Publications /></div>
            <div className="cv-auto"><Education /></div>
            <div className="cv-auto"><FAQ /></div>
            <div className="cv-auto"><Blog /></div>
            <div className="dither-edge" aria-hidden="true" />
            <div className="cv-auto"><Contact /></div>
          </main>
          <Footer />
        </div>

        {/* Resume overlay - self-managed via URL hash */}
        <Resume />

        {/* Ctrl/Cmd+K command palette + glass-card cursor spotlight */}
        <CommandPalette />
        <Spotlight />
      </div>
    </SmoothScroll>
    </MotionConfig>
    </LazyMotion>
  );
}

export default App;

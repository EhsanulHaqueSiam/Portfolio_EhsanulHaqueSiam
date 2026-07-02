import { LazyMotion, domAnimation, MotionConfig } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
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
import { SmoothScroll } from './components/ui/SmoothScroll';
import { ScrollProgress } from './components/ui/ScrollProgress';
import { CommandPalette } from './components/ui/CommandPalette';
import { EmojiCursor } from './components/ui/EmojiCursor';

const sections = [
  About,
  WhyMe,
  Experience,
  Skills,
  Projects,
  Testimonials,
  Awards,
  Publications,
  Education,
  FAQ,
  Blog,
  Contact,
];

function App() {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <SmoothScroll>
          <div className="relative min-h-screen w-full bg-background">
            {/* Top ambient glow, echoing the reference's background ellipse */}
            <div
              className="bg-ellipse left-1/2 top-[-260px] h-[520px] w-[900px] max-w-[150vw] -translate-x-1/2"
              aria-hidden="true"
            />

            <ScrollProgress />
            <Navbar />
            <EmojiCursor />

            <main id="main-content" className="relative z-10">
              <div className="mx-auto flex max-w-5xl flex-col space-y-24 px-4 pb-8 sm:space-y-32">
                <section id="hero" aria-label="Introduction">
                  <Hero />
                </section>
                {sections.map((Section, i) => (
                  <div key={i} className={i > 1 ? 'cv-auto' : undefined}>
                    <Section />
                  </div>
                ))}
              </div>
            </main>

            <Footer />

            {/* Resume overlay - self-managed via URL hash */}
            <Resume />

            {/* Ctrl/Cmd+K command palette */}
            <CommandPalette />
          </div>
        </SmoothScroll>
      </MotionConfig>
    </LazyMotion>
  );
}

export default App;

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { CustomCursor, ScrollProgress, SmoothScroll, NoiseOverlay } from './components/ui';
import { profileImage, profileHeroImage, featuredProjects, getProjectImage } from './data/content';

// Preload critical images
const criticalImages = [
  profileHeroImage,
  profileImage,
  ...(featuredProjects[0]?.images[0] ? [getProjectImage(featuredProjects[0].images[0])] : []),
];

// Add preload links to document head
if (typeof document !== 'undefined') {
  criticalImages.forEach((src) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    link.type = 'image/webp';
    document.head.appendChild(link);
  });
}

function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          timeoutId = setTimeout(onComplete, 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    return () => {
      clearInterval(timer);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] bg-space-900 flex flex-col items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Logo */}
      <motion.div
        className="relative mb-12"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-8xl font-display font-bold gradient-text">S</div>
        <motion.div
          className="absolute -inset-4 border border-violet-500/30 rounded-2xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>

      {/* Progress bar */}
      <div className="w-48 h-[2px] bg-space-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-violet-500 to-amber-500"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Progress text */}
      <motion.p
        className="mt-4 text-gray-500 font-mono text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {Math.round(Math.min(progress, 100))}%
      </motion.p>
    </motion.div>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <SmoothScroll>
      {/* Loading screen */}
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      <div className="relative">
        {/* Film grain overlay */}
        <NoiseOverlay />

        {/* Custom cursor - only on desktop */}
        <CustomCursor />

        {/* Scroll progress indicator */}
        <ScrollProgress />

        {/* Main content */}
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoading ? 0 : 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Navbar />
          <main>
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
        </motion.div>
      </div>
    </SmoothScroll>
  );
}

export default App;

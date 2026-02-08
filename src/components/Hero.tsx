import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { profile, profileHeroImage } from '../data/content';
import { SplitText, RevealText } from './ui/SplitText';
import { MagneticHover } from './ui/ImageDistortion';
import { Marquee } from './ui/Marquee';
import { OptimizedImage } from './ui/OptimizedImage';

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile for simplified animations
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Reduced parallax on mobile for better performance
  const y1 = useTransform(scrollYProgress, [0, 1], [0, isMobile ? 100 : 300]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, isMobile ? -50 : -200]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, isMobile ? 50 : 150]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, isMobile ? 0.95 : 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, isMobile ? 5 : 15]);

  // Smooth spring for mouse parallax
  const springConfig = { stiffness: 100, damping: 30 };
  const springY1 = useSpring(y1, springConfig);
  const springY2 = useSpring(y2, springConfig);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[150vh] md:min-h-[200vh]"
    >
      {/* Sticky hero content */}
      <div className="sticky top-0 min-h-screen md:h-screen flex flex-col justify-center overflow-hidden py-20 md:py-0">
        {/* Animated gradient mesh background */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Primary gradient orb - smaller on mobile for performance */}
          <motion.div
            className="absolute w-[300px] h-[300px] md:w-[600px] md:h-[600px] lg:w-[800px] lg:h-[800px] rounded-full will-change-transform"
            style={{
              y: isMobile ? 0 : springY1,
              rotate: isMobile ? 0 : rotate,
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
              filter: isMobile ? 'blur(30px)' : 'blur(40px)',
              top: '5%',
              right: '-15%',
            }}
          />

          {/* Secondary gradient orb - smaller on mobile */}
          <motion.div
            className="absolute w-[250px] h-[250px] md:w-[400px] md:h-[400px] lg:w-[600px] lg:h-[600px] rounded-full will-change-transform"
            style={{
              y: isMobile ? 0 : springY2,
              background: 'radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, transparent 70%)',
              filter: isMobile ? 'blur(30px)' : 'blur(40px)',
              bottom: '5%',
              left: '-10%',
            }}
          />

          {/* Grid lines */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '100px 100px',
            }}
          />

          {/* Decorative shapes - hidden on mobile for performance */}
          <motion.div
            className="hidden md:block absolute top-[20%] left-[10%] w-16 h-16 md:w-24 md:h-24 border border-violet-500/20 rounded-2xl will-change-transform"
            style={{ y: y3, rotate }}
            initial={{ opacity: 0 }}
            animate={{ rotate: [0, 90, 0], opacity: 1 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear', delay: 0.5 }}
          />
          <motion.div
            className="hidden md:block absolute bottom-[30%] right-[15%] w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full will-change-transform"
            style={{ y: y1 }}
            initial={{ opacity: 0 }}
            animate={{ scale: [1, 1.2, 1], opacity: 1 }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          />
          <motion.div
            className="hidden md:block absolute top-[40%] right-[8%] w-2 h-2 bg-violet-500 rounded-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
          />

          {/* Floating profile image - hidden on mobile */}
          <motion.div
            className="hidden xl:block absolute top-[20%] right-[8%] z-0"
            style={{ y: y2 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <div className="relative">
              {/* Glow backdrop - reduced blur */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/30 to-amber-500/20 rounded-[2rem] blur-2xl scale-110" />

              {/* Image container */}
              <motion.div
                className="relative w-64 h-80 rounded-[2rem] overflow-hidden border border-white/10"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              >
                <OptimizedImage
                  src={profileHeroImage}
                  alt={profile.name}
                  priority
                  width={256}
                  height={320}
                  className="w-full h-full"
                />
                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-space-900/60 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent mix-blend-overlay" />
              </motion.div>

              {/* Decorative elements around image - staggered for performance */}
              <motion.div
                className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-violet-500/50 rounded-tr-xl will-change-opacity"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, delay: 2 }}
              />
              <motion.div
                className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-amber-500/50 rounded-bl-xl will-change-opacity"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, delay: 2.5 }}
              />
            </div>
          </motion.div>
        </div>

        {/* Main content */}
        <motion.div
          className="relative z-10 px-4 sm:px-6 md:px-12 lg:px-24"
          style={{ scale: isMobile ? 1 : scale, opacity }}
        >
          {/* Eyebrow text */}
          <motion.div
            className="mb-4 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-violet-500/30 bg-violet-500/5 text-violet-400 text-xs sm:text-sm font-mono">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 animate-pulse" />
              {profile.available ? 'Available for opportunities' : 'Currently busy'}
            </span>
          </motion.div>

          {/* Giant name - main headline - better mobile sizing */}
          <div className="mb-4 sm:mb-6">
            <h1 className="text-[clamp(2.5rem,12vw,12rem)] font-display font-bold leading-[0.9] tracking-[-0.03em]">
              <span className="block overflow-hidden">
                <SplitText
                  animation="wave"
                  stagger={0.03}
                  delay={0.3}
                  className="text-white"
                >
                  {profile.firstName}
                </SplitText>
              </span>
              <span className="block overflow-hidden">
                <SplitText
                  animation="wave"
                  stagger={0.03}
                  delay={0.5}
                  className="gradient-text"
                >
                  {profile.lastName}
                </SplitText>
              </span>
            </h1>
          </div>

          {/* Role/title with reveal effect */}
          <div className="mb-6 sm:mb-12 overflow-hidden">
            <RevealText delay={0.8} className="text-lg sm:text-2xl md:text-4xl text-gray-400 font-light">
              {profile.title}
            </RevealText>
          </div>

          {/* Description and CTA */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 sm:gap-8 lg:gap-12 max-w-5xl">
            {/* Description */}
            <motion.p
              className="text-base sm:text-lg md:text-xl text-gray-500 max-w-md leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              {profile.tagline.split('AI').map((part, i) =>
                i === 0 ? part : (
                  <span key={i}>
                    <span className="text-violet-400">AI</span>
                    {part}
                  </span>
                )
              )}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-row flex-wrap gap-3"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <MagneticHover strength={isMobile ? 0 : 20}>
                <a
                  href="#projects"
                  className="group relative inline-flex items-center justify-center gap-2 sm:gap-3 px-5 sm:px-8 py-3 sm:py-4 bg-white text-space-900 rounded-full font-medium overflow-hidden transition-transform active:scale-95 md:hover:scale-105 text-sm sm:text-base min-h-[44px]"
                >
                  <span className="relative z-10">View Work</span>
                  <motion.span
                    className="relative z-10"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="absolute inset-0 z-10 flex items-center justify-center gap-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    View Work →
                  </span>
                </a>
              </MagneticHover>

              <MagneticHover strength={isMobile ? 0 : 20}>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 sm:gap-3 px-5 sm:px-8 py-3 sm:py-4 border border-white/20 text-white rounded-full font-medium hover:bg-white/5 active:bg-white/10 hover:border-white/40 transition-all duration-300 text-sm sm:text-base min-h-[44px]"
                >
                  Let's Talk
                </a>
              </MagneticHover>

              {/* Resume button - visible on all screens */}
              <MagneticHover strength={isMobile ? 0 : 20}>
                <a
                  href={profile.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-4 border border-amber-500/30 text-amber-400 rounded-full font-medium hover:bg-amber-500/10 active:bg-amber-500/15 hover:border-amber-500/50 transition-all duration-300 text-sm sm:text-base min-h-[44px]"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  <span>Resume</span>
                  {/* Subtle glow effect */}
                  <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-amber-500/5 to-transparent blur-xl" />
                </a>
              </MagneticHover>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator - hidden on mobile, shown on larger screens */}
        <motion.div
          className="hidden sm:block absolute bottom-12 right-6 md:right-12 lg:right-24 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          <a href="#about" className="flex flex-col items-center gap-2 text-gray-500 hover:text-white transition-colors">
            <span className="text-xs font-mono tracking-widest uppercase">Scroll</span>
            <motion.div
              className="w-6 h-10 rounded-full border border-current flex items-start justify-center p-2"
              initial={{ opacity: 0.5 }}
            >
              <motion.div
                className="w-1 h-2 rounded-full bg-current"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
          </a>
        </motion.div>

        {/* Social links - fixed left side, hidden on mobile */}
        <motion.div
          className="hidden lg:flex fixed left-8 top-1/2 -translate-y-1/2 flex-col gap-4 z-50"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          <MagneticHover strength={30}>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="w-12 h-12 rounded-full border border-white/10 bg-space-900/80 backdrop-blur-sm flex items-center justify-center text-gray-400 hover:text-white hover:border-violet-500/50 hover:bg-violet-500/10 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </MagneticHover>
          <MagneticHover strength={30}>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-12 h-12 rounded-full border border-white/10 bg-space-900/80 backdrop-blur-sm flex items-center justify-center text-gray-400 hover:text-white hover:border-violet-500/50 hover:bg-violet-500/10 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          </MagneticHover>
          <MagneticHover strength={30}>
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Resume"
              className="group relative w-12 h-12 rounded-full border border-white/10 bg-space-900/80 backdrop-blur-sm flex items-center justify-center text-gray-400 hover:text-white hover:border-amber-500/50 hover:bg-amber-500/10 transition-all duration-300"
            >
              {/* Subtle pulse ring on hover */}
              <span className="absolute inset-0 rounded-full border border-amber-500/0 group-hover:border-amber-500/30 group-hover:scale-125 transition-all duration-500" />
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </a>
          </MagneticHover>
          <div className="w-px h-24 bg-gradient-to-b from-white/20 to-transparent mx-auto mt-2" />
        </motion.div>
      </div>

      {/* Marquee section after hero */}
      <div className="absolute bottom-0 left-0 right-0 py-3 sm:py-6 md:py-8 bg-space-900/50 backdrop-blur-sm border-y border-white/5">
        <Marquee speed={isMobile ? 20 : 30} className="text-3xl sm:text-5xl md:text-7xl lg:text-9xl font-display font-bold text-white/[0.03]">
          <span className="mx-3 sm:mx-6 md:mx-8">AI ENGINEER</span>
          <span className="mx-3 sm:mx-6 md:mx-8">•</span>
          <span className="mx-3 sm:mx-6 md:mx-8">MACHINE LEARNING</span>
          <span className="mx-3 sm:mx-6 md:mx-8">•</span>
          <span className="mx-3 sm:mx-6 md:mx-8">SOFTWARE DEVELOPER</span>
          <span className="mx-3 sm:mx-6 md:mx-8">•</span>
          <span className="mx-3 sm:mx-6 md:mx-8">RESEARCHER</span>
          <span className="mx-3 sm:mx-6 md:mx-8">•</span>
        </Marquee>
      </div>
    </section>
  );
}

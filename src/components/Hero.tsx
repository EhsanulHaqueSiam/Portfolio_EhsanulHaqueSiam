import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { profile, profileHeroImage } from '../data/content';
import { SplitText, RevealText } from './ui/SplitText';
import { MagneticHover } from './ui/ImageDistortion';
import { Marquee } from './ui/Marquee';

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Parallax transforms
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 15]);

  // Smooth spring for mouse parallax
  const springConfig = { stiffness: 100, damping: 30 };
  const springY1 = useSpring(y1, springConfig);
  const springY2 = useSpring(y2, springConfig);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[200vh]"
    >
      {/* Sticky hero content */}
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        {/* Animated gradient mesh background */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Primary gradient orb */}
          <motion.div
            className="absolute w-[800px] h-[800px] rounded-full"
            style={{
              y: springY1,
              rotate,
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
              filter: 'blur(80px)',
              top: '10%',
              right: '-10%',
            }}
          />

          {/* Secondary gradient orb */}
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full"
            style={{
              y: springY2,
              background: 'radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, transparent 70%)',
              filter: 'blur(80px)',
              bottom: '0%',
              left: '-5%',
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

          {/* Decorative shapes */}
          <motion.div
            className="absolute top-[20%] left-[10%] w-24 h-24 border border-violet-500/20 rounded-2xl"
            style={{ y: y3, rotate }}
            animate={{ rotate: [0, 90, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute bottom-[30%] right-[15%] w-16 h-16 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full"
            style={{ y: y1 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-[40%] right-[8%] w-2 h-2 bg-violet-500 rounded-full"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
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
              {/* Glow backdrop */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/30 to-amber-500/20 rounded-[2rem] blur-3xl scale-110" />

              {/* Image container */}
              <motion.div
                className="relative w-64 h-80 rounded-[2rem] overflow-hidden border border-white/10"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              >
                <img
                  src={profileHeroImage}
                  alt={profile.name}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  className="w-full h-full object-cover"
                />
                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-space-900/60 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent mix-blend-overlay" />
              </motion.div>

              {/* Decorative elements around image */}
              <motion.div
                className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-violet-500/50 rounded-tr-xl"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div
                className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-amber-500/50 rounded-bl-xl"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
              />
            </div>
          </motion.div>
        </div>

        {/* Main content */}
        <motion.div
          className="relative z-10 px-6 md:px-12 lg:px-24"
          style={{ scale, opacity }}
        >
          {/* Eyebrow text */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/5 text-violet-400 text-sm font-mono">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              {profile.available ? 'Available for opportunities' : 'Currently busy'}
            </span>
          </motion.div>

          {/* Giant name - main headline */}
          <div className="mb-6">
            <h1 className="text-[clamp(3rem,15vw,12rem)] font-display font-bold leading-[0.85] tracking-[-0.03em]">
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
          <div className="mb-12 overflow-hidden">
            <RevealText delay={0.8} className="text-2xl md:text-4xl text-gray-400 font-light">
              {profile.title}
            </RevealText>
          </div>

          {/* Description and CTA */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-12 max-w-5xl">
            {/* Description */}
            <motion.p
              className="text-lg md:text-xl text-gray-500 max-w-md leading-relaxed"
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
              className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <MagneticHover strength={20}>
                <a
                  href="#projects"
                  className="group relative inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-space-900 rounded-full font-medium overflow-hidden transition-transform hover:scale-105 text-sm sm:text-base min-h-[48px]"
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

              <MagneticHover strength={20}>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 border border-white/20 text-white rounded-full font-medium hover:bg-white/5 hover:border-white/40 transition-all duration-300 text-sm sm:text-base min-h-[48px]"
                >
                  Let's Talk
                </a>
              </MagneticHover>
            </motion.div>
          </div>

          {/* Social links - hidden on mobile, positioned bottom left on desktop */}
          <motion.div
            className="hidden sm:flex absolute bottom-12 left-6 md:left-12 lg:left-24 flex-col gap-4"
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
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-violet-500/50 hover:bg-violet-500/10 transition-all duration-300"
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
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-violet-500/50 hover:bg-violet-500/10 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </MagneticHover>
          </motion.div>

          {/* Scroll indicator - centered on mobile, positioned right on desktop */}
          <motion.div
            className="absolute bottom-8 sm:bottom-12 left-1/2 sm:left-auto sm:right-6 md:right-12 lg:right-24 -translate-x-1/2 sm:translate-x-0"
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
        </motion.div>
      </div>

      {/* Marquee section after hero */}
      <div className="absolute bottom-0 left-0 right-0 py-4 sm:py-8 bg-space-900/50 backdrop-blur-sm border-y border-white/5">
        <Marquee speed={30} className="text-4xl sm:text-7xl md:text-9xl font-display font-bold text-white/[0.03]">
          <span className="mx-4 sm:mx-8">AI ENGINEER</span>
          <span className="mx-4 sm:mx-8">•</span>
          <span className="mx-4 sm:mx-8">MACHINE LEARNING</span>
          <span className="mx-4 sm:mx-8">•</span>
          <span className="mx-4 sm:mx-8">SOFTWARE DEVELOPER</span>
          <span className="mx-4 sm:mx-8">•</span>
          <span className="mx-4 sm:mx-8">RESEARCHER</span>
          <span className="mx-4 sm:mx-8">•</span>
        </Marquee>
      </div>
    </section>
  );
}

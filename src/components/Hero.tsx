import { useRef } from 'react';
import { m, useScroll, useTransform, useSpring } from 'framer-motion';
import { profile, profileHeroImage } from '../data/content';
import { SplitText, RevealText } from './ui/SplitText';
import { MagneticHover } from './ui/ImageDistortion';
import { Marquee } from './ui/Marquee';
import { OptimizedImage } from './ui/OptimizedImage';
import { ResumeIcon } from './ui/Icons';
import { useMediaQuery } from '../hooks/useMediaQuery';

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const isMobile = useMediaQuery('(max-width: 767px)');

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Reduced parallax on mobile for better performance
  const y1 = useTransform(scrollYProgress, [0, 1], [0, isMobile ? 100 : 300]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, isMobile ? -50 : -200]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, isMobile ? 0.95 : 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, isMobile ? 5 : 15]);

  // Smooth spring for scroll-driven parallax
  const springConfig = { stiffness: 100, damping: 30 };
  const springY1 = useSpring(y1, springConfig);
  const springY2 = useSpring(y2, springConfig);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[150vh] lg:min-h-[175vh] xl:min-h-[200vh]"
    >
      {/* Sticky hero content */}
      <div className="sticky top-0 min-h-screen md:h-screen flex flex-col justify-center overflow-hidden pt-24 pb-20 md:pb-0">
        {/* Animated gradient mesh background */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Primary gradient orb - scaled down on mobile for visual balance */}
          <m.div
            className="absolute w-[300px] h-[300px] md:w-[600px] md:h-[600px] lg:w-[800px] lg:h-[800px] rounded-full"
            style={{
              y: isMobile ? 0 : springY1,
              rotate: isMobile ? 0 : rotate,
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
              filter: isMobile ? 'blur(30px)' : 'blur(20px)',
              top: '5%',
              right: '-15%',
            }}
          />

          {/* Secondary gradient orb - smaller on mobile */}
          <m.div
            className="absolute w-[250px] h-[250px] md:w-[400px] md:h-[400px] lg:w-[600px] lg:h-[600px] rounded-full"
            style={{
              y: isMobile ? 0 : springY2,
              background: 'radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, transparent 70%)',
              filter: isMobile ? 'blur(30px)' : 'blur(20px)',
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

          {/* Decorative shapes - CSS animations (compositor-thread, auto-paused by content-visibility) */}
          <div
            className="hidden md:block absolute top-[20%] left-[10%] w-16 h-16 md:w-24 md:h-24 border border-violet-500/20 rounded-2xl hero-decorative-rotate"
          />
          <div
            className="hidden md:block absolute bottom-[30%] right-[15%] w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full hero-decorative-pulse"
          />
          <div
            className="hidden md:block absolute top-[40%] right-[8%] w-2 h-2 bg-violet-500 rounded-full hero-decorative-blink"
          />

          {/* Floating profile image - visible from lg (1024px+) screens */}
          <m.div
            className="hidden lg:block absolute top-[20%] right-[8%] z-0"
            style={{ y: y2 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <div className="relative">
              {/* Glow backdrop - reduced blur */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/30 to-amber-500/20 rounded-[2rem] blur-2xl scale-110" />

              {/* Image container */}
              <div
                className="relative lg:w-48 lg:h-60 xl:w-64 xl:h-80 rounded-[2rem] overflow-hidden border border-white/10 hero-float"
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
              </div>

              {/* Staggered fade-in decorative elements */}
              <div
                className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-violet-500/50 rounded-tr-xl hero-decorative-blink"
                style={{ animationDuration: '3s' }}
              />
              <div
                className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-amber-500/50 rounded-bl-xl hero-decorative-blink"
                style={{ animationDuration: '3s', animationDelay: '0.5s' }}
              />
            </div>
          </m.div>
        </div>

        {/* Main content */}
        <m.div
          className="relative z-10 px-4 sm:px-6 md:px-12 lg:px-24"
          style={{ scale: isMobile ? 1 : scale, opacity }}
        >
          {/* Eyebrow text */}
          <m.div
            className="mb-4 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-violet-500/30 bg-violet-500/5 text-violet-400 text-xs sm:text-sm font-mono">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 animate-pulse" />
              {profile.available ? 'Available for opportunities' : 'Currently busy'}
            </span>
          </m.div>

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
                  charClassName="gradient-text"
                >
                  {profile.lastName}
                </SplitText>
              </span>
            </h1>
          </div>

          {/* Key highlights for recruiters */}
          <m.div
            className="flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-1 sm:gap-y-2 mb-4 sm:mb-6 md:mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            {profile.stats.map((stat) => (
              <span key={stat.label} className="text-sm text-gray-400">
                <span className="text-white font-semibold">{stat.value}</span>{' '}
                {stat.label}
              </span>
            ))}
          </m.div>

          {/* Role/title with reveal effect */}
          <div className="mb-4 sm:mb-8 md:mb-12 overflow-hidden">
            <RevealText delay={0.8} className="text-lg sm:text-2xl md:text-4xl text-gray-400 font-light">
              {profile.title}
            </RevealText>
          </div>

          {/* Description and CTA */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 sm:gap-6 lg:gap-12 max-w-5xl">
            {/* Description */}
            <p
              className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 max-w-sm sm:max-w-md leading-relaxed"
            >
              {profile.tagline.split('AI').map((part, i) =>
                i === 0 ? part : (
                  <span key={`ai-${part.slice(0, 10)}`}>
                    <span className="text-violet-400">AI</span>
                    {part}
                  </span>
                )
              )}
            </p>

            {/* CTA Buttons */}
            <m.div
              className="flex flex-row flex-wrap gap-3"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <MagneticHover strength={isMobile ? 0 : 20}>
                <a
                  href="#projects"
                  className="group relative inline-flex items-center justify-center gap-2 sm:gap-3 px-5 sm:px-8 py-3 sm:py-4 bg-white text-space-900 rounded-full font-medium overflow-hidden transition-transform active:scale-95 md:hover:scale-105 text-sm sm:text-base min-h-[44px]"
                >
                  <span className="relative z-10 group-hover:text-white transition-colors duration-300">View Work</span>
                  <span
                    className="relative z-10 group-hover:text-white transition-colors duration-300 inline-block arrow-bounce"
                  >
                    →
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
                  <ResumeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Resume</span>
                  {/* Subtle glow effect */}
                  <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-amber-500/5 to-transparent blur-xl" />
                </a>
              </MagneticHover>
            </m.div>
          </div>
        </m.div>

        {/* Scroll indicator - hidden below sm (640px) breakpoint */}
        <m.div
          className="hidden sm:block absolute bottom-12 right-6 md:right-12 lg:right-24 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          <a href="#about" className="flex flex-col items-center gap-2 text-gray-500 hover:text-white transition-colors">
            <span className="text-xs font-mono tracking-widest uppercase">Scroll</span>
            <m.div
              className="w-6 h-10 rounded-full border border-current flex items-start justify-center p-2"
              initial={{ opacity: 0.5 }}
            >
              <div
                className="w-1 h-2 rounded-full bg-current scroll-dot"
              />
            </m.div>
          </a>
        </m.div>

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

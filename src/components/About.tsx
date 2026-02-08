import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { profile, profileImage } from '../data/content';
import { SplitText } from './ui/SplitText';
import { ImageDistortion, MagneticHover } from './ui/ImageDistortion';
import { Marquee } from './ui/Marquee';

export function About() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section id="about" ref={containerRef} className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 lg:px-24 relative overflow-hidden">
      {/* Section header */}
      <div className="max-w-7xl mx-auto mb-10 sm:mb-16 md:mb-20">
        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-8">
          <span className="text-violet-500 font-mono text-xs sm:text-sm">01</span>
          <div className="h-px flex-1 bg-gradient-to-r from-violet-500/50 to-transparent" />
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-bold">
          <SplitText animation="blur" stagger={0.03}>
            About Me
          </SplitText>
        </h2>
      </div>

      {/* Bento Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          {/* Main bio card - spans 8 columns */}
          <motion.div
            className="col-span-12 lg:col-span-8 row-span-2"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <ImageDistortion className="h-full">
              <div className="h-full p-8 md:p-12 rounded-3xl bg-gradient-to-br from-space-800/80 to-space-800/40 backdrop-blur-sm border border-white/5 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl" />

                <div className="relative z-10">
                  <motion.p
                    className="text-2xl md:text-3xl lg:text-4xl text-gray-200 leading-relaxed font-light mb-8"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    I'm a <span className="text-violet-400 font-medium">CS Student & AI Enthusiast</span> building
                    intelligent systems that solve real-world problems.
                  </motion.p>
                  <motion.p
                    className="text-lg text-gray-500 leading-relaxed max-w-2xl"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    From sentiment analysis with <span className="text-amber-400">85-90% accuracy</span> to
                    database systems with <span className="text-violet-400">6-8ms queries</span>, I focus on
                    building performant, production-ready solutions. Currently pursuing my degree at AIUB
                    while contributing to open-source and research.
                  </motion.p>
                </div>

                {/* Code decoration */}
                <div className="absolute bottom-6 right-6 text-violet-500/20 font-mono text-xs">
                  {'</bio>'}
                </div>
              </div>
            </ImageDistortion>
          </motion.div>

          {/* Profile image card - spans 4 columns */}
          <motion.div
            className="col-span-12 sm:col-span-6 lg:col-span-4"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <ImageDistortion className="h-full">
              <div className="group h-full min-h-[300px] rounded-3xl bg-gradient-to-br from-violet-500/20 to-amber-500/10 border border-white/5 relative overflow-hidden">
                {/* Profile image with parallax */}
                <motion.div style={{ y }} className="absolute inset-0 flex items-center justify-center p-6">
                  <div className="relative">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/30 to-amber-500/20 rounded-full blur-2xl scale-110 opacity-50 group-hover:opacity-80 transition-opacity duration-500" />

                    {/* Image container */}
                    <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-violet-500/50 transition-colors duration-500">
                      <img
                        src={profileImage}
                        alt={profile.name}
                        loading="eager"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-space-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    {/* Decorative ring */}
                    <motion.div
                      className="absolute inset-0 rounded-full border border-violet-500/20"
                      style={{ scale: 1.2 }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    />
                  </div>
                </motion.div>

                {/* Name label */}
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <p className="text-gray-500 text-sm font-mono">{profile.name}</p>
                </div>

                {/* Animated hover border */}
                <div className="absolute inset-0 rounded-3xl border border-violet-500/0 group-hover:border-violet-500/30 transition-colors duration-500 pointer-events-none" />
              </div>
            </ImageDistortion>
          </motion.div>

          {/* Stats card */}
          <motion.div
            className="col-span-12 sm:col-span-6 lg:col-span-4"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="h-full p-8 rounded-3xl bg-space-800/50 border border-white/5 flex flex-col justify-center">
              <div className="grid grid-cols-2 gap-6">
                {profile.stats.map((stat, i) => (
                  <MagneticHover key={stat.label} strength={20}>
                    <motion.div
                      className="text-center p-4 rounded-2xl bg-space-700/30 hover:bg-space-700/50 transition-colors cursor-default"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                    >
                      <div className="text-3xl md:text-4xl font-display font-bold gradient-text">
                        {stat.value}
                      </div>
                      <div className="text-gray-500 text-xs mt-1 uppercase tracking-wider">
                        {stat.label}
                      </div>
                    </motion.div>
                  </MagneticHover>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Location card */}
          <motion.div
            className="col-span-6 lg:col-span-4"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="h-full p-6 rounded-3xl bg-space-800/50 border border-white/5 flex flex-col justify-between min-h-[200px]">
              <div className="text-5xl mb-4">🇧🇩</div>
              <div>
                <p className="text-gray-500 text-sm uppercase tracking-wider mb-1">Based in</p>
                <p className="text-2xl font-display font-semibold text-white">{profile.location}</p>
              </div>
            </div>
          </motion.div>

          {/* Currently card */}
          <motion.div
            className="col-span-6 lg:col-span-4"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="h-full p-6 rounded-3xl bg-gradient-to-br from-violet-500/10 to-transparent border border-violet-500/20 flex flex-col justify-between min-h-[200px]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-green-400 text-sm font-mono">Currently</span>
              </div>
              <div>
                <p className="text-white font-medium">{profile.currentRole}</p>
                <p className="text-gray-500 text-sm">@ {profile.currentCompany}</p>
              </div>
            </div>
          </motion.div>

          {/* Tech stack card */}
          <motion.div
            className="col-span-12 lg:col-span-4"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="h-full p-6 rounded-3xl bg-space-800/50 border border-white/5">
              <p className="text-gray-500 text-sm font-mono mb-4">// primary_stack</p>
              <div className="flex flex-wrap gap-2">
                {['Python', 'Java', 'PyTorch', 'TensorFlow', 'Android', 'MySQL', 'C++', 'Git'].map((tech) => (
                  <motion.span
                    key={tech}
                    className="px-3 py-1.5 text-sm bg-space-700/50 text-gray-300 rounded-lg border border-white/5 hover:border-violet-500/30 hover:text-white transition-all cursor-default"
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom marquee */}
      <div className="mt-10 sm:mt-16 md:mt-20 -mx-4 sm:-mx-6 md:-mx-12 lg:-mx-24">
        <Marquee speed={30} direction="right" className="text-4xl sm:text-6xl md:text-8xl font-display font-bold text-white/[0.02] py-3 sm:py-4">
          <span className="mx-4 sm:mx-8 md:mx-12">PROBLEM SOLVER</span>
          <span className="mx-4 sm:mx-8 md:mx-12">•</span>
          <span className="mx-4 sm:mx-8 md:mx-12">RESEARCHER</span>
          <span className="mx-4 sm:mx-8 md:mx-12">•</span>
          <span className="mx-4 sm:mx-8 md:mx-12">BUILDER</span>
          <span className="mx-4 sm:mx-8 md:mx-12">•</span>
          <span className="mx-4 sm:mx-8 md:mx-12">LEARNER</span>
          <span className="mx-4 sm:mx-8 md:mx-12">•</span>
        </Marquee>
      </div>
    </section>
  );
}

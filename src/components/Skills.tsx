import { useState, memo } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { skills, categoryIcons, skillLevelToPercent } from '../data/content';
import { SplitText } from './ui/SplitText';
import { MagneticHover } from './ui/ImageDistortion';
import type { Skill } from '../data/types';

const SkillCard = memo(function SkillCard({ skill, index }: { skill: Skill; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const percent = skillLevelToPercent[skill.level] || 50;

  return (
    <m.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      <div className="relative p-6 rounded-2xl bg-space-800/50 border border-white/5 hover:border-violet-500/30 transition-all duration-500 overflow-hidden">
        {/* Hover glow */}
        <div
          className={`absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent transition-opacity duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <div className="relative z-10">
          {/* Skill icon and name */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-space-700/50 flex items-center justify-center overflow-hidden">
              <img
                src={skill.icon}
                alt={skill.name}
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <h3 className="text-white font-medium">{skill.name}</h3>
              <span className="text-xs text-gray-500 uppercase tracking-wider">
                {skill.level}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="relative h-1.5 bg-space-700/50 rounded-full overflow-hidden">
            <m.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-500 to-amber-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 1, delay: index * 0.05 + 0.3, ease: [0.22, 1, 0.36, 1] }}
            />
            {/* Shimmer effect - CSS animation for performance */}
            <div
              className="absolute inset-y-0 left-0 w-full animate-shimmer"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                backgroundSize: '200% 100%',
              }}
            />
          </div>

          {/* Percentage on hover */}
          <m.div
            className="absolute top-4 right-4 text-2xl font-display font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <span className="gradient-text">{percent}%</span>
          </m.div>
        </div>
      </div>
    </m.div>
  );
});

export function Skills() {
  const [activeCategory, setActiveCategory] = useState(0);

  const categories = skills.categories;

  return (
    <section id="skills" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 lg:px-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      {/* Section header */}
      <div className="max-w-7xl mx-auto mb-10 sm:mb-16 md:mb-20">
        <div className="flex items-center gap-4 mb-4 sm:mb-8">
          <span className="text-violet-500 font-mono text-sm">03</span>
          <div className="h-px flex-1 bg-gradient-to-r from-violet-500/50 to-transparent" />
        </div>
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold">
          <SplitText animation="blur" stagger={0.03}>
            Skills & Expertise
          </SplitText>
        </h2>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Category tabs - horizontally scrollable on mobile */}
        <div className="relative mb-8 sm:mb-12 md:mb-16">
          {/* Scroll fade indicators */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-space-900 to-transparent z-10 pointer-events-none md:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-space-900 to-transparent z-10 pointer-events-none md:hidden" />

          <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-6 px-6 md:mx-0 md:px-0 md:flex-wrap md:overflow-visible">
            {categories.map((category, index) => (
              <MagneticHover key={category.name} strength={15}>
                <m.button
                  onClick={() => setActiveCategory(index)}
                  className={`relative px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-medium text-sm transition-all duration-300 whitespace-nowrap flex-shrink-0 min-h-[44px] ${
                    activeCategory === index
                      ? 'text-white'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Background pill */}
                  {activeCategory === index && (
                    <m.div
                      layoutId="activeCategory"
                      className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-amber-500/10 rounded-full border border-violet-500/30"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <span>{categoryIcons[category.name] || '📦'}</span>
                    <span className="hidden sm:inline">{category.name}</span>
                    <span className="sm:hidden">{category.name.split(' ')[0]}</span>
                  </span>
                </m.button>
              </MagneticHover>
            ))}
          </div>
        </div>

        {/* Skills grid */}
        <AnimatePresence mode="wait">
          <m.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {categories[activeCategory].skills.map((skill, index) => (
              <SkillCard key={skill.name} skill={skill} index={index} />
            ))}
          </m.div>
        </AnimatePresence>

        {/* Bottom stats */}
        <m.div
          className="mt-10 sm:mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {[
            { label: 'Categories', value: categories.length, icon: '📚' },
            { label: 'Technologies', value: categories.reduce((acc, cat) => acc + cat.skills.length, 0), icon: '⚡' },
            { label: 'Expert Level', value: categories.reduce((acc, cat) => acc + cat.skills.filter(s => s.level === 'expert').length, 0), icon: '🏆' },
            { label: 'Advanced Level', value: categories.reduce((acc, cat) => acc + cat.skills.filter(s => s.level === 'advanced').length, 0), icon: '🚀' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center p-6 rounded-2xl bg-space-800/30 border border-white/5"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-4xl font-display font-bold gradient-text mb-1">
                {stat.value}
              </div>
              <div className="text-gray-500 text-sm uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </m.div>
      </div>
    </section>
  );
}

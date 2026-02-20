import { motion } from 'framer-motion';
import { featuredExperience } from '../data/content';
import { SplitText } from './ui/SplitText';
import { MagneticHover } from './ui/ImageDistortion';

export function Experience() {
  return (
    <section id="experience" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 lg:px-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-violet-500/5 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div className="mb-10 sm:mb-16 md:mb-20">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-violet-500 font-mono text-sm">02</span>
            <div className="h-px flex-1 bg-gradient-to-r from-violet-500/50 to-transparent" />
          </div>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold">
            <SplitText animation="blur" stagger={0.03}>
              Experience
            </SplitText>
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500 via-violet-500/50 to-transparent" />

          <div className="space-y-12">
            {featuredExperience.map((exp, index) => (
              <motion.div
                key={exp.company + exp.role}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative pl-12 md:pl-20"
              >
                {/* Timeline dot */}
                <div className="absolute left-4 md:left-8 top-2 w-4 h-4 -translate-x-1/2 rounded-full bg-violet-500 border-4 border-space-900 shadow-lg shadow-violet-500/50" />

                {/* Card */}
                <MagneticHover strength={8}>
                  <div className="p-8 md:p-10 rounded-3xl bg-space-800/50 border border-white/5 hover:border-violet-500/30 transition-all duration-500">
                    {/* Header */}
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                      <div className="flex items-start gap-4">
                        {exp.logo && (
                          <img
                            src={`/images/experience/${exp.logo}.webp`}
                            alt={exp.company}
                            className="w-12 h-12 rounded-xl object-contain bg-white/10 p-1 flex-shrink-0"
                          />
                        )}
                        <div>
                          <h3 className="text-2xl font-display font-semibold text-white mb-2">
                            {exp.role}
                          </h3>
                          <p className="text-violet-400 font-medium">
                            {exp.company}
                          </p>
                        </div>
                      </div>
                      <span className="px-4 py-2 text-sm font-mono text-gray-400 bg-space-700/50 rounded-xl border border-white/5">
                        {exp.date}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-400 leading-relaxed">
                      {exp.desc}
                    </p>
                  </div>
                </MagneticHover>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Resume CTA */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <MagneticHover strength={20}>
            <a
              href="https://flowcv.com/resume/61p1hietib2o"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-500/20 to-amber-500/10 rounded-full border border-violet-500/30 hover:border-violet-500/50 transition-all font-medium text-white"
            >
              <svg
                className="w-5 h-5 text-violet-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              View Resume
            </a>
          </MagneticHover>
        </motion.div>
      </div>
    </section>
  );
}

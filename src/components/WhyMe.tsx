import { m } from 'framer-motion';
import { SplitText } from './ui/SplitText';

const ease = [0.22, 1, 0.36, 1];

const proofPoints = [
  {
    metric: '4',
    label: 'Production Sites',
    sublabel: 'in 6 months',
    detail: 'Full lifecycle ownership — from design to deployment — driving 1.5x client revenue at BetaScript LLC',
    accent: 'from-violet-500 to-violet-400',
    glow: 'violet',
  },
  {
    metric: '3',
    label: 'Peer-Reviewed Papers',
    sublabel: 'while shipping code',
    detail: 'Published in IEEE and Taylor & Francis while maintaining 3.89 CGPA and building 15+ projects',
    accent: 'from-amber-500 to-amber-400',
    glow: 'amber',
  },
  {
    metric: '7x',
    label: 'Performance Gain',
    sublabel: 'through design',
    detail: 'Reduced query latency from 50ms to 7ms via 3NF database normalization and connection pooling',
    accent: 'from-violet-400 to-amber-400',
    glow: 'violet',
  },
];

export function WhyMe() {
  return (
    <section id="why-me" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 lg:px-24 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/[0.04] rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/[0.03] rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto relative">
        {/* Section label */}
        <m.div
          className="flex items-center gap-4 mb-6 sm:mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-violet-500 font-mono text-xs sm:text-sm">02</span>
          <div className="h-px flex-1 bg-gradient-to-r from-violet-500/50 to-transparent" />
        </m.div>

        {/* Headline */}
        <div className="mb-12 sm:mb-16 md:mb-20 max-w-4xl">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6">
            <SplitText animation="blur" stagger={0.03}>
              Why hire me?
            </SplitText>
          </h2>
          <m.p
            className="text-lg sm:text-xl md:text-2xl text-gray-400 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3, ease }}
          >
            I bridge <span className="text-violet-400 font-medium">research and production</span> — a published researcher who ships systems serving{' '}
            <span className="text-amber-400 font-medium">50,000+ users</span>. Not just code, but{' '}
            <span className="text-white font-medium">business outcomes</span>.
          </m.p>
        </div>

        {/* Proof point cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {proofPoints.map((point, i) => (
            <m.div
              key={point.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.15, ease }}
              className="group relative"
            >
              <div className="relative h-full p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-space-800/80 to-space-800/40 backdrop-blur-sm border border-white/5 hover:border-white/10 transition-[border-color] duration-200 overflow-hidden">
                {/* Hover glow */}
                <div
                  className={`absolute -top-16 -right-16 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-250 ${
                    point.glow === 'violet' ? 'bg-violet-500/15' : 'bg-amber-500/15'
                  }`}
                />

                {/* Big metric */}
                <div className="relative z-10 mb-4 sm:mb-6">
                  <span className={`text-5xl sm:text-6xl md:text-7xl font-display font-bold bg-gradient-to-r ${point.accent} bg-clip-text text-transparent`}>
                    {point.metric}
                  </span>
                </div>

                {/* Label */}
                <div className="relative z-10 mb-3 sm:mb-4">
                  <p className="text-white font-medium text-base sm:text-lg">{point.label}</p>
                  <p className="text-violet-400/60 text-xs sm:text-sm font-mono tracking-wide">{point.sublabel}</p>
                </div>

                {/* Detail */}
                <p className="relative z-10 text-gray-500 text-sm leading-relaxed">
                  {point.detail}
                </p>

                {/* Bottom gradient line */}
                <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r ${point.accent} opacity-0 group-hover:opacity-30 transition-opacity duration-200`} />
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}

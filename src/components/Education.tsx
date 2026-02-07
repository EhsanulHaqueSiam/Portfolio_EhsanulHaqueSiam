import { motion } from 'framer-motion';
import { SplitText } from './ui/SplitText';
import { MagneticHover } from './ui/ImageDistortion';

interface EducationItem {
  institution: string;
  degree: string;
  location: string;
  period: string;
  status: 'Pursuing' | 'Completed';
  logo: string;
}

const educationData: EducationItem[] = [
  {
    institution: 'American International University-Bangladesh',
    degree: 'Bachelor of Science in Computer Science and Engineering',
    location: 'AIUB',
    period: '2022 - 2026',
    status: 'Pursuing',
    logo: 'AIUB',
  },
  {
    institution: 'Govt. Azizul Haque College',
    degree: 'Higher Secondary School Certificate (HSC) in Science',
    location: 'Bogura',
    period: '2019 - 2021',
    status: 'Completed',
    logo: 'GAHC',
  },
  {
    institution: 'Bogra Zilla School',
    degree: 'Secondary School Certificate (SSC) in Science',
    location: 'Bogura',
    period: '2011 - 2019',
    status: 'Completed',
    logo: 'BZS',
  },
];

export function Education() {
  return (
    <section id="education" className="py-32 px-6 md:px-12 lg:px-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] border border-violet-500/10 rounded-full"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
          }}
          transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] border border-amber-500/10 rounded-full"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-violet-500 font-mono text-sm">06</span>
            <div className="h-px flex-1 bg-gradient-to-r from-violet-500/50 to-transparent" />
          </div>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold">
            <SplitText animation="blur" stagger={0.03}>
              Education
            </SplitText>
          </h2>
        </div>

        {/* Education cards */}
        <div className="grid gap-8">
          {educationData.map((edu, index) => (
            <motion.div
              key={edu.institution}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <MagneticHover strength={6}>
                <div className="group relative p-8 md:p-10 rounded-3xl bg-space-800/50 border border-white/5 hover:border-violet-500/30 transition-all duration-500 overflow-hidden">
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Content */}
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                    {/* Logo/Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-violet-500/20 to-amber-500/10 border border-white/10 flex items-center justify-center">
                        <span className="text-2xl md:text-3xl font-display font-bold gradient-text">
                          {edu.logo}
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                        <div>
                          <h3 className="text-xl md:text-2xl font-display font-semibold text-white mb-1 group-hover:text-violet-300 transition-colors">
                            {edu.degree}
                          </h3>
                          <p className="text-violet-400 font-medium">
                            {edu.institution}
                          </p>
                        </div>
                        <span className={`px-4 py-2 text-sm font-mono rounded-xl border ${
                          edu.status === 'Pursuing'
                            ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                            : 'text-green-400 bg-green-500/10 border-green-500/30'
                        }`}>
                          {edu.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-gray-400">
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {edu.location}
                        </span>
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {edu.period}
                        </span>
                      </div>
                    </div>

                    {/* Decorative element */}
                    <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 opacity-10 group-hover:opacity-20 transition-opacity">
                      <svg className="w-32 h-32 text-violet-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </MagneticHover>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

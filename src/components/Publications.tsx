import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { featuredPublications, getPublicationImage } from '../data/content';
import { SplitText } from './ui/SplitText';
import { MagneticHover } from './ui/ImageDistortion';

export function Publications() {
  const [expandedPub, setExpandedPub] = useState<number | null>(null);

  return (
    <section id="publications" className="py-32 px-6 md:px-12 lg:px-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 -left-32 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-violet-500 font-mono text-sm">05</span>
            <div className="h-px flex-1 bg-gradient-to-r from-violet-500/50 to-transparent" />
          </div>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold">
            <SplitText animation="blur" stagger={0.03}>
              Publications
            </SplitText>
          </h2>
        </div>

        {/* Publications grid */}
        <div className="space-y-8">
          {featuredPublications.map((pub, index) => (
            <motion.div
              key={pub.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <MagneticHover strength={6}>
                <div
                  className="group relative rounded-3xl bg-gradient-to-br from-space-800/80 to-space-800/40 border border-white/5 hover:border-violet-500/30 transition-all duration-500 overflow-hidden cursor-pointer"
                  onClick={() => setExpandedPub(expandedPub === index ? null : index)}
                >
                  <div className="grid lg:grid-cols-5 gap-0">
                    {/* Publication image */}
                    <div className="lg:col-span-2 relative overflow-hidden">
                      <div className="aspect-[4/3] lg:aspect-auto lg:h-full min-h-[250px] bg-gradient-to-br from-violet-500/10 to-amber-500/5">
                        {pub.images && pub.images[0] && (
                          <img
                            src={getPublicationImage(pub.images[0])}
                            alt={pub.title}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        )}
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-space-800/80 lg:block hidden" />
                        <div className="absolute inset-0 bg-gradient-to-t from-space-800/80 via-transparent to-transparent lg:hidden" />

                        {/* Shine effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                        />
                      </div>

                      {/* Publication type badge */}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1.5 text-xs font-mono text-violet-400 bg-violet-500/20 rounded-full border border-violet-500/30 backdrop-blur-sm">
                          Research Paper
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-3 p-8 md:p-10 flex flex-col justify-center">
                      {/* Conference and date */}
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-violet-500/20 to-amber-500/10 text-violet-400 rounded-xl border border-violet-500/20">
                          {pub.conference.split('(')[0].trim()}
                        </span>
                        <span className="text-gray-500 text-sm font-mono">{pub.date}</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl md:text-2xl lg:text-3xl font-display font-bold text-white mb-4 group-hover:text-violet-400 transition-colors leading-tight">
                        {pub.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-500 leading-relaxed mb-6">
                        {pub.desc}
                      </p>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-4">
                        {pub.paperLink && pub.paperLink !== 'https://example.com/paper-placeholder' && (
                          <MagneticHover strength={15}>
                            <motion.a
                              href={pub.paperLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-500/20 text-violet-400 rounded-xl border border-violet-500/30 hover:bg-violet-500/30 transition-colors"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                              <span>Read Paper</span>
                            </motion.a>
                          </MagneticHover>
                        )}

                        {pub.images && pub.images.length > 0 && (
                          <button
                            className="text-gray-500 hover:text-white text-sm flex items-center gap-2 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedPub(expandedPub === index ? null : index);
                            }}
                          >
                            <span>{expandedPub === index ? 'Hide' : 'View'} Image</span>
                            <motion.svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              animate={{ rotate: expandedPub === index ? 180 : 0 }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </motion.svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded image view */}
                  <AnimatePresence>
                    {expandedPub === index && pub.images && pub.images[0] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden border-t border-white/5"
                      >
                        <div className="p-6 bg-space-900/50">
                          <img
                            src={getPublicationImage(pub.images[0])}
                            alt={pub.title}
                            loading="lazy"
                            decoding="async"
                            className="w-full max-w-4xl mx-auto rounded-2xl shadow-2xl shadow-violet-500/10"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Decorative corner accent */}
                  <div className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-violet-500/50 rounded-tr-xl" />
                  </div>
                </div>
              </MagneticHover>
            </motion.div>
          ))}
        </div>

        {/* Research note */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-space-800/50 border border-white/5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <p className="text-gray-500 text-sm font-mono">
              More research publications in progress...
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

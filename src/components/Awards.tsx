import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { awards, getAchievementImage } from '../data/content';
import { SplitText } from './ui/SplitText';
import { MagneticHover } from './ui/ImageDistortion';

export function Awards() {
  const [selectedAward, setSelectedAward] = useState<number | null>(null);

  return (
    <section id="awards" className="py-32 px-6 md:px-12 lg:px-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-3xl" />
        <motion.div
          className="absolute top-1/4 right-1/4 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-violet-500 font-mono text-sm">04</span>
            <div className="h-px flex-1 bg-gradient-to-r from-violet-500/50 to-transparent" />
          </div>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold">
            <SplitText animation="blur" stagger={0.03}>
              Awards & Recognition
            </SplitText>
          </h2>
        </div>

        {/* Awards masonry grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 auto-rows-max">
          {awards.map((award, index) => (
            <motion.div
              key={award.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={index === 0 ? 'sm:col-span-2 lg:col-span-2 sm:row-span-2' : ''}
            >
              <MagneticHover strength={8}>
                <motion.div
                  className="group relative h-full rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer"
                  onClick={() => setSelectedAward(selectedAward === index ? null : index)}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Image background */}
                  <div className={`relative ${index === 0 ? 'aspect-[4/3] sm:aspect-[16/10]' : 'aspect-[4/3]'} overflow-hidden`}>
                    {award.images[0] && (
                      <img
                        src={getAchievementImage(award.images[0])}
                        alt={award.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    )}
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-space-900 via-space-900/60 to-transparent" />

                    {/* Shine effect on hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                    />
                  </div>

                  {/* Content overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                    {/* Category badge */}
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 text-xs font-mono text-amber-400/90 bg-amber-500/20 rounded-full border border-amber-500/30 backdrop-blur-sm capitalize">
                        {award.category}
                      </span>
                    </div>

                    {/* Award icon */}
                    <motion.div
                      className="w-12 h-12 mb-4 rounded-2xl bg-gradient-to-br from-amber-500/30 to-amber-600/20 flex items-center justify-center border border-amber-500/30 backdrop-blur-sm"
                      whileHover={{ rotate: 12, scale: 1.1 }}
                    >
                      <span className="text-2xl">🏆</span>
                    </motion.div>

                    {/* Title */}
                    <h3 className={`font-display font-bold text-white mb-2 group-hover:text-amber-400 transition-colors ${index === 0 ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'}`}>
                      {award.name}
                    </h3>

                    {/* Description - expandable */}
                    <motion.p
                      className="text-gray-400 text-sm leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all"
                      layout
                    >
                      {award.desc}
                    </motion.p>

                    {/* Image count indicator */}
                    {award.images.length > 1 && (
                      <div className="mt-4 flex items-center gap-2 text-gray-500 text-xs">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{award.images.length} images</span>
                      </div>
                    )}
                  </div>

                  {/* Hover border */}
                  <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-amber-500/30 transition-colors duration-500 pointer-events-none" />
                </motion.div>
              </MagneticHover>
            </motion.div>
          ))}
        </div>

        {/* Image gallery modal */}
        <AnimatePresence>
          {selectedAward !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-space-900/95 backdrop-blur-xl"
              onClick={() => setSelectedAward(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative w-full sm:max-w-5xl max-h-[85vh] sm:max-h-[90vh] overflow-auto rounded-t-3xl sm:rounded-3xl bg-space-800/95 sm:bg-space-800/90 border-t sm:border border-white/10 p-4 sm:p-6 sm:m-4"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Mobile drag handle */}
                <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-4 sm:hidden" />

                {/* Close button */}
                <button
                  onClick={() => setSelectedAward(null)}
                  className="absolute top-4 right-4 w-10 h-10 min-w-[44px] min-h-[44px] rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <h3 className="text-xl sm:text-2xl font-display font-bold text-white mb-3 sm:mb-4 pr-12">
                  {awards[selectedAward].name}
                </h3>
                <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-6">{awards[selectedAward].desc}</p>

                {/* Image gallery */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  {awards[selectedAward].images.map((img, i) => (
                    <motion.div
                      key={img}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="aspect-video rounded-xl overflow-hidden bg-space-700"
                    >
                      <img
                        src={getAchievementImage(img)}
                        alt={`${awards[selectedAward].name} - ${i + 1}`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

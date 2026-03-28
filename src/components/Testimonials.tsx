import { m } from 'framer-motion';
import { testimonials } from '../data/content';
import { SectionHeader } from './ui/SectionHeader';

const ease = [0.22, 1, 0.36, 1];

function QuoteIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C9.591 11.69 11 13.196 11 15c0 1.933-1.567 3.5-3.5 3.5-1.294 0-2.22-.418-2.917-1.179zM15.583 17.321C14.553 16.227 14 15 14 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C20.591 11.69 22 13.196 22 15c0 1.933-1.567 3.5-3.5 3.5-1.294 0-2.22-.418-2.917-1.179z" />
    </svg>
  );
}

export function Testimonials() {
  return (
    <section id="testimonials" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 lg:px-24 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-violet-500/[0.03] rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto relative">
        <SectionHeader number="06" title="Testimonials" />

        {/* Testimonial grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {testimonials.map((testimonial, i) => (
            <m.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.15, ease }}
              className="group relative"
            >
              {/* Card */}
              <div className="relative h-full p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-space-800/80 to-space-800/40 backdrop-blur-sm border border-white/5 hover:border-white/10 transition-colors duration-200 overflow-hidden">
                {/* Hover glow */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-250" />

                {/* Quote mark */}
                <QuoteIcon className="w-8 h-8 sm:w-10 sm:h-10 text-violet-500/20 mb-4 sm:mb-6" />

                {/* Quote text */}
                <blockquote className="relative z-10 mb-6 sm:mb-8">
                  <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-light italic">
                    "{testimonial.quote}"
                  </p>
                </blockquote>

                {/* Author */}
                <div className="relative z-10 flex items-center gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-white/5">
                  {/* Avatar placeholder - gradient circle with initials */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-violet-500/30 to-amber-500/30 flex items-center justify-center flex-shrink-0 border border-white/10">
                    <span className="text-white font-display font-bold text-sm sm:text-base">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-medium text-sm sm:text-base truncate">{testimonial.name}</p>
                    <p className="text-gray-500 text-xs sm:text-sm truncate">
                      {testimonial.role}, <span className="text-violet-400/80">{testimonial.company}</span>
                    </p>
                  </div>
                </div>
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}

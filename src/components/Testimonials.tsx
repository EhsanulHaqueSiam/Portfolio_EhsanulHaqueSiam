import { m } from 'framer-motion';
import { testimonials } from '../data/content';
import { SectionHeader } from './ui/SectionHeader';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * 06 / Testimonials — quotes typeset as letters of reference.
 * Paper spread: one giant vermilion Fraunces opening quote hangs over
 * the whole composition; each letter is set in Fraunces italic light
 * with hanging punctuation, a mono signature block above a hairline,
 * and an asymmetric two-column offset rhythm. Hairline frames appear
 * on hover only — no card grid.
 */
export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 sm:py-32">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <SectionHeader
          number="06"
          name="TESTIMONIALS"
          title={
            <>
              Word gets <em>around</em>
            </>
          }
          annotation={`${testimonials.length} LETTERS · ON FILE`}
        />

        <div className="relative">
          {/* Oversized opening quotation mark — hanging punctuation for the spread.
              Sized as a true display glyph so it drops over the first letter's
              top-left whitespace like a drop cap, without covering any text. */}
          <span
            aria-hidden="true"
            className="pointer-events-none select-none absolute -top-6 -left-2 sm:-top-9 sm:-left-4 lg:-top-12 lg:-left-8 font-display font-light leading-none text-vermilion-400 text-[8rem] sm:text-[12rem] lg:text-[16rem] opacity-50"
          >
            &ldquo;
          </span>

          <div className="relative grid grid-cols-1 gap-y-12 pt-14 sm:pt-20 lg:grid-cols-2 lg:items-start lg:gap-x-16 lg:gap-y-20 xl:gap-x-24">
            {testimonials.map((testimonial, i) => (
              <m.figure
                key={testimonial.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.7, delay: (i % 2) * 0.1, ease: EASE },
                }}
                viewport={{ once: true, margin: '-10%' }}
                whileHover={{ y: -2, transition: { duration: 0.15, ease: EASE } }}
                transition={{ duration: 0.2, ease: EASE }}
                className={`group glass-card relative m-0 p-6 !transition-[border-color,box-shadow,background-color] sm:p-8 ${
                  i % 2 === 1 ? 'lg:mt-16' : ''
                }`}
              >
                {/* Letter folio */}
                <span className="folio mb-5 block text-[10px] sm:mb-6">
                  LETTER {String(i + 1).padStart(2, '0')}
                </span>

                {/* The quote, typeset with hanging punctuation */}
                <blockquote className="m-0">
                  <p className="font-display italic font-light text-xl sm:text-2xl xl:text-[1.75rem] leading-[1.55] text-ink-800 indent-[-0.45em]">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                </blockquote>

                {/* Signature block */}
                <figcaption className="mt-7 border-t rule pt-4 font-mono text-[11px] uppercase tracking-[0.16em] leading-relaxed sm:mt-8 sm:text-xs">
                  <span className="text-ink-900 transition-colors duration-200 group-hover:text-vermilion-400">
                    {testimonial.name}
                  </span>
                  <span className="text-ink-500">
                    {' '}
                    · {testimonial.role}, {testimonial.company}
                  </span>
                </figcaption>
              </m.figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

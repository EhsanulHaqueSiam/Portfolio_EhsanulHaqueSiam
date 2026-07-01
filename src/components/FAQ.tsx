import { m } from 'framer-motion';
import { faqItems } from '../data/content';
import { SectionHeader } from './ui/SectionHeader';

/**
 * Accessible FAQ using native <details>/<summary> — answers are always present
 * in the DOM (crawlable for SEO/AEO, even when collapsed) and the JSON-LD
 * FAQPage in Layout mirrors this exact content (Google requires visible match).
 */
export function FAQ() {
  return (
    <section
      id="faq"
      className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 lg:px-24 relative overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-72 h-72 bg-violet-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <SectionHeader number="10" title="FAQ" />

        <div className="mt-10 space-y-4">
          {faqItems.map((item, i) => (
            <m.details
              key={item.question}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group rounded-2xl border border-white/5 bg-space-800/40 open:bg-space-800/60 open:border-violet-500/20 transition-colors"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:p-6 text-base sm:text-lg font-display font-semibold text-white [&::-webkit-details-marker]:hidden">
                <span>{item.question}</span>
                <span
                  className="shrink-0 text-violet-400 transition-transform duration-300 group-open:rotate-45"
                  aria-hidden="true"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </span>
              </summary>
              <div className="px-5 pb-5 sm:px-6 sm:pb-6 -mt-1 text-gray-400 leading-relaxed">
                {item.answer}
              </div>
            </m.details>
          ))}
        </div>
      </div>
    </section>
  );
}

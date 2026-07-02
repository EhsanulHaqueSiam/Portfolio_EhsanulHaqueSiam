import { m } from 'framer-motion';
import { faqItems } from '../data/content';
import { SectionHeader } from './ui/SectionHeader';
import { PlusIcon } from './ui/Icons';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * 10 / FAQ — accessible FAQ built on native <details>/<summary>.
 *
 * - The accordion is functional pre-hydration (no JS required to open items).
 * - Answers are always present in the server-rendered DOM, collapsed or not,
 *   so search/answer engines crawl the full text.
 * - Questions and answers render VERBATIM from `faqItems`: the JSON-LD
 *   FAQPage in Layout mirrors this exact content, and Google requires a
 *   visible on-page match. Do not paraphrase, truncate, or re-case them.
 */
export function FAQ() {
  return (
    <section id="faq" className="py-24 sm:py-32">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <SectionHeader
          number="10"
          name="FAQ"
          title={
            <>
              Quick <em>answers</em>
            </>
          }
          annotation={`${faqItems.length} QUESTIONS · PRINTED IN FULL`}
        />

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Left rail — editorial margin note */}
          <div className="lg:col-span-3">
            <div className="lg:sticky lg:top-28">
              <p className="folio">Appendix A</p>
              <p className="mt-4 max-w-[36ch] font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-ink-500">
                Answers are typeset in full below — the same text served to
                search and answer engines.
              </p>
            </div>
          </div>

          {/* The inquiries ledger */}
          <div className="lg:col-span-9">
            <div className="border-b rule">
              {faqItems.map((item, i) => (
                <m.details
                  key={item.question}
                  className="group border-t rule"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
                >
                  <summary className="flex min-h-[44px] cursor-pointer list-none items-start gap-4 py-6 [&::-webkit-details-marker]:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-vermilion sm:gap-6 sm:py-8">
                    <span
                      className="folio w-10 shrink-0 pt-1.5 text-vermilion-600 sm:w-14"
                      aria-hidden="true"
                    >
                      Q.{String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1 font-display text-lg font-light leading-snug text-ink-900 transition-colors duration-300 group-open:text-vermilion-600 sm:text-xl md:text-2xl">
                      {item.question}
                    </span>
                    <span
                      className="press-feedback mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center border rule text-ink-900 transition-colors duration-300 group-hover:border-vermilion group-hover:text-vermilion group-open:border-vermilion group-open:text-vermilion"
                      aria-hidden="true"
                    >
                      <PlusIcon className="h-4 w-4 transition-transform duration-300 ease-out-expo group-open:rotate-45" />
                    </span>
                  </summary>
                  <div className="pb-8 pl-14 pr-2 sm:pb-10 sm:pl-20">
                    <p className="max-w-prose text-base leading-relaxed text-ink-600">
                      {item.answer}
                    </p>
                  </div>
                </m.details>
              ))}
            </div>

            {/* Cross-reference to Contact */}
            <m.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
              className="mt-8 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-500"
            >
              Further inquiries{' '}
              <span aria-hidden="true">—</span>{' '}
              <a
                href="#contact"
                className="link-ink inline-flex min-h-[44px] items-center text-ink-900 hover:text-vermilion focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermilion"
              >
                See 11 / Contact <span aria-hidden="true" className="ml-1">↓</span>
              </a>
            </m.p>
          </div>
        </div>
      </div>
    </section>
  );
}

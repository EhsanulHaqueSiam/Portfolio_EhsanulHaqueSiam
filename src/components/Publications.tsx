import { useState } from 'react';
import { m, AnimatePresence, useReducedMotion } from 'framer-motion';
import { featuredPublications, getPublicationImage, hideImageOnError } from '../data/content';
import { SectionHeader } from './ui/SectionHeader';
import { ArrowUpRightIcon, PlusIcon } from './ui/Icons';

const EASE = [0.16, 1, 0.3, 1] as const;

type PublicationStatus = 'ACCEPTED' | 'PUBLISHED' | 'PRESENTED';

/** Parse a publication's editorial status from its date/desc metadata. */
function getStatus(date: string, desc: string): PublicationStatus {
  const text = `${date} ${desc}`;
  if (/accept/i.test(text)) return 'ACCEPTED';
  if (/book chapter|taylor/i.test(text)) return 'PUBLISHED';
  return 'PRESENTED';
}

export function Publications() {
  const [expandedPub, setExpandedPub] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // Sequential figure numbers, assigned only to entries that carry a plate.
  let figCounter = 0;
  const entries = featuredPublications.map((pub) => {
    const hasPlate = Boolean(pub.images && pub.images.length > 0);
    if (hasPlate) figCounter += 1;
    return {
      pub,
      status: getStatus(pub.date, pub.desc),
      figNo: hasPlate ? figCounter : null,
    };
  });

  return (
    <section id="publications" className="py-24 sm:py-32">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <SectionHeader
          number="08"
          name="RESEARCH"
          title={
            <>
              Published <em>research</em>
            </>
          }
          annotation={`${featuredPublications.length} ENTRIES · PEER-REVIEWED`}
        />

        {/* Citation list — numbered, hanging-indent entries */}
        <ol className="border-b rule">
          {entries.map(({ pub, status, figNo }, index) => {
            const isExpanded = expandedPub === index;
            const hasPlate = figNo !== null && pub.images && pub.images[0];

            return (
              <m.li
                key={pub.title}
                className="border-t rule py-10 sm:py-12"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.7, ease: EASE, delay: index * 0.08 }}
              >
                <div className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-2 sm:grid-cols-[4.5rem_minmax(0,1fr)] sm:gap-x-4">
                  {/* Hanging citation marker */}
                  <span className="select-none pt-1 font-mono text-sm text-vermilion-600 sm:pt-1.5 sm:text-base">
                    [{index + 1}]
                  </span>

                  <div className="min-w-0">
                    {/* Title + status stamp */}
                    <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
                      <h3 className="max-w-3xl font-display text-2xl font-light leading-[1.12] text-ink-900 sm:text-3xl">
                        {pub.title}
                      </h3>
                      <span
                        className={`stamp inline-block shrink-0 px-3 py-1.5 text-[10px] ${
                          index % 2 === 0 ? '-rotate-3' : 'rotate-2'
                        }`}
                      >
                        {status}
                      </span>
                    </div>

                    {/* Mono citation line */}
                    <p className="mt-4 font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-ink-500 sm:text-xs">
                      {pub.conference}
                      <span aria-hidden="true"> · </span>
                      {pub.date}
                    </p>

                    {/* Abstract */}
                    <p className="mt-4 max-w-[68ch] text-[15px] leading-relaxed text-ink-600 sm:text-base">
                      {pub.desc}
                    </p>

                    {/* Actions */}
                    {(pub.paperLink || hasPlate) && (
                      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3">
                        {pub.paperLink && (
                          <a
                            href={pub.paperLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Read paper: ${pub.title}`}
                            className="press-feedback inline-flex min-h-[44px] items-center gap-2 border rule px-5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-900 transition-colors hover:border-vermilion hover:text-vermilion"
                          >
                            Read
                            <ArrowUpRightIcon className="h-3.5 w-3.5" />
                          </a>
                        )}

                        {hasPlate && (
                          <button
                            type="button"
                            aria-expanded={isExpanded}
                            aria-controls={`publication-plate-${index}`}
                            aria-label={`${isExpanded ? 'Hide' : 'View'} plate for ${pub.title}`}
                            onClick={() =>
                              setExpandedPub(isExpanded ? null : index)
                            }
                            className="press-feedback inline-flex min-h-[44px] items-center gap-2.5 border rule px-5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-700 transition-colors hover:border-vermilion hover:text-vermilion"
                          >
                            <span>{isExpanded ? 'Hide plate' : 'View plate'}</span>
                            <m.span
                              className="inline-flex"
                              aria-hidden="true"
                              animate={{ rotate: isExpanded ? 45 : 0 }}
                              transition={{ duration: 0.35, ease: EASE }}
                            >
                              <PlusIcon className="h-3.5 w-3.5" />
                            </m.span>
                          </button>
                        )}
                      </div>
                    )}

                    {/* Expandable plate */}
                    <div id={`publication-plate-${index}`}>
                      <AnimatePresence initial={false}>
                        {isExpanded && hasPlate && (
                          <m.div
                            key="plate"
                            className="overflow-hidden"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{
                              height: 'auto',
                              opacity: 1,
                              transition: {
                                duration: shouldReduceMotion ? 0 : 0.5,
                                ease: EASE,
                              },
                            }}
                            exit={{
                              height: 0,
                              opacity: 0,
                              transition: {
                                duration: shouldReduceMotion ? 0 : 0.25,
                                ease: EASE,
                              },
                            }}
                          >
                            <figure className="pt-8">
                              <div className="plate reg-marks relative max-w-3xl shadow-plate">
                                <img
                                  src={getPublicationImage(pub.images[0])}
                                  alt={`Figure ${figNo}: ${pub.title}`}
                                  loading="lazy"
                                  decoding="async"
                                  className="h-auto w-full"
                                  onError={hideImageOnError}
                                />
                              </div>
                              <figcaption className="folio mt-3 max-w-3xl">
                                FIG. {String(figNo).padStart(2, '0')} —{' '}
                                {pub.conference}
                              </figcaption>
                            </figure>
                          </m.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </m.li>
            );
          })}
        </ol>

        {/* Research note */}
        <m.p
          className="mt-12 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-500 sm:mt-16 sm:text-xs"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
        >
          <span className="h-2 w-2 shrink-0 bg-vermilion animate-pulse" aria-hidden="true" />
          More research publications in progress...
        </m.p>
      </div>
    </section>
  );
}

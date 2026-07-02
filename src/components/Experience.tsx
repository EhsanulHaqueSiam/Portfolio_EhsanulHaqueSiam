import { m } from 'framer-motion';
import { featuredExperience, hideImageOnError } from '../data/content';
import { SectionHeader } from './ui/SectionHeader';
import { MagneticHover } from './ui/ImageDistortion';
import { ArrowRightIcon } from './ui/Icons';

const EASE = [0.16, 1, 0.3, 1] as const;

interface ParsedRole {
  /** Role with any parenthetical employment annotations removed */
  title: string;
  /** Mono ledger annotations, e.g. ["FULL-TIME", "REMOTE"] */
  annotations: string[];
}

/**
 * Splits "Research Assistant (Full-time, Remote)" into a clean role title plus
 * uppercase mono annotations (FULL-TIME · REMOTE). Roles containing "Intern"
 * without a parenthetical receive a derived INTERN annotation.
 */
function parseRole(role: string): ParsedRole {
  const match = role.match(/^(.*?)\s*\(([^)]*)\)\s*$/);
  const title = match ? match[1] : role;
  const annotations = match
    ? match[2]
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean)
        .map((part) => part.toUpperCase())
    : [];

  if (annotations.length === 0 && /\bintern\b/i.test(title)) {
    annotations.push('INTERN');
  }

  return { title, annotations };
}

/** "Apr 2026 - Present" → "Apr 2026 · Present" (uppercased via mono styling) */
function formatDate(date: string): string {
  return date.replace(/\s*-\s*/g, ' · ');
}

export function Experience() {
  const years = featuredExperience
    .flatMap((exp) => exp.date.match(/\d{4}/g) ?? [])
    .map(Number);
  const spanStart = years.length > 0 ? Math.min(...years) : null;
  const spanEnd = featuredExperience.some((exp) => /present/i.test(exp.date))
    ? 'PRESENT'
    : years.length > 0
      ? String(Math.max(...years))
      : null;
  const annotation =
    spanStart !== null && spanEnd !== null
      ? `${featuredExperience.length} ENTRIES · ${spanStart}-${spanEnd}`
      : `${featuredExperience.length} ENTRIES`;

  return (
    <section
      id="experience"
      aria-label="Records of employment"
      className="relative py-24 sm:py-32"
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <SectionHeader
          number="03"
          name="EXPERIENCE"
          title={
            <>
              The <em>record</em>
            </>
          }
          annotation={annotation}
        />

        {/* Employment ledger — hairline-divided rows, not cards */}
        <ol className="list-none border-b rule-strong">
          {featuredExperience.map((exp, index) => {
            const { title, annotations } = parseRole(exp.role);
            const ongoing = /present/i.test(exp.date);

            return (
              <m.li
                key={`${exp.company}-${exp.role}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.7, delay: index * 0.06, ease: EASE }}
                className="group border-t rule transition-colors duration-200 hover:bg-white/[0.03]"
              >
                <div className="grid grid-cols-1 gap-y-4 py-8 sm:py-10 lg:grid-cols-[11.5rem_minmax(0,1fr)] lg:gap-x-10">
                  {/* Date column — fixed width on lg, inline row on mobile */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 lg:flex-col lg:items-start lg:gap-3 lg:pt-2">
                    <span className="whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.14em] text-ink-600">
                      {formatDate(exp.date)}
                    </span>
                    {ongoing && (
                      <span className="stamp inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] leading-none">
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse-dot"
                          aria-hidden="true"
                        />
                        Ongoing
                      </span>
                    )}
                  </div>

                  {/* Entry — optional logo plate + company/role ledger line + desc */}
                  <div className="flex min-w-0 gap-4 sm:gap-6">
                    {exp.logo && (
                      <div className="plate h-10 w-10 shrink-0 rounded-xl sm:h-14 sm:w-14">
                        <img
                          src={`/images/experience/${exp.logo}.webp`}
                          alt={`${exp.company} logo`}
                          loading="lazy"
                          decoding="async"
                          width={56}
                          height={56}
                          className="h-full w-full object-contain p-1.5"
                          onError={hideImageOnError}
                        />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
                        <h3 className="font-display text-2xl font-light text-ink-900 transition-colors duration-200 group-hover:text-vermilion-400 sm:text-3xl">
                          {exp.company}
                        </h3>
                        <span className="font-body text-sm text-ink-700 sm:text-base">
                          {title}
                        </span>
                        <span className="leader hidden sm:block" aria-hidden="true" />
                        {annotations.length > 0 && (
                          <span className="whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.14em] text-ink-500">
                            {annotations.join(' · ')}
                          </span>
                        )}
                      </div>

                      <p className="mt-3 max-w-prose text-sm leading-relaxed text-ink-500 sm:text-base">
                        {exp.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </m.li>
            );
          })}
        </ol>

        {/* Resume CTA — the record continues in the résumé overlay */}
        <m.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          className="mt-12 flex flex-col items-start justify-between gap-6 sm:mt-16 sm:flex-row sm:items-center"
        >
          <MagneticHover strength={12}>
            <a
              href="#resume"
              className="btn-primary min-h-[44px] px-7 py-4"
            >
              View Full Record
              <ArrowRightIcon className="arrow-bounce h-4 w-4" />
            </a>
          </MagneticHover>
          <span className="folio">Record continues in résumé</span>
        </m.div>
      </div>
    </section>
  );
}

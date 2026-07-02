import { m } from 'framer-motion';
import { hideImageOnError } from '../data/content';
import { SectionHeader } from './ui/SectionHeader';

const EASE = [0.16, 1, 0.3, 1] as const;

interface LedgerRow {
  label: string;
  value: string;
  /** Render the value in vermilion (key transcript data). */
  accent?: boolean;
}

interface EducationItem {
  institution: string;
  degree: string;
  location: string;
  period: string;
  status: 'Pursuing' | 'Completed';
  image: string;
}

/** Primary record — rendered as the hairline-framed transcript excerpt. */
const primaryRecord: EducationItem = {
  institution: 'American International University-Bangladesh',
  degree: 'Bachelor of Science in Computer Science and Engineering',
  location: 'AIUB',
  period: '2022 — 2026',
  status: 'Pursuing',
  image: 'university',
};

/** Honours ledger for the primary record (Dean's List data per achievements). */
const primaryLedger: LedgerRow[] = [
  { label: 'Location', value: 'AIUB' },
  { label: "Dean's List", value: '3×', accent: true },
  { label: 'Term CGPA', value: '3.95 · 3.89 · 3.75+' },
  { label: 'Expected Graduation', value: '2026' },
];

/** Prior records — secondary ledger rows. */
const priorRecords: EducationItem[] = [
  {
    institution: 'Govt. Azizul Haque College',
    degree: 'Higher Secondary School Certificate (HSC) in Science',
    location: 'Bogura',
    period: '2019 — 2021',
    status: 'Completed',
    image: 'college',
  },
  {
    institution: 'Bogra Zilla School',
    degree: 'Secondary School Certificate (SSC) in Science',
    location: 'Bogura',
    period: '2011 — 2019',
    status: 'Completed',
    image: 'school',
  },
];

export function Education() {
  return (
    <section id="education" className="py-24 sm:py-32">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <SectionHeader
          number="09"
          name="EDUCATION"
          title={
            <>
              Academic <em>record</em>
            </>
          }
          annotation="3 INSTITUTIONS · 2011—2026"
        />

        {/* Primary record — hairline-framed transcript excerpt */}
        <m.article
          className="reg-marks relative border rule bg-paper-50 shadow-plate"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.7, ease: EASE }}
          aria-label={`Academic record: ${primaryRecord.institution}`}
        >
          {/* Transcript header strip */}
          <div className="flex items-baseline justify-between gap-4 border-b rule px-5 py-3 sm:px-8 lg:px-10">
            <span className="folio">RECORD 09-01</span>
            <span className="folio hidden sm:block text-right">
              TRANSCRIPT EXCERPT · OFFICIAL COPY
            </span>
          </div>

          <div className="grid gap-10 p-5 py-8 sm:p-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14 lg:p-10">
            <div className="min-w-0">
              {/* Institution + status stamp */}
              <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-5">
                <h3 className="max-w-2xl font-display text-3xl font-light leading-[1.08] text-ink-900 sm:text-4xl">
                  {primaryRecord.institution}
                </h3>
                <span className="stamp inline-block shrink-0 -rotate-3 px-3 py-1.5 text-[10px]">
                  {primaryRecord.status}
                </span>
              </div>

              {/* Degree + years — mono */}
              <p className="mt-4 font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-ink-500 sm:text-xs">
                {primaryRecord.degree}
                <span aria-hidden="true"> · </span>
                {primaryRecord.period}
              </p>

              {/* Honours ledger — dotted leaders */}
              <dl className="mt-8 border-t rule sm:mt-10">
                {primaryLedger.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-baseline border-b rule py-3.5"
                  >
                    <dt className="folio shrink-0">{row.label}</dt>
                    <span className="leader" aria-hidden="true" />
                    <dd
                      className={`shrink-0 text-right font-mono text-xs uppercase tracking-[0.14em] ${
                        row.accent
                          ? 'font-medium text-vermilion-600'
                          : 'text-ink-900'
                      }`}
                    >
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* University plate */}
            <figure className="group lg:pt-1">
              <div className="plate reg-marks relative shadow-plate">
                <img
                  src={`/images/education/${primaryRecord.image}.webp`}
                  alt={primaryRecord.institution}
                  width={640}
                  height={480}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full object-cover"
                  onError={hideImageOnError}
                />
              </div>
              <figcaption className="folio mt-3">
                FIG. 01 — THE UNIVERSITY · AIUB
              </figcaption>
            </figure>
          </div>
        </m.article>

        {/* Prior records — secondary ledger */}
        <div className="mt-16 sm:mt-20">
          <m.div
            className="flex items-baseline justify-between gap-4 border-t rule-strong pt-3"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <span className="folio">PRIOR RECORDS</span>
            <span className="folio text-right">2011 — 2021</span>
          </m.div>

          <ul className="mt-2">
            {priorRecords.map((edu, index) => (
              <m.li
                key={edu.institution}
                className="group grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-4 border-b rule py-8 sm:grid-cols-[5rem_minmax(0,1fr)] sm:gap-x-6 sm:py-10"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.7, ease: EASE, delay: index * 0.08 }}
              >
                {/* Small plate */}
                <div className="plate relative h-14 w-14 sm:h-20 sm:w-20">
                  <img
                    src={`/images/education/${edu.image}.webp`}
                    alt={edu.institution}
                    width={96}
                    height={96}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                    onError={hideImageOnError}
                  />
                </div>

                <div className="min-w-0">
                  {/* Institution … period (dotted leader) */}
                  <div className="flex items-baseline">
                    <h4 className="font-display text-xl font-light leading-[1.15] text-ink-900 sm:text-2xl">
                      {edu.institution}
                    </h4>
                    <span className="leader hidden sm:block" aria-hidden="true" />
                    <span className="hidden shrink-0 font-mono text-xs uppercase tracking-[0.14em] text-ink-900 sm:block">
                      {edu.period}
                    </span>
                  </div>

                  {/* Degree — mono */}
                  <p className="mt-3 font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-ink-500 sm:text-xs">
                    RECORD 09-0{index + 2}
                    <span aria-hidden="true"> · </span>
                    {edu.degree}
                  </p>

                  {/* Location · period (mobile) · status */}
                  <p className="mt-2 font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-ink-500 sm:text-xs">
                    {edu.location}
                    <span className="sm:hidden">
                      <span aria-hidden="true"> · </span>
                      {edu.period}
                    </span>
                    <span aria-hidden="true"> · </span>
                    <span className="text-ink-700">{edu.status}</span>
                  </p>
                </div>
              </m.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

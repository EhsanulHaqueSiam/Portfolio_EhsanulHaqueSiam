import { m } from 'framer-motion';
import type { ReactNode } from 'react';
import { profile, profileImage, hideImageOnError } from '../data/content';
import { SectionHeader } from './ui/SectionHeader';
import { GitHubGraph } from './ui/GitHubGraph';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Phrases inside profile.bio that receive a permanent editorial underline.
 * Capped at the 3 strongest hire-signals — more underlines dilute all of them.
 * Matching is literal against the JSON string — if the data changes and a
 * phrase no longer appears, it simply renders unstyled (never breaks).
 */
const KEY_PHRASES = [
  'Taylor & Francis book chapter',
  'IEEE QPAIN 2026',
  '1.5x client revenue',
];

const PHRASE_CLASS =
  'underline decoration-vermilion/70 decoration-[1.5px] underline-offset-[0.2em]';

/** Typeset the bio: wrap key phrases in underlined spans (spans, not links). */
function typesetBio(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let rest = text;
  let key = 0;

  while (rest.length > 0) {
    let matchIdx = -1;
    let matchPhrase = '';
    for (const phrase of KEY_PHRASES) {
      const idx = rest.indexOf(phrase);
      if (idx !== -1 && (matchIdx === -1 || idx < matchIdx)) {
        matchIdx = idx;
        matchPhrase = phrase;
      }
    }
    if (matchIdx === -1) {
      nodes.push(rest);
      break;
    }
    if (matchIdx > 0) {
      nodes.push(rest.slice(0, matchIdx));
    }
    nodes.push(
      <span key={key++} className={PHRASE_CLASS}>
        {matchPhrase}
      </span>,
    );
    rest = rest.slice(matchIdx + matchPhrase.length);
  }

  return nodes;
}

// Computed once at module scope — pure, deterministic, SSR-identical.
const bioNodes = typesetBio(profile.bio);

export function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <SectionHeader
          number="01"
          name="ABOUT"
          title={
            <>
              Research, <em>shipped</em>.
            </>
          }
          annotation="EST. READ 2 MIN"
        />

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-10">
          {/* ——— Left rail: portrait plate + ledger (sticky on lg) ——— */}
          <m.div
            className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <figure className="max-w-sm lg:max-w-none">
              <div className="reg-marks relative p-2 sm:p-3">
                <div
                  className="absolute -inset-4 rounded-[2rem] opacity-50 blur-2xl"
                  style={{
                    background:
                      'radial-gradient(60% 60% at 60% 35%, rgba(139,124,255,0.18), transparent 70%)',
                  }}
                  aria-hidden="true"
                />
                <div className="plate shadow-plate relative">
                  <img
                    src={profileImage}
                    alt={profile.name}
                    loading="lazy"
                    decoding="async"
                    width={640}
                    height={800}
                    sizes="(max-width: 1024px) 384px, 33vw"
                    className="block aspect-[4/5] w-full object-cover"
                    onError={hideImageOnError}
                  />
                </div>
              </div>
              <figcaption className="folio mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-2 sm:px-3">
                <span>Fig. 01 · The author</span>
                <span className="text-ink-500">{profile.name}</span>
              </figcaption>
            </figure>

            {/* Ledger — mono rows with dotted leaders */}
            <dl className="rule mt-10 divide-y divide-[color:var(--hairline)] border-b border-t">
              <div className="flex items-baseline py-3.5">
                <dt className="folio whitespace-nowrap">Based in</dt>
                <span className="leader" aria-hidden="true" />
                <dd className="text-right font-mono text-xs uppercase tracking-[0.14em] text-ink-900">
                  {profile.location}
                </dd>
              </div>
              <div className="flex items-baseline py-3.5">
                <dt className="folio whitespace-nowrap">Focus</dt>
                <span className="leader" aria-hidden="true" />
                <dd className="text-right font-mono text-xs uppercase tracking-[0.14em] text-ink-900">
                  AI × Full-Stack
                </dd>
              </div>
              <div className="flex items-baseline py-3.5">
                <dt className="folio whitespace-nowrap">Now</dt>
                <span className="leader" aria-hidden="true" />
                <dd className="text-right font-mono text-xs font-semibold uppercase tracking-[0.14em] text-vermilion-400">
                  {profile.currentCompany.split(',')[0]}
                </dd>
              </div>
            </dl>
          </m.div>

          {/* ——— Right column: drop-cap bio + contribution figure ——— */}
          <div className="lg:col-span-7 lg:col-start-6">
            <m.p
              className="max-w-[40rem] font-display text-xl font-light leading-[1.65] text-ink-900 first-letter:float-left first-letter:-mt-1 first-letter:pr-3 first-letter:font-display first-letter:text-[4.25rem] first-letter:font-normal first-letter:leading-[0.8] first-letter:text-vermilion-400 sm:text-2xl sm:first-letter:-mt-2 sm:first-letter:pr-4 sm:first-letter:text-[5.25rem]"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            >
              {bioNodes}
            </m.p>

            <m.p
              className="folio mt-8 max-w-[40rem] leading-[1.9]"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.7, delay: 0.18, ease: EASE }}
            >
              Currently · <span className="text-ink-900">{profile.currentRole}</span>{' '}
              · {profile.currentCompany}
            </m.p>

            <m.figure
              className="mt-14 sm:mt-16"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
            >
              <GitHubGraph />
              <figcaption className="folio mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span>Fig. 02 · Contribution density</span>
                <span className="text-ink-500">52 weeks</span>
              </figcaption>
            </m.figure>
          </div>
        </div>
      </div>
    </section>
  );
}

import { memo } from 'react';
import { m } from 'framer-motion';
import { skills } from '../data/content';
import { SectionHeader } from './ui/SectionHeader';
import type { Skill, SkillCategory } from '../data/types';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Proficiency → luminance weight. The specimen reads like a signal key:
 * iris violet = expert, bright = advanced, faded = intermediate.
 */
const LEVEL_CLASS: Record<Skill['level'], string> = {
  expert: 'text-vermilion-400 font-medium',
  advanced: 'text-ink-900',
  intermediate: 'text-ink-500',
  beginner: 'text-ink-500',
};

/** Spoken proficiency — the ink weights above are color-only, so AT gets words. */
const LEVEL_SR: Record<Skill['level'], string> = {
  expert: 'expert',
  advanced: 'advanced',
  intermediate: 'intermediate',
  beginner: 'beginner',
};

const totalInstruments = skills.categories.reduce(
  (acc, category) => acc + category.skills.length,
  0,
);

const CategoryRow = memo(function CategoryRow({
  category,
  index,
}: {
  category: SkillCategory;
  index: number;
}) {
  const count = category.skills.length;
  const last = category.skills.length - 1;

  return (
    <m.li
      className="group border-t rule transition-colors duration-200 hover:bg-white/[0.03]"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.7, ease: EASE, delay: Math.min(index * 0.07, 0.35) }}
    >
      <div className="py-8 sm:py-10">
        {/* Ledger meta: mono index left, tool count right */}
        <div className="mb-3 flex items-baseline justify-between gap-4 sm:mb-4">
          <span
            aria-hidden="true"
            className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500 transition-colors duration-200 group-hover:text-vermilion-400 sm:text-xs"
          >
            04.{index + 1}
          </span>
          <span className="text-right font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500 transition-colors duration-200 group-hover:text-ink-900 sm:text-xs">
            {count} {count === 1 ? 'Tool' : 'Tools'}
          </span>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-10">
          <h3 className="font-display text-display-md font-light text-ink-900 lg:col-span-5">
            {category.name}
          </h3>

          {/* Type specimen: every skill inline, weighted by proficiency */}
          <p className="mt-4 font-mono text-sm uppercase leading-[2] tracking-[0.08em] lg:col-span-7 lg:mt-2">
            {category.skills.map((skill, j) => (
              <span key={skill.name}>
                <span className={LEVEL_CLASS[skill.level]}>
                  {skill.name}
                  <span className="sr-only"> ({LEVEL_SR[skill.level]})</span>
                </span>
                {j < last && (
                  <span aria-hidden="true" className="text-ink-300">
                    {' · '}
                  </span>
                )}
              </span>
            ))}
          </p>
        </div>
      </div>
    </m.li>
  );
});

export function Skills() {
  const categories = skills.categories;

  return (
    <section id="skills" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <SectionHeader
          number="04"
          name="SKILLS"
          title={
            <>
              The <em>toolkit</em>
            </>
          }
          annotation={`${categories.length} CATEGORIES · ${totalInstruments} TOOLS`}
        />

        {/* Reading key for the specimen ink weights */}
        <m.div
          className="glass mb-10 inline-flex flex-wrap items-baseline gap-x-6 gap-y-2 !rounded-full px-5 py-3 sm:mb-14 sm:px-6"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <span className="folio">Key</span>
          <span className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-vermilion-400">
            <span aria-hidden="true">● </span>Violet = Expert
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-900">
            <span aria-hidden="true">● </span>Bright = Advanced
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-500">
            <span aria-hidden="true">● </span>Faded = Intermediate
          </span>
        </m.div>

        {/* Open ledger: all 8 categories always rendered — no tabs, fully crawlable */}
        <ul role="list" className="border-b rule">
          {categories.map((category, index) => (
            <CategoryRow key={category.name} category={category} index={index} />
          ))}
        </ul>
      </div>
    </section>
  );
}

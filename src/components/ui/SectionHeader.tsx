import { memo } from 'react';
import type { ReactNode } from 'react';
import { m } from 'framer-motion';

interface SectionHeaderProps {
  /** Folio index, e.g. "01" */
  number: string;
  /** Mono section name printed in the folio row, e.g. "ABSTRACT" */
  name?: string;
  /** Display title — may contain <em> for italic Fraunces emphasis */
  title: ReactNode;
  /** Right-aligned mono annotation, e.g. "5 ENTRIES · 2023—2026" */
  annotation?: string;
  /** Set true inside ink (dark) spreads */
  inverse?: boolean;
  className?: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Editorial section opener: hairline-topped folio row (NN — NAME ... ANNOTATION)
 * followed by a giant Fraunces title that mask-reveals on scroll.
 */
export const SectionHeader = memo(function SectionHeader({
  number,
  name,
  title,
  annotation,
  inverse = false,
  className = '',
}: SectionHeaderProps) {
  const folio = inverse ? 'folio-inverse' : 'folio';
  const rule = inverse ? 'rule-inverse' : 'rule-strong';

  return (
    <div className={`mb-12 sm:mb-16 md:mb-20 ${className}`}>
      <div className={`border-t ${rule} pt-3 mb-8 sm:mb-10 flex items-baseline justify-between gap-4`}>
        <span className={folio}>
          <span className={inverse ? 'text-vermilion-400' : 'text-vermilion'}>{number}</span>
          {name && (
            <>
              <span aria-hidden="true"> · </span>
              {name}
            </>
          )}
        </span>
        {annotation && (
          <span className={`${folio} hidden sm:block text-right`}>{annotation}</span>
        )}
      </div>
      <h2
        className="poster text-display-lg text-ink-900"
      >
        <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
          <m.span
            className="block will-change-transform"
            initial={{ y: '105%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            {title}
          </m.span>
        </span>
      </h2>
    </div>
  );
});

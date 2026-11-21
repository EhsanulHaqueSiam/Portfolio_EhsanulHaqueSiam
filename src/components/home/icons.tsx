import type { SVGProps } from 'react';
import { brandPaths } from './brandPaths';

type P = SVGProps<SVGSVGElement>;

/** Filled 24x24 brand mark from Simple Icons. */
export function Brand({ name, ...p }: P & { name: keyof typeof brandPaths }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
      <path d={brandPaths[name]} />
    </svg>
  );
}

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export function SpeakerIcon({ on, ...p }: P & { on: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...p}>
      <path d="M11 5 6 9H3v6h3l5 4z" />
      {on ? (
        <>
          <path d="M15.5 9.5a3.5 3.5 0 0 1 0 5" className="origin-left transition-opacity duration-200" />
          <path d="M18.5 7a7 7 0 0 1 0 10" className="origin-left transition-opacity duration-200" />
        </>
      ) : (
        <path d="m16 10 4 4m0-4-4 4" />
      )}
    </svg>
  );
}

export function GlobeIcon(p: P) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </svg>
  );
}

export function ChevronIcon(p: P) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...p}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function StarOutlineIcon(p: P) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...p}>
      <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z" />
    </svg>
  );
}

export function MergeIcon(p: P) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...p}>
      <circle cx="6" cy="6" r="2.2" />
      <circle cx="6" cy="18" r="2.2" />
      <circle cx="18" cy="15" r="2.2" />
      <path d="M6 8.2v7.6M6 8.5c0 4 3 6.5 9.8 6.5" />
    </svg>
  );
}

/** T3 Code's app icon (assets/prod in pingdotgg/t3code), at 2x for the 40px tile. */
export function T3Mark({ className = '' }: { className?: string }) {
  return <img src="/images/icons/t3code.webp" alt="" width={48} height={48} className={`object-cover ${className}`} />;
}

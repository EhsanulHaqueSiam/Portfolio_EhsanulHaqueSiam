import { type ReactNode, useEffect, useState } from 'react';
import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import { profile, profileImage, roles } from '../../data/content';
import { haptic } from '../../lib/haptics';
import { sound } from '../../lib/sound';
import { MapPinIcon } from '../ui/Icons';
import { Brand, T3Mark } from './icons';

// Tools Siam contributes to or lives in. `r` is the resting tilt.
const stickers: Array<{ label: string; r: string; mark: ReactNode; tile: string }> = [
  { label: 'T3 Code contributor', r: '-8deg', mark: <T3Mark className="h-full w-full text-[11px]" />, tile: '' },
  { label: 'Better Auth contributor', r: '5deg', mark: <Brand name="betterAuth" className="h-3.5 w-3.5" />, tile: 'bg-white text-black' },
  { label: 'Neovim', r: '-4deg', mark: <Brand name="neovim" className="h-3.5 w-3.5" />, tile: 'bg-[#0f1a12] text-[#57a143]' },
  { label: 'Arch Linux (Omarchy)', r: '7deg', mark: <Brand name="arch" className="h-3.5 w-3.5" />, tile: 'bg-[#0b1520] text-[#1793d1]' },
];

function Stickers() {
  return (
    <ul aria-label="Tools I contribute to and use" className="flex items-center pl-1">
      {stickers.map((s, i) => (
        <li key={s.label} className="-ml-1.5 first:ml-0">
          <button
            type="button"
            title={s.label}
            aria-label={s.label}
            style={{ '--r': s.r } as React.CSSProperties}
            onMouseEnter={() => sound.note(i + 2)}
            onClick={(e) => {
              const el = e.currentTarget;
              el.classList.add('lift');
              sound.note(i + 2);
              haptic();
              setTimeout(() => el.classList.remove('lift'), 650);
            }}
            className={`sticker grid h-7 w-7 place-items-center overflow-hidden rounded-[8px] border-2 border-[#f4f4f1] shadow-[0_3px_8px_rgb(0_0_0/0.4)] ${s.tile}`}
          >
            {s.mark}
          </button>
        </li>
      ))}
    </ul>
  );
}

/**
 * The role line under the name, after samworks: every 3s the phrase swaps, each
 * letter rising out of a blur 30ms after the one before. Screen readers get the
 * full title once; reduced motion keeps the first phrase still.
 */
function RollingRole() {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => !document.hidden && setI((n) => (n + 1) % roles.length), 3000);
    return () => clearInterval(id);
  }, [reduce]);
  const phrase = roles[i];
  return (
    <p className="mt-1 h-[18px] overflow-hidden font-mono text-[12px] uppercase tracking-[0.14em] text-foreground/80">
      <span className="sr-only">{profile.title}</span>
      <AnimatePresence mode="popLayout" initial={false}>
        <m.span
          key={phrase}
          aria-hidden="true"
          className="inline-flex"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.4 }}
        >
          {Array.from(phrase).map((ch, n) => (
            <m.span
              key={n}
              className="roll-char"
              initial={{ opacity: 0, y: 5, filter: 'blur(5px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -5, filter: 'blur(5px)' }}
              transition={{ delay: 0.03 * n, duration: 0.3 }}
            >
              {ch === ' ' ? '\u00a0' : ch}
            </m.span>
          ))}
        </m.span>
      </AnimatePresence>
    </p>
  );
}

export function Profile() {
  return (
    <div>
      {/* 10-frame loop (falling water, foam, twinkling fireflies); the still frame for reduced motion. */}
      <picture>
        <source media="(prefers-reduced-motion: reduce)" srcSet="/images/banner.webp" />
        <img
          src="/images/banner-anim.webp"
          alt="Pixel-art night scene: a waterfall under a full moon and aurora, with fireflies and glowing plants"
          width={1360}
          height={453}
          fetchPriority="high"
          className="block aspect-[1360/453] w-full border-b border-border object-cover"
        />
      </picture>
      <div className="flex items-center gap-4 px-4 py-4">
        <img
          src={profileImage}
          alt={profile.name}
          width={88}
          height={88}
          className="h-[88px] w-[88px] shrink-0 rounded-xl border border-border bg-card object-cover p-[3px]"
        />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <h1 className="font-serif text-[30px] leading-[1.05] tracking-[-0.01em] sm:text-[34px]">{profile.name}</h1>
            <Stickers />
          </div>
          <RollingRole />
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPinIcon className="h-3 w-3" />
            {profile.location}
          </p>
        </div>
      </div>
    </div>
  );
}

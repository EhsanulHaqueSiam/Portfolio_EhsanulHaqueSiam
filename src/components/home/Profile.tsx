import type { ReactNode } from 'react';
import { profile, profileImage } from '../../data/content';
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
            onPointerUp={(e) => {
              if (e.pointerType === 'mouse') return;
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

export function Profile() {
  return (
    <div>
      {/* 8-frame loop (river shimmer, lantern flicker, stars); the still frame for reduced motion. */}
      <picture>
        <source media="(prefers-reduced-motion: reduce)" srcSet="/images/banner.webp" />
        <img
          src="/images/banner-anim.webp"
          alt="Pixel-art night view of Dhaka from the Buriganga river, boats and a rickshaw on the bank"
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
          <p className="mt-1 font-mono text-[12px] uppercase tracking-[0.14em] text-foreground/80">{profile.title}.</p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPinIcon className="h-3 w-3" />
            {profile.location}
          </p>
        </div>
      </div>
    </div>
  );
}

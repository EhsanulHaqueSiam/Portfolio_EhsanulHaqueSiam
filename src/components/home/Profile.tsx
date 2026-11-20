import { type ReactNode, useEffect, useRef, useState } from 'react';
import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import { profile, profileImage, roles, stickers } from '../../data/content';
import { haptic } from '../../lib/haptics';
import { sound } from '../../lib/sound';
import { MapPinIcon } from '../ui/Icons';
import { Brand, T3Mark } from './icons';

const TILTS = ['-8deg', '5deg', '-4deg', '7deg'];
const TILE: Record<(typeof stickers)[number]['mark'], { cls: string; mark: ReactNode }> = {
  t3: { cls: '', mark: <T3Mark className="h-full w-full text-[11px]" /> },
  betterAuth: { cls: 'bg-white text-black', mark: <Brand name="betterAuth" className="h-3.5 w-3.5" /> },
  neovim: { cls: 'bg-[#0f1a12] text-[#57a143]', mark: <Brand name="neovim" className="h-3.5 w-3.5" /> },
  linux: { cls: 'bg-[#1a1a1a] text-[#f4f4f1]', mark: <Brand name="linux" className="h-3.5 w-3.5" /> },
};

/** Tilted tiles that lift and play a note on hover. Contributions link to the Open Source section. */
function Stickers() {
  return (
    <ul aria-label="Projects I contribute to and tools I use" className="flex items-center pl-1">
      {stickers.map((s, i) => {
        const tile = TILE[s.mark];
        const cls = `sticker grid h-7 w-7 place-items-center overflow-hidden rounded-[8px] border-2 border-[#f4f4f1] shadow-[0_3px_8px_rgb(0_0_0/0.4)] ${tile.cls}`;
        const style = { '--r': TILTS[i % TILTS.length] } as React.CSSProperties;
        return (
          <li key={s.label} className="-ml-1.5 first:ml-0" onMouseEnter={() => sound.note(i + 2)}>
            {s.href ? (
              <a href={s.href} title={s.label} aria-label={s.label} style={style} className={cls} onClick={haptic}>
                {tile.mark}
              </a>
            ) : (
              <span role="img" title={s.label} aria-label={s.label} style={style} className={cls}>
                {tile.mark}
              </span>
            )}
          </li>
        );
      })}
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
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (reduce || !ref.current) return;
    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(ref.current);
    const id = setInterval(() => visible && !document.hidden && setI((n) => (n + 1) % roles.length), 3000);
    return () => {
      clearInterval(id);
      io.disconnect();
    };
  }, [reduce]);
  const phrase = roles[i];
  return (
    <p ref={ref} className="relative mt-1 h-[18px] overflow-hidden font-mono text-[12px] uppercase tracking-[0.14em] text-foreground/80">
      <span className="sr-only">{profile.title}</span>
      <AnimatePresence mode="popLayout" initial={false}>
        <m.span
          key={phrase}
          aria-hidden="true"
          className="inline-flex"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.4 } }}
          exit={{ opacity: 0, y: -5, transition: { duration: 0.15 } }}
        >
          {Array.from(phrase).map((ch, n) => (
            <m.span
              key={n}
              className="roll-char"
              initial={{ opacity: 0, y: 5, filter: 'blur(5px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
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

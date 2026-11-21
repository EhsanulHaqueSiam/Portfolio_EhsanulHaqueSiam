import { type ReactNode, useEffect, useRef, useState } from 'react';
import { m, useReducedMotion, useTransform } from 'framer-motion';
import { profile, profileImage, roles, stickers } from '../../data/content';
import { haptic } from '../../lib/haptics';
import { isPlain } from '../../lib/plain';
import { usePull } from '../../lib/pull';
import { sound } from '../../lib/sound';
import { MapPinIcon } from '../ui/Icons';
import { Brand, T3Mark } from './icons';
import { HiddenCat } from './PixelCat';
import { RollNumber } from './RollNumber';

const TILTS = ['-8deg', '5deg', '-4deg', '7deg'];
const TILE: Record<(typeof stickers)[number]['mark'], { cls: string; mark: ReactNode }> = {
  t3: { cls: '', mark: <T3Mark className="h-full w-full" /> },
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
              <a href={s.href} title={s.label} aria-label={s.label} style={style} className={cls} onClick={() => haptic()}>
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
 * The rolling role in the status line ("Open to work · AI Engineer"). Every 3s the phrase
 * changes by rolling: each letter column slides up, the old character out and the new one
 * in, 22ms after its neighbour (after superinteractions.com's text roll). Monospace keeps the
 * columns aligned. The fixed headline above carries the title for the 30-second read, so this
 * is a flourish: screen readers skip it; reduced motion and the plain version stay still.
 */
function RollingRole() {
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const width = Math.max(...roles.map((r) => r.length));

  useEffect(() => {
    if (reduce || isPlain() || !ref.current) return;
    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(ref.current);
    const id = setInterval(() => {
      if (visible && !document.hidden) setTo((n) => (n + 1) % roles.length);
    }, 3000);
    return () => {
      clearInterval(id);
      io.disconnect();
    };
  }, [reduce]);

  // Once the last column has landed, the new phrase becomes the resting one.
  useEffect(() => {
    if (to === from) return;
    const done = setTimeout(() => setFrom(to), 400 + 22 * width);
    return () => clearTimeout(done);
  }, [to, from, width]);

  const rolling = to !== from;
  const pad = (s: string, i: number) => (s[i] === undefined || s[i] === ' ' ? '\u00a0' : s[i]);
  return (
    <span ref={ref} aria-hidden="true" className="inline-block h-[16px] overflow-hidden align-middle font-mono text-[11px] leading-[16px] text-foreground/80">
      <span className={`roll ${rolling ? 'is-rolling' : ''}`}>
        {Array.from({ length: width }, (_, i) => (
          <span key={i} className="roll-col" style={{ '--i': i } as React.CSSProperties}>
            <span>{pad(roles[from], i)}</span>
            <span>{pad(roles[to], i)}</span>
          </span>
        ))}
      </span>
    </span>
  );
}

/**
 * The hero photo, which you can grab and pull (the gentle version of rameerez.com's face):
 * it follows the pointer a little, stretching along the pull, and springs back with a
 * wobble on release. Squashes slightly while pressed. Nothing moves until it is touched.
 */
function PullablePhoto() {
  const { x, y, handlers } = usePull({
    follow: 0.35,
    stiffness: 420,
    damping: 11,
    onGrab: (e) => {
      sound.click();
      if (e.pointerType !== 'mouse') haptic('selection');
    },
    onRelease: () => sound.note(6),
  });
  const scaleX = useTransform(x, [-40, 0, 40], [1.14, 1, 1.14]);
  const scaleY = useTransform(y, [-40, 0, 40], [1.14, 1, 1.14]);
  return (
    <m.img
      src={profileImage}
      alt={profile.name}
      width={88}
      height={88}
      draggable={false}
      {...handlers}
      data-pull=""
      whileTap={{ scale: 0.95 }}
      style={{ x, y, scaleX, scaleY }}
      className="relative z-10 h-[88px] w-[88px] shrink-0 cursor-grab touch-none select-none rounded-xl border border-border bg-card object-cover p-[3px] active:cursor-grabbing"
    />
  );
}

const dhaka = new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Dhaka' });

/**
 * "Open to work · 12:40 PM in Dhaka". Availability is hq's `available` flag. The time is
 * Siam's local time (his location is Dhaka), filled in after hydration so the static HTML
 * never shows a stale build-time clock, and re-read on each minute boundary: a text
 * change once a minute, no animation.
 */
function Status() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    let id = 0;
    const tick = () => {
      setTime(dhaka.format(new Date()));
      id = window.setTimeout(tick, 60_000 - (Date.now() % 60_000));
    };
    tick();
    return () => clearTimeout(id);
  }, []);
  const city = profile.location.split(',')[0];
  return (
    <p className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-muted-foreground">
      {profile.available && (
        <>
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-signal-success" />
          <span className="text-foreground/80">Open to work</span>
          <span aria-hidden="true">·</span>
          <RollingRole />
        </>
      )}
      <MapPinIcon className="h-3 w-3" />
      {time ? (
        <span>
          <span className="tabular-nums text-foreground/80">{time}</span> in {city}
        </span>
      ) : (
        profile.location
      )}
    </p>
  );
}

export function Profile() {
  return (
    <div>
      {/* 10-frame loop (falling water, foam, twinkling fireflies); the still frame for reduced motion. */}
      <div data-playful="" className="relative">
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
      {/* A hidden cat on the dark ledge left of the waterfall. */}
      <HiddenCat id="banner" pose="sit" className="absolute bottom-[27%] left-[30%] h-[14px] w-[17px]" />
      </div>
      <div className="flex items-center gap-4 px-4 py-4">
        <PullablePhoto />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <h1 className="font-serif text-[30px] leading-[1.05] tracking-[-0.01em] sm:text-[34px]">{profile.name}</h1>
            <Stickers />
          </div>
          <p className="mt-1 font-mono text-[12px] uppercase leading-[18px] tracking-[0.14em] text-foreground/80">{profile.title}</p>
          <Status />
        </div>
      </div>
      <p className="px-4 text-[14.5px] leading-relaxed text-foreground/85">{profile.tagline.replace(/\.?$/, '.')}</p>
      <div className="flex flex-wrap gap-2 px-4 pt-4">
        <a href={`mailto:${profile.email}`} onClick={() => haptic()} onMouseEnter={sound.tick} className="press rounded-full bg-foreground px-4 py-2 text-[13px] font-medium text-background">
          Email me
        </a>
        <a href="#resume" onMouseEnter={sound.tick} className="press rounded-full border border-border px-4 py-2 text-[13px] text-foreground/85 transition-colors hover:border-foreground/30 hover:text-foreground">
          View CV
        </a>
      </div>
      <HeroStats />
    </div>
  );
}

/** hq's headline stats ("1.5x revenue growth", ...): the 30-second read. Numbers roll up once on load. */
function HeroStats() {
  if (!profile.stats?.length) return null;
  return (
    <dl className="mx-4 mb-4 mt-5 grid grid-cols-2 overflow-hidden rounded-xl border border-border sm:grid-cols-4">
      {profile.stats.map((s, i) => {
        // "1.5x" -> 1.5 + "x", "50K+" -> 50 + "K+"; anything without a leading number shows as is.
        const m = s.value.match(/^([\d.]+)(.*)$/);
        return (
          <div key={s.label} className={`flex flex-col-reverse px-3 py-3 ${i % 2 === 0 ? 'border-r' : ''} ${i < 2 ? 'border-b sm:border-b-0' : ''} ${i === 1 ? 'sm:border-r' : ''} border-border`}>
            <dt className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">{s.label}</dt>
            {/* Sans, not the serif: the odometer needs fixed-width figures, which the serif lacks. */}
            <dd className="text-[24px] font-medium leading-none tracking-[-0.02em]">
              {m ? (
                <>
                  <RollNumber value={Number(m[1])} format={{ maximumFractionDigits: 1 }} fromZero />
                  {m[2]}
                </>
              ) : (
                s.value
              )}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

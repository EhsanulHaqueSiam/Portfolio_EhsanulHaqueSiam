import { type ReactNode, useEffect, useState } from 'react';
import { m, useTransform } from 'framer-motion';
import { profile, profileImage, stickers } from '../../data/content';
import { haptic } from '../../lib/haptics';
import { usePull } from '../../lib/pull';
import { sound } from '../../lib/sound';
import { Brand, T3Mark } from './icons';
import { HiddenCat } from './PixelCat';

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
      className="relative z-10 h-[88px] w-[88px] shrink-0 sm:h-[104px] sm:w-[104px] cursor-grab touch-none select-none rounded-xl border border-border bg-card object-cover p-[3px] active:cursor-grabbing"
    />
  );
}

const dhaka = new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Dhaka' });

/**
 * "Open to work · 12:40 PM in Dhaka", one quiet line. Availability is hq's `available` flag. The time is
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
        </>
      )}
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
      {/* Three things, like samworks: name, role, and where and whether he's available. */}
      <div className="flex items-center gap-5 px-4 py-6">
        <PullablePhoto />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <h1 className="font-serif text-[30px] leading-[1.05] tracking-[-0.01em] sm:text-[36px]">{profile.name}</h1>
            <Stickers />
          </div>
          <p className="mt-1.5 text-[14px] font-medium leading-snug text-muted-foreground sm:text-[17px] sm:font-semibold">{profile.title}</p>
          <Status />
        </div>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { catFacts } from '../../data/catFacts';
import { CATS, type CatId, findCat, useCatFind } from '../../lib/cats';
import { haptic } from '../../lib/haptics';
import { sound } from '../../lib/sound';

/**
 * Pixel cats (after Dhruv's pixel mascot). One sits on the dock and tells true facts about Siam
 * when clicked; five more hide around the site (banner, a hatched band, a paper's BibTeX, the 404,
 * a hidden ⌘K command) and count toward a little hunt (lib/cats.ts). They only move when touched:
 * frames swap in CSS (.cat in index.css). The plain version hides them all.
 */

type Pose = 'sit' | 'peek' | 'sleep';

/** The cat drawings: a sitting cat (17x14, with blink and tail-flick frames), a head peeking over an edge (17x9), a curled sleeper (24x12). */
export function CatSprite({ pose, className = '' }: { pose: Pose; className?: string }) {
  if (pose === 'peek')
    return (
      <svg viewBox="0 0 17 9" shapeRendering="crispEdges" aria-hidden="true" className={`cat ${className}`}>
        <g className="fill-foreground/80">
          <rect x="5" y="0" width="1" height="2" />
          <rect x="11" y="0" width="1" height="2" />
          <rect x="6" y="1" width="5" height="1" />
          <rect x="5" y="2" width="7" height="7" />
        </g>
        <g className="fill-background">
          <g className="cat-eyes">
            <rect x="6" y="4" width="1" height="2" />
            <rect x="10" y="4" width="1" height="2" />
          </g>
          <g className="cat-blink">
            <rect x="6" y="5" width="1" height="1" />
            <rect x="10" y="5" width="1" height="1" />
          </g>
        </g>
      </svg>
    );
  if (pose === 'sleep')
    return (
      <svg viewBox="0 0 24 12" shapeRendering="crispEdges" aria-hidden="true" className={`cat ${className}`}>
        <g className="fill-foreground/80">
          <rect x="4" y="5" width="9" height="1" />
          <rect x="3" y="6" width="12" height="4" />
          <rect x="2" y="7" width="1" height="3" />
          <rect x="13" y="5" width="7" height="5" />
          <rect x="13" y="3" width="1" height="2" />
          <rect x="19" y="3" width="1" height="2" />
          <rect x="14" y="4" width="5" height="1" />
          <rect x="1" y="10" width="17" height="1" />
          <rect x="1" y="9" width="1" height="1" />
        </g>
        <g className="fill-background">
          <rect x="14" y="7" width="2" height="1" />
          <rect x="17" y="7" width="2" height="1" />
        </g>
        <g className="fill-muted-foreground">
          <rect x="21" y="0" width="3" height="1" />
          <rect x="22" y="1" width="1" height="1" />
          <rect x="21" y="2" width="3" height="1" />
        </g>
      </svg>
    );
  return (
    <svg viewBox="0 0 17 14" shapeRendering="crispEdges" aria-hidden="true" className={`cat ${className}`}>
      <g className="fill-foreground/80">
        <rect x="2" y="2" width="1" height="2" />
        <rect x="7" y="2" width="1" height="2" />
        <rect x="3" y="3" width="4" height="1" />
        <rect x="2" y="4" width="6" height="5" />
        <rect x="3" y="9" width="9" height="4" />
        <rect x="2" y="12" width="1" height="1" />
        <rect x="11" y="12" width="1" height="1" />
        <g className="cat-tail">
          <rect x="12" y="10" width="1" height="1" />
          <rect x="13" y="9" width="1" height="1" />
          <rect x="14" y="7" width="1" height="2" />
        </g>
        <g className="cat-flick">
          <rect x="12" y="10" width="2" height="1" />
          <rect x="14" y="10" width="1" height="1" />
          <rect x="15" y="9" width="1" height="1" />
        </g>
      </g>
      <g className="fill-background">
        <g className="cat-eyes">
          <rect x="3" y="5" width="1" height="2" />
          <rect x="6" y="5" width="1" height="2" />
        </g>
        <g className="cat-blink">
          <rect x="3" y="6" width="1" height="1" />
          <rect x="6" y="6" width="1" height="1" />
        </g>
        <rect x="4" y="7" width="2" height="1" />
      </g>
    </svg>
  );
}

/** A hidden cat: a small button that meows and counts toward the hunt when clicked. */
export function HiddenCat({ id, pose, className = '' }: { id: CatId; pose: Pose; className?: string }) {
  return (
    <button
      type="button"
      aria-label="Pet the cat"
      title="Pet the cat"
      data-playful=""
      onClick={() => {
        findCat(id);
        haptic('success');
      }}
      className={`press cat-host ${className}`}
    >
      <CatSprite pose={pose} className="block h-full w-full" />
    </button>
  );
}

/**
 * The cat that peeks over one hatched band on the home page, a different band each visit.
 * Chosen after hydration (so the server HTML stays the same) and drawn into that band by a portal.
 */
export function PeekingCat() {
  const [band, setBand] = useState<HTMLElement | null>(null);
  useEffect(() => {
    // Skip the first band (right under the hero) so it is a little hidden.
    const bands = [...document.querySelectorAll<HTMLElement>('main .hatch')].slice(1);
    if (bands.length) setBand(bands[Math.floor(Math.random() * bands.length)]);
  }, []);
  if (!band) return null;
  return createPortal(
    <span className="peek-slot" data-playful="">
      <HiddenCat id="band" pose="peek" className="peek-cat h-[18px] w-[34px]" />
    </span>,
    band,
  );
}

/** The dock cat: hover makes it blink, a click makes it say the next fact in a speech bubble. */
export function DockCat() {
  const [say, setSay] = useState<number | null>(null);
  const next = useRef(0);
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (say === null) return;
    const close = (e: Event) => {
      if (e instanceof KeyboardEvent ? e.key === 'Escape' : !ref.current?.contains(e.target as Node)) setSay(null);
    };
    addEventListener('pointerdown', close);
    addEventListener('keydown', close);
    return () => {
      removeEventListener('pointerdown', close);
      removeEventListener('keydown', close);
    };
  }, [say]);

  return (
    <span data-playful="" className="absolute -top-[21px] right-3">
      {say !== null && (
        <span role="status" className="cat-bubble absolute bottom-[calc(100%+10px)] right-[-6px] w-[230px] rounded-xl bg-foreground px-3 py-2 text-left text-[12.5px] leading-snug text-background shadow-[0_8px_20px_rgb(0_0_0/0.35)]">
          meow. {catFacts[say]}
          <span className="mt-1 block font-mono text-[10px] text-background/60">
            {say + 1} of {catFacts.length} · click for another
          </span>
        </span>
      )}
      <button
        ref={ref}
        type="button"
        aria-label="Ask the cat for a fact about Siam"
        onPointerEnter={(e) => e.pointerType === 'mouse' && sound.note(8)}
        onClick={() => {
          setSay(next.current);
          next.current = (next.current + 1) % catFacts.length;
          sound.meow();
          haptic();
        }}
        className="press cat-host block h-[22px] w-[27px]"
      >
        <CatSprite pose="sit" className="block h-full w-full" />
      </button>
    </span>
  );
}

/** "3 of 5 cats found": a pill that rises above the dock for a moment after each find. */
export function CatToast() {
  const find = useCatFind();
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-[84px] z-40 flex justify-center print:hidden">
      {find && (
        <span key={find.at} className="cat-toast flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 font-mono text-[12px] text-foreground/85 shadow-[0_8px_20px_rgb(0_0_0/0.3)]">
          <CatSprite pose="sit" className="h-3 w-3.5" />
          {find.count === CATS.length ? 'You found every cat.' : `${find.count} of ${CATS.length} cats found`}
        </span>
      )}
    </div>
  );
}

let greeted = false;
/** A cat in the developer console, once per visit, for anyone who opens DevTools. */
export function useConsoleCat() {
  useEffect(() => {
    if (greeted) return;
    greeted = true;
    console.log(' /\\_/\\   hi, developer.\n( o.o )  this site is open source:\n > ^ <   https://github.com/EhsanulHaqueSiam/Portfolio_EhsanulHaqueSiam');
  }, []);
}

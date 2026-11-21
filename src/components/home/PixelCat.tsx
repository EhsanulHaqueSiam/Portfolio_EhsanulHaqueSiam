import { useRef } from 'react';
import { sound } from '../../lib/sound';

/**
 * A 17x14 pixel cat sitting on the dock's top edge (after Dhruv's pixel mascot). Hover, or a
 * tap on touch screens, makes it blink and flick its tail, with a high note. The frames swap
 * in CSS (.cat in index.css); it never moves on its own.
 */
export function PixelCat() {
  const ref = useRef<SVGSVGElement>(null);
  return (
    <svg
      ref={ref}
      viewBox="0 0 17 14"
      shapeRendering="crispEdges"
      aria-hidden="true"
      onPointerEnter={(e) => e.pointerType === 'mouse' && sound.note(8)}
      onPointerDown={(e) => {
        if (e.pointerType === 'mouse') return;
        sound.note(8);
        const el = ref.current;
        if (!el) return;
        el.dataset.pet = 'true';
        setTimeout(() => delete el.dataset.pet, 700);
      }}
      className="cat absolute -top-[21px] right-3 h-[22px] w-[27px] cursor-pointer"
    >
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
      <g className="fill-card">
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

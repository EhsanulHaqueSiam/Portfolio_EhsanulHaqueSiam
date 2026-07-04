import { useEffect, useRef } from 'react';

interface AsciiFieldProps {
  className?: string;
  /** character grid columns */
  cols?: number;
  /** 'ink' = paper glyphs on an ink spread; 'paper' = ink glyphs on paper */
  surface?: 'ink' | 'paper';
}

/** light → dense glyph ramp for the wave field */
const RAMP = ' .·:~=+*#%@';
const CELL_ASPECT = 0.6;
const RADIUS = 150;
const LERP = 0.15;

/** signal palette the cursor pulls out of the field: violet through cyan,
    magenta and amber, so the wake reads as full-color ASCII */
const PALETTE: Array<[number, number, number]> = [
  [139, 124, 255], // iris violet
  [94, 231, 245], // signal cyan
  [255, 110, 199], // magenta
  [255, 194, 75], // amber
  [169, 157, 255], // violet-400
];

/**
 * Abstract interactive ASCII art: a slowly drifting interference-wave field
 * typeset in mono glyphs. Characters near the cursor flood with signal colors
 * (iris violet/cyan); the field breathes on its own. Pure decoration —
 * client-only, aria-hidden, disabled for reduced motion (static frame).
 */
export function AsciiField({ className = '', cols = 64, surface = 'ink' }: AsciiFieldProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    let disposed = false;
    let raf = 0;
    let rows = 0;
    let cellW = 0;
    let cellH = 0;
    let dpr = 1;
    let t = Math.random() * 100;
    let influence: Float32Array = new Float32Array(0);
    let target: Float32Array = new Float32Array(0);
    let lastFrame = 0;

    // Glyph base color, resolved per-frame from the active theme so the field
    // flips the instant ThemeToggle toggles html.dark. Dark theme: near-white
    // glyphs on the dark plate. Light theme: dark ink on the light plate —
    // otherwise the near-white glyphs vanish on a white page (the reported
    // "ascii is black/blank in white theme" bug). The cursor wake lerps from
    // this base toward the saturated PALETTE in either theme.
    const glyphBase = () => {
      const dark = document.documentElement.classList.contains('dark');
      if (surface === 'ink') {
        return dark
          ? { r: 238, g: 241, b: 248, a: 0.3 }
          : { r: 24, g: 27, b: 38, a: 0.42 };
      }
      return dark
        ? { r: 174, g: 181, b: 200, a: 0.4 }
        : { r: 60, g: 66, b: 88, a: 0.5 };
    };

    const layout = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (!w || !h) return false;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      cellW = canvas.width / cols;
      cellH = cellW / CELL_ASPECT;
      rows = Math.max(1, Math.round(canvas.height / cellH));
      cellH = canvas.height / rows;
      ctx.font = `500 ${Math.ceil(cellH)}px 'Geist Mono Variable', monospace`;
      ctx.textBaseline = 'top';
      influence = new Float32Array(cols * rows);
      target = new Float32Array(cols * rows);
      return true;
    };

    /** interference of three drifting waves, 0..1 */
    const field = (x: number, y: number, time: number) => {
      const u = x / cols;
      const v = y / rows;
      const s =
        Math.sin(u * 6.3 + time * 0.7) +
        Math.sin((u + v) * 4.1 - time * 0.45) +
        Math.sin(Math.hypot(u - 0.6, v - 0.4) * 9 - time * 0.9);
      return (s + 3) / 6;
    };

    const draw = (time: number) => {
      const base = glyphBase();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const v = field(x, y, time);
          const ci = Math.min(RAMP.length - 1, Math.floor(v * RAMP.length));
          const ch = RAMP[ci];
          if (ch === ' ') continue;
          const f = influence[i];
          if (f > 0.02) {
            const p = PALETTE[Math.min(PALETTE.length - 1, Math.floor(v * PALETTE.length))];
            const rr = Math.round(base.r + (p[0] - base.r) * f);
            const gg = Math.round(base.g + (p[1] - base.g) * f);
            const bb = Math.round(base.b + (p[2] - base.b) * f);
            ctx.fillStyle = `rgba(${rr},${gg},${bb},${Math.min(1, base.a + v * 0.3 + f * 0.75)})`;
          } else {
            ctx.fillStyle = `rgba(${base.r},${base.g},${base.b},${base.a * (0.35 + v * 0.65)})`;
          }
          ctx.fillText(ch, x * cellW, y * cellH);
        }
      }
    };

    let hasFrame = false;
    const tick = (now: number) => {
      if (disposed) return;
      // Hold a frozen frame while the page scrolls (canvas raster is pricey)
      // — but always paint the FIRST frame so the cell is never blank.
      if (hasFrame && document.documentElement.classList.contains('is-scrolling')) {
        raf = requestAnimationFrame(tick);
        return;
      }
      // ~30fps is plenty for a drifting field and keeps main thread light
      if (now - lastFrame >= 33) {
        lastFrame = now;
        hasFrame = true;
        if (!reduced) t += 0.016;
        for (let i = 0; i < influence.length; i++) {
          influence[i] += (target[i] - influence[i]) * LERP;
        }
        draw(t);
      }
      raf = requestAnimationFrame(tick);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const px = (e.clientX - rect.left) * (canvas.width / rect.width);
      const py = (e.clientY - rect.top) * (canvas.height / rect.height);
      const rad = RADIUS * dpr;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const d = Math.hypot(x * cellW + cellW / 2 - px, y * cellH + cellH / 2 - py);
          target[y * cols + x] = d < rad ? (1 - d / rad) ** 1.3 : 0;
        }
      }
    };

    const onPointerLeave = () => {
      target.fill(0);
    };

    let resizeT = 0;
    const onResize = () => {
      window.clearTimeout(resizeT);
      resizeT = window.setTimeout(() => {
        if (layout()) draw(t);
      }, 150);
    };

    // The section may mount with zero size (content-visibility: auto);
    // lay out again whenever the box materializes or changes.
    if (layout()) draw(t);
    const ro = new ResizeObserver(() => {
      if (layout()) draw(t);
    });
    ro.observe(wrap);

    let visible = false;
    const io = new IntersectionObserver(
      (entries) => {
        const nowVisible = entries[0]?.isIntersecting ?? false;
        if (nowVisible && !visible && !reduced) {
          visible = true;
          lastFrame = 0;
          raf = requestAnimationFrame(tick);
        } else if (!nowVisible && visible) {
          visible = false;
          cancelAnimationFrame(raf);
        }
      },
      { rootMargin: '80px' }
    );
    io.observe(wrap);

    // Repaint immediately when the theme flips. The field may be paused
    // offscreen or frozen mid-scroll, so the per-frame glyphBase() read alone
    // won't fire — this forces one repaint on the html.dark toggle. Guarded on
    // the actual dark state so the unrelated `is-scrolling` class toggle (also
    // on <html>) doesn't trigger a wasted raster on every scroll gesture.
    let lastDark = document.documentElement.classList.contains('dark');
    const themeObserver = new MutationObserver(() => {
      const nowDark = document.documentElement.classList.contains('dark');
      if (nowDark !== lastDark) {
        lastDark = nowDark;
        draw(t);
      }
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    if (!reduced && finePointer) {
      canvas.addEventListener('pointermove', onPointerMove, { passive: true });
      canvas.addEventListener('pointerleave', onPointerLeave, { passive: true });
    }
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      disposed = true;
      io.disconnect();
      ro.disconnect();
      themeObserver.disconnect();
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeT);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('resize', onResize);
    };
  }, [cols, surface]);

  return (
    <div ref={wrapRef} className={`relative ${className}`} aria-hidden="true" data-cursor="signal">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}

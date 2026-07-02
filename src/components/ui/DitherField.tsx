import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * DitherField — animated 1-bit ordered-dither gradient field.
 *
 * Two soft light-blobs drift across a low-resolution buffer; each cell is
 * thresholded against an 8×8 Bayer matrix so the gradient dissolves into
 * chunky retro dither dots (iris violet, with a cyan shimmer band).
 *
 * The canvas renders at ~1 cell per 4 CSS px and is upscaled with
 * image-rendering: pixelated, so a full-viewport field costs almost nothing.
 * Pauses offscreen; renders a single static frame under reduced motion.
 * Purely decorative — parent must set aria-hidden.
 */

const BAYER_8 = (() => {
  // Recursively build the 8x8 Bayer matrix, normalized to 0..1
  let m: number[][] = [[0]];
  for (let n = 1; n <= 8; n *= 2) {
    const size = n * 2;
    const next: number[][] = Array.from({ length: size }, () => Array(size).fill(0));
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        const v = 4 * m[y][x];
        next[y][x] = v;
        next[y][x + n] = v + 2;
        next[y + n][x] = v + 3;
        next[y + n][x + n] = v + 1;
      }
    }
    m = next;
  }
  return m.map((row) => row.map((v) => v / 64));
})();

const CELL = 4; // CSS px per dither cell

// Palette bands (r, g, b, a) — single violet family, brighter at the crest
const VIOLET_DIM: [number, number, number, number] = [139, 124, 255, 46];
const VIOLET: [number, number, number, number] = [153, 140, 255, 82];
const CREST: [number, number, number, number] = [199, 192, 255, 88];

export function DitherField({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let running = false;
    let w = 0;
    let h = 0;
    let img: ImageData | null = null;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect || rect.width === 0) return;
      w = Math.max(2, Math.ceil(rect.width / CELL));
      h = Math.max(2, Math.ceil(rect.height / CELL));
      canvas.width = w;
      canvas.height = h;
      img = ctx.createImageData(w, h);
      render(performance.now());
    };

    const render = (now: number) => {
      if (!img) return;
      const t = now * 0.00006;
      const data = img.data;
      // Drifting blob centres (normalized coords, lissajous paths)
      const b1x = 0.68 + 0.22 * Math.sin(t * 2.1);
      const b1y = 0.18 + 0.14 * Math.cos(t * 1.7);
      const b2x = 0.22 + 0.2 * Math.cos(t * 1.3 + 2);
      const b2y = 0.62 + 0.2 * Math.sin(t * 1.9 + 1);
      const aspect = w / h;

      let i = 0;
      for (let y = 0; y < h; y++) {
        const ny = y / h;
        const row = BAYER_8[y & 7];
        for (let x = 0; x < w; x++) {
          const nx = x / w;
          const d1x = (nx - b1x) * aspect;
          const d1y = ny - b1y;
          const d2x = (nx - b2x) * aspect;
          const d2y = ny - b2y;
          // Soft inverse-square falloff blobs + gentle top vignette
          let v =
            0.5 / (1 + 34 * (d1x * d1x + d1y * d1y)) +
            0.4 / (1 + 40 * (d2x * d2x + d2y * d2y)) +
            0.1 * (1 - ny);

          const threshold = row[x & 7];
          let c: [number, number, number, number] | null = null;
          if (v > threshold + 0.42) c = CREST; // hot crest, brightest violet
          else if (v > threshold + 0.16) c = VIOLET;
          else if (v > threshold) c = VIOLET_DIM;

          if (c) {
            data[i] = c[0];
            data[i + 1] = c[1];
            data[i + 2] = c[2];
            data[i + 3] = c[3];
          } else {
            data[i + 3] = 0;
          }
          i += 4;
        }
      }
      ctx.putImageData(img, 0, 0);
    };

    let last = 0;
    const loop = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(loop);
      if (now - last < 1000 / 20) return; // ~20fps is plenty for dither drift
      last = now;
      render(now);
    };

    const start = () => {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { rootMargin: '10%' }
    );
    io.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (canvas.isConnected) start();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 h-full w-full ${className}`}
      style={{ imageRendering: 'pixelated' }}
      aria-hidden="true"
    />
  );
}

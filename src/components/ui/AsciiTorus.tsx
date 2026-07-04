import { useEffect, useRef } from 'react';

/** luminance ramp, dim to hot */
const RAMP = '.,:;=!*#$@';
const CELL_ASPECT = 0.55;

/** signal palette the surface cycles through (violet, cyan, magenta, amber) */
const STOPS: Array<[number, number, number]> = [
  [139, 124, 255], // iris violet
  [94, 231, 245], // signal cyan
  [255, 110, 199], // magenta
  [255, 194, 75], // amber
];

/** smooth loop through the palette, t in 0..1 */
function paletteAt(t: number): [number, number, number] {
  const n = STOPS.length;
  const x = ((t % 1) + 1) % 1 * n;
  const i = Math.floor(x) % n;
  const j = (i + 1) % n;
  const f = x - Math.floor(x);
  const a = STOPS[i];
  const b = STOPS[j];
  return [
    a[0] + (b[0] - a[0]) * f,
    a[1] + (b[1] - a[1]) * f,
    a[2] + (b[2] - a[2]) * f,
  ];
}

/**
 * AsciiTorus — a slowly tumbling 3D torus rendered as color ASCII glyphs.
 * The surface hue drifts through the signal palette; moving the cursor over
 * the plate tilts the spin axis toward it, and a click flips the spin.
 * Client-only and purely decorative (parent supplies the accessible caption).
 * Reduced motion: renders a single lit frame, no tumble.
 */
export function AsciiTorus({ className = '' }: { className?: string }) {
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
    let cols = 0;
    let rows = 0;
    let cellW = 0;
    let cellH = 0;
    let lastFrame = 0;

    // rotation state: base tumble + pointer-driven tilt (lerped)
    let angleA = 1.0;
    let angleB = 0.6;
    let spinDir = 1;
    let tiltX = 0;
    let tiltY = 0;
    let targetTiltX = 0;
    let targetTiltY = 0;
    let hueShift = 0;

    // per-cell buffers, sized in layout()
    let zBuf: Float32Array = new Float32Array(0);
    let lumBuf: Float32Array = new Float32Array(0);
    let hueBuf: Float32Array = new Float32Array(0);

    const layout = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (!w || !h) return false;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      cols = Math.max(30, Math.round(w / 7));
      cellW = canvas.width / cols;
      cellH = cellW / CELL_ASPECT;
      rows = Math.max(1, Math.round(canvas.height / cellH));
      cellH = canvas.height / rows;
      ctx.font = `600 ${Math.ceil(cellH * 0.96)}px 'Geist Mono Variable', monospace`;
      ctx.textBaseline = 'top';
      zBuf = new Float32Array(cols * rows);
      lumBuf = new Float32Array(cols * rows);
      hueBuf = new Float32Array(cols * rows);
      return true;
    };

    const R1 = 1; // tube radius
    const R2 = 2; // torus radius
    const K2 = 5; // camera distance

    const draw = () => {
      zBuf.fill(0);
      lumBuf.fill(-1);

      const A = angleA + tiltY;
      const B = angleB + tiltX;
      const cosA = Math.cos(A);
      const sinA = Math.sin(A);
      const cosB = Math.cos(B);
      const sinB = Math.sin(B);
      // screen scale: fit the torus inside the shorter cell axis
      const K1 = (Math.min(cols, rows / CELL_ASPECT) * 0.27 * K2) / (R1 + R2);

      for (let theta = 0; theta < Math.PI * 2; theta += 0.09) {
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta);
        const circleX = R2 + R1 * cosT;
        const circleY = R1 * sinT;

        for (let phi = 0; phi < Math.PI * 2; phi += 0.035) {
          const cosP = Math.cos(phi);
          const sinP = Math.sin(phi);

          const x = circleX * (cosB * cosP + sinA * sinB * sinP) - circleY * cosA * sinB;
          const y = circleX * (sinB * cosP - sinA * cosB * sinP) + circleY * cosA * cosB;
          const z = K2 + cosA * circleX * sinP + circleY * sinA;
          const ooz = 1 / z;

          const xp = Math.floor(cols / 2 + K1 * ooz * x);
          const yp = Math.floor(rows / 2 - K1 * ooz * y * CELL_ASPECT);
          if (xp < 0 || xp >= cols || yp < 0 || yp >= rows) continue;

          const idx = yp * cols + xp;
          if (ooz <= zBuf[idx]) continue;
          zBuf[idx] = ooz;

          // lambert-ish luminance against a fixed light
          const L =
            cosP * cosT * sinB -
            cosA * cosT * sinP -
            sinA * sinT +
            cosB * (cosA * sinT - cosT * sinA * sinP);
          lumBuf[idx] = Math.max(0.02, (L + 1.4) / 2.4);
          hueBuf[idx] = phi / (Math.PI * 2) + hueShift;
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Resolved per-frame so the torus flips with ThemeToggle. Dark theme:
      // the bright STOPS palette on the dark plate. Light theme: darken the
      // palette and lower the glow floor so the colored glyphs keep readable
      // contrast on the near-white plate instead of washing out.
      const dark = document.documentElement.classList.contains('dark');
      for (let yc = 0; yc < rows; yc++) {
        for (let xc = 0; xc < cols; xc++) {
          const idx = yc * cols + xc;
          const lum = lumBuf[idx];
          if (lum < 0) continue;
          const ch = RAMP[Math.min(RAMP.length - 1, Math.floor(lum * RAMP.length))];
          let [r, g, b] = paletteAt(hueBuf[idx]);
          let glow: number;
          let alpha: number;
          if (dark) {
            glow = 0.35 + lum * 0.65;
            alpha = Math.min(1, 0.35 + lum * 0.75);
          } else {
            r *= 0.58;
            g *= 0.58;
            b *= 0.58;
            glow = 0.12 + lum * 0.88;
            alpha = Math.min(1, 0.55 + lum * 0.5);
          }
          ctx.fillStyle = `rgba(${Math.round(r * glow)},${Math.round(g * glow)},${Math.round(b * glow)},${alpha})`;
          ctx.fillText(ch, xc * cellW, yc * cellH);
        }
      }
    };

    let hasFrame = false;
    const tick = (now: number) => {
      if (disposed) return;
      raf = requestAnimationFrame(tick);
      // Hold a frozen frame while the page scrolls (canvas raster is pricey)
      // — but always paint the FIRST frame so the cell is never blank.
      if (hasFrame && document.documentElement.classList.contains('is-scrolling')) return;
      if (now - lastFrame < 33) return; // ~30fps
      lastFrame = now;
      hasFrame = true;
      angleA += 0.028 * spinDir;
      angleB += 0.014 * spinDir;
      hueShift += 0.0016;
      tiltX += (targetTiltX - tiltX) * 0.06;
      tiltY += (targetTiltY - tiltY) * 0.06;
      draw();
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      targetTiltX = nx * 1.5;
      targetTiltY = ny * 1.2;
    };

    const onPointerLeave = () => {
      targetTiltX = 0;
      targetTiltY = 0;
    };

    const onClick = () => {
      spinDir *= -1;
    };

    let resizeT = 0;
    const onResize = () => {
      window.clearTimeout(resizeT);
      resizeT = window.setTimeout(() => {
        if (layout()) draw();
      }, 150);
    };

    // Survive mounting inside a zero-size (content-visibility) box.
    if (layout()) draw();
    const ro = new ResizeObserver(() => {
      if (layout()) draw();
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

    // Repaint on theme toggle even while paused offscreen / frozen mid-scroll.
    // Guarded on the actual dark state so the unrelated `is-scrolling` class
    // toggle (also on <html>) doesn't trigger a wasted raster on every scroll.
    let lastDark = document.documentElement.classList.contains('dark');
    const themeObserver = new MutationObserver(() => {
      const nowDark = document.documentElement.classList.contains('dark');
      if (nowDark !== lastDark) {
        lastDark = nowDark;
        draw();
      }
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    if (finePointer && !reduced) {
      wrap.addEventListener('pointermove', onPointerMove, { passive: true });
      wrap.addEventListener('pointerleave', onPointerLeave, { passive: true });
    }
    if (!reduced) wrap.addEventListener('click', onClick);
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      disposed = true;
      io.disconnect();
      ro.disconnect();
      themeObserver.disconnect();
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeT);
      wrap.removeEventListener('pointermove', onPointerMove);
      wrap.removeEventListener('pointerleave', onPointerLeave);
      wrap.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className={`relative ${className}`}
      aria-hidden="true"
      data-cursor="spin"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}

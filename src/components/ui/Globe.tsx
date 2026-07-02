import { useEffect, useRef } from 'react';

const DHAKA: [number, number] = [23.8103, 90.4125];

/**
 * Drag-to-spin WebGL globe (cobe v2) marked at Dhaka. Auto-rotates slowly,
 * theme-aware, decorative (parent sets aria context). cobe is loaded on
 * demand so its WebGL code stays out of the main bundle.
 */
export function Globe({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    import('cobe').then(({ default: createGlobe }) => {
      if (cancelled || !canvas.isConnected) return;

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      let phi = 3.4; // start facing Bangladesh
      let width = canvas.offsetWidth || 300;
      let pointerDown = false;
      let pointerStartX = 0;
      let phiStart = 0;
      let raf = 0;

      const isDark = () => document.documentElement.classList.contains('dark');

      const themed = () => ({
        dark: isDark() ? 1 : 0,
        mapBrightness: isDark() ? 5 : 8,
        baseColor: (isDark() ? [0.35, 0.35, 0.42] : [0.82, 0.82, 0.88]) as [number, number, number],
        glowColor: (isDark() ? [0.12, 0.12, 0.18] : [0.92, 0.92, 0.96]) as [number, number, number],
      });

      const globe = createGlobe(canvas, {
        devicePixelRatio: 2,
        width: width * 2,
        height: width * 2,
        phi,
        theta: 0.18,
        diffuse: 1.2,
        mapSamples: 12000,
        markerColor: [0.545, 0.486, 1],
        markers: [{ location: DHAKA, size: 0.09 }],
        ...themed(),
      });

      // Track size via ResizeObserver instead of reading offsetWidth per frame
      // (a forced layout every tick while Lenis is scrolling).
      const ro = new ResizeObserver((entries) => {
        const w = entries[0]?.contentRect.width;
        if (w) width = w;
      });
      ro.observe(canvas);

      let lastFrame = 0;
      const tick = (now: number) => {
        raf = requestAnimationFrame(tick);
        // hold a frozen frame while the page scrolls (GL submission is pricey)
        if (document.documentElement.classList.contains('is-scrolling')) return;
        // ~30fps: WebGL submission is the main-thread cost here
        if (now - lastFrame < 33) return;
        lastFrame = now;
        if (!pointerDown && !reduced) phi += 0.006;
        globe.update({ phi, width: width * 2, height: width * 2, ...themed() });
      };

      // Only spin while on screen and the tab is visible.
      let running = false;
      const start = () => {
        if (running) return;
        running = true;
        raf = requestAnimationFrame(tick);
      };
      const stop = () => {
        running = false;
        cancelAnimationFrame(raf);
      };
      // Strict gate: WebGL costs real CPU on software-GL fallbacks, so only
      // render when a meaningful part of the globe is actually on screen.
      const io = new IntersectionObserver(
        ([entry]) => (entry.isIntersecting && !document.hidden ? start() : stop()),
        { threshold: 0.25 }
      );
      io.observe(canvas);
      const onVisibility = () => {
        if (document.hidden) stop();
        else if (canvas.isConnected) start();
      };
      document.addEventListener('visibilitychange', onVisibility);

      const onPointerDown = (e: PointerEvent) => {
        pointerDown = true;
        pointerStartX = e.clientX;
        phiStart = phi;
        canvas.style.cursor = 'grabbing';
      };
      const onPointerMove = (e: PointerEvent) => {
        if (!pointerDown) return;
        phi = phiStart + (e.clientX - pointerStartX) * 0.01;
      };
      const onPointerUp = () => {
        pointerDown = false;
        canvas.style.cursor = 'grab';
      };

      canvas.addEventListener('pointerdown', onPointerDown);
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('pointerup', onPointerUp, { passive: true });

      cleanup = () => {
        stop();
        ro.disconnect();
        io.disconnect();
        document.removeEventListener('visibilitychange', onVisibility);
        globe.destroy();
        canvas.removeEventListener('pointerdown', onPointerDown);
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
      };
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <div className={`relative mx-auto aspect-square w-full max-w-[420px] ${className}`} aria-hidden="true">
      <canvas
        ref={canvasRef}
        className="h-full w-full touch-none [cursor:grab]"
        style={{ contain: 'layout paint size' }}
      />
    </div>
  );
}

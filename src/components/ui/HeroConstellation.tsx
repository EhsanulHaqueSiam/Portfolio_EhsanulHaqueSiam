import { useEffect, useRef } from 'react';

/**
 * Drifting constellation dots behind the hero (port of the reference's
 * hero-constellation). Dots pulse, wrap at the edges, and repel/swirl away
 * from the cursor. Theme-aware: dark ink dots on light, white on dark.
 */
export function HeroConstellation({
  desktopDots = 300,
  mobileDots = 75,
  className = '',
}: {
  desktopDots?: number;
  mobileDots?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animationId = 0;
    let width = 0;
    let height = 0;
    let resizeTimer: ReturnType<typeof setTimeout>;

    let mouseX = -9999;
    let mouseY = -9999;
    const MOUSE_RADIUS = 160;
    const MOUSE_FORCE = 0.35;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
        mouseX = -9999;
        mouseY = -9999;
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    interface Dot {
      x: number;
      y: number;
      baseVx: number;
      baseVy: number;
      pushVx: number;
      pushVy: number;
      radius: number;
      baseOpacity: number;
      phase: number;
      pulseSpeed: number;
    }

    let dots: Dot[] = [];

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 2);
      width = canvas!.offsetWidth;
      height = canvas!.offsetHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function initDots() {
      dots = [];
      const padX = width * 0.04;
      const padY = height * 0.04;
      const areaW = width - padX * 2;
      const areaH = height - padY * 2;
      const dotCount = window.innerWidth < 768 ? mobileDots : desktopDots;

      for (let i = 0; i < dotCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.15 + Math.random() * 0.3;
        dots.push({
          x: padX + Math.random() * areaW,
          y: padY + Math.random() * areaH,
          baseVx: Math.cos(angle) * speed,
          baseVy: Math.sin(angle) * speed,
          pushVx: 0,
          pushVy: 0,
          radius: 0.5 + Math.random() * 0.6,
          baseOpacity: 0.5 + Math.random() * 0.5,
          phase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.0008 + Math.random() * 0.0015,
        });
      }
    }

    let lastTime = 0;
    let lastDraw = 0;

    function animate(time: number) {
      animationId = requestAnimationFrame(animate);
      // Freeze while the page scrolls: canvas raster is the #1 scroll cost,
      // and a static frame is invisible when everything is moving anyway.
      if (document.documentElement.classList.contains('is-scrolling')) return;
      // ~30fps keeps the drift smooth while halving main-thread time
      if (time - lastDraw < 33) return;
      lastDraw = time;
      const dt = lastTime ? Math.min(time - lastTime, 100) : 16;
      lastTime = time;

      ctx!.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const halfW = width / 2;
      const halfH = height / 2;
      const radiusSq = MOUSE_RADIUS * MOUSE_RADIUS;
      const isDark = document.documentElement.classList.contains('dark');
      const rgb = isDark ? '255, 255, 255' : '30, 30, 30';

      for (const dot of dots) {
        const dmx = dot.x - mouseX;
        const dmy = dot.y - mouseY;
        const distSq = dmx * dmx + dmy * dmy;

        if (distSq < radiusSq && distSq > 0) {
          const dist = Math.sqrt(distSq);
          const falloff = 1 - dist / MOUSE_RADIUS;
          const force = MOUSE_FORCE * falloff * falloff;
          const nx = dmx / dist;
          const ny = dmy / dist;
          dot.pushVx += (nx * force + ny * force * 0.3) * (dt / 16);
          dot.pushVy += (ny * force - nx * force * 0.3) * (dt / 16);
        }

        dot.pushVx *= 0.97;
        dot.pushVy *= 0.97;

        if (!reduced) {
          dot.x += (dot.baseVx + dot.pushVx) * (dt / 16);
          dot.y += (dot.baseVy + dot.pushVy) * (dt / 16);
        }

        if (dot.x < -20) dot.x = width + 20;
        if (dot.x > width + 20) dot.x = -20;
        if (dot.y < -20) dot.y = height + 20;
        if (dot.y > height + 20) dot.y = -20;

        dot.phase += dot.pulseSpeed * dt;
        const pulse = (Math.sin(dot.phase) + 1) / 2;
        const opacity = dot.baseOpacity * (0.3 + pulse * 0.7);

        const dx = (dot.x - cx) / halfW;
        const dy = (dot.y - cy) / halfH;
        const vignette = Math.max(0, 1 - (dx * dx + dy * dy) * 0.7);

        ctx!.beginPath();
        ctx!.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${rgb}, ${opacity * vignette * (isDark ? 0.7 : 1)})`;
        ctx!.fill();
      }
    }

    resize();
    initDots();

    // Only animate while on screen and the tab is visible.
    let running = false;
    const start = () => {
      if (running) return;
      running = true;
      lastTime = 0;
      animationId = requestAnimationFrame(animate);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(animationId);
    };

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting && !document.hidden ? start() : stop()),
      { rootMargin: '10%' }
    );
    io.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (canvas.isConnected) start();
    };
    document.addEventListener('visibilitychange', onVisibility);

    let lastWidth = window.innerWidth;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const widthChanged = window.innerWidth !== lastWidth;
        lastWidth = window.innerWidth;
        resize();
        if (widthChanged) initDots();
      }, 200);
    };
    window.addEventListener('resize', onResize);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [desktopDots, mobileDots]);

  return (
    // biome-ignore lint/a11y/noAriaHiddenOnFocusable: canvas has no tabindex and is purely decorative
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
    />
  );
}

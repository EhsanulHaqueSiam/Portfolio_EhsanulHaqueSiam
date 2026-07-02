import { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utils';

interface ScratchToRevealProps {
  children: React.ReactNode;
  className?: string;
  /** Percent of the surface that must be scratched before auto-clearing. */
  minScratchPercentage?: number;
  onComplete?: () => void;
  /** Change to re-cover the surface (e.g. after swapping the prize). */
  resetKey?: string | number;
}

/**
 * Scratch-card canvas (magicui port, dependency-free). Drag to scrape away a
 * soft gradient foil; past the threshold the rest dissolves.
 */
export function ScratchToReveal({
  children,
  className,
  minScratchPercentage = 30,
  onComplete,
  resetKey,
}: ScratchToRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [cleared, setCleared] = useState(false);
  const scratching = useRef(false);
  const doneRef = useRef(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: resetKey intentionally re-runs the effect to repaint the foil
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setCleared(false);
    doneRef.current = false;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const paint = () => {
      canvas.width = wrap.clientWidth * dpr;
      canvas.height = wrap.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const g = ctx.createLinearGradient(0, 0, wrap.clientWidth, wrap.clientHeight);
      g.addColorStop(0, '#A97CF9');
      g.addColorStop(0.5, '#F38CB9');
      g.addColorStop(1, '#FDCC92');
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, wrap.clientWidth, wrap.clientHeight);
      ctx.fillStyle = 'rgba(255,255,255,0.65)';
      ctx.font = '600 12px "Geist Variable", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('scratch me', wrap.clientWidth / 2, wrap.clientHeight / 2 + 4);
    };
    paint();

    const scratch = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 18, 0, Math.PI * 2);
      ctx.fill();
    };

    const checkProgress = () => {
      if (doneRef.current) return;
      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let clearedPx = 0;
      // Sample every 16th pixel for speed
      for (let i = 3; i < data.length; i += 64) {
        if (data[i] === 0) clearedPx++;
      }
      const percent = (clearedPx / (data.length / 64)) * 100;
      if (percent >= minScratchPercentage) {
        doneRef.current = true;
        setCleared(true);
        onComplete?.();
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      scratching.current = true;
      scratch(e.clientX, e.clientY);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!scratching.current) return;
      e.preventDefault();
      scratch(e.clientX, e.clientY);
    };
    const onPointerUp = () => {
      if (scratching.current) checkProgress();
      scratching.current = false;
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp, { passive: true });

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [minScratchPercentage, onComplete, resetKey]);

  return (
    <div ref={wrapRef} className={cn('relative overflow-hidden select-none', className)}>
      {children}
      {/* biome-ignore lint/a11y/noAriaHiddenOnFocusable: canvas has no tabindex and is purely decorative */}
      <canvas
        ref={canvasRef}
        className={cn(
          'absolute inset-0 h-full w-full touch-none transition-opacity duration-500',
          cleared ? 'pointer-events-none opacity-0' : 'opacity-100'
        )}
        style={{ cursor: 'crosshair' }}
        aria-hidden="true"
      />
    </div>
  );
}

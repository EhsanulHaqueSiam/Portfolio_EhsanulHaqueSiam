import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, m } from 'framer-motion';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export interface LightboxImage {
  src: string;
  alt: string;
}

interface LightboxProps {
  images: LightboxImage[];
  startIndex?: number;
  /** Caption shown under the image (e.g. the award/paper title). */
  caption?: string;
  onClose: () => void;
}

/**
 * Fullscreen image viewer: backdrop/ESC to close, ←/→ (keys, buttons, or
 * clicking the image) to move through multi-image sets. Pauses Lenis while
 * open, preloads neighbours, and portals above everything (navbar is z-500).
 */
export function Lightbox({ images, startIndex = 0, caption, onClose }: LightboxProps) {
  const [index, setIndex] = useState(() => Math.min(startIndex, images.length - 1));
  const many = images.length > 1;

  const prev = useCallback(
    () => setIndex((i) => (i - 1 + images.length) % images.length),
    [images.length]
  );
  const next = useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length]);

  // Keyboard + scroll lock for the whole lifetime of the overlay
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft' && many) prev();
      else if (e.key === 'ArrowRight' && many) next();
    };
    window.addEventListener('keydown', onKey);
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    window.dispatchEvent(new Event('lenis:stop'));
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
      window.dispatchEvent(new Event('lenis:start'));
    };
  }, [onClose, prev, next, many]);

  // Preload neighbours so arrowing through a gallery never flashes empty
  useEffect(() => {
    if (!many) return;
    for (const offset of [1, -1]) {
      const img = new Image();
      img.src = images[(index + offset + images.length) % images.length].src;
    }
  }, [index, images, many]);

  const current = images[index];
  if (!current) return null;

  const navBtn =
    'absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/70 text-foreground backdrop-blur-sm transition-all hover:scale-110 hover:bg-background disabled:opacity-40';

  return createPortal(
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: EASE }}
      className="fixed inset-0 z-[700] flex flex-col items-center justify-center bg-background/90 p-4 backdrop-blur-md sm:p-8"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={caption ?? current.alt}
    >
      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close image viewer"
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/70 text-foreground backdrop-blur-sm transition-all hover:rotate-90 hover:bg-background"
      >
        <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      {many && (
        <>
          <button type="button" onClick={prev} aria-label="Previous image" className={`${navBtn} left-3 sm:left-6`}>
            <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" />
            </svg>
          </button>
          <button type="button" onClick={next} aria-label="Next image" className={`${navBtn} right-3 sm:right-6`}>
            <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </>
      )}

      {/* Image (click advances in galleries) */}
      <AnimatePresence mode="wait" initial={false}>
        <m.img
          key={current.src}
          src={current.src}
          alt={current.alt}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.99 }}
          transition={{ duration: 0.22, ease: EASE }}
          onClick={many ? next : undefined}
          className={`max-h-[80vh] max-w-full select-none rounded-lg border border-border object-contain shadow-2xl ${
            many ? 'cursor-pointer' : ''
          }`}
          draggable={false}
        />
      </AnimatePresence>

      {/* Caption + counter */}
      <div className="pointer-events-none mt-4 flex items-center gap-3 text-sm text-muted-foreground">
        {caption && <span className="max-w-[70vw] truncate">{caption}</span>}
        {many && (
          <span className="rounded-full border border-border bg-background/70 px-2.5 py-0.5 text-xs tabular-nums backdrop-blur-sm">
            {index + 1} / {images.length}
          </span>
        )}
      </div>
    </m.div>,
    document.body
  );
}

import { useState, useEffect, useRef, useCallback } from 'react';
import { m } from 'framer-motion';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean; // Load immediately (above-fold images)
  fill?: boolean; // Fill parent container
  aspectRatio?: string; // e.g., "16/9", "4/3", "1/1"
  width?: number; // Explicit width for CLS prevention
  height?: number; // Explicit height for CLS prevention
  sizes?: string; // Responsive sizes attribute
  srcSet?: string; // Responsive srcset
  onLoad?: () => void;
}

// Netlify Image CDN endpoint (platform feature, no adapter needed): resizes
// and re-encodes (AVIF/WebP via Accept negotiation) on the fly at the edge.
const CDN_WIDTHS = [480, 768, 1024, 1600];
const cdnUrl = (src: string, w: number) => `/.netlify/images?url=${encodeURIComponent(src)}&w=${w}`;

export function OptimizedImage({
  src,
  alt,
  className = '',
  priority = false,
  fill = false,
  aspectRatio,
  width,
  height,
  sizes = '100vw',
  srcSet,
  onLoad,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  // Serve responsive variants through the Netlify Image CDN for local images;
  // if the endpoint is unavailable (local preview, other hosts) fall back to
  // the original file on first error.
  const [useCdn, setUseCdn] = useState(() => !srcSet && src.startsWith('/'));
  const imgRef = useRef<HTMLImageElement>(null);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setUseCdn((wasCdn) => {
      if (wasCdn) return false; // retry with the original asset
      setHasError(true);
      setIsLoaded(true);
      return wasCdn;
    });
  }, []);

  const effectiveSrcSet = useCdn
    ? CDN_WIDTHS.map((w) => `${cdnUrl(src, w)} ${w}w`).join(', ')
    : srcSet;

  // If the image was already cached and completed before hydration attached
  // the onLoad handler, reveal it immediately (avoids a stuck-invisible image).
  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) handleLoad();
  }, [handleLoad]);

  const containerStyles = fill ? 'absolute inset-0' : '';
  const fetchPriorityAttr = priority
    ? ({ fetchpriority: 'high' } as Record<string, string>)
    : {};

  return (
    <div
      className={`relative overflow-hidden ${containerStyles} ${className}`}
      style={{
        ...(aspectRatio && !fill ? { aspectRatio } : {}),
        ...(width && height && !fill && !aspectRatio ? { aspectRatio: `${width}/${height}` } : {}),
      }}
    >
      {/* Blur placeholder */}
      <m.div
        className="absolute inset-0 bg-paper-200"
        initial={{ opacity: 1 }}
        animate={{ opacity: isLoaded && !hasError ? 0 : 1 }}
        transition={{ duration: 0.4 }}
      >
        {hasError ? (
          <div className="absolute inset-0 flex items-center justify-center text-ink-400">
            <svg aria-hidden="true" className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        ) : (
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        )}
      </m.div>

      {/* Actual image — always rendered into the static HTML so `alt` is
          crawlable; native loading="lazy" still defers the fetch off-screen. */}
      <m.div
        className="w-full h-full"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 1.05 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          {...fetchPriorityAttr}
          onLoad={handleLoad}
          onError={handleError}
          className="w-full h-full object-cover"
          {...(width && { width })}
          {...(height && { height })}
          sizes={sizes}
          {...(effectiveSrcSet && { srcSet: effectiveSrcSet })}
        />
      </m.div>
    </div>
  );
}

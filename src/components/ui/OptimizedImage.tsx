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
  sizes?: string; // Responsive sizes attribute, e.g., "(max-width: 768px) 100vw, 50vw"
  srcSet?: string; // Responsive srcset, e.g., "image-400.webp 400w, image-800.webp 800w"
  onLoad?: () => void;
}

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
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      // Graceful fallback for older browsers/webviews.
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px', // Start loading 200px before entering viewport
        threshold: 0,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoaded(true);
  }, []);

  const containerStyles = fill
    ? 'absolute inset-0'
    : '';

  const imgProps = {
    loading: priority ? 'eager' as const : 'lazy' as const,
    decoding: priority ? 'sync' as const : 'async' as const,
    onLoad: handleLoad,
    onError: handleError,
    className: `w-full h-full object-cover`,
    ...(width && { width }),
    ...(height && { height }),
    sizes,
    ...(srcSet && { srcSet }),
  };
  const fetchPriorityAttr = priority
    ? ({ fetchpriority: 'high' } as Record<string, string>)
    : {};

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${containerStyles} ${className}`}
      style={{
        ...(aspectRatio && !fill ? { aspectRatio } : {}),
        ...(width && height && !fill && !aspectRatio ? { aspectRatio: `${width}/${height}` } : {}),
      }}
    >
      {/* Blur placeholder */}
      <m.div
        className="absolute inset-0 bg-gradient-to-br from-space-700/50 to-space-800/50"
        initial={{ opacity: 1 }}
        animate={{ opacity: isLoaded && !hasError ? 0 : 1 }}
        transition={{ duration: 0.4 }}
      >
        {hasError ? (
          <div className="absolute inset-0 flex items-center justify-center text-gray-600">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        ) : (
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        )}
      </m.div>

      {/* Actual image */}
      {isInView && (
        <m.div
          className="w-full h-full"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{
            opacity: isLoaded ? 1 : 0,
            scale: isLoaded ? 1 : 1.05,
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            {...imgProps}
            {...fetchPriorityAttr}
            src={src}
            alt={alt}
          />
        </m.div>
      )}
    </div>
  );
}

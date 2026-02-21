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

// Helper to get WebP version of an image path
function getWebPPath(src: string): string | null {
  // Check if there's a webp version available
  const extensions = ['.png', '.jpg', '.jpeg', '.PNG', '.JPG', '.JPEG'];
  for (const ext of extensions) {
    if (src.endsWith(ext)) {
      return src.replace(new RegExp(`${ext}$`), '.webp');
    }
  }
  return null;
}

// Helper to generate srcset for responsive images
// This can be extended when responsive sizes are generated at build time
// function generateSrcSet(src: string): string {
//   return src;
// }

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
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) {
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

  const containerStyles = fill
    ? 'absolute inset-0'
    : aspectRatio
    ? `aspect-[${aspectRatio}]`
    : '';

  // Get WebP path for picture element
  const webpSrc = getWebPPath(src);
  const hasWebP = webpSrc !== null;

  // Determine if source is already WebP
  const isWebP = src.endsWith('.webp');

  // Common image props (alt excluded — passed explicitly for linter visibility)
  const imgProps = {
    loading: priority ? 'eager' as const : 'lazy' as const,
    decoding: priority ? 'sync' as const : 'async' as const,
    onLoad: handleLoad,
    className: `w-full h-full object-cover`,
    ...(width && { width }),
    ...(height && { height }),
    sizes,
    ...(srcSet && { srcSet }),
  };

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
        animate={{ opacity: isLoaded ? 0 : 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </m.div>

      {/* Actual image with picture element for format fallback */}
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
          {hasWebP && !isWebP ? (
            // Use picture element for WebP with JPEG/PNG fallback
            <picture>
              <source srcSet={webpSrc} type="image/webp" sizes={sizes} />
              <img
                {...imgProps}
                src={src}
                alt={alt}
                fetchPriority={priority ? 'high' : 'auto'}
              />
            </picture>
          ) : (
            // Single format image
            <img
              {...imgProps}
              src={src}
              alt={alt}
              fetchPriority={priority ? 'high' : 'auto'}
            />
          )}
        </m.div>
      )}
    </div>
  );
}

// Preload critical images
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

// Preload multiple images with progress callback
export function preloadImages(
  srcs: string[],
  onProgress?: (loaded: number, total: number) => void
): Promise<void[]> {
  let loaded = 0;
  const total = srcs.length;

  return Promise.all(
    srcs.map((src) =>
      preloadImage(src).then(() => {
        loaded++;
        onProgress?.(loaded, total);
      })
    )
  );
}

// Get all critical images for preloading
export function getCriticalImages(): string[] {
  // Return paths to critical above-the-fold images
  return [
    '/images/profile2-hero.webp',
    '/images/profile2.webp',
  ];
}

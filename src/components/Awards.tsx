import { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { awards, getAchievementImage } from '../data/content';
import type { Achievement } from '../data/types';
import { SectionHeading, headingIconClass } from './ui/SectionHeading';
import { BlurFade } from './ui/BlurFade';
import { GlowCard } from './ui/GlowCard';
import { Lightbox } from './ui/Lightbox';
import { OptimizedImage } from './ui/OptimizedImage';
import { TiltCard } from './ui/TiltCard';
import { AwardIcon, ShieldIcon, ExpandIcon } from './ui/Icons';

const categoryLabel: Record<string, string> = {
  award: 'Award',
  certificate: 'Certificate',
};

function AwardCard({ item }: { item: Achievement }) {
  const images = (item.images ?? []).map(getAchievementImage);
  const [frame, setFrame] = useState(0);
  const [viewer, setViewer] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // While hovered, flip through the full photo set (galleries of 8 exist).
  const startCycle = () => {
    if (images.length < 2 || timerRef.current) return;
    timerRef.current = setInterval(() => setFrame((f) => (f + 1) % images.length), 900);
  };
  const stopCycle = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setFrame(0);
  };
  // biome-ignore lint/correctness/useExhaustiveDependencies: unmount-only cleanup; re-running per render would kill the cycle
  useEffect(() => () => stopCycle(), []);

  return (
    <GlowCard
      className="transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-foreground/5"
      cursorEmoji={item.category === 'award' ? '🏆' : '📜'}
      onMouseEnter={startCycle}
      onMouseLeave={stopCycle}
    >
      {images.length > 0 && (
        <button
          type="button"
          onClick={() => {
            stopCycle();
            setViewer(frame);
          }}
          aria-label={`View ${item.name} image${images.length > 1 ? 's' : ''} fullscreen`}
          className="relative block h-36 w-full cursor-zoom-in overflow-hidden bg-muted text-left"
        >
          <OptimizedImage
            src={images[0]}
            alt={item.name}
            aspectRatio="16/9"
            sizes="(max-width: 640px) 100vw, 33vw"
            className={`h-full w-full object-cover object-top transition-transform duration-500 group-hover/glow:scale-[1.04] ${frame > 0 ? 'invisible' : ''}`}
          />
          {frame > 0 && (
            <img
              src={images[frame]}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-top"
              loading="lazy"
              decoding="async"
            />
          )}
          <span className="absolute right-2 top-2 rounded-full bg-black/40 p-1.5 text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover/glow:opacity-100">
            <ExpandIcon className="h-3.5 w-3.5" />
          </span>
          {images.length > 1 && (
            <span className="absolute bottom-2 right-2 rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-semibold tabular-nums text-white backdrop-blur-sm">
              {frame + 1}/{images.length}
            </span>
          )}
        </button>
      )}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-semibold leading-snug tracking-tight text-foreground">
            {item.name}
          </h3>
          <span className="mt-0.5 flex shrink-0 items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {item.category === 'award' ? (
              <AwardIcon className="h-3 w-3" />
            ) : (
              <ShieldIcon className="h-3 w-3" />
            )}
            {categoryLabel[item.category] ?? item.category}
          </span>
        </div>
        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground sm:text-sm">
          {item.desc}
        </p>
      </div>
      <AnimatePresence>
        {viewer !== null && (
          <Lightbox
            images={images.map((src, i) => ({ src, alt: `${item.name} — image ${i + 1}` }))}
            startIndex={viewer}
            caption={item.name}
            onClose={() => setViewer(null)}
          />
        )}
      </AnimatePresence>
    </GlowCard>
  );
}

/** Awards and certifications: card grid. */
export function Awards() {
  return (
    <section id="awards" className="scroll-mt-28">
      <SectionHeading icon={<AwardIcon className={headingIconClass} />}>
        {'Awards & Certifications'}
      </SectionHeading>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {awards.map((item, i) => (
          <BlurFade key={item.name} delay={0.06 + i * 0.04} inView className="h-full">
            <TiltCard>
              <AwardCard item={item} />
            </TiltCard>
          </BlurFade>
        ))}
      </div>
    </section>
  );
}

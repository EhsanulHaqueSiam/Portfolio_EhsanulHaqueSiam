import { useEffect, useRef, useState } from 'react';
import { awards, getAchievementImage } from '../data/content';
import type { Achievement } from '../data/types';
import { SectionHeading, headingIconClass } from './ui/SectionHeading';
import { BlurFade } from './ui/BlurFade';
import { SpotlightGlow } from './ui/SpotlightGlow';
import { OptimizedImage } from './ui/OptimizedImage';
import { TiltCard } from './ui/TiltCard';
import { AwardIcon, ShieldIcon } from './ui/Icons';

const categoryLabel: Record<string, string> = {
  award: 'Award',
  certificate: 'Certificate',
};

function AwardCard({ item }: { item: Achievement }) {
  const images = (item.images ?? []).map(getAchievementImage);
  const [frame, setFrame] = useState(0);
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
  useEffect(() => () => stopCycle(), []);

  return (
    <div
      className="group/glow relative flex h-full flex-col overflow-hidden rounded-xl border bg-card/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-ring/60 hover:shadow-lg hover:shadow-foreground/5"
      onMouseEnter={startCycle}
      onMouseLeave={stopCycle}
    >
      <SpotlightGlow />
      {images.length > 0 && (
        <div className="relative h-36 overflow-hidden bg-muted">
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
          {images.length > 1 && (
            <span className="absolute bottom-2 right-2 rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-semibold tabular-nums text-white backdrop-blur-sm">
              {frame + 1}/{images.length}
            </span>
          )}
        </div>
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
    </div>
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

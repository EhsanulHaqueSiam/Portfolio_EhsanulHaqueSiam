import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { featuredPublications, getPublicationImage } from '../data/content';
import type { Publication } from '../data/types';
import { SectionHeading, headingIconClass } from './ui/SectionHeading';
import { BlurFade } from './ui/BlurFade';
import { GlowCard } from './ui/GlowCard';
import { Lightbox } from './ui/Lightbox';
import { BorderBeam } from './ui/BorderBeam';
import { FlaskIcon, ArrowUpRightIcon, ExpandIcon } from './ui/Icons';

function statusOf(pub: Publication): { label: string; tone: string } {
  const date = pub.date.toLowerCase();
  if (date.includes('accepted')) {
    return { label: 'Accepted', tone: 'bg-signal-pending/15 text-signal-pending' };
  }
  if (date.includes('book chapter') || date.includes('published')) {
    return { label: 'Published', tone: 'bg-signal-success/15 text-signal-success' };
  }
  return { label: 'Presented', tone: 'bg-secondary text-muted-foreground' };
}

function PublicationCard({ pub, highlight }: { pub: Publication; highlight: boolean }) {
  const status = statusOf(pub);
  const [viewer, setViewer] = useState(false);
  const images = (pub.images ?? []).map(getPublicationImage);
  const inner = (
    <GlowCard contentClassName="p-5" cursorEmoji="📄">
      {highlight && <BorderBeam size={90} duration={8} colorFrom="#7ddfff" colorTo="rgba(125,223,255,0)" />}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold leading-snug tracking-tight text-foreground sm:text-base">
          {pub.title}
          {pub.paperLink && (
            <ArrowUpRightIcon className="ml-1 inline-block h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 group-hover/glow:-translate-y-0.5 group-hover/glow:translate-x-0.5" />
          )}
        </h3>
        <span
          className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${status.tone}`}
        >
          {status.label}
        </span>
      </div>
      <p className="mt-1.5 text-xs font-medium text-muted-foreground sm:text-sm">
        {pub.conference}
        <span className="mx-1" aria-hidden="true">
          •
        </span>
        {pub.date}
      </p>
      <div className="mt-3 flex items-start gap-4">
        <p className="min-w-0 flex-1 text-sm leading-relaxed text-muted-foreground">{pub.desc}</p>
        {images[0] && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setViewer(true);
            }}
            aria-label={`View ${pub.title} document fullscreen`}
            className="group/thumb relative hidden shrink-0 cursor-zoom-in sm:block"
          >
            <img
              src={images[0]}
              alt={`${pub.title} document`}
              width={112}
              height={80}
              loading="lazy"
              decoding="async"
              className="h-20 w-28 rounded-md border border-border object-cover object-top transition-transform duration-300 group-hover/glow:scale-105"
            />
            <span className="absolute inset-0 flex items-center justify-center rounded-md bg-black/35 opacity-0 transition-opacity duration-200 group-hover/thumb:opacity-100">
              <ExpandIcon className="h-4 w-4 text-white" />
            </span>
          </button>
        )}
      </div>
      <AnimatePresence>
        {viewer && (
          <Lightbox
            images={images.map((src, i) => ({ src, alt: `${pub.title} — document ${i + 1}` }))}
            caption={pub.title}
            onClose={() => setViewer(false)}
          />
        )}
      </AnimatePresence>
    </GlowCard>
  );

  if (pub.paperLink) {
    return (
      <a href={pub.paperLink} target="_blank" rel="noopener noreferrer" className="block h-full">
        {inner}
      </a>
    );
  }
  return inner;
}

/** Research: publication cards, flagship ringed with a border beam. */
export function Publications() {
  return (
    <section id="publications" className="scroll-mt-28">
      <SectionHeading icon={<FlaskIcon className={headingIconClass} />}>Research</SectionHeading>
      <div className="space-y-4">
        {featuredPublications.map((pub, i) => (
          <BlurFade key={pub.title} delay={0.08 + i * 0.05} direction="right" inView>
            <PublicationCard pub={pub} highlight={i === 0} />
          </BlurFade>
        ))}
      </div>
    </section>
  );
}

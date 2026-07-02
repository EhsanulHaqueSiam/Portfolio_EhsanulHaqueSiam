import { featuredPublications, getPublicationImage } from '../data/content';
import type { Publication } from '../data/types';
import { SectionHeading, headingIconClass } from './ui/SectionHeading';
import { BlurFade } from './ui/BlurFade';
import { SpotlightGlow } from './ui/SpotlightGlow';
import { BorderBeam } from './ui/BorderBeam';
import { FlaskIcon, ArrowUpRightIcon } from './ui/Icons';

function statusOf(pub: Publication): { label: string; tone: string } {
  const date = pub.date.toLowerCase();
  if (date.includes('accepted')) {
    return { label: 'Accepted', tone: 'bg-amber-500/15 text-amber-600 dark:text-amber-400' };
  }
  if (date.includes('book chapter') || date.includes('published')) {
    return { label: 'Published', tone: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' };
  }
  return { label: 'Presented', tone: 'bg-secondary text-muted-foreground' };
}

function PublicationCard({ pub, highlight }: { pub: Publication; highlight: boolean }) {
  const status = statusOf(pub);
  const inner = (
    <div className="group/glow relative h-full overflow-hidden rounded-xl border bg-card/60 p-5 backdrop-blur-sm transition-colors duration-300 hover:border-ring/60">
      <SpotlightGlow />
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
        {pub.images?.[0] && (
          <img
            src={getPublicationImage(pub.images[0])}
            alt={`${pub.title} document`}
            width={112}
            height={80}
            loading="lazy"
            decoding="async"
            className="hidden h-20 w-28 shrink-0 rounded-md border border-border object-cover object-top transition-transform duration-300 group-hover/glow:scale-105 sm:block"
          />
        )}
      </div>
    </div>
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

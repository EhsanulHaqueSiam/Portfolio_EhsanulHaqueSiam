import { testimonials } from '../data/content';
import type { Testimonial } from '../data/types';
import { SectionHeading, headingIconClass } from './ui/SectionHeading';
import { Marquee } from './ui/Marquee';
import { SpotlightGlow } from './ui/SpotlightGlow';
import { QuoteIcon } from './ui/Icons';

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <figure className="group/glow relative w-[300px] shrink-0 overflow-hidden rounded-xl border bg-card/60 p-5 transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-ring/60 sm:w-[360px]">
      <SpotlightGlow />
      <QuoteIcon className="h-4 w-4 text-muted-foreground/70 transition-transform duration-300 group-hover/glow:-rotate-12 group-hover/glow:scale-125" />
      <blockquote className="mt-3 whitespace-normal text-sm leading-relaxed text-foreground/90">
        {item.quote}
      </blockquote>
      <figcaption className="mt-4 flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground"
        >
          {item.name
            .split(/\s+/)
            .map((w) => w[0])
            .join('')
            .slice(0, 2)}
        </span>
        <span className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">{item.name}</span>
          <span className="text-xs text-muted-foreground">
            {item.role}, {item.company}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

/** Testimonials: paused-on-hover marquee of quote cards. */
export function Testimonials() {
  const half = Math.ceil(testimonials.length / 2);
  const rowA = testimonials.slice(0, half);
  const rowB = testimonials.slice(half);

  return (
    <section id="testimonials" className="scroll-mt-28">
      <SectionHeading icon={<QuoteIcon className={headingIconClass} />}>Testimonials</SectionHeading>
      <div className="relative overflow-hidden" data-cursor-emoji="💬">
        <div className="fade-mask-left" />
        <div className="fade-mask-right" />
        <Marquee pauseOnHover className="[--duration:38s] [--gap:1rem]">
          {rowA.map((t) => (
            <TestimonialCard key={t.name} item={t} />
          ))}
        </Marquee>
        {rowB.length > 0 && (
          <Marquee pauseOnHover reverse className="[--duration:42s] [--gap:1rem]">
            {rowB.map((t) => (
              <TestimonialCard key={t.name} item={t} />
            ))}
          </Marquee>
        )}
      </div>
    </section>
  );
}

import { paperSlug, profile, publications, slugify } from '../../data/content';
import { GlideList } from '../../lib/useGlide';
import { haptic } from '../../lib/haptics';
import type { Publication } from '../../data/types';
import { sound } from '../../lib/sound';
import { ArrowUpRightIcon } from '../ui/Icons';
import { ext } from './chrome';
import { ChevronIcon } from './icons';
import { Crumbs, SayHi } from './Detail';
import { pubMeta } from './Rows';

/** Groups by what the work is, read from its status line in publications.json. */
function kind(p: Publication) {
  const s = pubMeta(p).status;
  if (/book chapter/i.test(s)) return 'Book chapters';
  if (/presentation|talk/i.test(s)) return 'Talks';
  return 'Conference papers';
}
const ORDER = ['Conference papers', 'Book chapters', 'Talks'];

const groups = ORDER.map((k) => ({ k, items: publications.filter((p) => kind(p) === k) })).filter((g) => g.items.length);
const published = publications.filter((p) => /published|chapter/i.test(pubMeta(p).status)).length;

const Pill = ({ href, children }: { href: string; children: string }) => (
  <a
    href={href}
    {...ext(href)}
    onMouseEnter={sound.tick}
    className="press group inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-[12px] transition-colors hover:border-foreground/30"
  >
    {children}
    <ArrowUpRightIcon className="icon-arrow h-3 w-3" />
  </a>
);

export function PublicationsList() {
  return (
    <div className="px-4 pb-6 pt-6">
      <Crumbs trail={[['Siam', '/'], ['Publications']]} />
      <h1 className="mt-4 font-serif text-[40px] leading-none tracking-[-0.01em]">Publications</h1>
      <p className="mt-3 max-w-[60ch] text-[15px] leading-relaxed text-muted-foreground">
        NLP and applied machine learning: medical language models, topic modeling of research trends, and statistics on climate losses in Bangladesh.
      </p>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <dl className="flex gap-7">
          {[
            [publications.length, 'works'],
            [published, 'published'],
          ].map(([n, label]) => (
            <div key={label} className="flex flex-col-reverse">
              <dt className="mt-1 text-[12px] text-muted-foreground">{label}</dt>
              <dd className="font-serif text-[34px] leading-none tabular-nums">
                {n}
              </dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-wrap gap-2">
          <Pill href={profile.scholar}>Google Scholar</Pill>
          <Pill href={profile.orcid}>ORCID</Pill>
          <Pill href={profile.ieeeXplore}>IEEE Xplore</Pill>
        </div>
      </div>

      {groups.map((g) => (
        <section key={g.k} aria-labelledby={`g-${slugify(g.k)}`} className="mt-10">
          <div className="mb-2 flex items-baseline justify-between border-b border-border pb-2 text-[13px]">
            <h2 id={`g-${slugify(g.k)}`} className="font-medium text-muted-foreground">
              {g.k}
            </h2>
            <span className="font-mono text-muted-foreground">{g.items.length}</span>
          </div>
          <GlideList className="divide-y divide-border">
            {g.items.map((p) => {
              const { when, status } = pubMeta(p);
              return (
                <li key={p.title}>
                  <a
                    href={`/publications/${paperSlug(p)}/`}
                    onMouseEnter={sound.tick}
                    onClick={haptic}
                    aria-labelledby={`t-${paperSlug(p)}`}
                    className="group -mx-2 block rounded-lg px-2 py-4"
                  >
                    <span id={`t-${paperSlug(p)}`} className="text-[15px] font-medium leading-snug">
                      {p.title}
                      <ChevronIcon className="icon-nudge ml-1 inline h-3.5 w-3.5 -rotate-90 align-[-2px] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </span>
                    <span className="mt-1 block text-[12.5px] text-muted-foreground">{[p.conference, when, status].filter(Boolean).join(' · ')}</span>
                    <span className="mt-2 block text-[13.5px] leading-relaxed text-foreground/75">{p.desc}</span>
                  </a>
                </li>
              );
            })}
          </GlideList>
        </section>
      ))}

      <SayHi title="Working on something similar?" line="Happy to talk research and collaborations." />
    </div>
  );
}

import { profile, publications } from '../../data/content';
import type { Publication } from '../../data/types';
import { sound } from '../../lib/sound';
import { ArrowUpRightIcon } from '../ui/Icons';
import { ext } from './chrome';
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
    <ArrowUpRightIcon className="icon-nudge h-3 w-3" />
  </a>
);

export function PublicationsList() {
  return (
    <div className="px-4 pb-6 pt-6">
      <p className="text-[13px] text-muted-foreground">
        <a href="/" className="transition-colors hover:text-foreground">
          Siam
        </a>{' '}
        / <span className="text-foreground">Publications</span>
      </p>
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
              <dd className="font-serif text-[34px] leading-none tabular-nums">{n}</dd>
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
        <section key={g.k} aria-labelledby={`g-${g.k}`} className="mt-10">
          <div className="mb-2 flex items-baseline justify-between border-b border-border pb-2 text-[13px]">
            <h2 id={`g-${g.k}`} className="font-medium text-muted-foreground">
              {g.k}
            </h2>
            <span className="font-mono text-muted-foreground">{g.items.length}</span>
          </div>
          <ul className="divide-y divide-border">
            {g.items.map((p) => {
              const { when, status } = pubMeta(p);
              const Title = p.paperLink ? 'a' : 'span';
              return (
                <li key={p.title} className="py-4">
                  <Title
                    {...(p.paperLink ? { href: p.paperLink, target: '_blank', rel: 'noopener noreferrer', onMouseEnter: sound.tick } : {})}
                    className={`group text-[15px] font-medium leading-snug ${p.paperLink ? 'transition-colors hover:text-foreground/80' : ''}`}
                  >
                    {p.title}
                    {p.paperLink && <ArrowUpRightIcon className="icon-nudge ml-1 inline h-3 w-3 align-baseline text-muted-foreground" />}
                  </Title>
                  <p className="mt-1 text-[12.5px] text-muted-foreground">{[p.conference, when, status].filter(Boolean).join(' · ')}</p>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-foreground/75">{p.desc}</p>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <div className="mt-12 flex items-center justify-between gap-4 border-t border-border pt-5">
        <div>
          <p className="text-[15px] font-medium">Working on something similar?</p>
          <p className="text-[13px] text-muted-foreground">Happy to talk research and collaborations.</p>
        </div>
        <a href={`mailto:${profile.email}`} className="press shrink-0 rounded-full bg-foreground px-4 py-2 text-[13px] font-medium text-background">
          Say hi
        </a>
      </div>
    </div>
  );
}

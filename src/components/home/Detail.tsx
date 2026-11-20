import { type ReactNode, useState } from 'react';
import { companyLink, experience, getPublicationImage, paperSlug, profile, publications, workSlug } from '../../data/content';
import type { PaperDetail } from '../../data/papers';
import type { Experience } from '../../data/types';
import { haptic } from '../../lib/haptics';
import { sound } from '../../lib/sound';
import { ArrowUpRightIcon, CheckIcon, CopyIcon } from '../ui/Icons';
import { ext } from './chrome';
import { CompanyMark, LinkRow, PaperMark, pubMeta, shortRange, shortRole } from './Rows';

function Crumbs({ trail }: { trail: Array<[string, string?]> }) {
  return (
    <nav aria-label="Breadcrumb" className="enter text-[13px] text-muted-foreground">
      {trail.map(([label, href], i) => (
        <span key={label}>
          {i > 0 && <span className="mx-1.5">/</span>}
          {href ? (
            <a href={href} onMouseEnter={sound.tick} className="transition-colors hover:text-foreground">
              {label}
            </a>
          ) : (
            <span aria-current="page" className="text-foreground">
              {label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

const Block = ({ title, n, children }: { title: string; n: number; children: ReactNode }) => (
  <section className="enter mt-9" style={{ '--n': n } as React.CSSProperties}>
    <h2 className="mb-3 border-b border-border pb-2 text-[13px] font-medium text-muted-foreground">{title}</h2>
    {children}
  </section>
);

const Fact = ({ k, children }: { k: string; children: ReactNode }) => (
  <div className="grid grid-cols-[120px_1fr] gap-3 py-2 text-[14px] sm:grid-cols-[160px_1fr]">
    <dt className="text-muted-foreground">{k}</dt>
    <dd className="min-w-0 break-words">{children}</dd>
  </div>
);

const Out = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} {...ext(href)} onMouseEnter={sound.tick} className="group inline-flex items-center gap-1 underline decoration-foreground/30 underline-offset-[3px] hover:decoration-foreground">
    {children}
    <ArrowUpRightIcon className="icon-nudge h-3 w-3 text-muted-foreground" />
  </a>
);

function SayHi() {
  return (
    <div className="mt-12 flex items-center justify-between gap-4 border-t border-border pt-5">
      <div>
        <p className="text-[15px] font-medium">Have something in mind?</p>
        <p className="text-[13px] text-muted-foreground">My inbox is open.</p>
      </div>
      <a href={`mailto:${profile.email}`} onClick={haptic} onMouseEnter={sound.tick} className="press shrink-0 rounded-full bg-foreground px-4 py-2 text-[13px] font-medium text-background">
        Say hi
      </a>
    </div>
  );
}

/** /work/[slug]: one role, its summary and highlights, then the other roles. */
export function WorkPage({ e }: { e: Experience }) {
  const site = companyLink(e);
  return (
    <div className="px-4 pb-6 pt-6">
      <Crumbs trail={[['Siam', '/'], ['Work', '/#experience'], [e.company]]} />
      <header className="enter mt-5 flex items-center gap-4" style={{ '--n': 1 } as React.CSSProperties}>
        <CompanyMark e={e} size={52} />
        <div className="min-w-0">
          <h1 className="text-balance font-serif text-[36px] leading-none tracking-[-0.01em]">{e.company}</h1>
          <p className="mt-1.5 text-[14px] text-muted-foreground">
            {e.role} · <span className="font-mono text-[12.5px]">{shortRange(e.date)}</span>
            {e.location && ` · ${e.location}`}
          </p>
        </div>
      </header>
      <p className="enter mt-6 text-[15px] leading-relaxed text-foreground/85" style={{ '--n': 2 } as React.CSSProperties}>
        {e.desc}
      </p>
      {e.highlights && e.highlights.length > 0 && (
        <Block title="Highlights" n={3}>
          <ul className="grid gap-2.5 text-[14.5px] leading-relaxed text-foreground/85">
            {e.highlights.map((h) => (
              <li key={h} className="relative pl-4 before:absolute before:left-0 before:top-[0.7em] before:h-1 before:w-1 before:rounded-full before:bg-muted-foreground">
                {h}
              </li>
            ))}
          </ul>
        </Block>
      )}
      {site && (
        <Block title="Elsewhere" n={4}>
          <Out href={site.href}>{site.label}</Out>
        </Block>
      )}
      <Block title="More work" n={5}>
        <ul className="divide-y divide-border">
          {experience
            .filter((x) => x.showInHome && x.company !== e.company)
            .map((x) => (
              <li key={x.company}>
                <LinkRow href={`/work/${workSlug(x)}/`} mark={<CompanyMark e={x} />} title={x.company} sub={shortRole(x)} right={shortRange(x.date)} />
              </li>
            ))}
        </ul>
      </Block>
      <SayHi />
    </div>
  );
}

function CopyBib({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(text).then(() => {
          setDone(true);
          sound.click();
          haptic();
          setTimeout(() => setDone(false), 1600);
        });
      }}
      className="press group inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
    >
      {done ? <CheckIcon className="h-3.5 w-3.5 text-signal-success" /> : <CopyIcon className="icon-pop h-3.5 w-3.5" />}
      <span aria-live="polite">{done ? 'Copied' : 'Copy BibTeX'}</span>
    </button>
  );
}

/** Names Siam in an author list (Crossref spells him "Md Ehsanul Haque"). */
const isSiam = (name: string) => /ehsanul/i.test(name) && /haque/i.test(name);

/** /publications/[slug]: summary, facts, how to read and cite it, then more research. */
export function PaperPage({ paper }: { paper: PaperDetail }) {
  const { pub, doi, authors, venue, publisher, pages, bibtex } = paper;
  const { when, year, status } = pubMeta(pub);
  const short = pub.title.split(':')[0];
  return (
    <div className="px-4 pb-6 pt-6">
      <Crumbs trail={[['Siam', '/'], ['Publications', '/publications/'], [short]]} />
      <p className="enter mt-5 font-mono text-[12px] text-muted-foreground" style={{ '--n': 1 } as React.CSSProperties}>
        {status || 'paper'} · {year}
      </p>
      <h1 className="enter mt-2 text-balance font-serif text-[32px] leading-[1.1] tracking-[-0.01em]" style={{ '--n': 1 } as React.CSSProperties}>
        {pub.title}
      </h1>

      {pub.images[0] && (
        <figure className="enter mt-7 overflow-hidden rounded-lg border border-border" style={{ '--n': 2 } as React.CSSProperties}>
          <img src={getPublicationImage(pub.images[0])} alt={`Certificate for ${short} from ${pub.conference}`} width={1200} height={848} loading="lazy" className="block h-auto w-full" />
        </figure>
      )}

      <Block title="Summary" n={2}>
        <p className="text-[15px] leading-relaxed text-foreground/85">{pub.desc}</p>
      </Block>

      <Block title="Publication facts" n={3}>
        <dl className="divide-y divide-border">
          <Fact k="Published in">{venue ?? pub.conference}</Fact>
          {publisher && <Fact k="Publisher">{publisher}</Fact>}
          <Fact k="Date">{when}</Fact>
          {pages && <Fact k="Pages">{pages}</Fact>}
          {authors.length > 0 && (
            <Fact k="Authors">
              {authors.map((a, i) => (
                <span key={a}>
                  {i > 0 && ', '}
                  {isSiam(a) ? <strong className="font-medium text-foreground">{a}</strong> : <span className="text-foreground/80">{a}</span>}
                </span>
              ))}
            </Fact>
          )}
          {doi && (
            <Fact k="DOI">
              <Out href={`https://doi.org/${doi}`}>{doi}</Out>
            </Fact>
          )}
        </dl>
      </Block>

      {pub.paperLink && (
        <Block title="Read it" n={4}>
          <Out href={pub.paperLink}>{new URL(pub.paperLink).hostname.replace(/^www\./, '')}</Out>
        </Block>
      )}

      {bibtex && (
        <Block title="Cite it" n={5}>
          <div className="mb-2 flex justify-end">
            <CopyBib text={bibtex} />
          </div>
          <pre className="overflow-x-auto rounded-lg border border-border bg-card p-3 font-mono text-[12px] leading-relaxed text-foreground/85">{bibtex}</pre>
        </Block>
      )}

      <Block title="More research" n={6}>
        <ul className="divide-y divide-border">
          {publications
            .filter((p) => p.title !== pub.title)
            .map((p) => (
              <li key={p.title}>
                <LinkRow href={`/publications/${paperSlug(p)}/`} mark={<PaperMark />} title={p.title} sub={p.conference} right={pubMeta(p).year} />
              </li>
            ))}
        </ul>
      </Block>
      <SayHi />
    </div>
  );
}

import { type ReactNode, useState } from 'react';
import { companyLink, experience, paperSlug, profile, publications, workSlug } from '../../data/content';
import type { PaperDetail } from '../../data/papers';
import type { Experience } from '../../data/types';
import { haptic } from '../../lib/haptics';
import { sound } from '../../lib/sound';
import { GlideList } from '../../lib/useGlide';
import { ArrowUpRightIcon, CheckIcon, CopyIcon } from '../ui/Icons';
import { ext } from './chrome';
import { CompanyMark, LinkRow, PaperMark, pubMeta, shortRange, shortRole } from './Rows';

export function Crumbs({ trail }: { trail: Array<[string, string?]> }) {
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
    <ArrowUpRightIcon className="icon-arrow h-3 w-3 text-muted-foreground" />
  </a>
);

export function SayHi({ title = 'Have something in mind?', line = 'My inbox is open.' }: { title?: string; line?: string }) {
  return (
    <div className="mt-12 flex items-center justify-between gap-4 border-t border-border pt-5">
      <div>
        <p className="text-[15px] font-medium">{title}</p>
        <p className="text-[13px] text-muted-foreground">{line}</p>
      </div>
      <a href={`mailto:${profile.email}`} onClick={() => haptic()} onMouseEnter={sound.tick} className="press shrink-0 rounded-full bg-foreground px-4 py-2 text-[13px] font-medium text-background">
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
        <GlideList className="divide-y divide-border">
          {experience
            .filter((x) => x.showInHome && x.company !== e.company)
            .map((x) => (
              <li key={x.company}>
                <LinkRow href={`/work/${workSlug(x)}/`} mark={<CompanyMark e={x} />} title={x.company} sub={shortRole(x)} right={shortRange(x.date)} />
              </li>
            ))}
        </GlideList>
      </Block>
      <SayHi />
    </div>
  );
}

function CopyBib({ text }: { text: string }) {
  const [done, setDone] = useState<'idle' | 'ok' | 'failed'>('idle');
  return (
    <button
      type="button"
      onClick={() => {
        const reset = () => setTimeout(() => setDone('idle'), 1600);
        Promise.resolve(navigator.clipboard?.writeText(text) ?? Promise.reject(new Error('no clipboard')))
          .then(() => {
            setDone('ok');
            sound.click();
            haptic('success');
          })
          .catch(() => setDone('failed'))
          .finally(reset);
      }}
      className="press group inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
    >
      {done === 'ok' ? <CheckIcon className="h-3.5 w-3.5 text-signal-success" /> : <CopyIcon className="icon-pop h-3.5 w-3.5" />}
      <span aria-live="polite">{done === 'ok' ? 'Copied' : done === 'failed' ? 'Copy failed' : 'Copy BibTeX'}</span>
    </button>
  );
}

/** Names Siam in an author list (Crossref spells him "Md Ehsanul Haque"). */
const isSiam = (name: string) => /ehsanul/i.test(name) && /haque/i.test(name);

/** /publications/[slug]: summary, facts, how to read and cite it, then more research. */
export function PaperPage({ paper }: { paper: PaperDetail }) {
  const { pub, doi, authors, venue, publisher, pages, bibtex } = paper;
  const { when, year, status } = pubMeta(pub);
  const kind = /presentation|talk/i.test(status) ? 'Talk' : /chapter/i.test(status) ? 'Book chapter' : 'Conference paper';
  const short = pub.title.split(':')[0];
  return (
    <div className="px-4 pb-6 pt-6">
      <Crumbs trail={[['Siam', '/'], ['Publications', '/publications/'], [short]]} />
      <article
        className="enter mt-6 rounded-xl border border-border bg-card px-6 py-7 sm:px-9 sm:py-9"
        style={{ '--n': 1 } as React.CSSProperties}
        aria-labelledby="paper-title"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          {kind} · {pub.conference.includes(year) ? pub.conference : `${pub.conference} · ${year}`}
        </p>
        <h1 id="paper-title" className="mt-4 text-balance font-serif text-[30px] leading-[1.12] tracking-[-0.01em] sm:text-[34px]">
          {pub.title}
        </h1>
        {authors.length > 0 && (
          <p className="mt-4 text-[14px] text-foreground/80">
            {authors.map((a, i) => (
              <span key={a}>
                {i > 0 && ', '}
                {isSiam(a) ? <strong className="font-medium text-foreground">{a}</strong> : a}
              </span>
            ))}
          </p>
        )}
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-4 text-[13px]">
          <span className="text-muted-foreground">{status || kind}</span>
          {doi && <Out href={`https://doi.org/${doi}`}>DOI {doi}</Out>}
        </div>
      </article>

      <Block title={kind === 'Talk' ? 'What the talk covered' : 'What it does and finds'} n={2}>
        <p className="text-[15px] leading-relaxed text-foreground/85">{pub.desc}</p>
      </Block>

      <Block title={kind === 'Talk' ? 'Talk facts' : 'Publication facts'} n={3}>
        <dl className="divide-y divide-border">
          <Fact k={kind === 'Talk' ? 'Presented at' : 'Published in'}>{venue ?? pub.conference}</Fact>
          {publisher && <Fact k="Publisher">{publisher}</Fact>}
          <Fact k="Date">{when}</Fact>
          {pages && <Fact k="Pages">{pages}</Fact>}
        </dl>
      </Block>

      {pub.paperLink && !(doi && pub.paperLink.includes(doi)) && (
        <Block title="Read it" n={4}>
          <Out href={pub.paperLink}>{new URL(pub.paperLink).hostname.replace(/^www\./, '')}</Out>
        </Block>
      )}

      {!bibtex && kind !== 'Talk' && (
        <Block title="Cite it" n={5}>
          <p className="text-[14px] text-muted-foreground">A citation will appear here once the {kind.toLowerCase()} is indexed with a DOI.</p>
        </Block>
      )}
      {bibtex && (
        <Block title="Cite it" n={5}>
          <div className="mb-2 flex justify-end">
            <CopyBib text={bibtex} />
          </div>
          {/* biome-ignore lint/a11y/noNoninteractiveTabindex: scrollable code must take focus so keyboards can scroll it (WCAG 2.1.1) */}
          {/* biome-ignore lint/a11y/useSemanticElements: the focusable scroller itself needs a name, so the region role sits on the pre, not a wrapping section */}
          <pre tabIndex={0} role="region" aria-label="BibTeX" className="overflow-x-auto rounded-lg border border-border bg-card p-3 font-mono text-[12px] leading-relaxed text-foreground/85">{bibtex}</pre>
        </Block>
      )}

      <Block title="More research" n={6}>
        <GlideList className="divide-y divide-border">
          {publications
            .filter((p) => p.title !== pub.title)
            .map((p) => (
              <li key={p.title}>
                <LinkRow href={`/publications/${paperSlug(p)}/`} mark={<PaperMark />} title={p.title} sub={p.conference} right={pubMeta(p).year} />
              </li>
            ))}
        </GlideList>
      </Block>
      <SayHi />
    </div>
  );
}

/** The 404, inside the site's own shell so the nav and dock still work. */
export function NotFound() {
  return (
    <div className="px-4 pb-6 pt-16">
      <p className="enter font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Error 404</p>
      <h1 className="enter mt-3 font-serif text-[44px] leading-none tracking-[-0.01em]" style={{ '--n': 1 } as React.CSSProperties}>
        Nothing lives here.
      </h1>
      <p className="enter mt-4 text-[15px] text-foreground/85" style={{ '--n': 2 } as React.CSSProperties}>
        The link may be old, or the page moved.
      </p>
      <div className="enter mt-8 flex items-center gap-4" style={{ '--n': 3 } as React.CSSProperties}>
        <a href="/" onClick={() => haptic()} onMouseEnter={sound.tick} className="press rounded-full bg-foreground px-4 py-2 text-[13px] font-medium text-background">
          Back home
        </a>
        <a href="/publications/" onMouseEnter={sound.tick} className="text-[13px] text-muted-foreground transition-colors hover:text-foreground">
          Research
        </a>
      </div>
    </div>
  );
}

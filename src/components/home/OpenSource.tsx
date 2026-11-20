import { useState } from 'react';
import type { OpenSourceRepo } from '../../data/opensource';
import { haptic } from '../../lib/haptics';
import { sound } from '../../lib/sound';
import { ArrowUpRightIcon } from '../ui/Icons';
import { Brand, ChevronIcon, MergeIcon, StarOutlineIcon, T3Mark } from './icons';
import { Section } from './chrome';

const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });

function RepoCard({ r, defaultOpen }: { r: OpenSourceRepo; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const merged = r.prs.filter((p) => p.state === 'merged').length;
  const id = `repo-${r.repo.replace(/\W/g, '-')}`;

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => {
          setOpen(!open);
          sound.paper(!open);
          haptic();
        }}
        onMouseEnter={sound.tick}
        className="group -mx-2 flex w-[calc(100%+1rem)] items-center gap-3 rounded-lg px-2 py-3 text-left transition-colors hover:bg-secondary/60"
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-[10px] border border-border bg-card">
          {r.logo === 't3' ? <T3Mark className="h-full w-full text-[14px]" /> : <Brand name="betterAuth" className="icon-pop h-5 w-5" />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-medium">{r.name}</span>
          <span className="block truncate font-mono text-[12px] text-muted-foreground">{r.repo}</span>
        </span>
        <span className="flex items-center gap-1 text-[13px] tabular-nums">
          <StarOutlineIcon className="h-3.5 w-3.5 text-signal-star" />
          {compact.format(r.stars)}
        </span>
        <span className="hidden text-[12px] text-muted-foreground sm:inline">
          {r.prs.length} PR{r.prs.length > 1 ? 's' : ''}, {merged} merged
        </span>
        <ChevronIcon className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* grid-rows 0fr -> 1fr animates height without measuring. */}
      <div id={id} className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          {/* visibility flips after the collapse finishes, so closed PR links leave the tab order. */}
          <ul className={`mb-3 ml-[52px] divide-y divide-border border-t border-border transition-[visibility] duration-300 ${open ? 'visible' : 'invisible'}`}>
            {r.prs.map((p) => (
              <li key={p.number}>
                <a
                  href={`https://github.com/${r.repo}/pull/${p.number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={sound.tick}
                  className="group grid grid-cols-[16px_1fr_auto] items-start gap-3 py-2.5"
                >
                  <MergeIcon className={`mt-0.5 h-4 w-4 ${p.state === 'merged' ? 'text-[#a78bfa]' : 'text-signal-success'}`} />
                  <span className="text-[13.5px] leading-snug transition-colors group-hover:text-foreground">
                    {p.title}
                    {p.note && <span className="ml-1.5 text-[12px] text-muted-foreground">({p.note})</span>}
                  </span>
                  <span className="flex items-center gap-2 whitespace-nowrap text-[12px]">
                    <span className={p.state === 'merged' ? 'text-[#a78bfa]' : 'text-signal-success'}>{p.state === 'merged' ? 'Merged' : 'Open'}</span>
                    <span className="font-mono text-muted-foreground">#{p.number}</span>
                    <ArrowUpRightIcon className="icon-nudge h-3 w-3 text-muted-foreground" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function OpenSource({ repos }: { repos: OpenSourceRepo[] }) {
  return (
    <Section id="open-source" title="Open source" aside="Upstream pull requests">
      {repos.map((r, i) => (
        <RepoCard key={r.repo} r={r} defaultOpen={i === 0} />
      ))}
    </Section>
  );
}

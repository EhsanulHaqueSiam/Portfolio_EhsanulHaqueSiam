import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from '@ui-sdk/react/collapsible';
import type { OpenSourceRepo } from '../../data/opensource';
import { haptic } from '../../lib/haptics';
import { sound } from '../../lib/sound';
import { ArrowUpRightIcon } from '../ui/Icons';
import { Brand, ChevronIcon, MergeIcon, StarOutlineIcon, T3Mark } from './icons';
import { Section } from './chrome';

const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });

function RepoCard({ r, defaultOpen }: { r: OpenSourceRepo; defaultOpen: boolean }) {
  const merged = r.prs.filter((p) => p.state === 'merged').length;

  return (
    <Collapsible
      defaultOpen={defaultOpen}
      onOpenChange={(open) => {
        sound.open(open);
        haptic();
      }}
      className="border-b border-border last:border-b-0"
    >
      <CollapsibleTrigger
        aria-label={`${r.name} pull requests`}
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
          <StarOutlineIcon className="star h-3.5 w-3.5 text-muted-foreground" />
          {compact.format(r.stars)}
        </span>
        <span className="hidden text-[12px] text-muted-foreground sm:inline">
          {r.prs.length} PR{r.prs.length > 1 ? 's' : ''}, {merged} merged
        </span>
        <ChevronIcon className="h-4 w-4 text-muted-foreground transition-transform duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[open]:rotate-180" />
      </CollapsibleTrigger>

      <CollapsiblePanel>
        <ul className="mb-3 ml-[52px] divide-y divide-border border-t border-border">
          {r.prs.map((p) => (
            <li key={p.number}>
              <a
                href={`https://github.com/${r.repo}/pull/${p.number}`}
                aria-label={`${p.title}${p.note ? ` (${p.note})` : ''}, ${p.state} pull request #${p.number}`}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={sound.tick}
                onClick={haptic}
                className="group -mx-2 grid grid-cols-[16px_1fr_auto] items-start gap-3 rounded-md px-2 py-2.5 transition-colors hover:bg-secondary/60"
              >
                <MergeIcon className={`icon-pop mt-0.5 h-4 w-4 ${p.state === 'merged' ? 'text-[#a78bfa]' : 'text-signal-success'}`} />
                <span className="text-[13.5px] leading-snug">
                  {p.title}
                  {p.note && <span className="text-[12px] text-muted-foreground"> ({p.note})</span>}
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
      </CollapsiblePanel>
    </Collapsible>
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

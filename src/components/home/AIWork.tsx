import { aiWork, workSlug } from '../../data/content';
import type { OpenSourceRepo } from '../../data/opensource';
import { haptic } from '../../lib/haptics';
import { sound } from '../../lib/sound';
import { GlideList } from '../../lib/useGlide';
import { Marked } from '../ui/Marked';
import { Section } from './chrome';
import { T3Mark } from './icons';
import { CompanyMark, shortRange } from './Rows';

/**
 * "AI in Production", right after About: the shipped AI systems an AI or forward-deployed
 * engineering reviewer is looking for, in the first scroll (the hiring-bar review). Each row
 * quotes the role's own highlights (picked in site.json `aiWork`) and opens that role's page;
 * the last row is the agent-app PRs, counted live from GitHub at build.
 */
export function AIWork({ repos }: { repos: OpenSourceRepo[] }) {
  const t3 = repos.find((r) => r.logo === 't3');
  const merged = t3?.prs.filter((p) => p.state === 'merged').length ?? 0;
  return (
    <Section id="ai-work" title="AI in Production">
      <GlideList className="divide-y divide-border">
        {aiWork.map(({ title, role, lines }) => (
          <li key={title}>
            <a href={`/work/${workSlug(role)}/`} onMouseEnter={sound.tick} onClick={() => haptic()} className="group -mx-2 grid grid-cols-[28px_1fr_auto] items-start gap-3 rounded-lg px-2 py-3">
              <CompanyMark e={role} />
              <span className="min-w-0">
                <span className="block text-[14.5px] font-medium leading-snug">
                  {title} <span className="font-normal text-muted-foreground">· {role.company}</span>
                </span>
                {lines.map((l) => (
                  <span key={l} className="mt-1 block text-[13.5px] leading-relaxed text-muted-foreground">
                    <Marked text={l} />
                  </span>
                ))}
              </span>
              <span className="pt-0.5 font-mono text-[12px] text-muted-foreground">{shortRange(role.date)}</span>
            </a>
          </li>
        ))}
        {t3 && merged > 0 && (
          <li>
            <a href="/#open-source" onMouseEnter={sound.tick} className="group -mx-2 grid grid-cols-[28px_1fr_auto] items-start gap-3 rounded-lg px-2 py-3">
              <span className="grid h-7 w-7 place-items-center overflow-hidden rounded-[7px] border border-border">
                <T3Mark className="h-full w-full" />
              </span>
              <span className="min-w-0">
                <span className="block text-[14.5px] font-medium leading-snug">
                  {t3.name} <span className="font-normal text-muted-foreground">· open source</span>
                </span>
                <span className="mt-1 block text-[13.5px] leading-relaxed text-muted-foreground">
                  {merged} of {t3.prs.length} pull requests merged into the coding-agent app.
                </span>
              </span>
              <span className="pt-0.5 font-mono text-[12px] text-muted-foreground">PRs</span>
            </a>
          </li>
        )}
      </GlideList>
    </Section>
  );
}

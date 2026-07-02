import { skills } from '../data/content';
import { SectionHeading, headingIconClass } from './ui/SectionHeading';
import { BlurFade } from './ui/BlurFade';
import { SpotlightGlow } from './ui/SpotlightGlow';
import { Marquee } from './ui/Marquee';
import { Tooltip } from './ui/Tooltip';
import { TerminalIcon } from './ui/Icons';

const allSkills = skills.categories.flatMap((c) => c.skills);
const iconSkills = allSkills.filter((s) => s.icon?.startsWith('http'));
const rowA = iconSkills.filter((_, i) => i % 2 === 0);
const rowB = iconSkills.filter((_, i) => i % 2 === 1);

/**
 * Skills: two counter-scrolling icon marquees + per-category chip cards.
 */
export function Skills() {
  return (
    <section id="skills" className="scroll-mt-28">
      <SectionHeading icon={<TerminalIcon className={headingIconClass} />}>Skills</SectionHeading>

      {/* Icon marquees */}
      <div className="relative mb-10 overflow-hidden">
        <div className="fade-mask-left" />
        <div className="fade-mask-right" />
        <Marquee pauseOnHover className="[--duration:32s]">
          <div className="flex items-center gap-8">
            {rowA.map((s) => (
              <Tooltip key={s.name} label={s.name}>
                <img
                  src={s.icon}
                  alt={s.name}
                  className="h-9 w-9 transition-transform duration-300 hover:scale-125"
                  loading="lazy"
                />
              </Tooltip>
            ))}
          </div>
        </Marquee>
        <Marquee pauseOnHover reverse className="[--duration:36s]">
          <div className="flex items-center gap-8">
            {rowB.map((s) => (
              <Tooltip key={s.name} label={s.name}>
                <img
                  src={s.icon}
                  alt={s.name}
                  className="h-9 w-9 transition-transform duration-300 hover:scale-125"
                  loading="lazy"
                />
              </Tooltip>
            ))}
          </div>
        </Marquee>
      </div>

      {/* Category cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {skills.categories.map((category, i) => (
          <BlurFade key={category.name} delay={0.05 + i * 0.04} inView>
            <div className="group/glow relative h-full overflow-hidden rounded-xl border bg-card/60 p-4 backdrop-blur-sm transition-colors duration-300 hover:border-ring/60">
              <SpotlightGlow />
              <h3 className="mb-3 text-sm font-bold tracking-tight text-foreground sm:text-base">
                {category.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill.name}
                    className="inline-flex items-center gap-1.5 rounded-sm bg-secondary px-2 py-1 text-xs font-semibold leading-none tracking-tight text-secondary-foreground transition-transform duration-200 hover:scale-105"
                  >
                    {skill.icon?.startsWith('http') && (
                      <img src={skill.icon} alt="" className="h-3.5 w-3.5" loading="lazy" />
                    )}
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          </BlurFade>
        ))}
      </div>
    </section>
  );
}

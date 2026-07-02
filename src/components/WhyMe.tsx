import { SectionHeading, headingIconClass } from './ui/SectionHeading';
import { BlurFade } from './ui/BlurFade';
import { SpotlightGlow } from './ui/SpotlightGlow';
import { BorderBeam } from './ui/BorderBeam';
import { NumberTicker } from './ui/NumberTicker';
import { SparklesIcon, FlaskIcon, TrendingUpIcon, ShieldIcon, TerminalIcon } from './ui/Icons';

const iconClass = 'h-5 w-5 text-foreground';

const reasons = [
  {
    icon: <FlaskIcon className={iconClass} />,
    title: 'Research that ships',
    desc: 'Peer-reviewed publications (Taylor & Francis, IEEE QPAIN 2026) alongside production systems. I read the papers and then build the pipeline.',
  },
  {
    icon: <TrendingUpIcon className={iconClass} />,
    title: 'Measured business impact',
    desc: '4 production sites drove 1.5x client revenue at BetaScript. An ordering platform I built serves 50,000+ customers at a 4.9-star rating.',
  },
  {
    icon: <ShieldIcon className={iconClass} />,
    title: 'Security mindset',
    desc: 'Certified Ethical Hacker doing blockchain, cybersecurity and quantum cryptography R&D at Deepchain Labs. I build with threat models in mind.',
  },
  {
    icon: <TerminalIcon className={iconClass} />,
    title: 'End-to-end ownership',
    desc: 'From 272 scraping spiders and Gemini fine-tuning to React frontends and Netlify deploys: design, build, measure, iterate, solo or leading a team.',
  },
];

const stats = [
  { label: 'Users served', value: 50000, suffix: '+' },
  { label: 'Client revenue', value: 1.5, suffix: 'x', decimals: 1 },
  { label: 'Papers & talks', value: 3, suffix: '' },
  { label: 'Production apps', value: 8, suffix: '+' },
];

/** Why me: differentiator cards + proof counters with a border beam. */
export function WhyMe() {
  return (
    <section id="why-me" className="scroll-mt-28">
      <SectionHeading icon={<SparklesIcon className={headingIconClass} />}>Why Me</SectionHeading>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {reasons.map((reason, i) => (
          <BlurFade key={reason.title} delay={0.06 + i * 0.05} inView>
            <div className="group/glow relative h-full overflow-hidden rounded-xl border bg-card/60 p-5 backdrop-blur-sm transition-colors duration-300 hover:border-ring/60">
              <SpotlightGlow />
              <div className="flex items-center gap-2.5">
                {reason.icon}
                <h3 className="text-sm font-bold tracking-tight text-foreground sm:text-base">
                  {reason.title}
                </h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{reason.desc}</p>
            </div>
          </BlurFade>
        ))}
      </div>

      {/* Proof counters */}
      <BlurFade delay={0.15} inView>
        <div className="relative mt-6 overflow-hidden rounded-xl border bg-card/60 backdrop-blur-sm">
          <BorderBeam size={90} duration={7} colorFrom="#8c7aff" colorTo="rgba(140,122,255,0)" />
          <dl className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`flex flex-col items-center px-4 py-5 sm:py-6 ${
                  i > 0 ? 'md:border-l md:border-border/60' : ''
                } ${i % 2 === 1 ? 'max-md:border-l max-md:border-border/60' : ''} ${
                  i >= 2 ? 'max-md:border-t max-md:border-border/60' : ''
                }`}
              >
                <dd className="text-2xl font-semibold tracking-tighter text-foreground sm:text-3xl">
                  <NumberTicker value={stat.value} suffix={stat.suffix} decimalPlaces={stat.decimals ?? 0} />
                </dd>
                <dt className="mt-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground sm:text-xs">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </BlurFade>
    </section>
  );
}

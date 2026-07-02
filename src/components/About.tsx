import { useEffect, useRef, useState } from 'react';
import { profile, skills } from '../data/content';
import { SectionHeading, headingIconClass } from './ui/SectionHeading';
import { GlowingEffect } from './ui/GlowingEffect';
import { SpotlightGlow } from './ui/SpotlightGlow';
import { NumberTicker } from './ui/NumberTicker';
import { Marquee } from './ui/Marquee';
import { Globe } from './ui/Globe';
import { GitHubGraph } from './ui/GitHubGraph';
import { ScratchToReveal } from './ui/ScratchToReveal';
import { AsciiTorus } from './ui/AsciiTorus';
import { Tooltip } from './ui/Tooltip';
import {
  MapPinIcon,
  ToolIcon,
  LinkIcon,
  HeartIcon,
  ShieldIcon,
  UsersIcon,
  TrendingUpIcon,
  HandClickIcon,
  SparklesIcon,
  GitHubIcon,
  LinkedInIcon,
  EmailIcon,
  ResumeIcon,
} from './ui/Icons';

const dashboardIconClass = 'h-4 w-4 sm:h-5 sm:w-5 text-foreground';

// Fun prizes hidden under the scratch foil: sticker GIFs (same set as the
// reference) mixed with emoji stickers so the deck stays fresh even offline.
const SCRATCH_GIFS = [
  'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3YXJld3JyYXo1Z3d1Nnh1ZzFxbXU3ZzV5N3JiamNsa3ByMHBvam1vaiZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/eOjuCYIGqXSqfBy0MX/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3aGh0YmFybmt1d3d4ZGY0c2lyMDhmcTlnMTBkanozNGxuangydjluaSZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/AEDD6xjlOxNMgFsUmA/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOWdnMDcycTF1ejAyNm1yamVuMTZpZTcxd3UwemhxbzcweGVsMDl5aSZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/LqgrTA39s77U8JKhJd/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOTY3c293N2VhdDFsMmFkdG85MGpjcnRrd2xybHUwZnI2dGdwdnpzYSZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/xYPdnwsRPZDhCxXvOi/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3YXZjdjljYzM0NzhoOHNjajZldDQ2ZzU5YTF5MTExOXQxbGdpdjAxZSZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/20JY76TfKAhR20SfJu/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3YXZjdjljYzM0NzhoOHNjajZldDQ2ZzU5YTF5MTExOXQxbGdpdjAxZSZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/MxZKME5mbgeXckKp14/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ2Y2N2FvYTl6bTkxeGlzanpxNmJrOXh1bXBuY3gyY2ljeHpweWVlMSZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/d9UAwX6gd6d3zYrTF5/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3amtteDRyNWx4OHpmODVlMXo3YnBlczd3dGRoMWVlcWE5MzJxMjA2cyZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/kimWBtJDjWcwFH2nRB/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaTNtcmFyajY4MzNldzVkanU5dHNzdTBnaWJibmo0d2wycm5xOWRzZCZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/GPWKoHhTMmjTYqOTVG/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3NzAwZmVqd2tyM2t4c28xZHprem00dzR3bW9vZDZ2d2FzZDV5dTkxNiZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/wMQTobBKTpmg5TLuZ5/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZmdtbDAxdjY3b2I2cm1naXRraGhpMm95MzA1dXkzank3dXg0MGcybSZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/yrYcBBMG9F9tLwSDrM/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3dXIxaXR2dzFhenZieXo1N2F0c2NpZmNza2ZwbnZpbm5vNHZ4ZWFwbyZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/LIcwKtctRdCtPaaaNO/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExb3FqaHAwa2d1ZHB4ZTIwMXlka2FrNGNrbHRlamJxZ3AzbXVzdHpqMCZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/UmbybxMJ3sRvKBV5qw/giphy.gif',
];

const SCRATCH_EMOJIS = ['🎉', '🚀', '🐱', '🔥', '🤖', '✨', '🦄', '🎮', '☕', '🧠', '🛡️', '👾'];

type ScratchPrize = { kind: 'gif'; src: string } | { kind: 'emoji'; glyph: string };

const SCRATCH_PRIZES: ScratchPrize[] = [
  ...SCRATCH_GIFS.map((src): ScratchPrize => ({ kind: 'gif', src })),
  ...SCRATCH_EMOJIS.map((glyph): ScratchPrize => ({ kind: 'emoji', glyph })),
];

const prizeKey = (p: ScratchPrize) => (p.kind === 'gif' ? p.src : p.glyph);

function shuffle<T>(arr: readonly T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  children?: React.ReactNode;
  tooltip?: string;
  cursorEmoji?: string;
}

/** Bento cell: glowing pointer-chasing border + cursor spotlight inside. */
function GridItem({ area, icon, title, children, tooltip, cursorEmoji }: GridItemProps) {
  return (
    <li
      className="min-h-[2rem] w-full list-none"
      style={{ gridArea: area }}
      data-cursor-emoji={cursorEmoji}
      title={tooltip}
    >
      <div className="relative mx-auto h-full rounded-xl border p-2 md:rounded-2xl">
        <GlowingEffect spread={40} glow proximity={64} inactiveZone={0.01} />
        <div className="group/glow relative flex h-full flex-col justify-between gap-2 overflow-hidden rounded-lg bg-card/60 p-4">
          <SpotlightGlow />
          <div className="relative flex flex-row items-center gap-2 sm:gap-3">
            <div>{icon}</div>
            <h3 className="text-start text-sm font-semibold tracking-tight text-foreground sm:text-base">
              {title}
            </h3>
          </div>
          <div className="min-h-0 flex-1 pt-2">{children}</div>
        </div>
      </div>
    </li>
  );
}

const connect = [
  { label: 'GitHub', href: profile.github, icon: GitHubIcon },
  { label: 'LinkedIn', href: profile.linkedin, icon: LinkedInIcon },
  { label: 'Email', href: `mailto:${profile.email}`, icon: EmailIcon },
  { label: 'Resume', href: '#resume', icon: ResumeIcon },
];

// Flatten the categorized skills into one marquee-friendly icon strip.
const marqueeTools = skills.categories
  .flatMap((c) => c.skills)
  .filter((s) => s.icon?.startsWith('http'))
  .slice(0, 24);

/**
 * About: short bio + interactive bento dashboard (globe, GitHub heatmap,
 * counters, scratch card, tools marquee).
 */
export function About() {
  // Scratch prizes come off a shuffled deck (client-only to avoid a hydration
  // mismatch): every reset reveals a new GIF or emoji, no repeats until the
  // whole deck has cycled. The next GIF preloads while the current one shows.
  const deckRef = useRef<ScratchPrize[]>([]);
  const [prize, setPrize] = useState<ScratchPrize | null>(null);

  const drawPrize = () => {
    setPrize((current) => {
      if (deckRef.current.length === 0) {
        deckRef.current = shuffle(SCRATCH_PRIZES);
        // never deal the same prize twice in a row across reshuffles
        if (current && prizeKey(deckRef.current[0]) === prizeKey(current)) {
          deckRef.current.push(deckRef.current.shift()!);
        }
      }
      const next = deckRef.current.shift()!;
      const upcoming = deckRef.current[0];
      if (upcoming?.kind === 'gif') {
        const img = new Image();
        img.src = upcoming.src;
      }
      return next;
    });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: deal the first prize once on mount only
  useEffect(() => {
    drawPrize();
  }, []);

  return (
    <section id="about" className="scroll-mt-28">
      <SectionHeading icon={<SparklesIcon className={headingIconClass} />}>About Me</SectionHeading>

      <p className="mx-auto mb-10 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground sm:text-base">
        {profile.bio}
      </p>

      <ul className="dashboard-grid w-full gap-4">
        <GridItem
          area="location"
          icon={<MapPinIcon className={dashboardIconClass} />}
          title="Dhaka, BD → Worldwide"
          cursorEmoji="✈️"
          tooltip="Drag the globe"
        >
          <div className="min-h-[200px]">
            <Globe />
          </div>
        </GridItem>

        <li className="min-h-[2rem] w-full list-none" style={{ gridArea: 'github' }} data-cursor-emoji="💻">
          <GitHubGraph />
        </li>

        <GridItem
          area="stats1"
          icon={<UsersIcon className={dashboardIconClass} />}
          title="Users Served"
          cursorEmoji="👥"
        >
          <NumberTicker
            value={50000}
            suffix="+"
            className="whitespace-pre-wrap text-3xl font-semibold tracking-tighter text-muted-foreground"
          />
        </GridItem>

        <GridItem
          area="stats2"
          icon={<TrendingUpIcon className={dashboardIconClass} />}
          title="Client Revenue"
          tooltip="Measured post-launch at BetaScript"
          cursorEmoji="📈"
        >
          <NumberTicker
            value={1.5}
            decimalPlaces={1}
            suffix="x"
            className="whitespace-pre-wrap text-3xl font-semibold tracking-tighter text-muted-foreground"
          />
        </GridItem>

        <GridItem
          area="favstack"
          icon={<HeartIcon className={dashboardIconClass} />}
          title="Signal"
          tooltip="Color ASCII torus: hover to tilt, click to flip"
          cursorEmoji="🌀"
        >
          <div className="relative h-28 overflow-hidden rounded-md border border-border/60 bg-[#05060a]">
            <AsciiTorus className="h-full w-full" />
          </div>
        </GridItem>

        <GridItem
          area="ceh"
          icon={<ShieldIcon className={dashboardIconClass} />}
          title="Certified Ethical Hacker"
          cursorEmoji="🛡️"
        >
          <p className="text-sm leading-relaxed text-muted-foreground">
            EC-Council CEH. Security research at Deepchain Labs across blockchain and quantum cryptography.
          </p>
        </GridItem>

        <GridItem
          area="scratch"
          icon={<HandClickIcon className={dashboardIconClass} />}
          title="Scratch Me"
        >
          <div className="relative">
            <ScratchToReveal
              className="flex h-24 items-center justify-center rounded-md border border-border/60 bg-background"
              minScratchPercentage={20}
              resetKey={prize ? prizeKey(prize) : 'ssr'}
              onComplete={() => {
                window.setTimeout(drawPrize, 2400);
              }}
            >
              {prize &&
                (prize.kind === 'gif' ? (
                  <img
                    src={prize.src}
                    alt="Scratched-off surprise sticker"
                    width={100}
                    height={100}
                    loading="lazy"
                    decoding="async"
                    className="h-16 object-contain"
                  />
                ) : (
                  <span role="img" aria-label="Scratched-off surprise emoji" className="select-none text-5xl leading-none">
                    {prize.glyph}
                  </span>
                ))}
            </ScratchToReveal>
            <button
              type="button"
              onClick={drawPrize}
              onMouseDown={(e) => e.stopPropagation()}
              aria-label="New surprise"
              className="group absolute right-1 top-1 z-10 rounded-md p-1 text-muted-foreground transition-colors hover:bg-background/60 hover:text-foreground"
            >
              <svg
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 11A8.1 8.1 0 0 0 4.5 9M4 5v4h4M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
              </svg>
            </button>
          </div>
        </GridItem>

        <GridItem
          area="connect"
          icon={<LinkIcon className={dashboardIconClass} />}
          title="Connect"
          cursorEmoji="🔗"
        >
          <div className="flex flex-col gap-3.5 sm:p-2">
            {connect.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'me noopener noreferrer' : undefined}
                className="group flex items-center gap-2"
              >
                <Icon className="h-5 w-5 text-muted-foreground transition-[transform,color] group-hover:scale-125 group-hover:animate-wiggle group-hover:text-foreground" />
                <span className="text-sm text-muted-foreground transition-colors group-hover:font-semibold group-hover:text-foreground">
                  {label}
                </span>
              </a>
            ))}
          </div>
        </GridItem>

        <GridItem
          area="tools"
          icon={<ToolIcon className={dashboardIconClass} />}
          title="Tools"
          cursorEmoji="🔧"
        >
          <div className="relative overflow-hidden">
            <div className="fade-mask-left" />
            <div className="fade-mask-right" />
            <Marquee pauseOnHover className="[--duration:24s]">
              <div className="flex items-center gap-6">
                {marqueeTools.map(({ name, icon }) => (
                  <Tooltip key={name} label={name}>
                    <img src={icon} alt={name} className="h-8 w-8" loading="lazy" />
                  </Tooltip>
                ))}
              </div>
            </Marquee>
          </div>
        </GridItem>
      </ul>
    </section>
  );
}

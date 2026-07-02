import { useEffect, useRef, useState } from 'react';
import { m } from 'framer-motion';
import { profile, profileHeroImage } from '../data/content';
import { BlurFade } from './ui/BlurFade';
import { HeroConstellation } from './ui/HeroConstellation';
import { ShimmerButton } from './ui/ShimmerButton';
import { ShimmerBorder } from './ui/ShimmerBorder';
import { AnimatedName } from './ui/AnimatedName';
import { Tooltip } from './ui/Tooltip';
import { GitHubIcon, LinkedInIcon, EmailIcon, ArrowRightIcon } from './ui/Icons';

/** Dhaka-local status, like the reference: green while awake, amber after hours. */
function getStatus(): { status: string; dotClass: string } {
  const hour = parseInt(
    new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Dhaka', hour: 'numeric', hour12: false }).format(new Date()),
    10
  );
  return hour >= 8 && hour < 23
    ? { status: 'Available', dotClass: 'bg-green-500' }
    : { status: 'Recharging in Dhaka', dotClass: 'bg-amber-500' };
}

/** SSR renders the default; the live Dhaka status resolves after hydration. */
function StatusDot() {
  const [{ status, dotClass }, setState] = useState({ status: 'Available', dotClass: 'bg-green-500' });
  useEffect(() => setState(getStatus()), []);
  return (
    <>
      <span className="relative mr-2 flex h-2 w-2" aria-hidden="true">
        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${dotClass}`} />
        <span className={`relative inline-flex h-2 w-2 rounded-full ${dotClass}`} />
      </span>
      <span className="whitespace-pre-wrap py-0.5 text-center text-xs font-semibold leading-none text-muted-foreground sm:text-sm">
        {status}
      </span>
    </>
  );
}

const contactIcons = [
  { label: 'GitHub', href: profile.github, icon: GitHubIcon, aria: 'GitHub profile' },
  { label: 'LinkedIn', href: profile.linkedin, icon: LinkedInIcon, aria: 'LinkedIn profile' },
  { label: 'Email', href: `mailto:${profile.email}`, icon: EmailIcon, aria: 'Send an email' },
];

/**
 * Hero (reference port): constellation dots, ASCII torus avatar in an
 * animated glow ring, availability shimmer pill, animated name, and the
 * "View my work" pill with a cursor-tracked glow + shimmer border.
 */
export function Hero() {
  const [wiggleIcon, setWiggleIcon] = useState<string | null>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  const handleIconClick = (name: string) => {
    setWiggleIcon(name);
    setTimeout(() => setWiggleIcon(null), 600);
  };

  const handleCtaMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ctaRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  return (
    <div className="relative flex items-center justify-center overflow-hidden pb-16 pt-36 sm:pt-52">
      <HeroConstellation desktopDots={220} mobileDots={70} />

      <BlurFade delay={0.005} inView>
        <div className="relative flex-col space-y-1">
          <div className="relative flex flex-col items-center justify-center">
            {/* Portrait in an animated glow ring: grayscale until hover */}
            <div className="group relative p-[4px]" data-cursor-emoji="👋">
              <m.div
                aria-hidden
                className="absolute inset-1 z-[1] rounded-full opacity-40 blur-md transition duration-500 will-change-transform group-hover:opacity-100 bg-[radial-gradient(circle_farthest-side_at_0_100%,#7b61ff,transparent),radial-gradient(circle_farthest-side_at_100%_0,#5ee7f5,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#ffc414,transparent),radial-gradient(circle_farthest-side_at_0_0,#ff6ec7,#141316)]"
                style={{ backgroundSize: '400% 400%' }}
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse' }}
              />
              <img
                src={profileHeroImage}
                alt={profile.name}
                width={96}
                height={96}
                fetchPriority="high"
                className="relative z-10 h-20 w-20 rounded-full border border-white/10 object-cover grayscale transition-[filter,transform] duration-300 group-hover:scale-[1.03] group-hover:grayscale-0 sm:h-24 sm:w-24"
              />
            </div>

            {/* Status pill (Dhaka-local, like the reference) */}
            <ShimmerButton className="z-10 mt-8">
              <StatusDot />
            </ShimmerButton>
          </div>

          <div className="w-full space-y-6">
            <BlurFade delay={0.005} inView>
              <h1 className="whitespace-nowrap text-center text-5xl font-bold leading-[1.8] subpixel-antialiased sm:text-7xl">
                <span className="sr-only">{profile.name}</span>
                <span
                  aria-hidden="true"
                  className="inline-block bg-gradient-to-b from-zinc-500 to-zinc-950 bg-clip-text pb-2 text-transparent dark:from-zinc-50 dark:to-zinc-400"
                >
                  Hi. I&#39;m{' '}
                  <span className="text-foreground [-webkit-text-fill-color:hsl(var(--foreground))]">
                    <AnimatedName names={['Siam', 'Ehsanul']} className="script-accent" />
                  </span>
                </span>
              </h1>
              <p className="text-center text-base font-medium tracking-tight text-secondary-foreground subpixel-antialiased sm:text-2xl">
                An AI Engineer &amp; Full-Stack Developer who likes{' '}
                <span className="script-accent">building things</span>.
              </p>
              <p className="mt-3 text-center text-xs text-muted-foreground sm:text-sm">
                Published researcher · 50K+ users served · {profile.location}
              </p>
            </BlurFade>

            <BlurFade delay={0.01} direction="down" inView>
              <div className="z-10 flex flex-row items-center justify-center gap-5">
                {/* Contact icons */}
                <div className="flex flex-row items-center justify-center space-x-6">
                  {contactIcons.map(({ label, href, icon: Icon, aria }) => (
                    <Tooltip key={label} label={label} side="bottom">
                      <a
                        href={href}
                        target={href.startsWith('http') ? '_blank' : undefined}
                        rel={href.startsWith('http') ? 'me noopener noreferrer' : undefined}
                        aria-label={aria}
                        onClick={() => handleIconClick(label)}
                        className={`inline-flex text-secondary-foreground transition-transform duration-300 hover:scale-125 hover:animate-wiggle ${
                          wiggleIcon === label ? 'scale-125 animate-wiggle' : ''
                        }`}
                      >
                        <Icon className="h-6 w-6" />
                      </a>
                    </Tooltip>
                  ))}
                </div>

                <span className="h-5 w-px bg-border" aria-hidden />

                {/* View my work pill */}
                <a
                  ref={ctaRef}
                  onMouseMove={handleCtaMove}
                  href="#projects"
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-border/80 bg-background/40 px-4 py-1.5 text-sm font-medium text-secondary-foreground backdrop-blur-sm transition-colors hover:text-foreground"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-full text-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-20"
                    style={{
                      background:
                        'radial-gradient(120px circle at var(--mx, 50%) var(--my, 50%), currentColor, transparent 60%)',
                    }}
                  />
                  <span className="relative whitespace-nowrap">View my work</span>
                  <ArrowRightIcon className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  <ShimmerBorder />
                </a>
              </div>
            </BlurFade>
          </div>
        </div>
      </BlurFade>
    </div>
  );
}

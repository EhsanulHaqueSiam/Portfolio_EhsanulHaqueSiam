import { useEffect, useRef, useState } from 'react';
import { m, useInView } from 'framer-motion';
import { profile, navItems } from '../data/content';
import { RainbowButton } from './ui/RainbowButton';
import { StudioCat } from './ui/StudioCat';
import { GitHubIcon, LinkedInIcon, EmailIcon, ResumeIcon, SendIcon, StarIcon } from './ui/Icons';

const REPO_URL = 'https://github.com/EhsanulHaqueSiam/Portfolio_EhsanulHaqueSiam';

const connectLinks = [
  { label: 'GitHub', href: 'https://github.com/EhsanulHaqueSiam', icon: GitHubIcon, external: true },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/EhsanulHaqueSiam/', icon: LinkedInIcon, external: true },
  { label: 'Email', href: `mailto:ehsanul.siamdev@gmail.com`, icon: EmailIcon, external: false },
  { label: 'Resume', href: '#resume', icon: ResumeIcon, external: false },
];

/**
 * Footer (reference port): "Say hello" rainbow CTA with a paper-plane fly-out,
 * link columns, and the studio cat perched on the top rule.
 */
export function Footer() {
  const [sent, setSent] = useState(false);
  const waveRef = useRef<HTMLSpanElement>(null);
  const waveInView = useInView(waveRef, { amount: 0.5 });
  const [waveKey, setWaveKey] = useState(0);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if (waveInView) setWaveKey((k) => k + 1);
  }, [waveInView]);

  const handleSendClick = () => {
    if (sent) return;
    setSent(true);
    window.setTimeout(() => setSent(false), 1300);
  };

  const goTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    history.replaceState(null, '', href);
  };

  return (
    <footer className="relative w-full overflow-hidden">
      {/* Bottom glow */}
      <div className="bg-ellipse bottom-[-180px] left-1/2 h-[360px] w-[720px] -translate-x-1/2" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col px-4 pt-20 sm:pt-28">
        {/* CTA */}
        <div className="mb-16 flex flex-col items-center justify-center sm:mb-24">
          <h2 className="mb-8 text-center text-pretty text-3xl font-bold sm:text-4xl">
            Say <span className="script-accent">hello</span>.{' '}
            <span ref={waveRef} className="inline-block">
              <span key={waveKey} className="inline-block origin-bottom-right animate-wiggle hover:animate-wiggle">
                👋
              </span>
            </span>
          </h2>
          <a
            href={`mailto:${profile.email}`}
            onClick={handleSendClick}
            className="group inline-block transition-transform duration-150 active:scale-95"
          >
            <RainbowButton className="overflow-visible pl-5 pr-6 sm:pl-7 sm:pr-8 before:transition-[width,height,bottom,filter] before:duration-300 hover:before:bottom-[-35%] hover:before:h-1/3 hover:before:w-4/5 hover:before:[filter:blur(1.1rem)]">
              <m.span
                aria-hidden
                className="inline-flex will-change-transform"
                animate={
                  sent
                    ? {
                        x: [0, 24, 90, 0, 0],
                        y: [0, -38, -64, 30, 0],
                        rotate: [0, 25, 45, 0, 0],
                        opacity: [1, 1, 0, 0, 1],
                      }
                    : { x: 0, y: 0, rotate: 0, opacity: 1 }
                }
                transition={{
                  duration: sent ? 1.2 : 0.45,
                  ease: 'easeOut',
                  times: sent ? [0, 0.3, 0.5, 0.51, 1] : undefined,
                }}
              >
                <SendIcon className="h-5 w-5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:-rotate-12" />
              </m.span>
              <span className="tracking-tight">Contact Me</span>
            </RainbowButton>
          </a>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-6 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground sm:text-sm"
          >
            <GitHubIcon className="h-4 w-4" />
            <span>This site is open source: star it on GitHub</span>
            <StarIcon className="h-3.5 w-3.5 transition-colors group-hover:animate-spin-grow group-hover:text-amber-400" />
          </a>
        </div>

        {/* The studio cat, perched on the footer rule */}
        <div className="flex justify-end pr-[8%] sm:pr-[12%]" aria-hidden="true">
          <StudioCat className="translate-y-[3px]" />
        </div>

        {/* Links + identity */}
        <div className="grid grid-cols-2 gap-8 border-t border-border/60 pb-8 pt-10 sm:grid-cols-3 sm:gap-12">
          <div className="col-span-2 flex flex-col items-start gap-3 sm:col-span-1">
            <span className="script-accent text-2xl text-foreground">es.</span>
            <p className="text-sm font-semibold tracking-tight text-foreground">{profile.name}</p>
            <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
              AI Engineer and Full-Stack Developer, bridging published research and production systems from Dhaka to worldwide.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">Navigate</h3>
            <ul className="flex flex-col gap-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <button
                    type="button"
                    onClick={() => goTo(item.href)}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">Connect</h3>
            <ul className="flex flex-col gap-2">
              {connectLinks.map(({ label, href, icon: Icon, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'me noopener noreferrer' : undefined}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col items-center justify-between gap-2 border-t border-border/60 pb-6 pt-6 sm:flex-row sm:gap-0">
          <p className="text-xs leading-none text-muted-foreground">
            © {currentYear} {profile.name}. All rights reserved.
          </p>
          <p className="text-xs leading-none text-muted-foreground">
            Built with Astro 7, React and Tailwind. Deployed on Netlify.
          </p>
        </div>
      </div>
    </footer>
  );
}

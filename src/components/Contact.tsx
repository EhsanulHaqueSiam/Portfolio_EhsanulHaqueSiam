import { useEffect, useRef, useState } from 'react';
import { profile } from '../data/content';
import { SectionHeading, headingIconClass } from './ui/SectionHeading';
import { BlurFade } from './ui/BlurFade';
import { GlowCard } from './ui/GlowCard';
import { AsciiField } from './ui/AsciiField';
import { ShimmerBorder } from './ui/ShimmerBorder';
import {
  EmailIcon,
  CopyIcon,
  CheckIcon,
  GitHubIcon,
  LinkedInIcon,
  ResumeIcon,
  ArrowUpRightIcon,
} from './ui/Icons';

const recruiterBody = [
  'Hi Ehsanul,',
  '',
  'I found your portfolio and would like to discuss a role.',
  '',
  'Role Title:',
  'Company:',
  'Location:',
  'Compensation Range:',
  'Interview Process:',
  '',
  'Best regards,',
].join('\n');

const recruiterMailto = `mailto:${profile.email}?subject=${encodeURIComponent(
  'Job Opportunity for Ehsanul Haque Siam'
)}&body=${encodeURIComponent(recruiterBody)}`;

const rows = [
  {
    label: 'Email',
    value: profile.email,
    href: `mailto:${profile.email}`,
    icon: EmailIcon,
  },
  {
    label: 'GitHub',
    value: '@EhsanulHaqueSiam',
    href: profile.github,
    icon: GitHubIcon,
  },
  {
    label: 'LinkedIn',
    value: 'in/EhsanulHaqueSiam',
    href: profile.linkedin,
    icon: LinkedInIcon,
  },
  {
    label: 'Resume',
    value: 'View or download PDF',
    href: '#resume',
    icon: ResumeIcon,
  },
];

/**
 * Contact: direct lines, a recruiter fast-lane mailto, and the interactive
 * color-ASCII field as the closing signal.
 */
export function Contact() {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section id="contact" className="scroll-mt-28">
      <SectionHeading icon={<EmailIcon className={headingIconClass} />}>Contact</SectionHeading>

      <p className="mx-auto mb-10 max-w-xl text-center text-sm leading-relaxed text-muted-foreground sm:text-base">
        Currently a Software Engineer at Ledgercross, building across the stack. I take on select
        AI/ML and full-stack engagements. Direct lines below; replies within 24 hours (UTC+6).
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Direct lines */}
        <BlurFade delay={0.06} inView className="h-full">
          <GlowCard contentClassName="gap-3 p-5" cursorEmoji="📬">
            {rows.map(({ label, value, href, icon: Icon }) => (
              <div key={label} className="flex items-center justify-between gap-3">
                <a
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'me noopener noreferrer' : undefined}
                  className="group flex min-w-0 items-center gap-3"
                >
                  <Icon className="h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
                  <span className="flex min-w-0 flex-col">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {label}
                    </span>
                    <span className="truncate text-sm text-foreground transition-colors group-hover:underline">
                      {value}
                    </span>
                  </span>
                </a>
                {label === 'Email' && (
                  <button
                    type="button"
                    onClick={copyEmail}
                    aria-label={copied ? 'Email copied' : 'Copy email address'}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-ring hover:text-foreground"
                  >
                    {copied ? <CheckIcon className="h-4 w-4 text-signal-success" /> : <CopyIcon className="h-4 w-4" />}
                  </button>
                )}
              </div>
            ))}

            {/* Recruiter fast lane */}
            <a
              href={recruiterMailto}
              className="group relative mt-auto inline-flex items-center justify-between gap-3 overflow-hidden rounded-lg border border-border bg-background/60 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-ring"
            >
              <span className="flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Hiring?
                </span>
                <span>Send a pre-filled role brief</span>
              </span>
              <ArrowUpRightIcon className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              <ShimmerBorder duration="4s" />
            </a>
          </GlowCard>
        </BlurFade>

        {/* Interactive ASCII signal */}
        <BlurFade delay={0.1} inView className="h-full">
          <figure className="flex h-full flex-col">
            <div className="relative min-h-[240px] flex-1 overflow-hidden rounded-xl border bg-ascii-surface">
              <AsciiField className="h-full w-full" surface="ink" cols={72} />
            </div>
            <figcaption className="mt-2 flex justify-between text-[11px] text-muted-foreground">
              <span>Interactive: move your cursor</span>
              <span>Dhaka · UTC+6</span>
            </figcaption>
          </figure>
        </BlurFade>
      </div>
    </section>
  );
}

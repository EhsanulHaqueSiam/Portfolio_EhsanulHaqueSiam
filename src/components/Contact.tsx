import { useState, useEffect, useRef } from 'react';
import { m } from 'framer-motion';
import { profile } from '../data/content';
import {
  GitHubIcon,
  LinkedInIcon,
  ArrowUpRightIcon,
  EmailIcon,
  CopyIcon,
  CheckIcon,
} from './ui/Icons';
import { AsciiField } from './ui/AsciiField';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * 11 / Contact — the ink-spread finale.
 * Full-bleed ink-950 field; the Footer (colophon) below continues the same
 * field with its own hairline top rule, so this section adds NO bottom rule.
 */
export function Contact() {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recruiterMailtoHref = `mailto:${profile.email}?subject=${encodeURIComponent('Job Opportunity for Ehsanul Haque Siam')}&body=${encodeURIComponent('Hi Ehsanul,\n\nI found your portfolio and would like to discuss a role.\n\nRole Title:\nCompany:\nLocation:\nCompensation Range:\nInterview Process:\n\nBest regards,')}`;

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setCopyFailed(false);
    } catch {
      // Fallback for older browsers or denied permissions
      try {
        const textarea = document.createElement('textarea');
        textarea.value = profile.email;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopied(true);
        setCopyFailed(false);
      } catch {
        setCopyFailed(true);
      }
    }
    // Clear any existing timeout before setting a new one
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCopied(false);
      setCopyFailed(false);
    }, 2000);
  };

  const ledger = [
    { label: 'Location', value: `${profile.location} (UTC+6)` },
    {
      label: 'Availability',
      value: profile.available ? (
        <>
          Select roles &amp; engagements — AI/ML ·{' '}
          <span className="whitespace-nowrap">Full-stack</span>
        </>
      ) : (
        'Fully booked'
      ),
    },
    { label: 'Remote', value: 'Worldwide' },
    { label: 'Response', value: '< 24 hrs' },
  ];

  const socials = [
    { href: profile.github, label: 'GitHub', Icon: GitHubIcon },
    { href: profile.linkedin, label: 'LinkedIn', Icon: LinkedInIcon },
  ];

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-ink-950 text-paper-100 py-24 sm:py-32"
    >
      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        {/* Ghost numeral — print watermark */}
        <span
          aria-hidden="true"
          className="pointer-events-none select-none absolute right-6 -top-10 hidden xl:block font-display font-light leading-none text-[17rem] text-outline-inverse"
        >
          11
        </span>

        {/* Folio row */}
        <m.div
          className="flex items-baseline justify-between gap-4 border-t rule-inverse pt-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <span className="folio-inverse">
            <span className="text-vermilion-400">11</span>
            <span aria-hidden="true"> — </span>
            CONTACT
          </span>
          <span className="folio-inverse hidden sm:block text-right">
            DIRECT LINE — DHAKA (UTC+6)
          </span>
        </m.div>

        {/* Giant headline — mask reveal */}
        <h2 className="relative mt-10 sm:mt-14 max-w-[14ch] font-display font-light text-display-xl text-paper-100">
          <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
            <m.span
              className="block will-change-transform"
              initial={{ y: '105%' }}
              whileInView={{ y: '0%' }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              Let’s put your next{' '}
              <em className="italic font-light">system</em> in production.
            </m.span>
          </span>
        </h2>

        {/* Email — the hero interaction */}
        <m.div
          className="mt-16 sm:mt-24"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
        >
          <p className="folio-inverse mb-5">Direct line</p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-6">
            <a
              href={recruiterMailtoHref}
              className="link-ink press-feedback inline-block max-w-full break-all font-display font-light leading-[1.05] text-[clamp(1.6rem,8.5vw,5rem)] text-paper-50 [background-size:0%_0.05em] hover:text-vermilion-400 hover:[background-size:100%_0.05em] focus-visible:text-vermilion-400 focus-visible:[background-size:100%_0.05em]"
            >
              {profile.email}
            </a>
            <m.button
              type="button"
              onClick={copyEmail}
              aria-label="Copy email"
              className={`press-feedback inline-flex min-h-[44px] min-w-[44px] items-center gap-2.5 border rule-inverse px-5 py-3 font-mono text-xs uppercase tracking-[0.16em] ${
                copied
                  ? 'border-vermilion-400 text-vermilion-400'
                  : 'text-paper-300 hover:border-vermilion-400 hover:text-vermilion-400 focus-visible:border-vermilion-400 focus-visible:text-vermilion-400'
              }`}
              whileTap={{ scale: 0.97 }}
            >
              {copied ? (
                <CheckIcon className="h-4 w-4" />
              ) : (
                <CopyIcon className="h-4 w-4" />
              )}
              <span>{copyFailed ? 'Copy failed' : copied ? 'Copied' : 'Copy'}</span>
            </m.button>
            <span className="sr-only" role="status" aria-live="polite">
              {copied
                ? 'Email copied to clipboard'
                : copyFailed
                  ? 'Failed to copy email'
                  : ''}
            </span>
          </div>
        </m.div>

        {/* Ledger + contact links */}
        <div className="mt-16 sm:mt-24 grid gap-14 lg:grid-cols-12 lg:gap-10">
          {/* The ledger */}
          <div className="lg:col-span-7">
            <dl>
              {ledger.map((row, i) => (
                <m.div
                  key={row.label}
                  className="flex flex-col gap-1.5 border-t rule-inverse py-4 last:border-b sm:flex-row sm:items-baseline sm:gap-2 sm:py-5"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.06 * i }}
                >
                  <dt className="folio-inverse shrink-0">{row.label}</dt>
                  <span
                    className="leader leader-inverse hidden sm:block"
                    aria-hidden="true"
                  />
                  <dd className="text-left font-mono text-xs uppercase tracking-[0.14em] text-paper-100 sm:text-right sm:text-sm">
                    {row.value}
                  </dd>
                </m.div>
              ))}
            </dl>

            {/* Primary CTA — recruiter mailto template */}
            <m.div
              className="mt-10 sm:mt-12"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
            >
              <a
                href={recruiterMailtoHref}
                className="press-feedback group inline-flex min-h-[44px] items-center gap-3 bg-paper-100 px-6 py-4 font-mono text-xs uppercase tracking-[0.16em] text-ink-900 hover:bg-vermilion hover:text-paper-50 focus-visible:bg-vermilion focus-visible:text-paper-50"
              >
                <EmailIcon className="h-4 w-4" />
                <span>Discuss a role</span>
                <ArrowUpRightIcon className="h-4 w-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </m.div>
          </div>

          {/* Stamp + socials + dossier */}
          <div className="flex flex-col items-start lg:col-span-5">
            <m.div
              className="stamp stamp-on-ink inline-block px-6 py-5 text-center text-sm font-medium sm:px-8 sm:py-6 sm:text-lg lg:self-end"
              initial={{ opacity: 0, scale: 1.12, rotate: 0 }}
              whileInView={{ opacity: 1, scale: 1, rotate: -6 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.35 }}
              whileHover={{ rotate: -3, scale: 1.04 }}
            >
              <span className="block">Replies</span>
              <span className="block">&lt; 24 hrs</span>
            </m.div>

            <m.nav
              className="mt-12 w-full"
              aria-label="Social profiles"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
            >
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="me noopener noreferrer"
                  className="group press-feedback flex min-h-[56px] items-center justify-between gap-4 border-t rule-inverse py-4 font-mono text-xs uppercase tracking-[0.16em] text-paper-100 last:border-b hover:text-vermilion-400 focus-visible:text-vermilion-400 sm:text-sm"
                >
                  <span className="flex items-center gap-3">
                    <social.Icon className="h-4 w-4 text-paper-300 transition-colors duration-300 group-hover:text-vermilion-400" />
                    <span>{social.label}</span>
                  </span>
                  <ArrowUpRightIcon className="h-4 w-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-1 group-hover:-translate-y-1" />
                </a>
              ))}
            </m.nav>

            {/* Stamped file link — the hiring dossier */}
            <m.div
              className="mt-10 w-full"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.25 }}
            >
              <a
                href="/hire-me.html"
                className="group press-feedback flex min-h-[72px] items-center justify-between gap-4 border-2 border-vermilion px-5 py-5 hover:bg-vermilion focus-visible:bg-vermilion sm:px-6"
              >
                <span className="flex flex-col gap-1.5">
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper-300 transition-colors duration-200 group-hover:text-paper-100 group-focus-visible:text-paper-100">
                    File No. EHS-2026-11
                  </span>
                  <span className="font-mono text-sm font-medium uppercase tracking-[0.16em] text-vermilion-400 transition-colors duration-200 group-hover:text-paper-50 group-focus-visible:text-paper-50 sm:text-base">
                    Hire-me dossier
                  </span>
                </span>
                <ArrowUpRightIcon className="h-5 w-5 shrink-0 text-vermilion-400 transition-[color,transform] duration-300 ease-out-expo group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-paper-50 group-focus-visible:text-paper-50" />
              </a>
            </m.div>

            {/* Interactive ASCII signal — pure decoration, colors bloom under the cursor */}
            <m.figure
              className="mt-12 hidden w-full lg:block"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
              aria-hidden="true"
            >
              <div className="reg-marks relative border rule-inverse">
                <AsciiField className="h-[220px] w-full" surface="ink" cols={72} />
              </div>
              <figcaption className="folio-inverse mt-3 flex justify-between gap-4">
                <span>Fig. 11 — Signal</span>
                <span>Interactive · move your cursor</span>
              </figcaption>
            </m.figure>
          </div>
        </div>
      </div>
    </section>
  );
}

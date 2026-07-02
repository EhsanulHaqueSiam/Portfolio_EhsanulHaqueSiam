import { m } from 'framer-motion';
import { profile, navItems } from '../data/content';
import { GitHubIcon, LinkedInIcon, EmailIcon } from './ui/Icons';

const EASE = [0.16, 1, 0.3, 1] as const;

// Quick-link subset of the sitewide nav (single source of truth for hrefs).
const QUICK_LINK_LABELS = ['About', 'Work', 'Research', 'Contact'];
const quickLinks = navItems.filter(link => QUICK_LINK_LABELS.includes(link.label));

const iconLink =
  'press-feedback flex h-11 w-11 items-center justify-center border rule-inverse text-paper-300 transition-colors hover:border-vermilion-400 hover:text-vermilion-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermilion-400';

const monoLink =
  'link-ink press-feedback inline-flex min-h-[44px] items-center font-mono text-[11px] uppercase tracking-[0.16em] text-paper-300 hover:text-paper-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermilion-400';

/**
 * Colophon — the closing imprint of the edition. Sits on `bg-ink-950` so it
 * reads as one continuous ink field with the Contact spread above it,
 * separated only by a hairline rule. Three mono columns:
 * imprint / colophon / index.
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ink-950 text-paper-300">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <m.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          className="border-t rule-inverse py-14 sm:py-16"
        >
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {/* 1 — Imprint */}
            <div>
              <p className="folio-inverse text-ink-400">Imprint</p>
              <p className="mt-4 font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-paper-300">
                © {currentYear} {profile.name}
                <span className="mt-1 block">— {profile.location}</span>
              </p>
              <div className="mt-6 flex items-center gap-3">
                <a
                  href={profile.github}
                  target="_blank"
                  rel="me noopener noreferrer"
                  aria-label="GitHub"
                  className={iconLink}
                >
                  <GitHubIcon className="h-4 w-4" />
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="me noopener noreferrer"
                  aria-label="LinkedIn"
                  className={iconLink}
                >
                  <LinkedInIcon className="h-4 w-4" />
                </a>
                <a href={`mailto:${profile.email}`} aria-label="Email" className={iconLink}>
                  <EmailIcon className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* 2 — Colophon */}
            <div>
              <p className="folio-inverse text-ink-400">Colophon</p>
              <ul className="mt-4 space-y-1.5 font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-paper-300">
                <li>Set in Fraunces, Instrument Sans &amp; Spline Sans Mono</li>
                <li>Built with Astro 7</li>
                <li>Deployed on Netlify</li>
              </ul>
            </div>

            {/* 3 — Index */}
            <nav aria-label="Footer">
              <p className="folio-inverse text-ink-400">Index</p>
              <ul className="mt-2">
                {quickLinks.map(link => (
                  <li key={link.href}>
                    <a href={link.href} className={monoLink}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              <a
                href="#main-content"
                aria-label="Return to top"
                className="press-feedback mt-5 inline-flex min-h-[44px] items-center gap-2 border rule-inverse px-4 font-mono text-[11px] uppercase tracking-[0.16em] text-paper-100 transition-colors hover:border-vermilion-400 hover:text-vermilion-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermilion-400"
              >
                Return to masthead <span aria-hidden="true">↑</span>
              </a>
            </nav>
          </div>

          {/* End rule */}
          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t rule-inverse pt-6 sm:mt-14">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-400">
              All rights reserved
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-400">
              End of record{' '}
              <span aria-hidden="true" className="text-vermilion-400">
                ∎
              </span>
            </p>
          </div>
        </m.div>
      </div>
    </footer>
  );
}

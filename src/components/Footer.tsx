import { m } from 'framer-motion';
import { profile, navItems } from '../data/content';
import { GitHubIcon, LinkedInIcon, EmailIcon } from './ui/Icons';
import { StudioCat } from './ui/StudioCat';

const EASE = [0.16, 1, 0.3, 1] as const;

// Quick-link subset of the sitewide nav (single source of truth for hrefs).
const QUICK_LINK_LABELS = ['About', 'Work', 'Research', 'Contact'];
const quickLinks = navItems.filter(link => QUICK_LINK_LABELS.includes(link.label));

const iconLink =
  'press-feedback flex h-11 w-11 items-center justify-center rounded-full border rule bg-white/5 text-ink-600 backdrop-blur-sm transition-colors hover:border-vermilion-500/40 hover:text-vermilion-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermilion-400';

const monoLink =
  'link-ink press-feedback inline-flex min-h-[44px] items-center font-mono text-[11px] uppercase tracking-[0.16em] text-ink-600 hover:text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermilion-400';

/**
 * Colophon — the closing imprint of the edition. Continues the void from the
 * Contact spread above, separated only by a hairline rule; a faint iris glow
 * rises from the horizon at the very bottom. Three mono columns:
 * imprint / colophon / index.
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden">
      {/* Iris glow horizon */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48"
        style={{
          background:
            'radial-gradient(60% 120% at 50% 100%, rgba(139, 124, 255, 0.12), transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        {/* The studio cat, perched on the footer rule */}
        <div className="flex justify-end pr-[10%] sm:pr-[16%]" aria-hidden="true">
          <StudioCat className="translate-y-[3px]" />
        </div>
        <m.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          className="border-t rule-strong py-14 sm:py-16"
        >
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {/* 1 — Imprint */}
            <div>
              <p className="folio">Imprint</p>
              <p className="mt-4 font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-ink-600">
                © {currentYear} {profile.name}
                <span className="mt-1 block">{profile.location}</span>
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
              <p className="folio">Colophon</p>
              <ul className="mt-4 space-y-1.5 font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-ink-600">
                <li>Set in Fraunces, Instrument Sans &amp; Spline Sans Mono</li>
                <li>Built with Astro 7</li>
                <li>Deployed on Netlify</li>
              </ul>
            </div>

            {/* 3 — Index */}
            <nav aria-label="Footer">
              <p className="folio">Index</p>
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
                className="press-feedback mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-full border rule bg-white/5 px-5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-800 backdrop-blur-sm transition-colors hover:border-vermilion-500/40 hover:text-vermilion-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermilion-400"
              >
                Return to masthead <span aria-hidden="true">↑</span>
              </a>
            </nav>
          </div>

          {/* End rule */}
          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t rule pt-6 sm:mt-14">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-500">
              All rights reserved
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-500">
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

import { m } from 'framer-motion';
import { profile } from '../data/content';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Vertical rail link — rotated mono type with an underline that draws in
// alongside the text. Muted on the void; warms to iris violet on hover.
const railLinkClass =
  'press-feedback [writing-mode:vertical-rl] rotate-180 px-1 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-600 hover:text-vermilion-400 focus-visible:text-vermilion-400 bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat [background-position:100%_0%] [background-size:1px_0%] hover:[background-size:1px_100%] focus-visible:[background-size:1px_100%] transition-[background-size,color] duration-500 ease-out-expo';

export function SocialLinks() {
  return (
    <m.nav
      aria-label="Social links"
      className="fixed bottom-0 left-6 xl:left-8 z-40 hidden 2xl:flex flex-col items-center gap-5"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.2, ease: EASE }}
    >
      <a
        href={profile.github}
        target="_blank"
        rel="me noopener noreferrer"
        aria-label="GitHub"
        className={railLinkClass}
      >
        GitHub
      </a>

      <span className="h-6 w-px bg-ink-300/70" aria-hidden="true" />

      <a
        href={profile.linkedin}
        target="_blank"
        rel="me noopener noreferrer"
        aria-label="LinkedIn"
        className={railLinkClass}
      >
        LinkedIn
      </a>

      <span className="h-6 w-px bg-ink-300/70" aria-hidden="true" />

      <a href="#resume" aria-label="Resume" className={railLinkClass}>
        CV
      </a>

      <span className="h-16 w-px bg-ink-300/70" aria-hidden="true" />
    </m.nav>
  );
}

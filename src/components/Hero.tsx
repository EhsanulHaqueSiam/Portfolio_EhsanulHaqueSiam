import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { m, useScroll, useTransform, useReducedMotion, useInView } from 'framer-motion';
import { profile, profileHeroImage } from '../data/content';
import { FerroText } from './ui/FerroText';
import { MagneticHover } from './ui/ImageDistortion';
import { OptimizedImage } from './ui/OptimizedImage';
import { ArrowDownIcon } from './ui/Icons';
import { useMediaQuery } from '../hooks/useMediaQuery';

/** Parses "1.5x" / "50K+" / "8+" into { value, decimals, suffix } for the ticker. */
function parseStat(raw: string): { value: number; decimals: number; suffix: string } {
  const match = raw.match(/^([\d.]+)(.*)$/);
  if (!match) return { value: 0, decimals: 0, suffix: raw };
  const num = parseFloat(match[1]);
  const decimals = match[1].includes('.') ? match[1].split('.')[1].length : 0;
  return { value: num, decimals, suffix: match[2] };
}

/**
 * Count-up numeral. SSR and first client render show the FINAL value (crawler
 * parity, no hydration mismatch); the count-up only runs after hydration.
 */
function StatTicker({ raw }: { raw: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(raw);

  useEffect(() => {
    if (!inView || reduced) return;
    const { value, decimals, suffix } = parseStat(raw);
    if (!value) return;
    const duration = 1100;
    let start: number | null = null;
    let raf: number;
    const tick = (t: number) => {
      if (start === null) start = t;
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setDisplay(`${(value * eased).toFixed(decimals)}${suffix}`);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setDisplay(raw);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, raw, reduced]);

  return <span ref={ref}>{display}</span>;
}

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const isMobile = useMediaQuery('(max-width: 767px)');
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });
  const exitY = useTransform(scrollYProgress, [0, 1], [0, reduced || isMobile ? 0 : -80]);
  const exitOpacity = useTransform(scrollYProgress, [0, 0.9], [1, reduced ? 1 : 0.15]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100svh] flex flex-col justify-start pt-24 sm:pt-28 lg:pt-32 pb-6"
      aria-label="Introduction"
    >
      <m.div
        style={{ y: exitY, opacity: exitOpacity }}
        className="relative mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12 flex-1 flex flex-col"
      >
        {/* Masthead meta row */}
        <div className="border-t border-b rule-strong py-2.5 flex items-center justify-between gap-4">
          <span className="folio">Now — {profile.currentRole}</span>
          <span className="folio hidden md:block">Deepchain Labs · BetaScript · BDTracks</span>
          <span className="folio hidden sm:block">{profile.location}</span>
        </div>

        {/* Masthead name — italic serif accent over giant poster type */}
        <div className="hero-name-block relative mt-10 sm:mt-14 lg:mt-16">
          <p
            className="rise-in font-display italic font-light text-vermilion text-2xl sm:text-4xl lg:text-5xl leading-none mb-2 sm:mb-4"
            style={{ '--rise-delay': '0.1s' } as CSSProperties}
          >
            {profile.title.toLowerCase()}
          </p>
          <h1 className="poster leading-[0.9]">
            <span className="sr-only">{profile.name}</span>
            <span className="hero-name-line block text-ink-900">
              <FerroText text={profile.firstName.toUpperCase()} delay={0.05} stagger={0.035} />
            </span>
            <span className="hero-name-line block text-ink-900">
              <FerroText
                text={profile.lastName.toUpperCase()}
                delay={0.3}
                stagger={0.03}
                suffix={<span className="text-vermilion">.</span>}
              />
            </span>
          </h1>
        </div>

        {/* Abstract + portrait */}
        <div className="hero-abstract-grid mt-10 sm:mt-14 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-7 xl:col-span-8">
            <p
              className="rise-in font-display font-light text-2xl sm:text-3xl xl:text-4xl leading-snug text-ink-800 max-w-[26ch] sm:max-w-[30ch]"
              style={{ '--rise-delay': '0.45s' } as CSSProperties}
            >
              {profile.tagline}
            </p>

            {/* CTAs */}
            <div
              className="rise-in mt-9 sm:mt-12 flex flex-wrap items-center gap-3 sm:gap-4"
              style={{ '--rise-delay': '0.65s' } as CSSProperties}
            >
              <MagneticHover strength={isMobile ? 0 : 18}>
                <a
                  href="#projects"
                  className="press-feedback inline-flex items-center gap-3 bg-ink-900 text-paper-50 font-mono text-xs uppercase tracking-[0.16em] px-6 py-4 hover:bg-vermilion transition-colors duration-300"
                >
                  Selected work
                  <span className="arrow-bounce" aria-hidden="true">→</span>
                </a>
              </MagneticHover>
              <MagneticHover strength={isMobile ? 0 : 18}>
                <a
                  href="#contact"
                  className="press-feedback inline-flex items-center gap-3 bg-vermilion text-paper-50 font-mono text-xs uppercase tracking-[0.16em] px-6 py-4 hover:bg-ink-900 transition-colors duration-300"
                >
                  Let’s talk
                  <span aria-hidden="true">→</span>
                </a>
              </MagneticHover>
              <span className="flex items-center gap-5 sm:ml-2">
                <a href="#resume" className="link-ink folio !text-ink-700 py-2">
                  Résumé
                </a>
                <a
                  href="/resume.pdf"
                  download="Ehsanul_Haque_Siam_Resume.pdf"
                  className="link-ink folio !text-ink-700 py-2 inline-flex items-center gap-1.5"
                >
                  PDF <ArrowDownIcon className="w-3 h-3" />
                </a>
              </span>
            </div>
          </div>

          {/* Portrait plate */}
          <figure
            className="rise-in lg:col-span-5 xl:col-span-4 max-w-sm lg:max-w-none lg:justify-self-end w-full"
            style={{ '--rise-delay': '0.3s' } as CSSProperties}
          >
            <div className="plate reg-marks relative">
              <OptimizedImage
                src={profileHeroImage}
                alt={profile.name}
                priority
                aspectRatio="954/960"
                sizes="(min-width: 1024px) 420px, 90vw"
                className="w-full"
              />
            </div>
            <figcaption className="folio mt-3 flex justify-between gap-4">
              <span>Fig. 00 — The author</span>
              <span className="hidden sm:inline">Dhaka, BD</span>
            </figcaption>
          </figure>
        </div>

        {/* Stats colophon — proof, measured (X-Y-Z) */}
        <dl
          className="rise-in mt-12 sm:mt-16 border-t border-b rule-strong grid grid-cols-2 md:grid-cols-4"
          style={{ '--rise-delay': '0.85s' } as CSSProperties}
        >
          {profile.stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col py-5 sm:py-6 px-4 sm:px-6 ${i > 0 ? 'md:border-l md:rule' : ''} ${i % 2 === 1 ? 'max-md:border-l max-md:rule' : ''} ${i >= 2 ? 'max-md:border-t max-md:rule' : ''}`}
            >
              <dt className="folio order-2">{stat.label}</dt>
              <dd className="order-1 font-display font-light text-3xl sm:text-4xl xl:text-5xl text-ink-900 mb-1">
                <StatTicker raw={stat.value} />
              </dd>
            </div>
          ))}
        </dl>

        {/* Scroll cue */}
        <a
          href="#about"
          className="rise-in mt-auto pt-8 pb-2 inline-flex items-center gap-3 self-start folio !text-ink-700 group"
          style={{ '--rise-delay': '1.2s' } as CSSProperties}
        >
          <span className="scroll-dot inline-block" aria-hidden="true">↓</span>
          Scroll — the work speaks
        </a>
      </m.div>
    </section>
  );
}

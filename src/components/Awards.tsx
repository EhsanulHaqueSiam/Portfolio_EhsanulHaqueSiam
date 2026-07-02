import { useState, useEffect, useCallback, useRef } from 'react';
import { m, AnimatePresence, useReducedMotion } from 'framer-motion';
import { awards, getAchievementImage, hideImageOnError } from '../data/content';
import { SectionHeader } from './ui/SectionHeader';
import { OptimizedImage } from './ui/OptimizedImage';
import { CloseIcon, PlusIcon, ArrowRightIcon } from './ui/Icons';

const EASE = [0.16, 1, 0.3, 1] as const;

/** Catalog number for the archival plates: 07-01, 07-02, … */
const catNo = (index: number) => `07-${String(index + 1).padStart(2, '0')}`;

const isCertifiedEthicalHacker = (name: string) => /certified ethical hacker/i.test(name);

export function Awards() {
  const [selectedAward, setSelectedAward] = useState<number | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [instantMotion, setInstantMotion] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<Element | null>(null);
  const galleryDialogRef = useRef<HTMLDivElement>(null);
  const lightboxDialogRef = useRef<HTMLDivElement>(null);
  const lightboxCloseButtonRef = useRef<HTMLButtonElement>(null);
  const lightboxPreviousFocusRef = useRef<Element | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const isModalOpen = selectedAward !== null;
  const isLightboxOpen = lightboxIndex !== null;

  // Lock body scroll and stop Lenis while the gallery dialog is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      window.dispatchEvent(new Event('lenis:stop'));
    } else {
      document.body.style.overflow = '';
      window.dispatchEvent(new Event('lenis:start'));
    }
    return () => {
      document.body.style.overflow = '';
      window.dispatchEvent(new Event('lenis:start'));
    };
  }, [isModalOpen]);

  // Closing the dialog also resets the lightbox
  const closeModal = useCallback((instant = false) => {
    setInstantMotion(instant);
    setLightboxIndex(null);
    setSelectedAward(null);
  }, []);

  // Lightbox navigation
  const currentImages = selectedAward !== null ? awards[selectedAward].images : [];

  const goNext = useCallback((instant = false) => {
    if (currentImages.length === 0) return;
    setInstantMotion(instant);
    setLightboxIndex(prev => prev === null ? null : (prev + 1) % currentImages.length);
  }, [currentImages.length]);

  const goPrev = useCallback((instant = false) => {
    if (currentImages.length === 0) return;
    setInstantMotion(instant);
    setLightboxIndex(prev => prev === null ? null : (prev - 1 + currentImages.length) % currentImages.length);
  }, [currentImages.length]);

  // Keyboard support: Escape closes (lightbox first), arrows page the lightbox
  useEffect(() => {
    if (!isModalOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isLightboxOpen) {
          setInstantMotion(true);
          setLightboxIndex(null);
        } else {
          closeModal(true);
        }
      }
      if (isLightboxOpen) {
        if (e.key === 'ArrowRight') goNext(true);
        if (e.key === 'ArrowLeft') goPrev(true);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isModalOpen, isLightboxOpen, closeModal, goNext, goPrev]);

  // Focus management: save previous focus, focus close button, restore on close
  useEffect(() => {
    if (isModalOpen) {
      previousFocusRef.current = document.activeElement;
      // Wait an animation frame so the dialog exists before focusing
      requestAnimationFrame(() => closeButtonRef.current?.focus());
    } else if (previousFocusRef.current instanceof HTMLElement) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [isModalOpen]);

  // Lightbox focus management: focus its close button on open, restore focus
  // back into the gallery when only the lightbox closes (the gallery-level
  // effect above handles restoration when both close together)
  useEffect(() => {
    if (isLightboxOpen) {
      lightboxPreviousFocusRef.current = document.activeElement;
      // Wait an animation frame so the lightbox exists before focusing
      requestAnimationFrame(() => lightboxCloseButtonRef.current?.focus());
    } else {
      if (isModalOpen && lightboxPreviousFocusRef.current instanceof HTMLElement) {
        lightboxPreviousFocusRef.current.focus();
      }
      lightboxPreviousFocusRef.current = null;
    }
  }, [isLightboxOpen, isModalOpen]);

  // Focus trap: keep Tab cycling inside the topmost open dialog
  useEffect(() => {
    if (!isModalOpen) return;

    const handleTabTrap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const modal = isLightboxOpen ? lightboxDialogRef.current : galleryDialogRef.current;
      if (!modal) return;
      const focusable = modal.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleTabTrap);
    return () => window.removeEventListener('keydown', handleTabTrap);
  }, [isModalOpen, isLightboxOpen]);

  return (
    <section id="awards" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <SectionHeader
          number="07"
          name="AWARDS & CERTS"
          title={
            <>
              Awards &amp; <em>honours</em>
            </>
          }
          annotation={`CAT. ${catNo(0)}–${catNo(awards.length - 1)} · ARCHIVE`}
        />

        {/* Archival plate grid — asymmetric: first and last entries span two columns
            (keeps the 3-col layout gapless with the current 4-entry archive) */}
        <div className="grid auto-rows-max grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {awards.map((award, index) => {
            const spansTwo = index === 0 || index >= 3;
            const certified = isCertifiedEthicalHacker(award.name);

            return (
              <m.div
                key={award.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.7, ease: EASE, delay: Math.min(index * 0.08, 0.32) }}
                className={spansTwo ? 'sm:col-span-2 lg:col-span-2' : ''}
              >
                <button
                  type="button"
                  onClick={() => {
                    if (selectedAward === index) {
                      closeModal(false);
                      return;
                    }
                    setInstantMotion(false);
                    setSelectedAward(index);
                  }}
                  className="group glass-card relative flex h-full w-full cursor-pointer flex-col text-left hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion focus-visible:ring-offset-2 focus-visible:ring-offset-paper-100"
                >
                  {/* Cover plate — duotone develops to colour on hover */}
                  <div className="reg-marks relative m-3 sm:m-4">
                    <div className={`plate relative w-full ${spansTwo ? 'aspect-[4/3] sm:aspect-[16/9]' : 'aspect-[4/3]'}`}>
                      {award.images[0] && (
                        <OptimizedImage
                          src={getAchievementImage(award.images[0])}
                          alt={award.name}
                          fill
                          className="grayscale transition-[filter] duration-700 ease-out-expo group-hover:grayscale-0"
                        />
                      )}
                    </div>
                    {certified && (
                      <span
                        aria-hidden="true"
                        className="stamp absolute right-3 top-3 z-10 inline-block px-3.5 py-1.5 text-[11px]"
                      >
                        Certified
                      </span>
                    )}
                  </div>

                  {/* Catalog entry */}
                  <div className="flex flex-1 flex-col px-4 pb-5 sm:px-5 sm:pb-6">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-vermilion-400">
                        Cat. {catNo(index)}
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-600">
                        {award.category}
                      </span>
                    </div>

                    <span
                      className={`block font-display font-medium text-ink-900 ${
                        spansTwo ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
                      }`}
                    >
                      {award.name}
                      <span className="sr-only">, open gallery</span>
                    </span>

                    <p className="mb-5 mt-2 max-w-prose text-sm leading-relaxed text-ink-500">
                      {award.desc}
                    </p>

                    <span className="mt-auto flex items-center gap-2 border-t rule pt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-600 transition-colors duration-200 group-hover:text-vermilion-400">
                      <PlusIcon className="h-3.5 w-3.5" aria-hidden="true" />
                      View gallery · {award.images.length} {award.images.length === 1 ? 'plate' : 'plates'}
                    </span>
                  </div>
                </button>
              </m.div>
            );
          })}
        </div>

        {/* Closing rule — end of catalogue */}
        <div className="mt-10 flex items-baseline gap-0 border-t rule pt-3 sm:mt-12" aria-hidden="true">
          <span className="folio">End of catalogue</span>
          <span className="leader" />
          <span className="folio">{awards.length} entries · verified originals</span>
        </div>

        {/* Gallery dialog — paper sheet over deep ink overlay */}
        <AnimatePresence>
          {selectedAward !== null && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: shouldReduceMotion || instantMotion ? 0 : 0.15 }}
              ref={galleryDialogRef}
              role="dialog"
              aria-modal="true"
              aria-label={`${awards[selectedAward].name} gallery`}
              className="fixed inset-0 z-[200] flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center"
              onClick={() => closeModal(false)}
            >
              <m.div
                initial={{ scale: 0.98, opacity: 0, transform: 'translateY(20px)' }}
                animate={{ scale: 1, opacity: 1, transform: 'translateY(0px)' }}
                exit={{ scale: 0.98, opacity: 0, transform: 'translateY(20px)' }}
                transition={{ duration: shouldReduceMotion || instantMotion ? 0 : 0.25, ease: EASE }}
                className="relative max-h-[85vh] w-full overflow-y-auto rounded-t-2xl border border-white/10 bg-paper-50/95 p-5 shadow-plate-lg backdrop-blur-2xl sm:m-4 sm:max-h-[90vh] sm:max-w-5xl sm:rounded-2xl sm:p-8"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Mobile pull bar */}
                <div className="mx-auto mb-4 h-[3px] w-12 rounded-full bg-white/20 sm:hidden" aria-hidden="true" />

                {/* Close button */}
                <button
                  ref={closeButtonRef}
                  onClick={() => closeModal(false)}
                  aria-label="Close gallery"
                  className="press-feedback absolute right-4 top-4 z-10 flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border rule-strong text-ink-900 hover:bg-ink-900 hover:text-paper-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion"
                >
                  <CloseIcon />
                </button>

                {/* Catalog header */}
                <div className="mb-6 border-b rule pb-5 pr-14">
                  <p className="folio mb-3">
                    <span className="text-vermilion-400">Cat. {catNo(selectedAward)}</span>
                    <span aria-hidden="true"> / </span>
                    {awards[selectedAward].category} · {currentImages.length}{' '}
                    {currentImages.length === 1 ? 'plate' : 'plates'}
                  </p>
                  <h3 className="font-display text-2xl font-light text-ink-900 sm:text-3xl">
                    {awards[selectedAward].name}
                  </h3>
                  <p className="mt-3 max-w-prose text-sm leading-relaxed text-ink-600 sm:text-base">
                    {awards[selectedAward].desc}
                  </p>
                </div>

                {/* Plate index */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {awards[selectedAward].images.map((img, i) => (
                    <m.button
                      key={img}
                      type="button"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: shouldReduceMotion || instantMotion ? 0 : 0.4,
                        delay: shouldReduceMotion || instantMotion ? 0 : i * 0.05,
                        ease: EASE,
                      }}
                      onClick={() => {
                        setInstantMotion(false);
                        setLightboxIndex(i);
                      }}
                      aria-label={`View plate ${i + 1} of ${currentImages.length} full size`}
                      className="group press-feedback cursor-pointer rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion focus-visible:ring-offset-2 focus-visible:ring-offset-paper-100"
                    >
                      <div className="plate relative aspect-video border rule">
                        <OptimizedImage
                          src={getAchievementImage(img)}
                          alt={`${awards[selectedAward].name} - ${i + 1}`}
                          fill
                          className="grayscale transition-[filter] duration-500 ease-out-expo group-hover:grayscale-0"
                        />
                      </div>
                      <span className="mt-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-ink-500 transition-colors duration-200 group-hover:text-vermilion-400">
                        <span>Plate {String(i + 1).padStart(2, '0')}</span>
                        <PlusIcon className="h-3 w-3" aria-hidden="true" />
                      </span>
                    </m.button>
                  ))}
                </div>
              </m.div>
            </m.div>
          )}
        </AnimatePresence>

        {/* Lightbox overlay — deepest ink, hairline chrome, mono controls */}
        <AnimatePresence>
          {selectedAward !== null && lightboxIndex !== null && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: shouldReduceMotion || instantMotion ? 0 : 0.2 }}
              ref={lightboxDialogRef}
              role="dialog"
              aria-modal="true"
              aria-label={`Plate ${lightboxIndex + 1} of ${currentImages.length}`}
              className="fixed inset-0 z-[210] flex items-center justify-center bg-black/90 backdrop-blur-sm"
              onClick={() => {
                setInstantMotion(false);
                setLightboxIndex(null);
              }}
            >
              {/* Plate counter */}
              <div className="absolute left-1/2 top-5 z-10 -translate-x-1/2 font-mono text-xs uppercase tracking-[0.2em] text-ink-600">
                Plate {String(lightboxIndex + 1).padStart(2, '0')} / {String(currentImages.length).padStart(2, '0')}
              </div>

              {/* Close button */}
              <button
                ref={lightboxCloseButtonRef}
                onClick={() => {
                  setInstantMotion(false);
                  setLightboxIndex(null);
                }}
                aria-label="Close lightbox"
                className="press-feedback absolute right-4 top-4 z-10 flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/20 text-ink-900 hover:bg-ink-950 hover:text-paper-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion"
              >
                <CloseIcon />
              </button>

              {/* Previous button */}
              {currentImages.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); goPrev(false); }}
                  aria-label="Previous image"
                  className="press-feedback absolute left-2 top-1/2 z-10 flex h-11 w-11 min-h-[44px] min-w-[44px] -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-ink-900 hover:bg-ink-950 hover:text-paper-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion sm:left-4 sm:h-12 sm:w-12"
                >
                  <ArrowRightIcon className="h-5 w-5 rotate-180" />
                </button>
              )}

              {/* Next button */}
              {currentImages.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); goNext(false); }}
                  aria-label="Next image"
                  className="press-feedback absolute right-2 top-1/2 z-10 flex h-11 w-11 min-h-[44px] min-w-[44px] -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-ink-900 hover:bg-ink-950 hover:text-paper-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion sm:right-4 sm:h-12 sm:w-12"
                >
                  <ArrowRightIcon className="h-5 w-5" />
                </button>
              )}

              {/* Full-size plate */}
              <m.div
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: shouldReduceMotion || instantMotion ? 0 : 0.2, ease: EASE }}
                className="relative max-h-[85vh] max-w-[90vw]"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={getAchievementImage(currentImages[lightboxIndex])}
                  alt={`${awards[selectedAward].name} - ${lightboxIndex + 1}`}
                  className="max-h-[85vh] max-w-full rounded-xl border border-white/10 object-contain"
                  onError={hideImageOnError}
                />
              </m.div>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/**
 * Smooth-scroll to a section, then keep correcting the target.
 *
 * Sections use `content-visibility: auto` with a 700px intrinsic-size
 * placeholder, so the document grows as sections between here and the
 * target render in. A single scrollIntoView computes its destination
 * once and lands short; we re-issue it until the target settles at the
 * top (or the user takes over scrolling).
 */
export function scrollToSection(selector: string) {
  const el = document.querySelector(selector);
  if (!el) return;

  let tries = 0;
  let cancelled = false;

  const cancel = () => {
    cancelled = true;
    window.removeEventListener('wheel', cancel);
    window.removeEventListener('touchstart', cancel);
  };
  window.addEventListener('wheel', cancel, { passive: true });
  window.addEventListener('touchstart', cancel, { passive: true });

  const settle = () => {
    if (cancelled) return;
    const top = el.getBoundingClientRect().top;
    if (Math.abs(top) > 8 && tries++ < 8) {
      el.scrollIntoView({ behavior: 'smooth' });
      setTimeout(settle, 450);
    } else {
      cancel();
    }
  };

  el.scrollIntoView({ behavior: 'smooth' });
  setTimeout(settle, 600);
}

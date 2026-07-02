import { m, useScroll } from 'framer-motion';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <m.div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[100]"
      style={{
        scaleX: scrollYProgress,
        background: '#8B7CFF',
        boxShadow: '0 0 12px rgba(139,124,255,0.55)',
      }}
    />
  );
}

import { m, useScroll } from 'framer-motion';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <m.div
      aria-hidden="true"
      className="fixed left-0 right-0 top-0 z-[600] h-[2px] origin-left bg-foreground/70"
      style={{ scaleX: scrollYProgress }}
    />
  );
}

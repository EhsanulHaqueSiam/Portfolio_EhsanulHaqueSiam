import { m, useScroll } from 'framer-motion';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <m.div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2px] bg-vermilion origin-left z-[100]"
      style={{ scaleX: scrollYProgress }}
    />
  );
}

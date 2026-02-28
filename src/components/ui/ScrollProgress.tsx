import { m, useScroll } from 'framer-motion';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <m.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 via-violet-400 to-amber-500 origin-left z-[100]"
      style={{ scaleX: scrollYProgress }}
    />
  );
}

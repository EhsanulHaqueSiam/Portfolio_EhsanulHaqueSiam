import { useEffect, useRef, useState } from 'react';
import { m, useTransform, useScroll, useSpring } from 'framer-motion';
import { cn } from '../../lib/utils';

/**
 * Scroll-following gradient beam beside a content column (aceternity port).
 * The colored segment of the line tracks scroll progress with a spring.
 */
export const TracingBeam = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const contentRef = useRef<HTMLDivElement>(null);
  const [svgHeight, setSvgHeight] = useState(0);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const update = () => setSvgHeight(el.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const y1 = useSpring(useTransform(scrollYProgress, [0, 0.8], [50, svgHeight]), {
    stiffness: 500,
    damping: 90,
  });
  const y2 = useSpring(useTransform(scrollYProgress, [0, 1], [50, svgHeight - 200]), {
    stiffness: 500,
    damping: 90,
  });

  return (
    <m.div ref={ref} className={cn('relative mx-auto h-full w-full', className)}>
      <div className="absolute top-8 -left-11 md:-left-12 lg:-left-16 max-md:hidden">
        <div className="ml-[30px] sm:ml-[31px] flex h-2.5 w-2.5 sm:h-2 sm:w-2 items-center justify-center rounded-full border border-border shadow-sm">
          <div className="h-1 w-1 rounded-full border animate-pulse border-emerald-500 bg-emerald-400" />
        </div>
        <svg
          viewBox={`0 0 20 ${svgHeight}`}
          width="20"
          height={svgHeight}
          className="ml-4 block"
          aria-hidden="true"
        >
          <path
            d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.8} l -18 24V ${svgHeight}`}
            fill="none"
            stroke="#9091A0"
            strokeOpacity="0.16"
          />
          <path
            d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.8} l -18 24V ${svgHeight}`}
            fill="none"
            stroke="url(#tracing-gradient)"
            strokeWidth="1.25"
            className="motion-reduce:hidden"
          />
          <defs>
            <m.linearGradient
              id="tracing-gradient"
              gradientUnits="userSpaceOnUse"
              x1="0"
              x2="0"
              y1={y1}
              y2={y2}
            >
              <stop stopColor="#5dd9ff" stopOpacity="0" />
              <stop stopColor="#ffe499" />
              <stop offset="0.225" stopOpacity="0.9" stopColor="#ffb0fc" />
              <stop offset="0.325" stopColor="#8c7aff" />
              <stop offset="1" stopColor="#7ddfff" stopOpacity="0" />
            </m.linearGradient>
          </defs>
        </svg>
      </div>
      <div ref={contentRef}>{children}</div>
    </m.div>
  );
};

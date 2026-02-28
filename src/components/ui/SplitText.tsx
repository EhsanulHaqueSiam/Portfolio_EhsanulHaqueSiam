import { useRef, useMemo } from 'react';
import { m, useInView, Variants } from 'framer-motion';

interface SplitTextProps {
  children: string;
  className?: string;
  delay?: number;
  type?: 'chars' | 'words' | 'lines';
  animation?: 'fade' | 'slide' | 'reveal' | 'blur' | 'wave';
  stagger?: number;
  once?: boolean;
  charClassName?: string;
}

export function SplitText({
  children,
  className = '',
  delay = 0,
  type = 'chars',
  animation = 'reveal',
  stagger = 0.02,
  once = true,
  charClassName = '',
}: SplitTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once, margin: '-10%' });

  const elements = useMemo(() => {
    if (type === 'chars') {
      return children.split('');
    } else if (type === 'words') {
      return children.split(' ');
    } else {
      return children.split('\n');
    }
  }, [children, type]);

  const itemVariants = useMemo<Variants>(() => {
    switch (animation) {
      case 'fade':
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        };
      case 'slide':
        return {
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 },
        };
      case 'reveal':
        return {
          hidden: { y: '100%', opacity: 0 },
          visible: { y: '0%', opacity: 1 },
        };
      case 'blur':
        return {
          hidden: { opacity: 0, y: 20, scale: 0.95 },
          visible: { opacity: 1, y: 0, scale: 1 },
        };
      case 'wave':
        return {
          hidden: { y: 50, rotateX: -90, opacity: 0 },
          visible: { y: 0, rotateX: 0, opacity: 1 },
        };
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        };
    }
  }, [animation]);

  const containerVariants = useMemo<Variants>(() => ({
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  }), [stagger, delay]);

  return (
    <m.span
      ref={containerRef}
      className={`inline-block ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {elements.map((element, pos) => (
        <span
          key={`${pos}:${element}`}
          className={`inline-block overflow-hidden ${type === 'words' ? 'mr-[0.25em]' : ''}`}
          style={animation === 'wave' ? { perspective: 1000 } : undefined}
        >
          <m.span
            className={`inline-block ${charClassName}`}
            variants={itemVariants}
            transition={{
              duration: animation === 'wave' ? 0.6 : 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              transformOrigin: animation === 'wave' ? 'center bottom' : undefined,
              backgroundSize: charClassName ? `${elements.length * 100}% 100%` : undefined,
              backgroundPosition: charClassName
                ? `${elements.length > 1 ? (pos / (elements.length - 1)) * 100 : 0}% 0%`
                : undefined,
            }}
          >
            {element === ' ' ? '\u00A0' : element}
          </m.span>
        </span>
      ))}
    </m.span>
  );
}

// Reveal text with a mask/clip effect
interface RevealTextProps {
  children: string;
  className?: string;
  delay?: number;
  duration?: number;
}

export function RevealText({ children, className = '', delay = 0, duration = 1.2 }: RevealTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <m.div
        initial={{ y: '100%' }}
        animate={isInView ? { y: '0%' } : { y: '100%' }}
        transition={{
          duration,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </m.div>
    </div>
  );
}

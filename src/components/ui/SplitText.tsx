import { useRef, useEffect, useState, useMemo } from 'react';
import { motion, useInView, Variants } from 'framer-motion';

interface SplitTextProps {
  children: string;
  className?: string;
  delay?: number;
  type?: 'chars' | 'words' | 'lines';
  animation?: 'fade' | 'slide' | 'reveal' | 'blur' | 'wave';
  stagger?: number;
  once?: boolean;
}

export function SplitText({
  children,
  className = '',
  delay = 0,
  type = 'chars',
  animation = 'reveal',
  stagger = 0.02,
  once = true,
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

  const getVariants = (): Variants => {
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
          hidden: { opacity: 0, filter: 'blur(12px)', y: 20 },
          visible: { opacity: 1, filter: 'blur(0px)', y: 0 },
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
  };

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const itemVariants = getVariants();

  return (
    <motion.span
      ref={containerRef}
      className={`inline-block ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {elements.map((element, i) => (
        <span
          key={i}
          className={`inline-block overflow-hidden ${type === 'words' ? 'mr-[0.25em]' : ''}`}
          style={animation === 'wave' ? { perspective: 1000 } : undefined}
        >
          <motion.span
            className="inline-block"
            variants={itemVariants}
            transition={{
              duration: animation === 'wave' ? 0.6 : 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={animation === 'wave' ? { transformOrigin: 'center bottom' } : undefined}
          >
            {element === ' ' ? '\u00A0' : element}
          </motion.span>
        </span>
      ))}
    </motion.span>
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
      <motion.div
        initial={{ y: '100%' }}
        animate={isInView ? { y: '0%' } : { y: '100%' }}
        transition={{
          duration,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Scramble text effect
interface ScrambleTextProps {
  children: string;
  className?: string;
  scrambleSpeed?: number;
}

export function ScrambleText({ children, className = '', scrambleSpeed = 30 }: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(children);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()';

  useEffect(() => {
    if (!isInView) return;

    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        children
          .split('')
          .map((char, i) => {
            if (i < iteration) return children[i];
            if (char === ' ') return ' ';
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      if (iteration >= children.length) {
        clearInterval(interval);
      }
      iteration += 1 / 3;
    }, scrambleSpeed);

    return () => clearInterval(interval);
  }, [isInView, children, scrambleSpeed]);

  return (
    <span ref={ref} className={`font-mono ${className}`}>
      {displayText}
    </span>
  );
}

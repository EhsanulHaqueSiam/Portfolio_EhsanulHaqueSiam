import { ReactNode } from 'react';
import { motion, Variants } from 'framer-motion';

interface TextRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
}

// Character-by-character reveal
export function CharReveal({
  children,
  className = '',
  delay = 0,
  duration = 0.03,
}: TextRevealProps) {
  const text = typeof children === 'string' ? children : '';

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: duration,
        delayChildren: delay,
      },
    },
  };

  const charVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
      rotateX: -90,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <motion.span
      className={`inline-block ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
    >
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          variants={charVariants}
          style={{ transformOrigin: 'bottom' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

// Word-by-word reveal
export function WordReveal({
  children,
  className = '',
  delay = 0,
  duration = 0.08,
}: TextRevealProps) {
  const text = typeof children === 'string' ? children : '';

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: duration,
        delayChildren: delay,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 30,
      filter: 'blur(10px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 15,
      },
    },
  };

  return (
    <motion.span
      className={`inline-block ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
    >
      {text.split(' ').map((word, i) => (
        <motion.span key={i} className="inline-block mr-[0.25em]" variants={wordVariants}>
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

// Line reveal with mask
export function LineReveal({
  children,
  className = '',
  delay = 0,
}: TextRevealProps) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{
          duration: 0.8,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Blur fade in
export function BlurFade({
  children,
  className = '',
  delay = 0,
}: TextRevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, filter: 'blur(20px)', y: 20 }}
      whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

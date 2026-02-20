import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true); // Start true to prevent flash
  const isVisibleRef = useRef(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Dot follows cursor tightly
  const dotSpringConfig = { damping: 35, stiffness: 500, mass: 0.3 };
  const dotX = useSpring(cursorX, dotSpringConfig);
  const dotY = useSpring(cursorY, dotSpringConfig);

  // Ring trails behind with a softer, more elastic feel
  const ringSpringConfig = { damping: 20, stiffness: 150, mass: 0.8 };
  const ringX = useSpring(cursorX, ringSpringConfig);
  const ringY = useSpring(cursorY, ringSpringConfig);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
    if (!isVisibleRef.current) {
      isVisibleRef.current = true;
      setIsVisible(true);
    }
  }, [cursorX, cursorY]);

  const handleMouseDown = useCallback(() => setIsClicking(true), []);
  const handleMouseUp = useCallback(() => setIsClicking(false), []);

  const handleElementEnter = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const interactiveElements = ['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT'];
    const isInteractive =
      interactiveElements.includes(target.tagName) ||
      target.closest('a, button, [data-cursor], [role="button"]') ||
      target.classList.contains('cursor-pointer');

    if (isInteractive) {
      setIsHovering(true);
      const cursorData = target.getAttribute('data-cursor') ||
                        target.closest('[data-cursor]')?.getAttribute('data-cursor');
      if (cursorData) {
        setCursorText(cursorData);
      }
    }
  }, []);

  const handleElementLeave = useCallback(() => {
    setIsHovering(false);
    setCursorText('');
  }, []);

  const handleDocumentLeave = useCallback(() => {
    isVisibleRef.current = false;
    setIsVisible(false);
  }, []);

  const handleDocumentEnter = useCallback(() => {
    isVisibleRef.current = true;
    setIsVisible(true);
  }, []);

  // Detect touch device
  useEffect(() => {
    const checkTouch = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
      setIsTouchDevice(hasTouch && hasCoarsePointer);
    };

    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  // Mouse event listeners
  useEffect(() => {
    if (isTouchDevice) return;

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleElementEnter, true);
    document.addEventListener('mouseout', handleElementLeave, true);
    document.documentElement.addEventListener('mouseleave', handleDocumentLeave);
    document.documentElement.addEventListener('mouseenter', handleDocumentEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleElementEnter, true);
      document.removeEventListener('mouseout', handleElementLeave, true);
      document.documentElement.removeEventListener('mouseleave', handleDocumentLeave);
      document.documentElement.removeEventListener('mouseenter', handleDocumentEnter);
    };
  }, [isTouchDevice, handleMouseMove, handleMouseDown, handleMouseUp, handleElementEnter, handleElementLeave, handleDocumentLeave, handleDocumentEnter]);

  if (isTouchDevice) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Main cursor dot - follows tightly */}
          <motion.div
            className="fixed top-0 left-0 rounded-full bg-white pointer-events-none z-[9999] mix-blend-difference"
            style={{
              x: dotX,
              y: dotY,
              translateX: '-50%',
              translateY: '-50%',
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: isClicking ? 0.5 : isHovering ? 0.5 : 1,
              width: isHovering ? 8 : 12,
              height: isHovering ? 8 : 12,
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              opacity: { duration: 0.2 },
              scale: { type: 'spring', stiffness: 500, damping: 28 },
              width: { type: 'spring', stiffness: 500, damping: 28 },
              height: { type: 'spring', stiffness: 500, damping: 28 },
            }}
          />

          {/* Outer ring - trails behind elegantly */}
          <motion.div
            className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998] flex items-center justify-center"
            style={{
              x: ringX,
              y: ringY,
              translateX: '-50%',
              translateY: '-50%',
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              width: isHovering ? 80 : 40,
              height: isHovering ? 80 : 40,
              scale: isClicking ? 0.85 : 1,
              borderWidth: isHovering ? 2 : 1,
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              opacity: { duration: 0.2 },
              width: { type: 'spring', stiffness: 200, damping: 25 },
              height: { type: 'spring', stiffness: 200, damping: 25 },
              scale: { type: 'spring', stiffness: 400, damping: 25 },
              borderWidth: { duration: 0.2 },
            }}
          >
            {/* Ring border with gradient effect */}
            <div
              className="absolute inset-0 rounded-full transition-all duration-300"
              style={{
                border: isHovering
                  ? '2px solid rgba(139, 92, 246, 0.6)'
                  : '1px solid rgba(139, 92, 246, 0.25)',
                boxShadow: isHovering
                  ? '0 0 20px rgba(139, 92, 246, 0.3), inset 0 0 20px rgba(139, 92, 246, 0.1)'
                  : 'none',
              }}
            />

            {/* Background fill on hover */}
            <motion.div
              className="absolute inset-0 rounded-full bg-violet-500/10"
              initial={{ scale: 0 }}
              animate={{ scale: isHovering ? 1 : 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            />

            {/* Cursor text */}
            <AnimatePresence>
              {cursorText && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.5, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5, y: -5 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="relative z-10 text-[11px] font-semibold text-violet-300 uppercase tracking-wider"
                >
                  {cursorText}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Subtle glow effect on hover */}
          <AnimatePresence>
            {isHovering && (
              <motion.div
                className="fixed top-0 left-0 rounded-full pointer-events-none z-[9997]"
                style={{
                  x: ringX,
                  y: ringY,
                  translateX: '-50%',
                  translateY: '-50%',
                }}
                initial={{ opacity: 0, scale: 0.5, width: 80, height: 80 }}
                animate={{ opacity: 0.15, scale: 1.5, width: 100, height: 100 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ type: 'spring', stiffness: 150, damping: 20 }}
              >
                <div className="w-full h-full rounded-full bg-violet-500 blur-xl" />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}

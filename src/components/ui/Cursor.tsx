import { useEffect, useReducer, useCallback, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';

interface CursorState {
  isHovering: boolean;
  isClicking: boolean;
  cursorText: string;
  isVisible: boolean;
  isTouchDevice: boolean;
}

type CursorAction =
  | { type: 'SET_CLICKING'; payload: boolean }
  | { type: 'SET_VISIBLE'; payload: boolean }
  | { type: 'SET_TOUCH_DEVICE'; payload: boolean }
  | { type: 'HOVER_ENTER'; text: string }
  | { type: 'HOVER_LEAVE' };

function cursorReducer(state: CursorState, action: CursorAction): CursorState {
  switch (action.type) {
    case 'SET_CLICKING':
      return { ...state, isClicking: action.payload };
    case 'SET_VISIBLE':
      return { ...state, isVisible: action.payload };
    case 'SET_TOUCH_DEVICE':
      return { ...state, isTouchDevice: action.payload };
    case 'HOVER_ENTER':
      return { ...state, isHovering: true, cursorText: action.text };
    case 'HOVER_LEAVE':
      return { ...state, isHovering: false, cursorText: '' };
    default:
      return state;
  }
}

const initialCursorState: CursorState = {
  isHovering: false,
  isClicking: false,
  cursorText: '',
  isVisible: false,
  isTouchDevice: true,
};

export function CustomCursor() {
  const [state, dispatch] = useReducer(cursorReducer, initialCursorState);
  const { isHovering, isClicking, cursorText, isVisible, isTouchDevice } = state;
  const isVisibleRef = useRef(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // Position via CSS custom properties — survives React re-renders because
  // React does not know about them and won't reconcile them away.
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (dotRef.current) {
      dotRef.current.style.setProperty('--cx', `${e.clientX}px`);
      dotRef.current.style.setProperty('--cy', `${e.clientY}px`);
    }
    if (ringRef.current) {
      ringRef.current.style.setProperty('--cx', `${e.clientX}px`);
      ringRef.current.style.setProperty('--cy', `${e.clientY}px`);
    }
    if (!isVisibleRef.current) {
      isVisibleRef.current = true;
      dispatch({ type: 'SET_VISIBLE', payload: true });
    }
  }, []);

  const handleMouseDown = useCallback(() => dispatch({ type: 'SET_CLICKING', payload: true }), []);
  const handleMouseUp = useCallback(() => dispatch({ type: 'SET_CLICKING', payload: false }), []);

  const handleElementEnter = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const interactiveElements = ['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT'];
    const isInteractive =
      interactiveElements.includes(target.tagName) ||
      target.closest('a, button, [data-cursor], [role="button"]') ||
      target.classList.contains('cursor-pointer');

    if (isInteractive) {
      const cursorData = target.getAttribute('data-cursor') ||
                        target.closest('[data-cursor]')?.getAttribute('data-cursor');
      dispatch({ type: 'HOVER_ENTER', text: cursorData || '' });
    }
  }, []);

  const handleElementLeave = useCallback((e: MouseEvent) => {
    const relatedTarget = e.relatedTarget as HTMLElement | null;
    if (relatedTarget?.closest('a, button, [data-cursor], [role="button"]')) return;
    dispatch({ type: 'HOVER_LEAVE' });
  }, []);

  const handleDocumentLeave = useCallback(() => {
    isVisibleRef.current = false;
    dispatch({ type: 'SET_VISIBLE', payload: false });
  }, []);

  const handleDocumentEnter = useCallback(() => {
    isVisibleRef.current = true;
    dispatch({ type: 'SET_VISIBLE', payload: true });
  }, []);

  useEffect(() => {
    const checkTouch = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
      dispatch({ type: 'SET_TOUCH_DEVICE', payload: hasTouch && hasCoarsePointer });
    };
    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

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

  const dotSize = isHovering ? 8 : 12;
  const ringSize = isHovering ? 80 : 40;

  return (
    <AnimatePresence>
      {isVisible && (
        <m.div
          key="cursor-group"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Dot — instant tracking via CSS custom properties, no transition on position */}
          <div
            ref={dotRef}
            className="fixed top-0 left-0 rounded-full bg-white pointer-events-none z-[9999] mix-blend-difference"
            style={{
              width: dotSize,
              height: dotSize,
              transform: 'translate(var(--cx, -100px), var(--cy, -100px)) translate(-50%, -50%)',
              transition: 'width 0.15s ease, height 0.15s ease, scale 0.12s ease',
              scale: isClicking ? 0.5 : isHovering ? 0.5 : 1,
            }}
          />

          {/* Ring — trails behind via CSS transition on transform (compositor thread) */}
          <div
            ref={ringRef}
            className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998] flex items-center justify-center"
            style={{
              width: ringSize,
              height: ringSize,
              border: isHovering
                ? '2px solid rgba(139, 92, 246, 0.6)'
                : '1px solid rgba(139, 92, 246, 0.25)',
              boxShadow: isHovering
                ? '0 0 20px rgba(139, 92, 246, 0.3), inset 0 0 20px rgba(139, 92, 246, 0.1)'
                : 'none',
              backgroundColor: isHovering ? 'rgba(139, 92, 246, 0.08)' : 'transparent',
              // Position via CSS var — survives re-renders. Transition creates the trailing effect.
              transform: 'translate(var(--cx, -100px), var(--cy, -100px)) translate(-50%, -50%)',
              transition: 'transform 0.18s cubic-bezier(0.25, 1, 0.5, 1), width 0.3s cubic-bezier(0.22, 1, 0.36, 1), height 0.3s cubic-bezier(0.22, 1, 0.36, 1), border 0.25s ease, box-shadow 0.3s ease, background-color 0.25s ease, scale 0.15s ease',
              scale: isClicking ? 0.85 : 1,
            }}
          >
            <AnimatePresence>
              {cursorText && (
                <m.span
                  initial={{ opacity: 0, scale: 0.5, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5, y: -5 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="relative z-10 text-[11px] font-semibold text-violet-300 uppercase tracking-wider whitespace-nowrap"
                >
                  {cursorText}
                </m.span>
              )}
            </AnimatePresence>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}

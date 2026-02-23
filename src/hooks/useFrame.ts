import { useEffect, useRef } from 'react';

const MAX_CONSECUTIVE_ERRORS = 5;

export function useFrame(callback: (time: number) => void) {
  const requestRef = useRef<number>();
  const callbackRef = useRef(callback);
  const errorCountRef = useRef(0);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const animate = (time: number) => {
      try {
        callbackRef.current(time);
        errorCountRef.current = 0;
      } catch (e) {
        errorCountRef.current++;
        console.error('useFrame callback error:', e);
        if (errorCountRef.current >= MAX_CONSECUTIVE_ERRORS) {
          console.error(`useFrame stopped after ${MAX_CONSECUTIVE_ERRORS} consecutive errors`);
          return;
        }
      }
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);
}

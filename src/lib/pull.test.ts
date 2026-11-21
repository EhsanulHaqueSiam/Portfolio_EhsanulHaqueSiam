import { act, renderHook } from '@testing-library/react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { expect, test, vi } from 'vitest';
import { usePull } from './pull';

const ev = (clientX: number, clientY: number) =>
  ({ button: 0, pointerId: 1, pointerType: 'mouse', clientX, clientY, currentTarget: { setPointerCapture() {} } }) as unknown as ReactPointerEvent<HTMLElement>;

test('follows the pointer by the follow factor while held, and goes home on release', () => {
  vi.stubGlobal('matchMedia', () => ({ matches: true })); // reduced motion: release snaps home at once
  const onRelease = vi.fn();
  const { result } = renderHook(() => usePull({ follow: 0.5, stiffness: 100, damping: 10, onRelease }));
  const { x, y, handlers } = result.current;

  act(() => {
    handlers.onPointerDown(ev(100, 100));
    handlers.onPointerMove(ev(140, 80));
  });
  expect([x.get(), y.get()]).toEqual([20, -10]);

  act(() => handlers.onPointerUp());
  expect([x.get(), y.get()]).toEqual([0, 0]);
  expect(onRelease).toHaveBeenCalledTimes(1);

  // Moves after release are ignored, and a second release is a no-op.
  act(() => {
    handlers.onPointerMove(ev(300, 300));
    handlers.onPointerCancel();
  });
  expect(x.get()).toBe(0);
  expect(onRelease).toHaveBeenCalledTimes(1);
  vi.unstubAllGlobals();
});

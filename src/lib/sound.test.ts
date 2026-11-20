import { act, renderHook } from '@testing-library/react';
import { beforeEach, expect, test, vi } from 'vitest';

// A stand-in AudioContext that starts suspended and runs once resumed, like a browser before a gesture.
class FakeAudioContext extends EventTarget {
  state: AudioContextState = 'suspended';
  sampleRate = 44100;
  currentTime = 0;
  destination = {};
  resume() {
    this.state = 'running';
    this.dispatchEvent(new Event('statechange'));
    return Promise.resolve();
  }
  createBuffer() {
    return { getChannelData: () => new Float32Array(1) };
  }
  createBufferSource() {
    return { connect: () => ({}), start() {} };
  }
  createOscillator() {
    const node = { type: '', frequency: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }, start() {}, stop() {}, connect: (n: unknown) => n };
    return node;
  }
  createGain() {
    return { gain: { setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect: (n: unknown) => n };
  }
}

beforeEach(() => {
  vi.resetModules();
  localStorage.clear();
  Object.assign(window, { AudioContext: FakeAudioContext });
});

const press = () => window.dispatchEvent(new Event('pointerdown'));

test('sound is on by default and the speaker flips it between on and off only', async () => {
  const { toggleSound, useSoundOn } = await import('./sound');
  const { result } = renderHook(() => useSoundOn());
  // On before any press, even though the browser has not unlocked audio yet.
  expect(result.current).toBe(true);

  await act(async () => {
    press();
    toggleSound();
  });
  expect(result.current).toBe(false);
  expect(localStorage.getItem('sound')).toBe('off');

  await act(async () => toggleSound());
  expect(result.current).toBe(true);
  expect(localStorage.getItem('sound')).toBe('on');
});

test('a saved off survives a reload', async () => {
  localStorage.setItem('sound', 'off');
  const { useSoundOn } = await import('./sound');
  const { result } = renderHook(() => useSoundOn());
  expect(result.current).toBe(false);
});

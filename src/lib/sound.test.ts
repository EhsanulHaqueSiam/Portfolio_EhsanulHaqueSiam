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

test('the click that unlocks audio on the speaker keeps sound on; the next one mutes', async () => {
  const { toggleSound, useSoundState } = await import('./sound');
  const { result } = renderHook(() => useSoundState());
  expect(result.current).toBe('locked');

  await act(async () => {
    press();
    toggleSound();
  });
  expect(result.current).toBe('on');

  await act(async () => {
    press();
    toggleSound();
  });
  expect(result.current).toBe('off');
  expect(localStorage.getItem('sound')).toBe('off');
});

test('once audio already runs, the speaker toggles at once, even right after another click', async () => {
  const { toggleSound, useSoundState } = await import('./sound');
  const { result } = renderHook(() => useSoundState());
  await act(async () => {
    press(); // a click elsewhere unlocks audio
  });
  expect(result.current).toBe('on');
  await act(async () => {
    press();
    toggleSound();
  });
  expect(result.current).toBe('off');
});

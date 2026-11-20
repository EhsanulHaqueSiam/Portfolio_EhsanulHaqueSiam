// Tiny synthesized UI sounds (Web Audio, no files), tuned after samworks.vercel.app:
// one short sine tick that glides down, played at different pitches.
// Browsers start audio only inside a click, tap or key press, so sound is
// "locked" until the first one; hovering before that stays silent.
// The on/off choice persists in localStorage `sound`.
import { useSyncExternalStore } from 'react';

const KEY = 'sound';
// C major pentatonic: any run of notes from it sounds fine.
const SCALE = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.51, 1567.98, 1760];

export type SoundState = 'off' | 'locked' | 'on';

let ctx: AudioContext | null = null;
let enabled = true;
let running = false;
let lockedGestureAt = -Infinity;
let lastTick = 0;
const listeners = new Set<() => void>();
const emit = () => {
  for (const l of listeners) l();
};

function getCtx(): AudioContext | null {
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
    ctx.addEventListener('statechange', () => {
      running = ctx?.state === 'running';
      emit();
    });
  }
  return ctx;
}

if (typeof window !== 'undefined') {
  try {
    enabled = localStorage.getItem(KEY) !== 'off';
  } catch {
    /* storage blocked: keep default */
  }
  // iOS Safari only unlocks once something actually plays inside the gesture.
  const types = ['pointerdown', 'pointerup', 'click', 'touchend', 'keydown'] as const;
  const unlock = (e: Event) => {
    if (e instanceof KeyboardEvent && e.key === 'Escape') return;
    if (!running && (e.type === 'pointerdown' || e.type === 'keydown')) lockedGestureAt = performance.now();
    const a = getCtx();
    if (!a) return;
    if (a.state !== 'running') a.resume().catch(() => {});
    const blip = a.createBufferSource();
    blip.buffer = a.createBuffer(1, 1, a.sampleRate);
    blip.connect(a.destination);
    blip.start(0);
    if (a.state === 'running') for (const t of types) removeEventListener(t, unlock, true);
  };
  for (const t of types) addEventListener(t, unlock, { capture: true, passive: true });
}

function live(): AudioContext | null {
  return enabled && running ? ctx : null;
}

function tone(freq: number, dur: number, gain: number, glide = 0.8) {
  const a = live();
  if (!a) return;
  const t = a.currentTime;
  const osc = a.createOscillator();
  const filter = a.createBiquadFilter();
  const amp = a.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, t);
  osc.frequency.exponentialRampToValueAtTime(freq * glide, t + dur);
  filter.type = 'lowpass';
  filter.frequency.value = 3000;
  filter.Q.value = 0.7;
  amp.gain.setValueAtTime(gain, t);
  amp.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(filter).connect(amp).connect(a.destination);
  osc.start(t);
  osc.stop(t + dur + 0.01);
}

export const sound = {
  /** The hover tick. Rate-limited so sweeping down a list doesn't buzz. */
  tick: () => {
    const now = performance.now();
    if (now - lastTick < 45) return;
    lastTick = now;
    tone(1000, 0.045, 0.06);
  },
  /** A firmer, lower tick for presses. */
  click: () => tone(640, 0.06, 0.08, 0.75),
  /** The tick pitched to the i-th note, for rows of chips and the dock. */
  note: (i: number) => {
    const now = performance.now();
    if (now - lastTick < 45) return;
    lastTick = now;
    tone(SCALE[((i % SCALE.length) + SCALE.length) % SCALE.length], 0.09, 0.05, 0.9);
  },
  /** Opening rises, closing falls. */
  open: (isOpen: boolean) => tone(isOpen ? 760 : 560, 0.07, 0.06, isOpen ? 1.25 : 0.8),
  /** Soft filtered-noise sweep for the theme reveal. */
  whoosh: () => {
    const a = live();
    if (!a) return;
    const len = Math.ceil(a.sampleRate * 0.45);
    const buf = a.createBuffer(1, len, a.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const src = a.createBufferSource();
    const filter = a.createBiquadFilter();
    const amp = a.createGain();
    const t = a.currentTime;
    src.buffer = buf;
    filter.type = 'bandpass';
    filter.Q.value = 0.9;
    filter.frequency.setValueAtTime(400, t);
    filter.frequency.exponentialRampToValueAtTime(2400, t + 0.4);
    amp.gain.setValueAtTime(0, t);
    amp.gain.linearRampToValueAtTime(0.05, t + 0.08);
    amp.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
    src.connect(filter).connect(amp).connect(a.destination);
    src.start(t);
  },
};

const state = (): SoundState => (!enabled ? 'off' : running ? 'on' : 'locked');

/**
 * The speaker button's click. The same click that unlocks audio must not also
 * mute it, so a press within a moment of unlocking keeps sound on.
 */
export function toggleSound() {
  // The click that starts audio began while it was still locked: keep sound on.
  const unlockingClick = performance.now() - lockedGestureAt < 1000;
  lockedGestureAt = -Infinity;
  enabled = unlockingClick ? true : !enabled;
  try {
    localStorage.setItem(KEY, enabled ? 'on' : 'off');
  } catch {
    /* storage blocked: still applies for this visit */
  }
  emit();
  if (enabled) {
    getCtx()
      ?.resume()
      .then(() => {
        running = true; // statechange may land after this
        tone(880, 0.08, 0.07, 1.25);
      })
      .catch(() => {});
  }
}

export function useSoundState(): SoundState {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    state,
    () => 'on',
  );
}

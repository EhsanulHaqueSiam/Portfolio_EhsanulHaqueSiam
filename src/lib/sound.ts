// Tiny synthesized UI sounds (Web Audio, no audio files). Silent until the
// first user gesture (browsers block audio before one) and while toggled off.
// The on/off choice persists in localStorage `sound`; React reads it through
// `useSoundEnabled`.
import { useSyncExternalStore } from 'react';

const KEY = 'sound';
// C major pentatonic, two octaves: any sequence of notes sounds fine.
const SCALE = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.51, 1567.98, 1760];

let ctx: AudioContext | null = null;
let unlocked = false;
let enabled = true;
let lastNote = 0;
const listeners = new Set<() => void>();

if (typeof window !== 'undefined') {
  try {
    enabled = localStorage.getItem(KEY) !== 'off';
  } catch {
    /* storage blocked: keep default */
  }
  // Browsers only start audio inside a gesture, and iOS Safari only once something
  // actually plays in it. So every gesture until audio runs plays one silent sample.
  const types = ['pointerdown', 'pointerup', 'click', 'touchend', 'keydown'] as const;
  const unlock = (e: Event) => {
    if (e instanceof KeyboardEvent && e.key === 'Escape') return;
    unlocked = true;
    const a = audio();
    if (!a) return;
    const blip = a.createBufferSource();
    blip.buffer = a.createBuffer(1, 1, a.sampleRate);
    blip.connect(a.destination);
    blip.start(0);
    if (a.state === 'running') for (const t of types) removeEventListener(t, unlock, true);
  };
  for (const t of types) addEventListener(t, unlock, { capture: true, passive: true });
}

function audio(): AudioContext | null {
  if (!enabled || !unlocked) return null;
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

type ToneOpts = { dur?: number; gain?: number; type?: OscillatorType; to?: number; lowpass?: number };

function tone(freq: number, { dur = 0.25, gain = 0.03, type = 'sine', to, lowpass = 3000 }: ToneOpts = {}) {
  const a = audio();
  if (!a) return;
  const t = a.currentTime;
  const osc = a.createOscillator();
  const filter = a.createBiquadFilter();
  const amp = a.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t + dur);
  filter.type = 'lowpass';
  filter.frequency.value = lowpass;
  amp.gain.setValueAtTime(0, t);
  amp.gain.linearRampToValueAtTime(gain, t + 0.006);
  amp.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(filter).connect(amp).connect(a.destination);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

// A 30ms band-passed noise burst: reads as a tick or a paper rustle.
function burst(freq: number, gain: number, q = 1.2) {
  const a = audio();
  if (!a) return;
  const buf = a.createBuffer(1, Math.ceil(a.sampleRate * 0.03), a.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length) ** 4;
  const src = a.createBufferSource();
  const filter = a.createBiquadFilter();
  const amp = a.createGain();
  src.buffer = buf;
  filter.type = 'bandpass';
  filter.frequency.value = freq;
  filter.Q.value = q;
  amp.gain.value = gain;
  src.connect(filter).connect(amp).connect(a.destination);
  src.start();
}

export const sound = {
  tick: () => burst(2600, 0.05),
  click: () => {
    burst(2200, 0.08);
    tone(880, { to: 440, dur: 0.09, gain: 0.02 });
  },
  /** Plays the i-th note of the scale; rate-limited so sweeping a row of items stays musical. */
  note: (i: number) => {
    const now = performance.now();
    if (now - lastNote < 60) return;
    lastNote = now;
    const f = SCALE[((i % SCALE.length) + SCALE.length) % SCALE.length];
    tone(f, { dur: 0.5, gain: 0.024, type: 'triangle', lowpass: 2400 });
    tone(f * 2, { dur: 0.28, gain: 0.005 });
  },
  paper: (open: boolean) => {
    burst(open ? 900 : 650, 0.12, 0.6);
    setTimeout(() => burst(open ? 1100 : 820, 0.06, 0.7), 50);
  },
  /** Soft filtered-noise sweep for the theme reveal. */
  whoosh: () => {
    const a = audio();
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
  toggle: (on: boolean) => {
    tone(on ? 660 : 520, { dur: 0.12, gain: 0.03 });
    setTimeout(() => tone(on ? 990 : 390, { dur: 0.18, gain: 0.03 }), 70);
  },
};

export function setSoundEnabled(next: boolean) {
  enabled = next;
  try {
    localStorage.setItem(KEY, next ? 'on' : 'off');
  } catch {
    /* storage blocked: still applies for this visit */
  }
  if (next) {
    unlocked = true; // the toggle click itself is a gesture
    sound.toggle(true);
  }
  for (const l of listeners) l();
}

export function useSoundEnabled() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => enabled,
    () => true,
  );
}

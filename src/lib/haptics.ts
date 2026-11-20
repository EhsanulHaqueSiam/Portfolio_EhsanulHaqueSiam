import { WebHaptics } from 'web-haptics';

// web-haptics (haptics.lochie.me): Vibration API patterns on Android, the hidden
// `<input switch>` trick on iOS Safari. Touch devices only, created on first use.
let instance: WebHaptics | null = null;

type Feel = 'tap' | 'nudge' | 'success';
const PATTERNS = { tap: [{ duration: 10, intensity: 0.4 }], nudge: 'nudge', success: 'success' } as const;

/** A light tap by default; `nudge` for toggles and switches, `success` for a completed copy. */
export function haptic(feel: Feel | unknown = 'tap') {
  if (typeof window === 'undefined' || !matchMedia('(pointer: coarse)').matches) return;
  instance ??= new WebHaptics();
  const key: Feel = feel === 'nudge' || feel === 'success' ? feel : 'tap';
  instance.trigger(PATTERNS[key] as Parameters<WebHaptics['trigger']>[0]).catch(() => {});
}

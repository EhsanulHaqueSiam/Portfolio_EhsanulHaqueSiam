import { WebHaptics } from 'web-haptics';

// web-haptics (haptics.lochie.me): Vibration API patterns on Android, the hidden
// `<input switch>` trick on iOS Safari. Touch devices only, created on first use.
let instance: WebHaptics | null = null;

/** `rigid` for taps, `selection` for toggles and switches, `success` for a completed copy. */
export function haptic(feel: 'rigid' | 'selection' | 'success' = 'rigid') {
  if (typeof window === 'undefined' || !matchMedia('(pointer: coarse)').matches) return;
  instance ??= new WebHaptics();
  instance.trigger(feel).catch(() => {});
}

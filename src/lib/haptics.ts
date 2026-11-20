// A light tap of haptic feedback on touch devices. Call from inside a user
// gesture (click/pointerup). Android uses the Vibration API; iOS Safari (18+)
// has none, but toggling a native `<input switch>` fires the system haptic,
// so a hidden one is clicked through its label.
let iosSwitch: HTMLLabelElement | null = null;

export function haptic() {
  if (typeof window === 'undefined' || !matchMedia('(pointer: coarse)').matches) return;
  if (typeof navigator.vibrate === 'function') {
    navigator.vibrate(8);
    return;
  }
  if (!iosSwitch) {
    iosSwitch = document.createElement('label');
    iosSwitch.setAttribute('aria-hidden', 'true');
    iosSwitch.style.cssText = 'position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;overflow:hidden';
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.setAttribute('switch', '');
    input.tabIndex = -1;
    iosSwitch.append(input);
    document.body.append(iosSwitch);
  }
  iosSwitch.click();
}

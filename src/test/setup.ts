import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

declare global {
  var __UI_SDK_STRICT__: boolean | undefined;
}
globalThis.__UI_SDK_STRICT__ = true;

// jsdom gaps ui-sdk needs filled (from node_modules/@ui-sdk/core/skills/ui-sdk/references/testing.md).
HTMLElement.prototype.showPopover = () => {};
HTMLElement.prototype.hidePopover = () => {};
Element.prototype.getAnimations = () => [];
Element.prototype.scrollIntoView = () => {};
Element.prototype.checkVisibility = () => true;
Element.prototype.getClientRects = () => [] as unknown as DOMRectList;
document.elementFromPoint = () => null;
document.elementsFromPoint = () => [];
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
// The page also uses these browser APIs.
globalThis.IntersectionObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
} as unknown as typeof IntersectionObserver;
window.matchMedia ??= (query: string) =>
  ({ matches: false, media: query, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, onchange: null }) as unknown as MediaQueryList;

afterEach(cleanup);

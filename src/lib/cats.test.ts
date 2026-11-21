import { beforeEach, expect, test, vi } from 'vitest';

beforeEach(() => {
  vi.resetModules();
  localStorage.clear();
});

test('a cat counts once, the hunt is remembered, and junk in storage is ignored', async () => {
  localStorage.setItem('cats-found', JSON.stringify(['banner', 'not-a-cat']));
  const { findCat, CATS } = await import('./cats');
  findCat('menu');
  findCat('menu');
  findCat('banner');
  expect(JSON.parse(localStorage.getItem('cats-found') ?? '[]').sort()).toEqual(['banner', 'menu']);
  expect(CATS).toHaveLength(5);
});

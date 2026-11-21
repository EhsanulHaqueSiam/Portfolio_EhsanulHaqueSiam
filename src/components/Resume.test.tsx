import { act, render, screen } from '@testing-library/react';
import { domAnimation, LazyMotion } from 'framer-motion';
import { afterEach, expect, test } from 'vitest';
import { Resume } from './Resume';

afterEach(() => history.replaceState(null, '', '/'));

test('a "#resume" link opens the CV even when a client router swallows the click and pushStates the hash', async () => {
  // What Astro's client router does with a same-page hash link: no default navigation, no hashchange.
  const router = (e: MouseEvent) => {
    const a = (e.target as Element).closest('a');
    if (!a) return;
    e.preventDefault();
    history.pushState(null, '', a.getAttribute('href'));
  };
  document.addEventListener('click', router);
  render(
    <LazyMotion features={domAnimation}>
      <a href="#resume">CV</a>
      <Resume />
    </LazyMotion>,
  );
  expect(screen.queryByRole('dialog', { name: 'Résumé' })).toBeNull();

  await act(async () => {
    screen.getByText('CV').click();
    await new Promise((r) => requestAnimationFrame(() => r(null)));
  });
  expect(screen.getByRole('dialog', { name: 'Résumé' })).toBeTruthy();
  document.removeEventListener('click', router);
});

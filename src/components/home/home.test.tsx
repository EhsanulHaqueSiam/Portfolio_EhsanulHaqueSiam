import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createAgent } from '@ui-sdk/react/agent';
import { domAnimation, LazyMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { describe, expect, test } from 'vitest';
import { featuredProjects } from '../../data/content';
import type { OpenSourceRepo } from '../../data/opensource';
import { GlideList } from '../../lib/useGlide';
import { Nav } from './chrome';
import { OpenSource } from './OpenSource';
import { shortRange } from './Rows';
import { formatBibtex } from '../../data/papers';
import type { Project } from '../../data/types';
import { ribbon, Shipped } from './Shipped';
import { Stack } from './StackActivity';

const wrap = (ui: ReactNode) => render(<LazyMotion features={domAnimation}>{ui}</LazyMotion>);

const repos: OpenSourceRepo[] = [
  { name: 'T3 Code', repo: 'pingdotgg/t3code', logo: 't3', stars: 1, prs: [{ number: 1, title: 'fix: one', state: 'merged' }] },
  { name: 'Better Auth', repo: 'better-auth/better-auth', logo: 'betterAuth', stars: 1, prs: [{ number: 2, title: 'feat: two', state: 'merged', note: 'co-author' }] },
];

describe('projects', () => {
  test('cards show first; the view control switches to the list and back', async () => {
    const user = userEvent.setup();
    wrap(<Shipped />);
    const view = screen.getByRole('radiogroup', { name: 'Project view' });
    expect(within(view).getByRole('radio', { name: 'Cards' })).toBeChecked();
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(4);

    await user.click(within(view).getByRole('radio', { name: 'List' }));
    expect(screen.queryAllByRole('heading', { level: 3 })).toHaveLength(0);
    expect(screen.getByRole('link', { name: /12,000\+ scholarships indexed daily/ })).toHaveAttribute('href', '/projects/scholarhub/'); // has a case study, so it opens that

    await user.keyboard('{ArrowLeft}');
    expect(within(view).getByRole('radio', { name: 'Cards' })).toBeChecked();
  });

  test('show all expands the cards to every featured project', async () => {
    const user = userEvent.setup();
    wrap(<Shipped />);
    const more = screen.getByRole('button', { name: `Show all ${featuredProjects.length}` });
    expect(more).toHaveAttribute('aria-expanded', 'false');
    await user.click(more);
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(featuredProjects.length);
    expect(screen.getByRole('button', { name: 'Show fewer' })).toHaveAttribute('aria-expanded', 'true');
  });
});

describe('open source', () => {
  test('the first repo starts open and each trigger toggles its pull requests', async () => {
    const user = userEvent.setup();
    wrap(<OpenSource repos={repos} />);
    const t3 = screen.getByRole('button', { name: /^T3 Code: 1 star, 1 pull request, 1 merged/ });
    const ba = screen.getByRole('button', { name: /^Better Auth:/ });
    expect(t3).toHaveAttribute('aria-expanded', 'true');
    expect(ba).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('link', { name: 'fix: one, merged pull request #1' })).toHaveAttribute('href', 'https://github.com/pingdotgg/t3code/pull/1');

    await user.click(ba);
    expect(ba).toHaveAttribute('aria-expanded', 'true');
    expect(await screen.findByRole('link', { name: 'feat: two (co-author), merged pull request #2' })).toBeInTheDocument();
  });
});

describe('tech stack', () => {
  test('a category filter narrows the chips', async () => {
    const user = userEvent.setup();
    wrap(<Stack />);
    const filter = screen.getByRole('radiogroup', { name: 'Filter skills' });
    expect(screen.getByText('Scikit-learn')).toBeInTheDocument();
    await user.click(within(filter).getByRole('radio', { name: 'Mobile' }));
    expect(screen.getByText('Android SDK')).toBeInTheDocument();
    expect(screen.queryByText('Scikit-learn')).not.toBeInTheDocument();
  });
});

describe('nav', () => {
  test('only the page itself is marked current; detail pages mark their parent as current', () => {
    const { rerender } = wrap(<Nav current="publications" />);
    expect(screen.getByRole('link', { name: 'Research' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current');

    rerender(
      <LazyMotion features={domAnimation}>
        <Nav current="paper" />
      </LazyMotion>,
    );
    expect(screen.getByRole('link', { name: 'Research' })).toHaveAttribute('aria-current', 'true');
  });
});

describe('glide highlight', () => {
  test('follows keyboard focus between rows and hides when focus leaves', () => {
    render(
      <GlideList>
        <li>
          <a href="#a">A</a>
        </li>
        <li>
          <a href="#b">B</a>
        </li>
      </GlideList>,
    );
    const pill = document.querySelector<HTMLElement>('.glide');
    act(() => screen.getByRole('link', { name: 'B' }).focus());
    expect(pill?.style.opacity).toBe('1');
    act(() => screen.getByRole('link', { name: 'B' }).blur());
    expect(pill?.style.opacity).toBe('0');
  });
});

describe('helpers', () => {
  test('ribbons show reach numbers only', () => {
    const p = (metrics: string[]) => ({ metrics }) as Project;
    expect(ribbon(p(['12,000+ scholarships indexed daily']))).toBe('12,000+ scholarships');
    expect(ribbon(p(['45+ active users']))).toBe('45+ active users');
    expect(ribbon(p(['12+ filter facets with pagination']))).toBeNull();
    expect(ribbon(p(['React 19 + Rust/Axum']))).toBeNull();
  });

  test('BibTeX from doi.org gets one field per line and every ampersand escaped', () => {
    const raw = ' @inproceedings{X_2026, title={A &amp;amp; B}, booktitle={C &amp; D}, year={2026} }';
    expect(formatBibtex(raw)).toBe('@inproceedings{X_2026,\n  title={A \\& B},\n  booktitle={C \\& D},\n  year={2026}\n}');
  });

  test('shortRange folds a shared year and says now for present roles', () => {
    expect(shortRange('Jun 2026–Present')).toBe('Jun 2026 – now');
    expect(shortRange('Apr 2026–May 2026')).toBe('Apr – May 2026');
    expect(shortRange('Aug 2025–May 2026')).toBe('Aug 2025 – May 2026');
  });
});

test('an agent can find and use every ui-sdk control on the page', async () => {
  const agent = createAgent();
  wrap(
    <>
      <Shipped />
      <OpenSource repos={repos} />
      <Stack />
    </>,
  );
  const entries = agent.snapshot().filter((e) => !e.offPage && e.component !== 'more');
  for (const e of entries) expect(e.label, `${e.component} ${e.ref} has no name`).toBeTruthy();
  const labels = entries.map((e) => e.label);
  for (const label of ['Project view', 'Filter skills', 'T3 Code: 1 star, 1 pull request, 1 merged', 'Better Auth: 1 star, 1 pull request, 1 merged']) {
    expect(labels, `${label} is missing`).toContain(label);
  }

  let result: Awaited<ReturnType<typeof agent.act>> | undefined;
  await act(async () => {
    result = await agent.act({
      steps: [
        { ref: 'Project view', action: 'setValue', args: ['list'] },
        { ref: 'Filter skills', action: 'setValue', args: ['Tools'] },
      ],
    });
  });
  expect(result?.ok, result?.error?.message).toBe(true);
  expect(screen.getByRole('radio', { name: 'List' })).toBeChecked();
  expect(screen.getByRole('radio', { name: 'Tools' })).toBeChecked();
});

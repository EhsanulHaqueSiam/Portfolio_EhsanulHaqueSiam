import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import { navigate } from 'astro:transitions/client';
import { caseStudies, experience, paperSlug, profile, projectSlug, publications, workSlug } from '../../data/content';
import { findCat } from '../../lib/cats';
import { haptic } from '../../lib/haptics';
import { togglePlain, usePlain } from '../../lib/plain';
import { sound, toggleSound, useSoundOn } from '../../lib/sound';
import { isDark, subscribeTheme, toggleTheme } from '../ui/ThemeToggle';

type Group = 'Go to' | 'Projects' | 'Papers' | 'Work' | 'Actions';
/** `run` may return a word to show in place of the hint before the menu closes ("Copied"). */
type Command = { group: Group; label: string; hint?: string; secret?: boolean; run: () => string | undefined | Promise<string | undefined> };

const go = (href: string) => () => {
  navigate(href);
  return undefined;
};

const SECTIONS: Array<[string, string]> = [
  ['Home', '/'],
  ['AI in Production', '/#ai-work'],
  ['Projects', '/#projects'],
  ['Open Source', '/#open-source'],
  ['Experience', '/#experience'],
  ['Research', '/publications/'],
  ['Contact', '/#contact'],
];

function commands(soundOn: boolean, dark: boolean, plain: boolean): Command[] {
  return [
    ...SECTIONS.map(([label, href]): Command => ({ group: 'Go to', label, run: go(href) })),
    ...caseStudies.map((p): Command => ({ group: 'Projects', label: p.name, hint: 'case study', run: go(`/projects/${projectSlug(p)}/`) })),
    ...publications.map((p): Command => ({ group: 'Papers', label: p.title, run: go(`/publications/${paperSlug(p)}/`) })),
    ...experience.filter((e) => e.showInHome).map((e): Command => ({ group: 'Work', label: e.company, hint: e.role, run: go(`/work/${workSlug(e)}/`) })),
    {
      group: 'Actions',
      label: 'Copy email',
      hint: profile.email,
      run: () =>
        navigator.clipboard?.writeText(profile.email).then(
          () => 'Copied',
          () => 'Copy failed',
        ) ?? 'Copy failed',
    },
    {
      group: 'Actions',
      label: 'Open CV',
      run: () => {
        location.hash = 'resume';
        return undefined;
      },
    },
    {
      group: 'Actions',
      label: soundOn ? 'Turn sound off' : 'Turn sound on',
      run: () => {
        toggleSound();
        return undefined;
      },
    },
    {
      group: 'Actions',
      label: plain ? 'Full version' : 'Plain version',
      hint: plain ? 'motion and sound back on' : 'no motion, sound or extras',
      run: () => {
        togglePlain();
        return undefined;
      },
    },
    // Only shows when the query mentions it: one of the hidden cats (lib/cats.ts).
    {
      group: 'Actions',
      label: 'Pet the cat',
      secret: true,
      run: () => {
        findCat('menu');
        return 'meow';
      },
    },
    {
      group: 'Actions',
      label: dark ? 'Switch to light theme' : 'Switch to dark theme',
      run: () => {
        toggleTheme();
        return undefined;
      },
    },
    {
      group: 'Actions',
      label: 'GitHub profile',
      hint: `@${profile.github.split('/').pop()}`,
      run: () => {
        window.open(profile.github, '_blank', 'noopener');
        return undefined;
      },
    },
  ];
}

/** Every word of the query must appear somewhere in the command; secret commands need the query to name them. */
const matches = (c: Command, q: string) => {
  if (c.secret && !/\bcat/i.test(q)) return false;
  const hay = `${c.label} ${c.group} ${c.hint ?? ''}`.toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .every((w) => hay.includes(w));
};

/**
 * The ⌘K menu (pattern from incident.io, Searchable and Base44 on Mobbin): jump to a section,
 * paper or role, or run an action, from the keyboard. A native <dialog>, so focus stays inside
 * and Esc closes it; the input is a combobox over a listbox, so screen readers follow the
 * highlighted row. Opened by ⌘K / Ctrl K anywhere, or by its header button.
 */
export function CommandMenu() {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [done, setDone] = useState<{ label: string; word: string } | null>(null);
  const soundOn = useSoundOn();
  const dark = useSyncExternalStore(subscribeTheme, isDark, () => true);
  const plain = usePlain();
  const id = useId();

  // A secret command the query names goes first, so Enter runs it.
  const shown = commands(soundOn, dark, plain)
    .filter((c) => matches(c, query.trim()))
    .sort((x, y) => Number(Boolean(y.secret)) - Number(Boolean(x.secret)));
  const at = Math.min(active, Math.max(shown.length - 1, 0));

  const open = () => {
    const d = dialog.current;
    if (!d || d.open) return;
    setQuery('');
    setActive(0);
    setDone(null);
    d.showModal();
    sound.open(true);
    haptic('selection');
  };
  const close = () => {
    if (!dialog.current?.open) return;
    dialog.current.close();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (dialog.current?.open) close();
        else open();
      }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  });

  // Keep the highlighted row in view while arrowing through a long list.
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-run when the highlighted row changes
  useEffect(() => {
    list.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [at, query]);

  const run = async (c: Command | undefined) => {
    if (!c) return;
    sound.click();
    haptic();
    const word = await c.run();
    if (!word) return close();
    setDone({ label: c.label, word });
    setTimeout(close, 700);
  };

  let group: Group | null = null;
  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-label="Search and commands"
        aria-keyshortcuts="Meta+K Control+K"
        title="Search and commands (⌘K)"
        className="press group grid h-8 w-8 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="icon-pop h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="6.5" />
          <path d="m20 20-4-4" />
        </svg>
      </button>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: the click only closes on the backdrop; Esc already closes a modal dialog */}
      <dialog
        ref={dialog}
        aria-label="Search and commands"
        onClose={() => sound.open(false)}
        onClick={(e) => e.target === e.currentTarget && close()}
        className="cmdk m-0 mx-auto mt-[12vh] w-[min(560px,calc(100vw-32px))] max-w-none overflow-hidden rounded-xl border border-border bg-card p-0 text-foreground shadow-[0_24px_60px_rgb(0_0_0/0.5)]"
      >
        <div className="flex items-center gap-2.5 border-b border-border px-3.5">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="6.5" />
            <path d="m20 20-4-4" />
          </svg>
          <input
            ref={input}
            role="combobox"
            aria-label="Search sections, papers and actions"
            aria-expanded="true"
            aria-controls={`${id}-list`}
            aria-activedescendant={shown.length ? `${id}-${at}` : undefined}
            aria-autocomplete="list"
            autoComplete="off"
            spellCheck={false}
            placeholder="Type a command or search…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                const step = e.key === 'ArrowDown' ? 1 : -1;
                setActive((at + step + shown.length) % Math.max(shown.length, 1));
              } else if (e.key === 'Enter') {
                e.preventDefault();
                run(shown[at]);
              }
            }}
            className="h-12 min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
          />
          <kbd className="rounded border border-border px-1.5 font-mono text-[11px] text-muted-foreground">esc</kbd>
        </div>
        <span aria-live="polite" className="sr-only">
          {done?.word}
        </span>
        <div ref={list} id={`${id}-list`} role="listbox" aria-label="Results" className="max-h-[min(360px,55vh)] overflow-y-auto overscroll-contain p-1.5">
          {shown.length === 0 && <p className="px-3 py-6 text-center text-[13px] text-muted-foreground">Nothing matches “{query.trim()}”</p>}
          {shown.map((c, i) => {
            const head = c.group !== group;
            group = c.group;
            return (
              <div key={`${c.group}-${c.label}`}>
                {head && (
                  <p aria-hidden="true" className="px-2.5 pb-1 pt-2.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">
                    {c.group}
                  </p>
                )}
                {/* biome-ignore lint/a11y/useKeyWithClickEvents: keyboard selection goes through the combobox input (arrows + Enter) */}
                <div
                  id={`${id}-${i}`}
                  role="option"
                  // Focus stays in the input (aria-activedescendant); -1 only marks the row as an option target.
                  tabIndex={-1}
                  aria-selected={i === at}
                  onMouseMove={() => {
                    if (i === at) return;
                    setActive(i);
                    sound.tick();
                  }}
                  onClick={() => run(c)}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-[14px] text-foreground/80 aria-selected:bg-secondary aria-selected:text-foreground"
                >
                  <span className="min-w-0 flex-1 truncate">{c.label}</span>
                  {(done?.label === c.label ? done.word : c.hint) && (
                    <span className={`shrink-0 truncate font-mono text-[11px] ${done?.label === c.label ? 'text-signal-success' : 'text-muted-foreground'} max-w-[45%]`}>
                      {done?.label === c.label ? done.word : c.hint}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div aria-hidden="true" className="hidden justify-end gap-4 border-t border-border px-3.5 py-2 font-mono text-[11px] text-muted-foreground sm:flex">
          <span>↑↓ to move</span>
          <span>↵ to select</span>
          <span>esc to close</span>
        </div>
      </dialog>
    </>
  );
}

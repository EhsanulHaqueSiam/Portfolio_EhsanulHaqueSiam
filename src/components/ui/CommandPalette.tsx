import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { navItems, profile } from '../../data/content';
import {
  GitHubIcon,
  LinkedInIcon,
  EmailIcon,
  CopyIcon,
  CheckIcon,
  ResumeIcon,
  DownloadIcon,
  ArrowRightIcon,
} from './Icons';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Anywhere in the app: dispatch this event to open the palette. */
export const OPEN_PALETTE_EVENT = 'open-command-palette';

interface Command {
  id: string;
  group: 'Navigate' | 'Actions' | 'Connect';
  label: string;
  hint?: string;
  keywords?: string;
  icon: React.ReactNode;
  run: () => void | Promise<void>;
  /** Keep the palette open after running (e.g. copy feedback) */
  keepOpen?: boolean;
}

function matches(query: string, cmd: Command): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = `${cmd.label} ${cmd.group} ${cmd.hint ?? ''} ${cmd.keywords ?? ''}`.toLowerCase();
  // Every space-separated token must appear somewhere
  return q.split(/\s+/).every((token) => haystack.includes(token));
}

/**
 * Ctrl/Cmd+K command palette. Jump to any section, copy the email address,
 * open the resume, or hit a social profile without touching the mouse.
 * Client-only by design; renders nothing until opened.
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setActive(0);
    setCopied(false);
  }, []);

  const commands = useMemo<Command[]>(() => {
    const go = (href: string) => () => {
      close();
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
      history.replaceState(null, '', href);
    };
    const nav: Command[] = navItems.map((item) => ({
      id: `nav-${item.href}`,
      group: 'Navigate',
      label: item.label,
      hint: item.no,
      keywords: 'go to jump section',
      icon: <ArrowRightIcon className="h-4 w-4" />,
      run: go(item.href),
    }));
    return [
      ...nav,
      {
        id: 'copy-email',
        group: 'Actions',
        label: copied ? 'Email copied' : 'Copy email address',
        hint: profile.email,
        keywords: 'mail clipboard contact',
        icon: copied ? <CheckIcon className="h-4 w-4 text-emerald-500" /> : <CopyIcon className="h-4 w-4" />,
        keepOpen: true,
        run: async () => {
          try {
            await navigator.clipboard.writeText(profile.email);
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
          } catch {
            window.location.href = `mailto:${profile.email}`;
          }
        },
      },
      {
        id: 'view-resume',
        group: 'Actions',
        label: 'View resume',
        hint: 'overlay',
        keywords: 'cv resume open',
        icon: <ResumeIcon className="h-4 w-4" />,
        run: () => {
          close();
          window.location.hash = 'resume';
        },
      },
      {
        id: 'download-resume',
        group: 'Actions',
        label: 'Download resume PDF',
        hint: 'pdf',
        keywords: 'cv download save',
        icon: <DownloadIcon className="h-4 w-4" />,
        run: () => {
          close();
          const a = document.createElement('a');
          a.href = '/resume.pdf';
          a.download = 'Ehsanul_Haque_Siam_Resume.pdf';
          a.click();
        },
      },
      {
        id: 'email',
        group: 'Connect',
        label: 'Send an email',
        hint: profile.email,
        keywords: 'mail hire contact talk',
        icon: <EmailIcon className="h-4 w-4" />,
        run: () => {
          close();
          window.location.href = `mailto:${profile.email}`;
        },
      },
      {
        id: 'github',
        group: 'Connect',
        label: 'GitHub',
        hint: 'EhsanulHaqueSiam',
        keywords: 'code repos open source',
        icon: <GitHubIcon className="h-4 w-4" />,
        run: () => {
          close();
          window.open(profile.github, '_blank', 'noopener');
        },
      },
      {
        id: 'linkedin',
        group: 'Connect',
        label: 'LinkedIn',
        hint: 'EhsanulHaqueSiam',
        keywords: 'profile network hire',
        icon: <LinkedInIcon className="h-4 w-4" />,
        run: () => {
          close();
          window.open(profile.linkedin, '_blank', 'noopener');
        },
      },
    ];
  }, [close, copied]);

  const filtered = useMemo(() => commands.filter((c) => matches(query, c)), [commands, query]);

  // Global shortcuts: Ctrl/Cmd+K toggles, custom event opens
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, onOpen);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpen);
    };
  }, []);

  // Focus input + lock scroll while open
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Clamp active index when the list shrinks
  useEffect(() => {
    setActive((a) => Math.min(a, Math.max(0, filtered.length - 1)));
  }, [filtered.length]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => (a + 1) % Math.max(filtered.length, 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => (a - 1 + Math.max(filtered.length, 1)) % Math.max(filtered.length, 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const cmd = filtered[active];
      if (cmd) void cmd.run();
    }
  };

  // Keep the active row in view
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  let lastGroup = '';

  return (
    <AnimatePresence>
      {open && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: EASE }}
          className="fixed inset-0 z-[90] flex items-start justify-center px-4 pt-[16vh] bg-background/70 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <m.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="glass-chrome w-full max-w-xl overflow-hidden rounded-2xl"
            onKeyDown={onKeyDown}
          >
            <div className="flex items-center gap-3 border-b border-border px-5">
              <span className="text-muted-foreground" aria-hidden="true">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" strokeLinecap="round" />
                </svg>
              </span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                placeholder="Jump to a section, copy email, open resume..."
                className="h-14 w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                aria-label="Search commands"
                autoComplete="off"
                spellCheck={false}
              />
              <kbd className="hidden shrink-0 rounded-md border border-border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground sm:block">
                esc
              </kbd>
            </div>

            <div
              ref={listRef}
              className="max-h-[46vh] overflow-y-auto overscroll-contain py-2"
              role="listbox"
              aria-label="Commands"
            >
              {filtered.length === 0 && (
                <p className="px-5 py-8 text-center font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  No matches for "{query}"
                </p>
              )}
              {filtered.map((cmd, i) => {
                const showGroup = cmd.group !== lastGroup;
                lastGroup = cmd.group;
                return (
                  <div key={cmd.id}>
                    {showGroup && (
                      <p className="px-5 pb-1.5 pt-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground" aria-hidden="true">
                        {cmd.group}
                      </p>
                    )}
                    <button
                      type="button"
                      data-index={i}
                      role="option"
                      aria-selected={i === active}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => void cmd.run()}
                      className={`flex w-full items-center gap-3.5 px-5 py-3 text-left transition-colors duration-150 ${
                        i === active ? 'bg-secondary/70 text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      <span className={i === active ? 'text-foreground' : 'text-muted-foreground'}>
                        {cmd.icon}
                      </span>
                      <span className="flex-1 text-sm">{cmd.label}</span>
                      {cmd.hint && (
                        <span className="hidden max-w-[200px] truncate font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground sm:block">
                          {cmd.hint}
                        </span>
                      )}
                      {i === active && (
                        <kbd className="hidden rounded-md border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:block">
                          ↵
                        </kbd>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between border-t border-border px-5 py-2.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">↑↓ navigate · ↵ select</span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{profile.name}</span>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}

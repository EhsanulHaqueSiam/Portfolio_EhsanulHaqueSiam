import { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { m, useInView } from 'framer-motion';
import { GitHubIcon } from './Icons';

const DAYS = 7;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_LABELS = ['', 'M', '', 'W', '', 'F', ''];
const GITHUB_USERNAME = 'EhsanulHaqueSiam';
const API_URL = `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`;

const CELL = 10;
const GAP = 2;
const STEP = CELL + GAP;
const LABEL_W = 20;

function formatTooltipDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return `${SHORT_DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface ApiResponse {
  total: { lastYear: number };
  contributions: ContributionDay[];
}

interface CellData { level: number; count: number; date: string }

// Convert flat contributions array into weeks grid (7 days per week)
function toWeeksGrid(contributions: ContributionDay[]): CellData[][] {
  const weeks: CellData[][] = [];
  let currentWeek: CellData[] = [];

  for (const day of contributions) {
    currentWeek.push({ level: day.level, count: day.count, date: day.date });
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }
  return weeks;
}

function getMonthLabels(contributions: ContributionDay[], visibleWeeks: number): { label: string; col: number }[] {
  const totalDays = contributions.length;
  const startIdx = Math.max(0, totalDays - visibleWeeks * 7);
  const labels: { label: string; col: number }[] = [];
  let lastMonth = -1;

  for (let i = startIdx; i < totalDays; i += 7) {
    const weekIdx = Math.floor((i - startIdx) / 7);
    const month = new Date(contributions[i].date).getMonth();
    if (month !== lastMonth) {
      labels.push({ label: MONTHS[month], col: weekIdx });
      lastMonth = month;
    }
  }
  return labels;
}

// Activity ramp: faint base, brightening through emerald like GitHub's own.
const FILL_CLASSES = [
  'fill-foreground/[0.07]',
  'fill-emerald-500/30',
  'fill-emerald-500/50',
  'fill-emerald-500/75',
  'fill-emerald-400',
];

const LEGEND_BG = [
  'bg-foreground/[0.07]',
  'bg-emerald-500/30',
  'bg-emerald-500/50',
  'bg-emerald-500/75',
  'bg-emerald-400',
];

export function GitHubGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphAreaRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-10%' });
  const [hoveredCell, setHoveredCell] = useState<{ week: number; day: number; count: number; date: string } | null>(null);
  const [visibleWeeks, setVisibleWeeks] = useState(52);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  // Fetch real contribution data from public API
  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function loadData() {
      try {
        const response = await fetch(API_URL, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const json = await response.json() as ApiResponse;
        if (cancelled) return;
        setData(json);
        setLoadError(false);
      } catch (error) {
        if (cancelled) return;
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setData(null);
        setLoadError(true);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  // Measure container width to compute visible weeks
  useEffect(() => {
    function measure() {
      if (!graphAreaRef.current) return;
      const width = graphAreaRef.current.clientWidth;
      const available = width - LABEL_W - 4;
      setVisibleWeeks(Math.max(20, Math.min(52, Math.floor(available / STEP))));
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Slice contributions to visible weeks
  const contributions = useMemo(() => {
    if (!data) return [];
    const totalDays = data.contributions.length;
    const neededDays = visibleWeeks * 7;
    const sliced = data.contributions.slice(Math.max(0, totalDays - neededDays));
    return sliced;
  }, [data, visibleWeeks]);

  const weeks = useMemo(() => toWeeksGrid(contributions), [contributions]);
  const monthLabels = useMemo(
    () => data ? getMonthLabels(data.contributions, visibleWeeks) : [],
    [data, visibleWeeks],
  );

  const totalContributions = data?.total?.lastYear ?? 0;

  const handleMouseEnter = useCallback((week: number, day: number, count: number, date: string) => {
    setHoveredCell({ week, day, count, date });
  }, []);
  const handleMouseLeave = useCallback(() => {
    setHoveredCell(null);
  }, []);

  // Is a cell adjacent to (within 1 step of) the hovered cell?
  const isNeighbor = useCallback((wk: number, dy: number) => {
    if (!hoveredCell) return false;
    const dw = Math.abs(wk - hoveredCell.week);
    const dd = Math.abs(dy - hoveredCell.day);
    return dw <= 1 && dd <= 1 && !(dw === 0 && dd === 0);
  }, [hoveredCell]);

  const displayWeeks = weeks.length || visibleWeeks;
  const graphWidth = LABEL_W + displayWeeks * STEP;
  const graphHeight = DAYS * STEP - GAP;

  return (
    <div
      ref={containerRef}
      className="glass-card relative flex h-full flex-col justify-center p-4 sm:p-5"
    >
      {/* Header */}
      <div className="mb-2.5 flex items-center justify-between gap-3">
        <a
          href={`https://github.com/${GITHUB_USERNAME}`}
          target="_blank"
          rel="me noopener noreferrer"
          className="inline-flex min-h-[44px] items-center gap-1.5 px-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground sm:text-xs"
          aria-label={`GitHub profile of ${GITHUB_USERNAME} (opens in new tab)`}
        >
          <GitHubIcon className="h-3.5 w-3.5" />
          <span className="link-underline">@{GITHUB_USERNAME}</span>
        </a>
        {totalContributions > 0 && (
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground sm:text-xs">
            {totalContributions.toLocaleString()} contributions
          </span>
        )}
      </div>

      {/* Graph */}
      <div ref={graphAreaRef} className="relative">
        {weeks.length > 0 ? (
          <svg
            width="100%"
            viewBox={`0 0 ${graphWidth} ${graphHeight + 14}`}
            className="block"
          >
            {/* Month labels */}
            {monthLabels.map(({ label, col }, i) => (
              <text
                key={`${label}-${i}`}
                x={LABEL_W + col * STEP}
                y={8}
                className="fill-muted-foreground font-mono"
                fontSize="8"
              >
                {label}
              </text>
            ))}

            {/* Day labels */}
            {DAY_LABELS.map((label, i) =>
              label ? (
                <text
                  key={i}
                  x={0}
                  y={14 + i * STEP + CELL * 0.75}
                  className="fill-muted-foreground font-mono"
                  fontSize="8"
                >
                  {label}
                </text>
              ) : null,
            )}

            {/* Column highlight — faint ink wash on hovered column */}
            {hoveredCell && (
              <m.rect
                x={LABEL_W + hoveredCell.week * STEP - 1}
                y={14}
                width={CELL + 2}
                height={graphHeight}
                className="fill-foreground/[0.05]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              />
            )}

            {/* Cells */}
            {weeks.map((week, weekIdx) =>
              week.map((day, dayIdx) => {
                const isHovered = hoveredCell?.week === weekIdx && hoveredCell?.day === dayIdx;
                const neighbor = isNeighbor(weekIdx, dayIdx);
                const x = LABEL_W + weekIdx * STEP;
                const y = 14 + dayIdx * STEP;
                const level = Math.min(day.level, 4);

                return (
                  <g key={`${weekIdx}-${dayIdx}`}>
                    {/* Hairline emerald ring on the hovered cell */}
                    {isHovered && level > 0 && (
                      <m.rect
                        x={x - 2}
                        y={y - 2}
                        rx={3}
                        width={CELL + 4}
                        height={CELL + 4}
                        className="fill-transparent stroke-emerald-400/60"
                        strokeWidth={1}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.15 }}
                        style={{ transformOrigin: `${x + CELL / 2}px ${y + CELL / 2}px` }}
                      />
                    )}
                    <m.rect
                      x={x}
                      y={y}
                      rx={2}
                      width={CELL}
                      height={CELL}
                      strokeWidth={0.75}
                      className={`cursor-crosshair ${FILL_CLASSES[level]}`}
                      initial={{ opacity: 0 }}
                      animate={
                        isInView
                          ? {
                              opacity: neighbor && level > 0 ? 1 : 1,
                              scale: isHovered ? 1.35 : 1,
                              filter: neighbor && level > 0 ? 'brightness(0.92)' : 'brightness(1)',
                            }
                          : { opacity: 0 }
                      }
                      transition={{
                        opacity: { duration: 0.3, delay: weekIdx * 0.006 },
                        scale: { type: 'spring', stiffness: 500, damping: 25 },
                        filter: { duration: 0.2 },
                      }}
                      style={{ transformOrigin: `${x + CELL / 2}px ${y + CELL / 2}px` }}
                      onMouseEnter={() => handleMouseEnter(weekIdx, dayIdx, day.count, day.date)}
                      onMouseLeave={handleMouseLeave}
                    />
                  </g>
                );
              }),
            )}

            {/* Floating tooltip inside SVG */}
            {hoveredCell && (
              <foreignObject
                x={Math.max(0, Math.min(
                  LABEL_W + hoveredCell.week * STEP + CELL / 2 - 60,
                  graphWidth - 120
                ))}
                y={Math.max(0, 14 + hoveredCell.day * STEP - 28)}
                width={120}
                height={24}
                className="pointer-events-none"
                style={{ overflow: 'visible' }}
              >
                <m.div
                  className="flex items-center justify-center"
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.1 }}
                >
                  <div className="whitespace-nowrap rounded-md border border-border bg-card px-2 py-1 shadow-md">
                    <span className="font-mono text-[8px] uppercase tracking-[0.06em] text-muted-foreground">
                      <span className="font-semibold text-emerald-500">{hoveredCell.count}</span>
                      {' '}· {formatTooltipDate(hoveredCell.date)}
                    </span>
                  </div>
                </m.div>
              </foreignObject>
            )}
          </svg>
        ) : (
          /* Loading skeleton */
          <div className="flex h-[100px] items-center justify-center">
            <span className={`font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground ${isLoading ? 'animate-pulse' : ''}`}>
              {isLoading
                ? 'Loading contributions...'
                : loadError
                  ? 'Contribution activity unavailable'
                  : 'No contributions to display'}
            </span>
          </div>
        )}
      </div>

      {/* Legend */}
      {weeks.length > 0 && (
        <div className="mt-2 flex items-center justify-end gap-1">
          <span className="mr-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Less</span>
          {LEGEND_BG.map((bg, i) => (
            <div key={i} className={`h-[9px] w-[9px] rounded-[2px] ${bg}`} />
          ))}
          <span className="ml-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">More</span>
        </div>
      )}
    </div>
  );
}

import { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { useInView } from 'framer-motion';
import { GitHubIcon } from './Icons';
import { GlowingEffect } from './GlowingEffect';
import { SpotlightGlow } from './SpotlightGlow';

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
const TOP_PAD = 14;

function formatTooltipDate(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
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

interface Hovered { week: number; day: number; count: number; date: string }

/**
 * The full cell grid as plain SVG rects, memoized so hover-state changes never
 * touch it. Reveal is a CSS opacity transition staggered per week — the old
 * per-cell framer springs (364 of them) were a measurable scroll-jank source.
 */
function CellGrid({ weeks, visible }: { weeks: CellData[][]; visible: boolean }) {
  return useMemo(
    () => (
      <g>
        {weeks.map((week, weekIdx) =>
          week.map((day, dayIdx) => (
            <rect
              key={`${weekIdx}-${dayIdx}`}
              x={LABEL_W + weekIdx * STEP}
              y={TOP_PAD + dayIdx * STEP}
              rx={2}
              width={CELL}
              height={CELL}
              className={FILL_CLASSES[Math.min(day.level, 4)]}
              style={{
                opacity: visible ? 1 : 0,
                transition: 'opacity 0.3s ease',
                transitionDelay: `${weekIdx * 6}ms`,
              }}
            />
          )),
        )}
      </g>
    ),
    [weeks, visible],
  );
}

export function GitHubGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphAreaRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-10%' });
  const [hoveredCell, setHoveredCell] = useState<Hovered | null>(null);
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

  // Measure container width to compute visible weeks. ResizeObserver (not a
  // window resize listener) so a mount inside a content-visibility-skipped
  // subtree re-measures once the section actually gets laid out.
  useEffect(() => {
    const el = graphAreaRef.current;
    if (!el) return;
    function measure() {
      const width = el!.clientWidth;
      if (!width) return;
      const available = width - LABEL_W - 4;
      setVisibleWeeks(Math.max(20, Math.min(52, Math.floor(available / STEP))));
    }
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
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

  // One delegated pointer handler on the SVG instead of 364 per-cell
  // listeners: map pointer position back into grid coordinates.
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      const svg = svgRef.current;
      if (!svg || weeks.length === 0) return;
      const rect = svg.getBoundingClientRect();
      const scale = (LABEL_W + weeks.length * STEP) / rect.width;
      const gx = (e.clientX - rect.left) * scale - LABEL_W;
      const gy = (e.clientY - rect.top) * scale - TOP_PAD;
      const week = Math.floor(gx / STEP);
      const day = Math.floor(gy / STEP);
      if (week < 0 || week >= weeks.length || day < 0 || day >= DAYS || gx % STEP > CELL || gy % STEP > CELL) {
        setHoveredCell((h) => (h === null ? h : null));
        return;
      }
      const cell = weeks[week]?.[day];
      if (!cell) return;
      setHoveredCell((h) =>
        h && h.week === week && h.day === day ? h : { week, day, count: cell.count, date: cell.date },
      );
    },
    [weeks],
  );

  const handlePointerLeave = useCallback(() => setHoveredCell(null), []);

  const displayWeeks = weeks.length || visibleWeeks;
  const graphWidth = LABEL_W + displayWeeks * STEP;
  const graphHeight = DAYS * STEP - GAP;
  const hoveredLevel = Math.min(weeks[hoveredCell?.week ?? -1]?.[hoveredCell?.day ?? -1]?.level ?? 0, 4);

  return (
    // Same shell as the sibling bento cells (About GridItem): chasing conic
    // border outside, spotlight inside, matching sans-serif header.
    <div ref={containerRef} className="relative mx-auto h-full rounded-xl border p-2 md:rounded-2xl">
      <GlowingEffect spread={40} glow proximity={64} inactiveZone={0.01} />
      <div className="group/glow relative flex h-full flex-col justify-center overflow-hidden rounded-lg bg-card/60 p-4">
        <SpotlightGlow />
      {/* Header */}
      <div className="mb-2.5 flex items-center justify-between gap-3">
        <a
          href={`https://github.com/${GITHUB_USERNAME}`}
          target="_blank"
          rel="me noopener noreferrer"
          className="inline-flex items-center gap-2 text-foreground transition-colors hover:text-foreground sm:gap-3"
          aria-label={`GitHub profile of ${GITHUB_USERNAME} (opens in new tab)`}
        >
          <GitHubIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="link-underline text-sm font-semibold tracking-tight sm:text-base">
            GitHub Activity
          </span>
        </a>
        {totalContributions > 0 && (
          <span className="text-xs tabular-nums text-muted-foreground">
            {totalContributions.toLocaleString()} contributions
          </span>
        )}
      </div>

      {/* Graph */}
      <div ref={graphAreaRef} className="relative">
        {weeks.length > 0 ? (
          <svg
            ref={svgRef}
            role="img"
            aria-label={`GitHub contribution heatmap: ${totalContributions.toLocaleString()} contributions in the last year`}
            width="100%"
            viewBox={`0 0 ${graphWidth} ${graphHeight + TOP_PAD}`}
            className="block cursor-crosshair"
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
          >
            {/* Month labels */}
            {monthLabels.map(({ label, col }, i) => (
              <text
                key={`${label}-${i}`}
                x={LABEL_W + col * STEP}
                y={8}
                className="fill-muted-foreground"
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
                  y={TOP_PAD + i * STEP + CELL * 0.75}
                  className="fill-muted-foreground"
                  fontSize="8"
                >
                  {label}
                </text>
              ) : null,
            )}

            <CellGrid weeks={weeks} visible={isInView} />

            {/* Hover overlays: drawn separately so the grid never re-renders */}
            {hoveredCell && (
              <g className="pointer-events-none">
                {/* faint ink wash on the hovered column */}
                <rect
                  x={LABEL_W + hoveredCell.week * STEP - 1}
                  y={TOP_PAD}
                  width={CELL + 2}
                  height={graphHeight}
                  className="fill-foreground/[0.05]"
                />
                {/* enlarged copy of the hovered cell */}
                <rect
                  x={LABEL_W + hoveredCell.week * STEP - 1.75}
                  y={TOP_PAD + hoveredCell.day * STEP - 1.75}
                  rx={2.5}
                  width={CELL + 3.5}
                  height={CELL + 3.5}
                  className={FILL_CLASSES[hoveredLevel]}
                />
                {/* hairline emerald ring */}
                {hoveredLevel > 0 && (
                  <rect
                    x={LABEL_W + hoveredCell.week * STEP - 2}
                    y={TOP_PAD + hoveredCell.day * STEP - 2}
                    rx={3}
                    width={CELL + 4}
                    height={CELL + 4}
                    className="fill-transparent stroke-emerald-400/60"
                    strokeWidth={1}
                  />
                )}
                {/* floating tooltip */}
                <foreignObject
                  x={Math.max(0, Math.min(
                    LABEL_W + hoveredCell.week * STEP + CELL / 2 - 60,
                    graphWidth - 120
                  ))}
                  y={Math.max(0, TOP_PAD + hoveredCell.day * STEP - 28)}
                  width={120}
                  height={24}
                  style={{ overflow: 'visible' }}
                >
                  <div className="flex items-center justify-center">
                    <div className="whitespace-nowrap rounded-md border border-border bg-card px-2 py-1 shadow-md">
                      <span className="font-mono text-[8px] uppercase tracking-[0.06em] text-muted-foreground">
                        <span className="font-semibold text-emerald-500">{hoveredCell.count}</span>
                        {' '}· {formatTooltipDate(hoveredCell.date)}
                      </span>
                    </div>
                  </div>
                </foreignObject>
              </g>
            )}
          </svg>
        ) : (
          /* Loading skeleton */
          <div className="flex h-[100px] items-center justify-center">
            <span className={`text-xs text-muted-foreground ${isLoading ? 'animate-pulse' : ''}`}>
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
          <span className="mr-0.5 text-[10px] text-muted-foreground">Less</span>
          {LEGEND_BG.map((bg, i) => (
            <div key={i} className={`h-[9px] w-[9px] rounded-[2px] ${bg}`} />
          ))}
          <span className="ml-0.5 text-[10px] text-muted-foreground">More</span>
        </div>
      )}
      </div>
    </div>
  );
}

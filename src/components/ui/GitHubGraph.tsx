import { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { m, useInView } from 'framer-motion';

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

const FILL_CLASSES = [
  'fill-white/[0.04]',
  'fill-violet-500/25',
  'fill-violet-500/45',
  'fill-violet-400/65',
  'fill-violet-400/90',
];

const LEGEND_BG = [
  'bg-white/[0.04]',
  'bg-violet-500/25',
  'bg-violet-500/45',
  'bg-violet-400/65',
  'bg-violet-400/90',
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
    <div ref={containerRef} className="group relative h-full p-4 sm:p-5 rounded-3xl bg-space-800/50 border border-white/5 hover:border-violet-500/20 transition-colors duration-500 overflow-hidden">
      <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-violet-500/[0.06] rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-2.5 relative z-10">
        <a
          href={`https://github.com/${GITHUB_USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center min-h-[44px] px-1 gap-1.5 text-gray-500 hover:text-violet-400 transition-colors"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          <span className="text-[10px] sm:text-xs font-mono tracking-wide">Activity</span>
        </a>
        {totalContributions > 0 && (
          <span className="text-gray-600 text-[10px] sm:text-xs font-mono">
            {totalContributions.toLocaleString()} contributions
          </span>
        )}
      </div>

      {/* Graph */}
      <div ref={graphAreaRef} className="relative z-10">
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
                className="fill-gray-600 font-mono"
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
                  className="fill-gray-600 font-mono"
                  fontSize="8"
                >
                  {label}
                </text>
              ) : null,
            )}

            {/* Column highlight — faint vertical line on hovered column */}
            {hoveredCell && (
              <m.rect
                x={LABEL_W + hoveredCell.week * STEP - 1}
                y={14}
                width={CELL + 2}
                height={graphHeight}
                rx={3}
                className="fill-violet-500/[0.04]"
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
                    {/* Glow ring — soft violet halo behind hovered cell */}
                    {isHovered && level > 0 && (
                      <m.rect
                        x={x - 2}
                        y={y - 2}
                        width={CELL + 4}
                        height={CELL + 4}
                        rx={4}
                        className="fill-transparent stroke-violet-400/40"
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
                      width={CELL}
                      height={CELL}
                      rx={2}
                      className={`cursor-crosshair ${FILL_CLASSES[level]}`}
                      initial={{ opacity: 0 }}
                      animate={
                        isInView
                          ? {
                              opacity: neighbor && level > 0 ? 1 : 1,
                              scale: isHovered ? 1.35 : 1,
                              filter: neighbor && level > 0 ? 'brightness(1.4)' : 'brightness(1)',
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
                  <div className="px-2 py-0.5 rounded-md bg-space-700/95 border border-white/10 backdrop-blur-sm shadow-lg shadow-black/30 whitespace-nowrap">
                    <span className="text-[8px] text-gray-300 font-mono">
                      <span className="text-violet-400 font-semibold">{hoveredCell.count}</span>
                      {' '}· {formatTooltipDate(hoveredCell.date)}
                    </span>
                  </div>
                </m.div>
              </foreignObject>
            )}
          </svg>
        ) : (
          /* Loading skeleton */
          <div className="h-[100px] flex items-center justify-center">
            <span className={`text-gray-600 text-xs font-mono ${isLoading ? 'animate-pulse' : ''}`}>
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
        <div className="flex items-center justify-end gap-1 mt-1.5 relative z-10">
          <span className="text-[9px] text-gray-600 font-mono mr-0.5">Less</span>
          {LEGEND_BG.map((bg, i) => (
            <div key={i} className={`w-[9px] h-[9px] rounded-[2px] ${bg}`} />
          ))}
          <span className="text-[9px] text-gray-600 font-mono ml-0.5">More</span>
        </div>
      )}
    </div>
  );
}

import { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { m, useInView } from 'framer-motion';

const DAYS = 7;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = ['', 'M', '', 'W', '', 'F', ''];
const GITHUB_USERNAME = 'EhsanulHaqueSiam';
const API_URL = `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`;

const CELL = 10;
const GAP = 2;
const STEP = CELL + GAP;
const LABEL_W = 20;

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface ApiResponse {
  total: { lastYear: number };
  contributions: ContributionDay[];
}

// Convert flat contributions array into weeks grid (7 days per week)
function toWeeksGrid(contributions: ContributionDay[]): { level: number; count: number }[][] {
  const weeks: { level: number; count: number }[][] = [];
  let currentWeek: { level: number; count: number }[] = [];

  for (const day of contributions) {
    currentWeek.push({ level: day.level, count: day.count });
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
  const [hoveredCell, setHoveredCell] = useState<{ week: number; day: number } | null>(null);
  const [visibleWeeks, setVisibleWeeks] = useState(52);
  const [data, setData] = useState<ApiResponse | null>(null);

  // Fetch real contribution data from public API
  useEffect(() => {
    fetch(API_URL)
      .then(r => r.json())
      .then((json: ApiResponse) => setData(json))
      .catch(() => {/* silently use empty state */});
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

  const handleMouseEnter = useCallback((week: number, day: number) => {
    setHoveredCell({ week, day });
  }, []);
  const handleMouseLeave = useCallback(() => {
    setHoveredCell(null);
  }, []);

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
          className="flex items-center gap-1.5 text-gray-500 hover:text-violet-400 transition-colors"
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

            {/* Cells */}
            {weeks.map((week, weekIdx) =>
              week.map((day, dayIdx) => {
                const isHovered = hoveredCell?.week === weekIdx && hoveredCell?.day === dayIdx;
                const x = LABEL_W + weekIdx * STEP;
                const y = 14 + dayIdx * STEP;
                const level = Math.min(day.level, 4);

                return (
                  <m.rect
                    key={`${weekIdx}-${dayIdx}`}
                    x={x}
                    y={y}
                    width={CELL}
                    height={CELL}
                    rx={2}
                    className={`cursor-crosshair ${FILL_CLASSES[level]}`}
                    initial={{ opacity: 0 }}
                    animate={
                      isInView
                        ? { opacity: 1, scale: isHovered ? 1.3 : 1, originX: `${x + CELL / 2}px`, originY: `${y + CELL / 2}px` }
                        : { opacity: 0 }
                    }
                    transition={{
                      opacity: { duration: 0.3, delay: weekIdx * 0.006 },
                      scale: { duration: 0.12 },
                    }}
                    onMouseEnter={() => handleMouseEnter(weekIdx, dayIdx)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {isHovered && day.count > 0 && (
                      <title>{day.count} contributions</title>
                    )}
                  </m.rect>
                );
              }),
            )}
          </svg>
        ) : (
          /* Loading skeleton */
          <div className="h-[100px] flex items-center justify-center">
            <span className="text-gray-600 text-xs font-mono animate-pulse">Loading contributions...</span>
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

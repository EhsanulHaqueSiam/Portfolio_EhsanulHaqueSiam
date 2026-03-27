import { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { m, useInView } from 'framer-motion';

const DAYS = 7;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = ['', 'M', '', 'W', '', 'F', ''];

// Cell size constants
const CELL = 10;
const GAP = 2;
const STEP = CELL + GAP;
const LABEL_W = 20; // day label column width

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateContributions(weeks: number): number[][] {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const rand = seededRandom(seed);

  const grid: number[][] = [];
  // Generate a full year then slice to requested weeks
  for (let week = 0; week < 53; week++) {
    const weekData: number[] = [];
    const weekActivity = rand() < 0.15 ? 0 : rand() < 0.3 ? 1 : rand() < 0.6 ? 2 : 3;

    for (let day = 0; day < DAYS; day++) {
      const isWeekend = day === 0 || day === 6;
      const r = rand();

      let level: number;
      if (weekActivity === 0) level = r < 0.85 ? 0 : 1;
      else if (weekActivity === 1) level = r < 0.4 ? 0 : r < 0.75 ? 1 : 2;
      else if (weekActivity === 2) level = r < 0.15 ? 0 : r < 0.4 ? 1 : r < 0.75 ? 2 : 3;
      else level = r < 0.05 ? 0 : r < 0.2 ? 1 : r < 0.45 ? 2 : r < 0.75 ? 3 : 4;

      if (isWeekend && level > 0 && rand() > 0.6) level = Math.max(0, level - 1);
      if (week === 52) {
        const currentDay = today.getDay();
        if (day > currentDay) level = 0;
      }
      weekData.push(level);
    }
    grid.push(weekData);
  }

  return grid.slice(53 - weeks);
}

function getMonthLabels(weeks: number): { label: string; col: number }[] {
  const today = new Date();
  const labels: { label: string; col: number }[] = [];
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - weeks * 7);

  let lastMonth = -1;
  for (let week = 0; week < weeks; week++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + week * 7);
    const month = d.getMonth();
    if (month !== lastMonth) {
      labels.push({ label: MONTHS[month], col: week });
      lastMonth = month;
    }
  }
  return labels;
}

const CELL_COLORS = [
  'bg-white/[0.04]',
  'bg-violet-500/20',
  'bg-violet-500/40',
  'bg-violet-500/60',
  'bg-violet-400/80',
];

export function GitHubGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphAreaRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-10%' });
  const [hoveredCell, setHoveredCell] = useState<{ week: number; day: number } | null>(null);
  const [visibleWeeks, setVisibleWeeks] = useState(52);

  // Measure container and compute how many weeks fit
  useEffect(() => {
    function measure() {
      if (!graphAreaRef.current) return;
      const width = graphAreaRef.current.clientWidth;
      const available = width - LABEL_W - 4; // padding
      const weeks = Math.max(20, Math.min(52, Math.floor(available / STEP)));
      setVisibleWeeks(weeks);
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const contributions = useMemo(() => generateContributions(visibleWeeks), [visibleWeeks]);
  const monthLabels = useMemo(() => getMonthLabels(visibleWeeks), [visibleWeeks]);

  const totalContributions = useMemo(
    () => contributions.reduce((sum, week) => sum + week.reduce((s, d) => s + d, 0), 0),
    [contributions],
  );
  const displayCount = useMemo(() => totalContributions * 3 + 142, [totalContributions]);

  const handleMouseEnter = useCallback((week: number, day: number) => {
    setHoveredCell({ week, day });
  }, []);
  const handleMouseLeave = useCallback(() => {
    setHoveredCell(null);
  }, []);

  const graphWidth = LABEL_W + visibleWeeks * STEP;
  const graphHeight = DAYS * STEP - GAP;

  return (
    <div ref={containerRef} className="group relative h-full p-4 sm:p-5 rounded-3xl bg-space-800/50 border border-white/5 hover:border-violet-500/20 transition-colors duration-500 overflow-hidden">
      {/* Background glow */}
      <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-violet-500/[0.06] rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-2.5 relative z-10">
        <a
          href="https://github.com/EhsanulHaqueSiam"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-gray-500 hover:text-violet-400 transition-colors"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          <span className="text-[10px] sm:text-xs font-mono tracking-wide">Activity</span>
        </a>
        <span className="text-gray-600 text-[10px] sm:text-xs font-mono">
          {displayCount}
        </span>
      </div>

      {/* Graph — auto-fits container width */}
      <div ref={graphAreaRef} className="relative z-10">
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
          {contributions.map((week, weekIdx) =>
            week.map((level, dayIdx) => {
              const isHovered = hoveredCell?.week === weekIdx && hoveredCell?.day === dayIdx;
              const x = LABEL_W + weekIdx * STEP;
              const y = 14 + dayIdx * STEP;

              return (
                <m.rect
                  key={`${weekIdx}-${dayIdx}`}
                  x={x}
                  y={y}
                  width={CELL}
                  height={CELL}
                  rx={2}
                  className={`cursor-crosshair ${
                    level === 0 ? 'fill-white/[0.04]' :
                    level === 1 ? 'fill-violet-500/20' :
                    level === 2 ? 'fill-violet-500/40' :
                    level === 3 ? 'fill-violet-500/60' :
                    'fill-violet-400/80'
                  }`}
                  initial={{ opacity: 0 }}
                  animate={
                    isInView
                      ? {
                          opacity: 1,
                          scale: isHovered ? 1.3 : 1,
                          originX: `${x + CELL / 2}px`,
                          originY: `${y + CELL / 2}px`,
                        }
                      : { opacity: 0 }
                  }
                  transition={{
                    opacity: { duration: 0.3, delay: weekIdx * 0.006 },
                    scale: { duration: 0.12 },
                  }}
                  onMouseEnter={() => handleMouseEnter(weekIdx, dayIdx)}
                  onMouseLeave={handleMouseLeave}
                />
              );
            }),
          )}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1 mt-1.5 relative z-10">
        <span className="text-[9px] text-gray-600 font-mono mr-0.5">Less</span>
        {CELL_COLORS.map((_, i) => (
          <div
            key={i}
            className={`w-[9px] h-[9px] rounded-[2px] ${CELL_COLORS[i]}`}
          />
        ))}
        <span className="text-[9px] text-gray-600 font-mono ml-0.5">More</span>
      </div>
    </div>
  );
}

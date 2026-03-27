import { useMemo, useState, useCallback } from 'react';
import { m, useInView } from 'framer-motion';
import { useRef } from 'react';

const WEEKS = 52;
const DAYS = 7;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

// Deterministic seed from date so graph changes daily but stays consistent within a day
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateContributions(): number[][] {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const rand = seededRandom(seed);

  const grid: number[][] = [];

  for (let week = 0; week < WEEKS; week++) {
    const weekData: number[] = [];
    // Create realistic patterns: bursts of activity, weekday bias
    const weekActivity = rand() < 0.15 ? 0 : rand() < 0.3 ? 1 : rand() < 0.6 ? 2 : 3;

    for (let day = 0; day < DAYS; day++) {
      const isWeekend = day === 0 || day === 6;
      const weekendPenalty = isWeekend ? 0.6 : 1;
      const r = rand();

      let level: number;
      if (weekActivity === 0) {
        level = r < 0.85 ? 0 : 1;
      } else if (weekActivity === 1) {
        level = r < 0.4 ? 0 : r < 0.75 ? 1 : 2;
      } else if (weekActivity === 2) {
        level = r < 0.15 ? 0 : r < 0.4 ? 1 : r < 0.75 ? 2 : 3;
      } else {
        level = r < 0.05 ? 0 : r < 0.2 ? 1 : r < 0.45 ? 2 : r < 0.75 ? 3 : 4;
      }

      // Weekend reduction
      if (isWeekend && level > 0 && rand() > weekendPenalty) {
        level = Math.max(0, level - 1);
      }

      // Future dates in the last week should be empty
      if (week === WEEKS - 1) {
        const currentDay = today.getDay(); // 0=Sun
        if (day > currentDay) level = 0;
      }

      weekData.push(level);
    }
    grid.push(weekData);
  }

  return grid;
}

function getMonthLabels(): { label: string; col: number }[] {
  const today = new Date();
  const labels: { label: string; col: number }[] = [];
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - WEEKS * 7);

  let lastMonth = -1;
  for (let week = 0; week < WEEKS; week++) {
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
  'bg-white/[0.04]',           // Level 0 — empty
  'bg-violet-500/20',          // Level 1 — light
  'bg-violet-500/40',          // Level 2 — medium
  'bg-violet-500/60',          // Level 3 — high
  'bg-violet-400/80',          // Level 4 — peak
];

const CELL_COLORS_HOVER = [
  'hover:bg-white/[0.08]',
  'hover:bg-violet-500/30',
  'hover:bg-violet-500/50',
  'hover:bg-violet-500/70',
  'hover:bg-violet-400/90',
];

export function GitHubGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-10%' });
  const [hoveredCell, setHoveredCell] = useState<{ week: number; day: number } | null>(null);

  const contributions = useMemo(generateContributions, []);
  const monthLabels = useMemo(getMonthLabels, []);

  const totalContributions = useMemo(
    () => contributions.reduce((sum, week) => sum + week.reduce((s, d) => s + d, 0), 0),
    [contributions],
  );

  // Rough "contributions in the last year" display number — scale level sums to realistic count
  const displayCount = useMemo(() => totalContributions * 3 + 142, [totalContributions]);

  const handleMouseEnter = useCallback((week: number, day: number) => {
    setHoveredCell({ week, day });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredCell(null);
  }, []);

  return (
    <div ref={containerRef} className="group relative h-full p-5 sm:p-6 rounded-3xl bg-space-800/50 border border-white/5 hover:border-violet-500/20 transition-colors duration-500 overflow-hidden">
      {/* Background glow */}
      <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-violet-500/[0.06] rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          <span className="text-gray-500 text-xs font-mono tracking-wide">github.com/EhsanulHaqueSiam</span>
        </div>
        <a
          href="https://github.com/EhsanulHaqueSiam"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-violet-400 transition-colors text-xs font-mono"
        >
          <span className="hidden sm:inline">{displayCount} contributions in the last year</span>
          <span className="sm:hidden">{displayCount} contributions</span>
        </a>
      </div>

      {/* Graph container — horizontally scrollable on small screens */}
      <div className="relative z-10 overflow-x-auto scrollbar-hide -mx-1 px-1">
        <div className="min-w-[680px]">
          {/* Month labels */}
          <div className="flex ml-7 mb-1.5">
            {monthLabels.map(({ label, col }, i) => (
              <span
                key={`${label}-${i}`}
                className="text-[10px] text-gray-600 font-mono"
                style={{
                  position: 'absolute',
                  left: `${col * 13 + 28}px`,
                }}
              >
                {label}
              </span>
            ))}
          </div>

          {/* Grid with day labels */}
          <div className="flex gap-0 mt-5 relative">
            {/* Day labels */}
            <div className="flex flex-col justify-between pr-1.5 flex-shrink-0" style={{ height: `${DAYS * 13 - 2}px` }}>
              {DAY_LABELS.map((label, i) => (
                <span key={i} className="text-[10px] text-gray-600 font-mono leading-none h-[11px] flex items-center">
                  {label}
                </span>
              ))}
            </div>

            {/* Contribution cells */}
            <div className="flex gap-[2px]">
              {contributions.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-[2px]">
                  {week.map((level, dayIdx) => {
                    const isHovered = hoveredCell?.week === weekIdx && hoveredCell?.day === dayIdx;
                    return (
                      <m.div
                        key={dayIdx}
                        className={`w-[11px] h-[11px] rounded-[2px] ${CELL_COLORS[level]} ${CELL_COLORS_HOVER[level]} transition-colors duration-150 cursor-crosshair`}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={
                          isInView
                            ? { opacity: 1, scale: isHovered ? 1.4 : 1 }
                            : { opacity: 0, scale: 0 }
                        }
                        transition={{
                          opacity: { duration: 0.3, delay: weekIdx * 0.008 + dayIdx * 0.002 },
                          scale: { duration: 0.15 },
                        }}
                        onMouseEnter={() => handleMouseEnter(weekIdx, dayIdx)}
                        onMouseLeave={handleMouseLeave}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1.5 mt-3 relative z-10">
        <span className="text-[10px] text-gray-600 font-mono mr-1">Less</span>
        {CELL_COLORS.map((color, i) => (
          <div key={i} className={`w-[11px] h-[11px] rounded-[2px] ${color}`} />
        ))}
        <span className="text-[10px] text-gray-600 font-mono ml-1">More</span>
      </div>
    </div>
  );
}

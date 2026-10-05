import React, { useState, useMemo } from 'react';
import { Calendar, Flame, CheckCircle, Info } from 'lucide-react';
import { formatDateKey } from '../utils/storage';

export default function ActivityHeatmap({ habits }) {
  const [hoveredDay, setHoveredDay] = useState(null);

  // Generate matrix for last 14 weeks (98 days)
  const heatmapData = useMemo(() => {
    const weeks = [];
    const totalDays = 14 * 7;
    const now = new Date();

    // Map each dateKey to number of completed habits
    const dayCounts = {};
    habits.forEach(h => {
      if (h.history) {
        Object.entries(h.history).forEach(([dateKey, done]) => {
          if (done) {
            dayCounts[dateKey] = (dayCounts[dateKey] || 0) + 1;
          }
        });
      }
    });

    // Determine day of week for today so grid aligns cleanly (0 = Sun, 1 = Mon ... 6 = Sat)
    // We want each column to represent a week (Monday to Sunday)
    const todayDayOfWeek = (now.getDay() + 6) % 7; // Convert to Mon=0 ... Sun=6

    let daysList = [];
    for (let i = totalDays - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - (i - (6 - todayDayOfWeek)));
      const dateKey = formatDateKey(d);
      const count = dayCounts[dateKey] || 0;
      const isFuture = d > now;

      daysList.push({
        date: d,
        dateKey,
        count: isFuture ? 0 : count,
        isFuture,
        dayOfWeek: (d.getDay() + 6) % 7,
        formatted: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      });
    }

    // Group into weeks (columns of 7 rows)
    let currentWeek = [];
    daysList.forEach((day, index) => {
      currentWeek.push(day);
      if (currentWeek.length === 7 || index === daysList.length - 1) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    return { weeks, dayCounts };
  }, [habits]);

  // Color level helper
  const getLevelClass = (count, isFuture) => {
    if (isFuture) return 'level-future';
    if (count === 0) return 'level-0';
    if (count <= 2) return 'level-1';
    if (count <= 4) return 'level-2';
    if (count <= 5) return 'level-3';
    return 'level-4';
  };

  // Calculate summary stats
  const totalCompletedHabits = Object.values(heatmapData.dayCounts).reduce((a, b) => a + b, 0);
  const activeDaysCount = Object.values(heatmapData.dayCounts).filter(c => c > 0).length;

  return (
    <div className="heatmap-card">
      <div className="heatmap-header">
        <div className="heatmap-title-group">
          <Calendar size={18} className="text-indigo" />
          <h3 className="heatmap-title">Habit Consistency Heatmap</h3>
          <span className="heatmap-subtitle">Past 14 weeks activity</span>
        </div>

        <div className="heatmap-summary-badges">
          <span className="summary-badge">
            <CheckCircle size={13} className="text-emerald" />
            <strong>{activeDaysCount}</strong> Active Days
          </span>
          <span className="summary-badge">
            <Flame size={13} className="text-amber" />
            <strong>{totalCompletedHabits}</strong> Total Completions
          </span>
        </div>
      </div>

      {/* Heatmap Grid Wrapper */}
      <div className="heatmap-scroll-container">
        <div className="heatmap-grid-layout">
          {/* Weekday labels */}
          <div className="heatmap-weekdays">
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
            <span>Sun</span>
          </div>

          {/* Grid columns */}
          <div className="heatmap-columns">
            {heatmapData.weeks.map((week, wIdx) => (
              <div key={wIdx} className="heatmap-week-column">
                {week.map(day => (
                  <div
                    key={day.dateKey}
                    className={`heatmap-cell ${getLevelClass(day.count, day.isFuture)}`}
                    onMouseEnter={() => !day.isFuture && setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    title={`${day.formatted}: ${day.count} habits completed`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Legend and Tooltip detail */}
      <div className="heatmap-footer">
        <div className="heatmap-tooltip-display">
          {hoveredDay ? (
            <span className="tooltip-text animate-fade-in">
              <strong>{hoveredDay.formatted}:</strong> {hoveredDay.count} habit{hoveredDay.count === 1 ? '' : 's'} completed ({Math.min(100, Math.round((hoveredDay.count / (habits.length || 1)) * 100))}%)
            </span>
          ) : (
            <span className="tooltip-placeholder">Hover or tap any square to inspect details</span>
          )}
        </div>

        <div className="heatmap-legend">
          <span className="legend-label">Less</span>
          <span className="heatmap-cell level-0" />
          <span className="heatmap-cell level-1" />
          <span className="heatmap-cell level-2" />
          <span className="heatmap-cell level-3" />
          <span className="heatmap-cell level-4" />
          <span className="legend-label">More</span>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { CheckCircle2, Flame, Timer, BarChart3, TrendingUp } from 'lucide-react';

export default function StatsCards({ habits, todayStats, bestStreak, focusSessions }) {
  // Calculate total focus time today
  const todayKey = new Date().toISOString().slice(0, 10);
  const todaySessions = focusSessions.filter(s => s.date === todayKey);
  const totalFocusMinutesToday = todaySessions.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);

  // Total check-ins all time
  let totalCompletionsAllTime = 0;
  habits.forEach(h => {
    if (h.history) {
      totalCompletionsAllTime += Object.values(h.history).filter(Boolean).length;
    }
  });

  return (
    <section className="stats-grid" aria-label="Key Productivity Metrics">
      {/* Card 1: Today's Completion */}
      <div className="stat-card">
        <div className="stat-card-header">
          <span className="stat-label">Today's Progress</span>
          <div className="stat-icon-wrapper text-emerald bg-emerald-subtle">
            <CheckCircle2 size={18} />
          </div>
        </div>
        <div className="stat-value-group">
          <span className="stat-value">{todayStats.percentage}%</span>
          <span className="stat-subtext">{todayStats.completed} of {todayStats.total} done</span>
        </div>
        <div className="stat-progress-bar-bg">
          <div 
            className="stat-progress-bar-fill" 
            style={{ width: `${todayStats.percentage}%` }}
          />
        </div>
      </div>

      {/* Card 2: Streak Leader */}
      <div className="stat-card">
        <div className="stat-card-header">
          <span className="stat-label">Best Active Streak</span>
          <div className="stat-icon-wrapper text-amber bg-amber-subtle">
            <Flame size={18} />
          </div>
        </div>
        <div className="stat-value-group">
          <span className="stat-value">{bestStreak} <span className="stat-unit">days</span></span>
          <span className="stat-subtext">Keep the momentum alive</span>
        </div>
        <div className="stat-footer-tag">
          <TrendingUp size={12} className="text-emerald" />
          <span>Top consistency</span>
        </div>
      </div>

      {/* Card 3: Focus Time Today */}
      <div className="stat-card">
        <div className="stat-card-header">
          <span className="stat-label">Focus Time Today</span>
          <div className="stat-icon-wrapper text-indigo bg-indigo-subtle">
            <Timer size={18} />
          </div>
        </div>
        <div className="stat-value-group">
          <span className="stat-value">
            {totalFocusMinutesToday} <span className="stat-unit">mins</span>
          </span>
          <span className="stat-subtext">{todaySessions.length} deep work session{todaySessions.length === 1 ? '' : 's'}</span>
        </div>
        <div className="stat-footer-tag">
          <span className="stat-badge-soft">Pomodoro Synced</span>
        </div>
      </div>

      {/* Card 4: Lifetime Completions */}
      <div className="stat-card">
        <div className="stat-card-header">
          <span className="stat-label">Total Check-ins</span>
          <div className="stat-icon-wrapper text-cyan bg-cyan-subtle">
            <BarChart3 size={18} />
          </div>
        </div>
        <div className="stat-value-group">
          <span className="stat-value">{totalCompletionsAllTime}</span>
          <span className="stat-subtext">Across {habits.length} habits</span>
        </div>
        <div className="stat-footer-tag">
          <span className="stat-badge-soft">30-day history</span>
        </div>
      </div>
    </section>
  );
}

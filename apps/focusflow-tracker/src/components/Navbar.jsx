import React from 'react';
import { 
  Sparkles, 
  Plus, 
  Flame, 
  Trophy, 
  Settings, 
  CheckCircle2, 
  Clock, 
  CalendarDays 
} from 'lucide-react';

export default function Navbar({ 
  todayStats, 
  bestStreak, 
  onOpenAddModal, 
  onOpenSettings, 
  onOpenAchievements,
  activeTab,
  setActiveTab
}) {
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  }).format(new Date());

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Brand identity */}
        <div className="brand-group">
          <div className="brand-icon-wrapper">
            <Sparkles className="brand-icon" size={22} />
          </div>
          <div className="brand-text">
            <div className="brand-title-row">
              <h1 className="brand-title">FocusFlow</h1>
              <span className="badge-pro">PRO TRACKER</span>
            </div>
            <p className="brand-subtitle">Habits • Deep Work • Analytics</p>
          </div>
        </div>

        {/* Center Date & Today Progress */}
        <div className="nav-center-metrics">
          <div className="metric-pill">
            <CalendarDays size={14} className="metric-pill-icon text-indigo" />
            <span className="metric-pill-text">{todayFormatted}</span>
          </div>

          <div className="metric-pill" title="Today's Habits Completion">
            <CheckCircle2 size={14} className="metric-pill-icon text-emerald" />
            <span className="metric-pill-text">
              {todayStats.completed}/{todayStats.total} Today ({todayStats.percentage}%)
            </span>
          </div>

          <div className="metric-pill highlight-streak" title="Longest Active Streak">
            <Flame size={14} className="metric-pill-icon text-amber" />
            <span className="metric-pill-text font-bold">
              {bestStreak}d Streak
            </span>
          </div>
        </div>

        {/* Right Action buttons */}
        <div className="nav-actions">
          {/* View switcher tabs for mobile / tablet */}
          <div className="nav-tab-switcher">
            <button 
              className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
            <button 
              className={`tab-btn ${activeTab === 'focus' ? 'active' : ''}`}
              onClick={() => setActiveTab('focus')}
            >
              <Clock size={14} /> Focus Timer
            </button>
          </div>

          <button 
            type="button"
            className="btn-icon" 
            title="Trophy & Badges" 
            onClick={onOpenAchievements}
            aria-label="Achievements and Milestones"
          >
            <Trophy size={18} />
          </button>

          <button 
            type="button"
            className="btn-icon" 
            title="Settings & Data Backup" 
            onClick={onOpenSettings}
            aria-label="Settings and Data"
          >
            <Settings size={18} />
          </button>

          <button 
            type="button"
            className="btn-primary" 
            onClick={onOpenAddModal}
            aria-label="Add New Habit"
          >
            <Plus size={16} />
            <span className="btn-label">New Habit</span>
          </button>
        </div>
      </div>
    </header>
  );
}

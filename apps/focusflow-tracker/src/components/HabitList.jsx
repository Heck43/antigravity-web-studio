import React, { useState } from 'react';
import { 
  Check, 
  Flame, 
  Trash2, 
  Edit3, 
  Search, 
  Filter, 
  PlusCircle, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { getTodayKey, formatDateKey, getPastDate, calculateHabitStreak } from '../utils/storage';
import { playSuccessChime } from '../utils/audio';
import confetti from 'canvas-confetti';

export default function HabitList({ 
  habits, 
  onToggleHabit, 
  onDeleteHabit, 
  onEditHabit, 
  onOpenAddModal, 
  soundEnabled 
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending' | 'completed'
  const [searchQuery, setSearchQuery] = useState('');

  const todayKey = getTodayKey();

  // Generate 7-day rolling window for habit mini-calendar (6 days ago -> today)
  const past7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = getPastDate(i);
    past7Days.push({
      dateKey: formatDateKey(d),
      dayLabel: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
      isToday: i === 0
    });
  }

  // Extract categories
  const categories = ['All', ...new Set(habits.map(h => h.category).filter(Boolean))];

  // Filtering
  const filteredHabits = habits.filter(h => {
    // Category match
    if (selectedCategory !== 'All' && h.category !== selectedCategory) return false;

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!h.title.toLowerCase().includes(q) && !(h.category || '').toLowerCase().includes(q)) {
        return false;
      }
    }

    // Status filter
    const isDone = Boolean(h.history && h.history[todayKey]);
    if (statusFilter === 'pending' && isDone) return false;
    if (statusFilter === 'completed' && !isDone) return false;

    return true;
  });

  const handleToggle = (habitId, dateKey = todayKey) => {
    const habit = habits.find(h => h.id === habitId);
    const wasCompleted = habit?.history?.[dateKey];

    onToggleHabit(habitId, dateKey);

    // If marking as done today, trigger sound and celebratory confetti!
    if (!wasCompleted && dateKey === todayKey) {
      playSuccessChime(soundEnabled);
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899']
        });
      } catch (e) {
        // Fallback gracefully
      }
    }
  };

  return (
    <div className="habit-section">
      {/* Header and Controls */}
      <div className="habit-section-header">
        <div>
          <h2 className="section-title">Daily Habits</h2>
          <p className="section-subtitle">Click the checkmark to mark complete today, or tap any day to log past activity.</p>
        </div>

        <button 
          className="btn-secondary" 
          onClick={onOpenAddModal}
        >
          <PlusCircle size={16} />
          <span>Add Habit</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="habit-filters-bar">
        {/* Search */}
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input 
            type="text"
            className="search-input"
            placeholder="Search habits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>×</button>
          )}
        </div>

        {/* Category Pills */}
        <div className="category-pills">
          {categories.map(cat => (
            <button
              key={cat}
              className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="status-toggle-group">
          <button 
            className={`status-pill ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All
          </button>
          <button 
            className={`status-pill ${statusFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setStatusFilter('pending')}
          >
            Pending
          </button>
          <button 
            className={`status-pill ${statusFilter === 'completed' ? 'active' : ''}`}
            onClick={() => setStatusFilter('completed')}
          >
            Done
          </button>
        </div>
      </div>

      {/* Habit Cards Grid */}
      {filteredHabits.length === 0 ? (
        <div className="empty-habits-state">
          <div className="empty-icon-box">
            <Sparkles size={28} className="text-indigo" />
          </div>
          <h3 className="empty-title">No habits found</h3>
          <p className="empty-desc">
            {searchQuery 
              ? `No habits match "${searchQuery}". Try clearing filters.` 
              : 'Start your streak by creating your first daily habit!'}
          </p>
          <button className="btn-primary" onClick={onOpenAddModal}>
            <PlusCircle size={16} /> Create Habit
          </button>
        </div>
      ) : (
        <div className="habit-cards-list">
          {filteredHabits.map(habit => {
            const streakInfo = calculateHabitStreak(habit);
            const isCompletedToday = Boolean(habit.history && habit.history[todayKey]);

            return (
              <div 
                key={habit.id} 
                className={`habit-card ${isCompletedToday ? 'is-completed' : ''}`}
                style={{ '--habit-accent': habit.color || '#6366f1' }}
              >
                {/* Left accent strip */}
                <div 
                  className="habit-card-accent-bar" 
                  style={{ backgroundColor: habit.color || '#6366f1' }} 
                />

                {/* Primary Complete Toggle Button */}
                <button
                  type="button"
                  className={`habit-check-btn ${isCompletedToday ? 'checked' : ''}`}
                  onClick={() => handleToggle(habit.id, todayKey)}
                  aria-label={`Mark ${habit.title} as ${isCompletedToday ? 'incomplete' : 'complete'}`}
                  title={isCompletedToday ? 'Completed today! Click to undo' : 'Click to complete for today'}
                >
                  <Check size={20} className="check-svg" />
                </button>

                {/* Habit Details */}
                <div className="habit-details">
                  <div className="habit-title-row">
                    <h3 className="habit-title">{habit.title}</h3>
                    <span 
                      className="habit-category-badge"
                      style={{ 
                        borderColor: `${habit.color || '#6366f1'}40`,
                        color: habit.color || '#6366f1',
                        backgroundColor: `${habit.color || '#6366f1'}15`
                      }}
                    >
                      {habit.category}
                    </span>
                  </div>

                  <div className="habit-meta-row">
                    {/* Streak badge */}
                    <div className="habit-streak-pill" title={`Longest streak: ${streakInfo.longest} days`}>
                      <Flame size={14} className={streakInfo.current > 0 ? 'text-amber flame-active' : 'text-muted'} />
                      <span className="streak-count">{streakInfo.current}d streak</span>
                    </div>

                    <span className="habit-freq-label">• {habit.targetFrequency || 'Daily'}</span>
                  </div>
                </div>

                {/* 7-Day Mini Calendar History */}
                <div className="mini-calendar-strip">
                  {past7Days.map(day => {
                    const isDoneOnDay = Boolean(habit.history && habit.history[day.dateKey]);
                    return (
                      <button
                        key={day.dateKey}
                        type="button"
                        className={`mini-day-pill ${isDoneOnDay ? 'done' : ''} ${day.isToday ? 'is-today' : ''}`}
                        onClick={() => handleToggle(habit.id, day.dateKey)}
                        title={`${day.dateKey}: ${isDoneOnDay ? 'Done' : 'Missed'} (Click to toggle)`}
                      >
                        <span className="mini-day-label">{day.dayLabel}</span>
                        <div className="mini-day-indicator">
                          {isDoneOnDay && <Check size={10} />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Actions */}
                <div className="habit-actions">
                  <button 
                    type="button"
                    className="action-btn"
                    title="Edit habit"
                    onClick={() => onEditHabit(habit)}
                    aria-label={`Edit ${habit.title}`}
                  >
                    <Edit3 size={15} />
                  </button>
                  <button 
                    type="button"
                    className="action-btn text-danger-hover"
                    title="Delete habit"
                    onClick={() => onDeleteHabit(habit.id)}
                    aria-label={`Delete ${habit.title}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

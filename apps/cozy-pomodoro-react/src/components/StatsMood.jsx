import React from 'react';
import { Flame, Clock, CheckCheck, Smile } from 'lucide-react';
import { soundManager } from '../utils/audioEngine';

const MOODS = [
  { id: 'cozy', emoji: '🌸', label: 'Уютно' },
  { id: 'energetic', emoji: '⚡', label: 'Бодро' },
  { id: 'calm', emoji: '🍵', label: 'Спокойно' },
  { id: 'sleepy', emoji: '☁️', label: 'Сонно' },
  { id: 'inspired', emoji: '✨', label: 'Вдохновлённо' }
];

export default function StatsMood({
  completedSessions,
  totalFocusMinutes,
  completedTasksCount,
  currentMood,
  setCurrentMood
}) {
  const handleMoodSelect = (moodId) => {
    soundManager.playClick();
    setCurrentMood(moodId);
  };

  const formatHoursMins = (totalMins) => {
    if (totalMins < 60) return `${totalMins} мин`;
    const hrs = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    return `${hrs} ч ${mins} мин`;
  };

  return (
    <section className="card stats-card" aria-label="Статистика и настроение">
      <div className="card-header">
        <div className="header-title-group">
          <span className="card-emoji">📊</span>
          <h2 className="card-title">Твой фокус сегодня</h2>
        </div>
      </div>

      {/* Stats pills */}
      <div className="stats-grid">
        <div className="stat-box stat-pink">
          <div className="stat-icon-wrap">
            <Flame size={18} />
          </div>
          <div className="stat-number">{completedSessions}</div>
          <div className="stat-label">Сессий фокуса</div>
        </div>

        <div className="stat-box stat-peach">
          <div className="stat-icon-wrap">
            <Clock size={18} />
          </div>
          <div className="stat-number">{formatHoursMins(totalFocusMinutes)}</div>
          <div className="stat-label">Чистого времени</div>
        </div>

        <div className="stat-box stat-mint">
          <div className="stat-icon-wrap">
            <CheckCheck size={18} />
          </div>
          <div className="stat-number">{completedTasksCount}</div>
          <div className="stat-label">Завершённых дел</div>
        </div>
      </div>

      {/* Mood Selector */}
      <div className="mood-section">
        <span className="mood-title">
          <Smile size={16} className="inline-icon" /> Как ты себя чувствуешь?
        </span>
        <div className="mood-buttons-row" role="radiogroup" aria-label="Выбор настроения">
          {MOODS.map(m => {
            const isSelected = currentMood === m.id;
            return (
              <button
                key={m.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                className={`mood-btn ${isSelected ? 'mood-selected' : ''}`}
                onClick={() => handleMoodSelect(m.id)}
              >
                <span className="mood-btn-emoji">{m.emoji}</span>
                <span className="mood-btn-text">{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

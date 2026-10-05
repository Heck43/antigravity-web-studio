import React from 'react';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { soundManager } from '../utils/audioEngine';

export default function Timer({
  mode,
  setMode,
  timeLeft,
  totalTime,
  isRunning,
  setIsRunning,
  onReset,
  onSkip,
  sessionCount,
  sessionsUntilLongBreak = 4
}) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;
  
  // SVG circular dimensions
  const size = 280;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const handleTogglePlay = () => {
    soundManager.playClick();
    setIsRunning(!isRunning);
  };

  const handleModeChange = (newMode) => {
    soundManager.playClick();
    setMode(newMode);
  };

  const getModeColor = () => {
    switch (mode) {
      case 'shortBreak':
        return {
          stroke: '#34D399',
          bg: 'var(--accent-mint-light)',
          name: 'Короткий перерыв'
        };
      case 'longBreak':
        return {
          stroke: '#A78BFA',
          bg: 'var(--accent-lavender-light)',
          name: 'Длинный перерыв'
        };
      case 'focus':
      default:
        return {
          stroke: '#F472B6',
          bg: 'var(--accent-pink-light)',
          name: 'Время фокуса'
        };
    }
  };

  const modeInfo = getModeColor();

  return (
    <div className="timer-card">
      {/* Mode selection pills */}
      <nav className="timer-mode-selector" aria-label="Режимы таймера">
        <button
          type="button"
          className={`mode-btn ${mode === 'focus' ? 'active-focus' : ''}`}
          onClick={() => handleModeChange('focus')}
        >
          🍅 Фокус
        </button>
        <button
          type="button"
          className={`mode-btn ${mode === 'shortBreak' ? 'active-short' : ''}`}
          onClick={() => handleModeChange('shortBreak')}
        >
          ☕ Перерыв
        </button>
        <button
          type="button"
          className={`mode-btn ${mode === 'longBreak' ? 'active-long' : ''}`}
          onClick={() => handleModeChange('longBreak')}
        >
          🌿 Отдых
        </button>
      </nav>

      {/* SVG Circular Progress & Time Display */}
      <div className="timer-circle-wrapper" role="region" aria-label="Индикатор времени">
        <svg width={size} height={size} className="timer-svg">
          <defs>
            <linearGradient id="focusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FB7185" />
              <stop offset="100%" stopColor="#F43F5E" />
            </linearGradient>
            <linearGradient id="shortBreakGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
            <linearGradient id="longBreakGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A78BFA" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>

          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#FCE7F3"
            strokeWidth={strokeWidth}
            fill="none"
            className="timer-track"
          />

          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={
              mode === 'shortBreak'
                ? 'url(#shortBreakGradient)'
                : mode === 'longBreak'
                ? 'url(#longBreakGradient)'
                : 'url(#focusGradient)'
            }
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="timer-progress"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>

        {/* Center content */}
        <div className="timer-center-content">
          <span className="timer-mode-tag" style={{ backgroundColor: modeInfo.bg }}>
            {modeInfo.name}
          </span>
          <div className="timer-clock" aria-live="polite">
            {formatTime(timeLeft)}
          </div>
          <span className="timer-cycle-hint">
            {mode === 'focus' 
              ? `Сессия ${(sessionCount % sessionsUntilLongBreak) + 1} из ${sessionsUntilLongBreak}`
              : 'Сделай пару глотков чая :3'}
          </span>
        </div>
      </div>

      {/* Primary Action Controls */}
      <div className="timer-controls">
        <button
          type="button"
          className="btn-control btn-secondary"
          onClick={() => {
            soundManager.playClick();
            onReset();
          }}
          title="Сбросить текущее время"
          aria-label="Сбросить таймер"
        >
          <RotateCcw size={20} />
        </button>

        <button
          type="button"
          className={`btn-control btn-main ${isRunning ? 'btn-pause' : 'btn-play'}`}
          onClick={handleTogglePlay}
          aria-label={isRunning ? 'Пауза' : 'Старт'}
        >
          {isRunning ? (
            <>
              <Pause size={24} /> <span>Пауза</span>
            </>
          ) : (
            <>
              <Play size={24} fill="currentColor" /> <span>Старт</span>
            </>
          )}
        </button>

        <button
          type="button"
          className="btn-control btn-secondary"
          onClick={() => {
            soundManager.playClick();
            onSkip();
          }}
          title="Перейти к следующему этапу"
          aria-label="Пропустить этап"
        >
          <SkipForward size={20} />
        </button>
      </div>
      
      <p className="timer-keyboard-tip">
        Подсказка: нажимай <kbd>Space</kbd> для паузы / старта
      </p>
    </div>
  );
}

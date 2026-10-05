import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Bell, 
  Target, 
  CheckCircle2, 
  Coffee, 
  Zap 
} from 'lucide-react';
import { playTickSound, playTimerCompleteSound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { getTodayKey } from '../utils/storage';

export default function FocusTimer({ 
  habits, 
  settings, 
  onSaveSession, 
  focusSessions 
}) {
  const [mode, setMode] = useState('focus'); // 'focus' | 'shortBreak' | 'longBreak'
  const [isRunning, setIsRunning] = useState(false);
  const [selectedHabitId, setSelectedHabitId] = useState(habits[0]?.id || '');
  const [completedCycles, setCompletedCycles] = useState(0);

  // Durations in seconds
  const getDurationForMode = (m) => {
    if (m === 'focus') return (settings.focusDuration || 25) * 60;
    if (m === 'shortBreak') return (settings.shortBreakDuration || 5) * 60;
    if (m === 'longBreak') return (settings.longBreakDuration || 15) * 60;
    return 25 * 60;
  };

  const [timeLeft, setTimeLeft] = useState(getDurationForMode('focus'));
  const [totalTime, setTotalTime] = useState(getDurationForMode('focus'));

  const timerRef = useRef(null);

  // Switch mode handler
  const handleModeChange = (newMode) => {
    setIsRunning(false);
    clearInterval(timerRef.current);
    setMode(newMode);
    const dur = getDurationForMode(newMode);
    setTotalTime(dur);
    setTimeLeft(dur);
  };

  // Timer tick effect
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleTimerComplete();
            return 0;
          }
          if (settings.tickEnabled && prev % 2 === 0) {
            playTickSound(true);
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, mode, settings.tickEnabled]);

  // Handle completion
  const handleTimerComplete = () => {
    setIsRunning(false);
    playTimerCompleteSound(settings.soundEnabled);

    if (mode === 'focus') {
      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      // Log session
      const selectedHabit = habits.find(h => h.id === selectedHabitId);
      const newSession = {
        id: `session-${Date.now()}`,
        date: getTodayKey(),
        timestamp: Date.now(),
        durationMinutes: settings.focusDuration || 25,
        habitTitle: selectedHabit ? selectedHabit.title : 'General Deep Work',
        habitId: selectedHabitId || null,
        type: 'focus'
      };
      onSaveSession(newSession);

      const nextCycles = completedCycles + 1;
      setCompletedCycles(nextCycles);

      // Auto switch to short break or long break (every 4 cycles)
      if (nextCycles % 4 === 0) {
        handleModeChange('longBreak');
      } else {
        handleModeChange('shortBreak');
      }
    } else {
      // Break is complete, switch back to focus
      handleModeChange('focus');
    }
  };

  const handleTogglePlay = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    const dur = getDurationForMode(mode);
    setTotalTime(dur);
    setTimeLeft(dur);
  };

  const handleSkip = () => {
    setIsRunning(false);
    if (mode === 'focus') {
      handleModeChange('shortBreak');
    } else {
      handleModeChange('focus');
    }
  };

  // Format time MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // SVG Circular progress math
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = totalTime > 0 ? (totalTime - timeLeft) / totalTime : 0;
  const strokeDashoffset = circumference - progressRatio * circumference;

  // Filter recent sessions for today
  const todayKey = getTodayKey();
  const todaySessions = focusSessions.filter(s => s.date === todayKey);

  return (
    <div className="focus-timer-card">
      <div className="timer-header">
        <div className="timer-title-group">
          <Zap size={18} className="text-indigo" />
          <h3 className="timer-title">Deep Work Timer</h3>
        </div>
        <div className="timer-cycle-badge" title="Focus cycles completed">
          <span>Cycle: {completedCycles}</span>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="timer-mode-selector">
        <button
          className={`mode-btn ${mode === 'focus' ? 'active focus-mode' : ''}`}
          onClick={() => handleModeChange('focus')}
        >
          <Zap size={14} /> Focus
        </button>
        <button
          className={`mode-btn ${mode === 'shortBreak' ? 'active break-mode' : ''}`}
          onClick={() => handleModeChange('shortBreak')}
        >
          <Coffee size={14} /> Short Break
        </button>
        <button
          className={`mode-btn ${mode === 'longBreak' ? 'active break-mode' : ''}`}
          onClick={() => handleModeChange('longBreak')}
        >
          <Coffee size={14} /> Long Break
        </button>
      </div>

      {/* Habit Link Dropdown */}
      <div className="timer-habit-select-box">
        <label className="select-label">
          <Target size={13} className="text-indigo" />
          <span>Active Task / Habit:</span>
        </label>
        <select
          className="habit-select-input"
          value={selectedHabitId}
          onChange={(e) => setSelectedHabitId(e.target.value)}
        >
          <option value="">General Focus / No Habit</option>
          {habits.map(h => (
            <option key={h.id} value={h.id}>{h.title}</option>
          ))}
        </select>
      </div>

      {/* Circular Progress Ring */}
      <div className="timer-dial-container">
        <svg className="timer-svg" width="240" height="240" viewBox="0 0 240 240">
          <circle
            className="timer-track"
            cx="120"
            cy="120"
            r={radius}
            strokeWidth="10"
          />
          <circle
            className={`timer-progress ${mode === 'focus' ? 'focus-stroke' : 'break-stroke'}`}
            cx="120"
            cy="120"
            r={radius}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Countdown Display */}
        <div className="timer-center-info">
          <span className="timer-time-display">{timeFormatted}</span>
          <span className="timer-status-text">
            {isRunning ? (mode === 'focus' ? 'Stay locked in 🔥' : 'Rest & recharge ☕') : 'Ready'}
          </span>
        </div>
      </div>

      {/* Timer Controls */}
      <div className="timer-controls-row">
        <button
          type="button"
          className="timer-control-btn reset-btn"
          onClick={handleReset}
          title="Reset timer"
          aria-label="Reset timer"
        >
          <RotateCcw size={18} />
        </button>

        <button
          type="button"
          className={`timer-control-btn play-btn ${isRunning ? 'running' : ''}`}
          onClick={handleTogglePlay}
          aria-label={isRunning ? 'Pause timer' : 'Start timer'}
        >
          {isRunning ? <Pause size={24} /> : <Play size={24} className="play-icon-offset" />}
        </button>

        <button
          type="button"
          className="timer-control-btn skip-btn"
          onClick={handleSkip}
          title="Skip session"
          aria-label="Skip session"
        >
          <SkipForward size={18} />
        </button>
      </div>

      {/* Recent Logged Sessions today */}
      <div className="timer-sessions-log">
        <div className="sessions-log-header">
          <span className="sessions-log-title">Today's Completed Sessions ({todaySessions.length})</span>
        </div>
        {todaySessions.length === 0 ? (
          <p className="sessions-empty-text">No focus sessions recorded yet today.</p>
        ) : (
          <div className="sessions-chips-list">
            {todaySessions.slice(-4).reverse().map(session => (
              <div key={session.id} className="session-chip">
                <CheckCircle2 size={12} className="text-emerald" />
                <span className="session-chip-title">{session.habitTitle}</span>
                <span className="session-chip-time">{session.durationMinutes}m</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

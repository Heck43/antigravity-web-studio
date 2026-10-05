import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Settings as SettingsIcon, Sparkles, Coffee, RotateCcw } from 'lucide-react';
import Mascot from './components/Mascot';
import Timer from './components/Timer';
import SoundBar from './components/SoundBar';
import TaskList from './components/TaskList';
import StatsMood from './components/StatsMood';
import SettingsModal from './components/SettingsModal';
import { soundManager } from './utils/audioEngine';
import { loadState, saveState } from './utils/storage';

const DEFAULT_SETTINGS = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  autoStartBreaks: false
};

const DEFAULT_TASKS = [
  { id: '1', title: 'Разобрать конспекты или код', estimatedPomos: 2, completedPomos: 0, completed: false },
  { id: '2', title: 'Налить вкусный чай или какао ☕', estimatedPomos: 1, completedPomos: 0, completed: true }
];

export default function App() {
  // Persistent Settings
  const [settings, setSettings] = useState(() => loadState('settings', DEFAULT_SETTINGS));
  const [tasks, setTasks] = useState(() => loadState('tasks', DEFAULT_TASKS));
  const [completedSessions, setCompletedSessions] = useState(() => loadState('sessions_count', 0));
  const [totalFocusMinutes, setTotalFocusMinutes] = useState(() => loadState('total_minutes', 0));
  const [currentMood, setCurrentMood] = useState(() => loadState('current_mood', 'cozy'));

  // Timer State
  const [mode, setMode] = useState('focus'); // 'focus' | 'shortBreak' | 'longBreak'
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(settings.focusMinutes * 60);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Sync state to localStorage
  useEffect(() => { saveState('settings', settings); }, [settings]);
  useEffect(() => { saveState('tasks', tasks); }, [tasks]);
  useEffect(() => { saveState('sessions_count', completedSessions); }, [completedSessions]);
  useEffect(() => { saveState('total_minutes', totalFocusMinutes); }, [totalFocusMinutes]);
  useEffect(() => { saveState('current_mood', currentMood); }, [currentMood]);

  // Total time for currently selected mode
  const getTotalTimeForMode = (currentMode) => {
    switch (currentMode) {
      case 'shortBreak':
        return settings.shortBreakMinutes * 60;
      case 'longBreak':
        return settings.longBreakMinutes * 60;
      case 'focus':
      default:
        return settings.focusMinutes * 60;
    }
  };

  // Switch mode handler
  const handleModeChange = (newMode) => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(getTotalTimeForMode(newMode));
  };

  // Reset current timer
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(getTotalTimeForMode(mode));
  };

  // Skip current phase
  const handleSkip = () => {
    if (mode === 'focus') {
      const nextBreak = (completedSessions + 1) % 4 === 0 ? 'longBreak' : 'shortBreak';
      handleModeChange(nextBreak);
    } else {
      handleModeChange('focus');
    }
  };

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#F472B6', '#FBCFE8', '#34D399', '#FBBF24', '#A78BFA']
      });
    } catch {}
  };

  // Timer Tick & Completion logic
  useEffect(() => {
    let timerId = null;

    if (isRunning && timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // Completed interval!
      if (mode === 'focus') {
        soundManager.playChime('complete');
        triggerConfetti();
        const newCount = completedSessions + 1;
        setCompletedSessions(newCount);
        setTotalFocusMinutes(prev => prev + settings.focusMinutes);

        // Next mode: long break every 4 sessions, else short break
        const nextMode = newCount % 4 === 0 ? 'longBreak' : 'shortBreak';
        setMode(nextMode);
        setTimeLeft(getTotalTimeForMode(nextMode));
        setIsRunning(settings.autoStartBreaks);
      } else {
        // Break ended
        soundManager.playChime('break');
        setMode('focus');
        setTimeLeft(getTotalTimeForMode('focus'));
        setIsRunning(false);
      }
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isRunning, timeLeft, mode, settings, completedSessions]);

  // Update Page Title
  useEffect(() => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    const emoji = mode === 'focus' ? '🍅' : '☕';
    document.title = `${timeFormatted} ${emoji} Cozy Focus :3`;
  }, [timeLeft, mode]);

  // Global Spacebar shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
      if (e.code === 'Space') {
        e.preventDefault();
        soundManager.playClick();
        setIsRunning(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const totalTime = getTotalTimeForMode(mode);

  return (
    <div className="app-layout">
      {/* Background soft ambient pastel blobs */}
      <div className="bg-blob blob-1" aria-hidden="true" />
      <div className="bg-blob blob-2" aria-hidden="true" />
      <div className="bg-blob blob-3" aria-hidden="true" />

      {/* Header */}
      <header className="app-header">
        <div className="logo-group">
          <span className="logo-emoji animate-bob">🍅</span>
          <div className="logo-text-group">
            <h1 className="logo-title">Cozy Focus <span className="logo-badge">:3</span></h1>
            <span className="logo-subtitle">Твой тёплый компаньон для продуктивности</span>
          </div>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="btn-header-action"
            onClick={() => {
              soundManager.playClick();
              setIsSettingsOpen(true);
            }}
            aria-label="Настройки таймера"
            title="Настройки таймера"
          >
            <SettingsIcon size={19} />
            <span className="action-text">Настройки</span>
          </button>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="main-content-grid">
        {/* Left Column: Mascot & Interactive Timer */}
        <section className="column-timer">
          <Mascot
            mode={mode}
            isRunning={isRunning}
            completedToday={completedSessions}
          />

          <Timer
            mode={mode}
            setMode={handleModeChange}
            timeLeft={timeLeft}
            totalTime={totalTime}
            isRunning={isRunning}
            setIsRunning={setIsRunning}
            onReset={handleReset}
            onSkip={handleSkip}
            sessionCount={completedSessions}
          />
        </section>

        {/* Right Column: Sounds, Tasks & Stats */}
        <section className="column-widgets">
          <SoundBar />

          <TaskList
            tasks={tasks}
            setTasks={setTasks}
          />

          <StatsMood
            completedSessions={completedSessions}
            totalFocusMinutes={totalFocusMinutes}
            completedTasksCount={tasks.filter(t => t.completed).length}
            currentMood={currentMood}
            setCurrentMood={setCurrentMood}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>
          Создано с нежностью и уютом :3 • Перерывы важны, отдыхай вовремя 🍵
        </p>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        setSettings={setSettings}
      />
    </div>
  );
}

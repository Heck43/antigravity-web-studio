import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import StatsCards from './components/StatsCards';
import HabitList from './components/HabitList';
import ActivityHeatmap from './components/ActivityHeatmap';
import FocusTimer from './components/FocusTimer';
import HabitModal from './components/HabitModal';
import SettingsModal from './components/SettingsModal';
import AchievementsModal from './components/AchievementsModal';
import { 
  loadHabits, 
  saveHabits, 
  loadFocusSessions, 
  saveFocusSessions, 
  loadSettings, 
  saveSettings, 
  getTodayStats, 
  calculateHabitStreak, 
  generateSeedHabits, 
  generateSeedFocusSessions 
} from './utils/storage';
import './App.css';

export default function App() {
  const [habits, setHabits] = useState(() => loadHabits());
  const [focusSessions, setFocusSessions] = useState(() => loadFocusSessions());
  const [settings, setSettings] = useState(() => loadSettings());

  // Navigation tab state ('dashboard' or 'focus')
  const [activeTab, setActiveTab] = useState('dashboard');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);

  // Sync state changes to localStorage
  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  useEffect(() => {
    saveFocusSessions(focusSessions);
  }, [focusSessions]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger when inside an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setEditingHabit(null);
        setIsAddModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Compute overall stats
  const todayStats = useMemo(() => getTodayStats(habits), [habits]);

  const bestStreak = useMemo(() => {
    if (habits.length === 0) return 0;
    const streaks = habits.map(h => calculateHabitStreak(h).current);
    return Math.max(...streaks, 0);
  }, [habits]);

  // Handlers for habits
  const handleToggleHabit = (habitId, dateKey) => {
    setHabits(prevHabits => {
      return prevHabits.map(h => {
        if (h.id !== habitId) return h;
        const currentHist = { ...(h.history || {}) };
        if (currentHist[dateKey]) {
          delete currentHist[dateKey];
        } else {
          currentHist[dateKey] = true;
        }
        return {
          ...h,
          history: currentHist
        };
      });
    });
  };

  const handleSaveHabit = (habitData) => {
    setHabits(prev => {
      const existsIndex = prev.findIndex(h => h.id === habitData.id);
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = {
          ...updated[existsIndex],
          ...habitData
        };
        return updated;
      } else {
        return [
          {
            ...habitData,
            createdAt: new Date().toISOString(),
            history: {}
          },
          ...prev
        ];
      }
    });
  };

  const handleDeleteHabit = (habitId) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      setHabits(prev => prev.filter(h => h.id !== habitId));
    }
  };

  const handleEditHabit = (habit) => {
    setEditingHabit(habit);
    setIsAddModalOpen(true);
  };

  const handleSaveSession = (newSession) => {
    setFocusSessions(prev => [newSession, ...prev]);
  };

  const handleImportAllData = (backupBundle) => {
    if (backupBundle.habits) setHabits(backupBundle.habits);
    if (backupBundle.focusSessions) setFocusSessions(backupBundle.focusSessions);
    if (backupBundle.settings) setSettings(backupBundle.settings);
  };

  const handleResetSampleData = () => {
    const seedH = generateSeedHabits();
    const seedS = generateSeedFocusSessions();
    setHabits(seedH);
    setFocusSessions(seedS);
  };

  return (
    <div className="app-shell">
      {/* Top Navbar */}
      <Navbar
        todayStats={todayStats}
        bestStreak={bestStreak}
        onOpenAddModal={() => {
          setEditingHabit(null);
          setIsAddModalOpen(true);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAchievements={() => setIsAchievementsOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Container */}
      <main className="main-content-layout">
        {/* Top Metric Cards */}
        <StatsCards
          habits={habits}
          todayStats={todayStats}
          bestStreak={bestStreak}
          focusSessions={focusSessions}
        />

        {/* Dynamic Split Dashboard: Left Habits/Heatmap, Right Focus Suite */}
        <div className="dashboard-columns-grid">
          {/* Main Workspace Column */}
          <div className={`primary-column ${activeTab === 'focus' ? 'hide-on-mobile' : ''}`}>
            {/* Habit Manager Section */}
            <HabitList
              habits={habits}
              onToggleHabit={handleToggleHabit}
              onDeleteHabit={handleDeleteHabit}
              onEditHabit={handleEditHabit}
              onOpenAddModal={() => {
                setEditingHabit(null);
                setIsAddModalOpen(true);
              }}
              soundEnabled={settings.soundEnabled}
            />

            {/* GitHub-style Activity Heatmap */}
            <ActivityHeatmap habits={habits} />
          </div>

          {/* Side Focus Suite Column */}
          <div className={`secondary-column ${activeTab === 'dashboard' ? 'hide-on-mobile' : ''}`}>
            <FocusTimer
              habits={habits}
              settings={settings}
              onSaveSession={handleSaveSession}
              focusSessions={focusSessions}
            />
          </div>
        </div>
      </main>

      {/* Modals */}
      <HabitModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingHabit(null);
        }}
        onSave={handleSaveHabit}
        editingHabit={editingHabit}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={setSettings}
        habits={habits}
        focusSessions={focusSessions}
        onImportAllData={handleImportAllData}
        onResetSampleData={handleResetSampleData}
      />

      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        habits={habits}
        todayStats={todayStats}
        bestStreak={bestStreak}
        focusSessions={focusSessions}
      />
    </div>
  );
}

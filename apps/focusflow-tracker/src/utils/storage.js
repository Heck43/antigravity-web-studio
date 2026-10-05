// LocalStorage persistence and data helpers for FocusFlow

export function getTodayKey() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getPastDate(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d;
}

// Generate rich initial habits with past 30 days of data
export function generateSeedHabits() {
  const habits = [
    {
      id: 'habit-1',
      title: 'Deep Work & Coding',
      category: 'Focus',
      color: '#6366f1', // Indigo
      targetFrequency: 'Daily',
      createdAt: getPastDate(45).toISOString(),
      history: {}
    },
    {
      id: 'habit-2',
      title: 'Morning 20m Walk / Sunlight',
      category: 'Health',
      color: '#10b981', // Emerald
      targetFrequency: 'Daily',
      createdAt: getPastDate(40).toISOString(),
      history: {}
    },
    {
      id: 'habit-3',
      title: 'Read 20 Pages Non-Fiction',
      category: 'Mindset',
      color: '#ec4899', // Pink
      targetFrequency: 'Daily',
      createdAt: getPastDate(35).toISOString(),
      history: {}
    },
    {
      id: 'habit-4',
      title: 'Hydration (2.5L Water)',
      category: 'Health',
      color: '#06b6d4', // Cyan
      targetFrequency: 'Daily',
      createdAt: getPastDate(30).toISOString(),
      history: {}
    },
    {
      id: 'habit-5',
      title: 'Strength or Cardio Workout',
      category: 'Fitness',
      color: '#f59e0b', // Amber
      targetFrequency: 'Weekdays',
      createdAt: getPastDate(28).toISOString(),
      history: {}
    },
    {
      id: 'habit-6',
      title: 'Evening Digital Sunset (No screens)',
      category: 'Mindset',
      color: '#8b5cf6', // Violet
      targetFrequency: 'Daily',
      createdAt: getPastDate(20).toISOString(),
      history: {}
    }
  ];

  // Fill realistic 28-day history
  const todayKey = getTodayKey();
  for (let i = 28; i >= 0; i--) {
    const d = getPastDate(i);
    const key = formatDateKey(d);
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;

    // Habit 1 (Deep Work): Completed mostly on weekdays
    if (!isWeekend || Math.random() > 0.4) {
      if (Math.random() > 0.15) habits[0].history[key] = true;
    }

    // Habit 2 (Morning Walk): High completion
    if (Math.random() > 0.18) habits[1].history[key] = true;

    // Habit 3 (Reading): Moderate
    if (Math.random() > 0.25) habits[2].history[key] = true;

    // Habit 4 (Hydration): Very high
    if (Math.random() > 0.12) habits[3].history[key] = true;

    // Habit 5 (Workout): 4-5 times a week
    if (!isWeekend && Math.random() > 0.2) habits[4].history[key] = true;

    // Habit 6 (Digital Sunset): Starts from 20 days ago
    if (i <= 20 && Math.random() > 0.3) habits[5].history[key] = true;
  }

  // Ensure today has a mix of completed and pending habits
  habits[0].history[todayKey] = true;
  habits[1].history[todayKey] = true;
  habits[3].history[todayKey] = true;
  delete habits[2].history[todayKey];
  delete habits[4].history[todayKey];
  delete habits[5].history[todayKey];

  return habits;
}

export function generateSeedFocusSessions() {
  const sessions = [];
  const todayKey = getTodayKey();
  sessions.push({
    id: 'session-1',
    date: todayKey,
    timestamp: Date.now() - 3600000,
    durationMinutes: 25,
    habitTitle: 'Deep Work & Coding',
    type: 'focus'
  });
  sessions.push({
    id: 'session-2',
    date: todayKey,
    timestamp: Date.now() - 1800000,
    durationMinutes: 25,
    habitTitle: 'Deep Work & Coding',
    type: 'focus'
  });
  return sessions;
}

const STORAGE_KEY_HABITS = 'focusflow_habits_v1';
const STORAGE_KEY_SESSIONS = 'focusflow_sessions_v1';
const STORAGE_KEY_SETTINGS = 'focusflow_settings_v1';

export function loadHabits() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HABITS);
    if (!raw) {
      const initial = generateSeedHabits();
      saveHabits(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : generateSeedHabits();
  } catch (e) {
    console.error('Failed to load habits from localStorage:', e);
    return generateSeedHabits();
  }
}

export function saveHabits(habits) {
  try {
    localStorage.setItem(STORAGE_KEY_HABITS, JSON.stringify(habits));
  } catch (e) {
    console.error('Failed to save habits:', e);
  }
}

export function loadFocusSessions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SESSIONS);
    if (!raw) {
      const initial = generateSeedFocusSessions();
      saveFocusSessions(initial);
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load sessions:', e);
    return [];
  }
}

export function saveFocusSessions(sessions) {
  try {
    localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
  } catch (e) {
    console.error('Failed to save sessions:', e);
  }
}

export function loadSettings() {
  const defaults = {
    soundEnabled: true,
    tickEnabled: false,
    focusDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    autoStartBreaks: false
  };
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) return defaults;
    return { ...defaults, ...JSON.parse(raw) };
  } catch (e) {
    return defaults;
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

// Compute streak for a single habit
export function calculateHabitStreak(habit) {
  const history = habit.history || {};
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  const todayKey = getTodayKey();
  const d = new Date();
  
  // Check if today is completed
  const isDoneToday = Boolean(history[todayKey]);
  let checkDate = new Date();
  
  if (!isDoneToday) {
    // If not done today, streak may still be alive from yesterday
    checkDate.setDate(checkDate.getDate() - 1);
  }

  // Count backwards for current streak
  while (true) {
    const key = formatDateKey(checkDate);
    if (history[key]) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  // Calculate longest streak across history
  const sortedDates = Object.keys(history)
    .filter(k => history[k])
    .sort();

  if (sortedDates.length > 0) {
    tempStreak = 1;
    longestStreak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const prev = new Date(sortedDates[i - 1]);
      const curr = new Date(sortedDates[i]);
      const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak++;
        if (tempStreak > longestStreak) longestStreak = tempStreak;
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
    }
  }

  return {
    current: currentStreak,
    longest: Math.max(longestStreak, currentStreak),
    isCompletedToday: isDoneToday
  };
}

// Calculate general completion rate for today
export function getTodayStats(habits) {
  if (!habits || habits.length === 0) {
    return { total: 0, completed: 0, percentage: 0 };
  }
  const todayKey = getTodayKey();
  const completed = habits.filter(h => h.history && h.history[todayKey]).length;
  const percentage = Math.round((completed / habits.length) * 100);
  return {
    total: habits.length,
    completed,
    percentage
  };
}

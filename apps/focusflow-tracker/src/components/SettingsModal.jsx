import React, { useState, useRef } from 'react';
import { 
  X, 
  Settings, 
  Volume2, 
  VolumeX, 
  Download, 
  Upload, 
  RotateCcw, 
  Clock, 
  Check, 
  AlertTriangle 
} from 'lucide-react';
import { generateSeedHabits, generateSeedFocusSessions } from '../utils/storage';

export default function SettingsModal({ 
  isOpen, 
  onClose, 
  settings, 
  onSaveSettings, 
  habits, 
  focusSessions, 
  onImportAllData,
  onResetSampleData
}) {
  const [localSettings, setLocalSettings] = useState(settings);
  const [statusMessage, setStatusMessage] = useState('');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleChange = (key, value) => {
    const updated = { ...localSettings, [key]: value };
    setLocalSettings(updated);
    onSaveSettings(updated);
  };

  // Export JSON backup
  const handleExport = () => {
    const exportBundle = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      habits,
      focusSessions,
      settings: localSettings
    };

    const blob = new Blob([JSON.stringify(exportBundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `focusflow-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusMessage('Backup downloaded successfully!');
    setTimeout(() => setStatusMessage(''), 3000);
  };

  // Import JSON backup
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.habits && Array.isArray(parsed.habits)) {
          onImportAllData(parsed);
          setStatusMessage('Data imported successfully!');
          setTimeout(() => setStatusMessage(''), 3000);
        } else {
          alert('Invalid backup file format.');
        }
      } catch (err) {
        alert('Could not parse backup file.');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  const handleResetToSample = () => {
    if (window.confirm('Reset all habits, streaks, and sessions to the rich demo dataset?')) {
      onResetSampleData();
      setStatusMessage('Restored to sample demo dataset.');
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content animate-scale-up" 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="settings-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Settings size={18} className="text-indigo" />
            <h2 id="settings-modal-title" className="modal-title">Preferences & Data</h2>
          </div>
          <button 
            type="button" 
            className="modal-close-btn" 
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <div className="settings-body">
          {statusMessage && (
            <div className="status-toast-banner">
              <Check size={16} /> {statusMessage}
            </div>
          )}

          {/* Sound Settings */}
          <div className="settings-section">
            <h3 className="settings-section-title">Sound Effects</h3>
            
            <div className="setting-toggle-row">
              <div className="toggle-label-group">
                <span className="toggle-title">Completion Chimes</span>
                <span className="toggle-description">Play acoustic bell on habit check-in & timer finish</span>
              </div>
              <button
                type="button"
                className={`switch-toggle ${localSettings.soundEnabled ? 'active' : ''}`}
                onClick={() => handleChange('soundEnabled', !localSettings.soundEnabled)}
                aria-label="Toggle completion sounds"
              >
                <div className="switch-thumb" />
              </button>
            </div>

            <div className="setting-toggle-row">
              <div className="toggle-label-group">
                <span className="toggle-title">Subtle Focus Ticks</span>
                <span className="toggle-description">Soft heartbeat ticks while timer is actively running</span>
              </div>
              <button
                type="button"
                className={`switch-toggle ${localSettings.tickEnabled ? 'active' : ''}`}
                onClick={() => handleChange('tickEnabled', !localSettings.tickEnabled)}
                aria-label="Toggle timer ticks"
              >
                <div className="switch-thumb" />
              </button>
            </div>
          </div>

          {/* Timer Settings */}
          <div className="settings-section">
            <h3 className="settings-section-title">Pomodoro Durations</h3>
            
            <div className="timer-inputs-grid">
              <div className="timer-input-box">
                <label className="timer-input-label">Focus (mins)</label>
                <input
                  type="number"
                  min="5"
                  max="90"
                  className="number-input"
                  value={localSettings.focusDuration || 25}
                  onChange={(e) => handleChange('focusDuration', Number(e.target.value))}
                />
              </div>

              <div className="timer-input-box">
                <label className="timer-input-label">Short Break</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  className="number-input"
                  value={localSettings.shortBreakDuration || 5}
                  onChange={(e) => handleChange('shortBreakDuration', Number(e.target.value))}
                />
              </div>

              <div className="timer-input-box">
                <label className="timer-input-label">Long Break</label>
                <input
                  type="number"
                  min="5"
                  max="60"
                  className="number-input"
                  value={localSettings.longBreakDuration || 15}
                  onChange={(e) => handleChange('longBreakDuration', Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Data Backup & Restore */}
          <div className="settings-section">
            <h3 className="settings-section-title">Data Storage & Portability</h3>
            <p className="settings-section-desc">
              All habits and session logs are safely stored locally in your browser's LocalStorage.
            </p>

            <div className="data-actions-grid">
              <button 
                type="button" 
                className="btn-outline-action" 
                onClick={handleExport}
              >
                <Download size={15} />
                <span>Export JSON Backup</span>
              </button>

              <button 
                type="button" 
                className="btn-outline-action" 
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={15} />
                <span>Import JSON Backup</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>

            <div className="reset-data-box">
              <button 
                type="button" 
                className="btn-danger-outline" 
                onClick={handleResetToSample}
              >
                <RotateCcw size={14} />
                <span>Reset to Sample Demo Habits</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

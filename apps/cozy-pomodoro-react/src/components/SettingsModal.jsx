import React, { useEffect, useRef } from 'react';
import { X, Volume2, BellRing, Sliders, Check } from 'lucide-react';
import { soundManager } from '../utils/audioEngine';

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  setSettings
}) {
  const modalRef = useRef(null);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleFocusChange = (val) => {
    setSettings(prev => ({ ...prev, focusMinutes: Number(val) }));
  };

  const handleShortBreakChange = (val) => {
    setSettings(prev => ({ ...prev, shortBreakMinutes: Number(val) }));
  };

  const handleLongBreakChange = (val) => {
    setSettings(prev => ({ ...prev, longBreakMinutes: Number(val) }));
  };

  const handleToggleAutoStart = () => {
    soundManager.playClick();
    setSettings(prev => ({ ...prev, autoStartBreaks: !prev.autoStartBreaks }));
  };

  const testChime = () => {
    soundManager.playChime('complete');
  };

  return (
    <div 
      className="modal-backdrop animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="modal-container animate-scale-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        ref={modalRef}
      >
        <div className="modal-header">
          <div className="header-title-group">
            <Sliders size={20} className="text-pink" />
            <h2 id="settings-title" className="modal-title">Настройки таймера</h2>
          </div>
          <button
            type="button"
            className="btn-icon-close"
            onClick={onClose}
            aria-label="Закрыть настройки"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Focus duration */}
          <div className="setting-row">
            <div className="setting-label-wrap">
              <label htmlFor="focus-time-range" className="setting-label">
                🍅 Длительность фокуса
              </label>
              <span className="setting-value-badge">{settings.focusMinutes} мин</span>
            </div>
            <input
              id="focus-time-range"
              type="range"
              min="5"
              max="60"
              step="5"
              value={settings.focusMinutes}
              onChange={(e) => handleFocusChange(e.target.value)}
              className="settings-range"
            />
          </div>

          {/* Short break duration */}
          <div className="setting-row">
            <div className="setting-label-wrap">
              <label htmlFor="short-break-range" className="setting-label">
                ☕ Короткий перерыв
              </label>
              <span className="setting-value-badge">{settings.shortBreakMinutes} мин</span>
            </div>
            <input
              id="short-break-range"
              type="range"
              min="1"
              max="15"
              step="1"
              value={settings.shortBreakMinutes}
              onChange={(e) => handleShortBreakChange(e.target.value)}
              className="settings-range"
            />
          </div>

          {/* Long break duration */}
          <div className="setting-row">
            <div className="setting-label-wrap">
              <label htmlFor="long-break-range" className="setting-label">
                🌿 Длинный перерыв
              </label>
              <span className="setting-value-badge">{settings.longBreakMinutes} мин</span>
            </div>
            <input
              id="long-break-range"
              type="range"
              min="5"
              max="30"
              step="5"
              value={settings.longBreakMinutes}
              onChange={(e) => handleLongBreakChange(e.target.value)}
              className="settings-range"
            />
          </div>

          {/* Auto-start breaks */}
          <div className="setting-toggle-row">
            <div>
              <span className="setting-toggle-title">Автостарт перерывов</span>
              <p className="setting-toggle-desc">Запускать отдых сразу после завершения сессии</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.autoStartBreaks}
              className={`toggle-switch ${settings.autoStartBreaks ? 'toggle-on' : ''}`}
              onClick={handleToggleAutoStart}
            >
              <span className="toggle-slider" />
            </button>
          </div>

          {/* Sound test button */}
          <div className="setting-sound-test">
            <button
              type="button"
              className="btn-test-sound"
              onClick={testChime}
            >
              <BellRing size={16} />
              <span>Проверить звук колокольчика</span>
            </button>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn-save-modal"
            onClick={onClose}
          >
            <Check size={18} />
            <span>Готово</span>
          </button>
        </div>
      </div>
    </div>
  );
}

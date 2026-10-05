import React, { useState } from 'react';
import { CloudRain, Flame, Coffee, Wind, Volume2, VolumeX } from 'lucide-react';
import { soundManager } from '../utils/audioEngine';

const SOUNDS = [
  { id: 'rain', name: 'Тёплый дождь', icon: CloudRain, color: '#60A5FA', lightColor: '#EFF6FF' },
  { id: 'campfire', name: 'Камин / Костёр', icon: Flame, color: '#F97316', lightColor: '#FFF7ED' },
  { id: 'cafe', name: 'Атмосфера кафе', icon: Coffee, color: '#A855F7', lightColor: '#FAF5FF' },
  { id: 'breeze', name: 'Лесной бриз', icon: Wind, color: '#10B981', lightColor: '#ECFDF5' }
];

export default function SoundBar() {
  const [activeSounds, setActiveSounds] = useState({
    rain: false,
    campfire: false,
    cafe: false,
    breeze: false
  });

  const [volumes, setVolumes] = useState({
    rain: 0.5,
    campfire: 0.5,
    cafe: 0.5,
    breeze: 0.5
  });

  const toggleSound = (soundId) => {
    soundManager.playClick();
    const nextState = !activeSounds[soundId];
    setActiveSounds(prev => ({ ...prev, [soundId]: nextState }));
    soundManager.setAmbient(soundId, nextState, volumes[soundId]);
  };

  const handleVolumeChange = (soundId, newVolume) => {
    const vol = parseFloat(newVolume);
    setVolumes(prev => ({ ...prev, [soundId]: vol }));
    if (activeSounds[soundId]) {
      soundManager.setAmbient(soundId, true, vol);
    }
  };

  const hasAnyActive = Object.values(activeSounds).some(Boolean);

  const stopAll = () => {
    soundManager.playClick();
    soundManager.stopAllAmbient();
    setActiveSounds({
      rain: false,
      campfire: false,
      cafe: false,
      breeze: false
    });
  };

  return (
    <section className="card soundbar-card" aria-label="Фоновые звуки для концентрации">
      <div className="card-header">
        <div className="header-title-group">
          <span className="card-emoji">🎧</span>
          <h2 className="card-title">Уютные звуки природы</h2>
        </div>
        {hasAnyActive && (
          <button
            type="button"
            className="btn-text-subtle"
            onClick={stopAll}
            title="Выключить все звуки"
          >
            <VolumeX size={15} /> Выключить все
          </button>
        )}
      </div>

      <p className="card-subtitle">
        Включи нежный шум дождя или потрескивание огня, чтобы легче погрузиться в поток
      </p>

      <div className="sound-grid">
        {SOUNDS.map(sound => {
          const Icon = sound.icon;
          const isActive = activeSounds[sound.id];

          return (
            <div
              key={sound.id}
              className={`sound-pill ${isActive ? 'sound-active' : ''}`}
              style={{
                '--pill-accent': sound.color,
                '--pill-bg': sound.lightColor
              }}
            >
              <div className="sound-pill-main">
                <button
                  type="button"
                  className={`sound-toggle-btn ${isActive ? 'is-playing' : ''}`}
                  onClick={() => toggleSound(sound.id)}
                  aria-pressed={isActive}
                  aria-label={`${sound.name}: ${isActive ? 'остановить' : 'включить'}`}
                >
                  <Icon size={18} />
                  <span className="sound-name">{sound.name}</span>
                </button>
                <span className="sound-status-dot" aria-hidden="true" />
              </div>

              {isActive && (
                <div className="sound-slider-row animate-fade-in">
                  <Volume2 size={13} className="text-muted" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volumes[sound.id]}
                    onChange={(e) => handleVolumeChange(sound.id, e.target.value)}
                    className="sound-range-input"
                    aria-label={`Громкость для ${sound.name}`}
                  />
                  <span className="sound-volume-percent">
                    {Math.round(volumes[sound.id] * 100)}%
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

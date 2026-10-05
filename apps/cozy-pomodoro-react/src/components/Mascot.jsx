import React, { useState } from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { soundManager } from '../utils/audioEngine';

const QUOTES = [
  "Мурр! Ты отлично справляешься :3",
  "Сделай глубокий вдох и расслабь плечи ✨",
  "Маленькие шаги ведут к большим чудесам 🐾",
  "Не забудь выпить глоточек воды или чая 🍵",
  "Я верю в тебя! Давай ещё одну помидорку!",
  "Ты супер-звезда! Мяу~ 🌸",
  "Каждая минута фокуса — это вклад в твою мечту 💖"
];

export default function Mascot({ mode, isRunning, completedToday }) {
  const [speech, setSpeech] = useState("Привет! Давай поработаем вместе :3");
  const [bubbleKey, setBubbleKey] = useState(0);
  const [isWiggling, setIsWiggling] = useState(false);

  const handleMascotClick = () => {
    soundManager.playClick();
    const randomIndex = Math.floor(Math.random() * QUOTES.length);
    setSpeech(QUOTES[randomIndex]);
    setBubbleKey(prev => prev + 1);
    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 600);
  };

  const isBreak = mode === 'shortBreak' || mode === 'longBreak';

  return (
    <div className="mascot-container">
      {/* Speech bubble */}
      <div 
        key={bubbleKey} 
        className="mascot-bubble animate-pop"
        onClick={handleMascotClick}
        title="Нажми на меня!"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleMascotClick()}
      >
        <span>{speech}</span>
        <div className="bubble-tail"></div>
      </div>

      {/* Interactive SVG Mascot */}
      <div 
        className={`mascot-svg-wrapper ${isRunning ? 'animate-breathe' : 'mascot-sleeping'} ${isWiggling ? 'animate-wiggle' : ''}`}
        onClick={handleMascotClick}
        title="Котик Моти :3 (нажми, чтобы погладить)"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleMascotClick()}
      >
        <svg 
          viewBox="0 0 200 180" 
          width="180" 
          height="160" 
          className="mascot-svg"
        >
          <defs>
            <linearGradient id="furGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#FFF1F2" />
            </linearGradient>
            <linearGradient id="earGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FBCFE8" />
              <stop offset="100%" stopColor="#F472B6" />
            </linearGradient>
            <linearGradient id="cheeksGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FDA4AF" />
              <stop offset="100%" stopColor="#FB7185" />
            </linearGradient>
            <linearGradient id="cupGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C4B5FD" />
              <stop offset="100%" stopColor="#A78BFA" />
            </linearGradient>
          </defs>

          {/* Shadow */}
          <ellipse cx="100" cy="168" rx="65" ry="10" fill="#FCE7F3" opacity="0.8" />

          {/* Tail */}
          <path 
            d="M 150 140 Q 185 130 180 100 Q 175 80 165 90 Q 160 115 140 135 Z" 
            fill="#FFF1F2" 
            stroke="#FBCFE8" 
            strokeWidth="3"
            className="mascot-tail"
          />

          {/* Ears */}
          {/* Left Ear */}
          <path 
            d="M 45 75 Q 35 15 75 35 Z" 
            fill="url(#furGradient)" 
            stroke="#F472B6" 
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <path 
            d="M 48 70 Q 42 28 70 42 Z" 
            fill="url(#earGradient)" 
            opacity="0.75" 
          />

          {/* Right Ear */}
          <path 
            d="M 155 75 Q 165 15 125 35 Z" 
            fill="url(#furGradient)" 
            stroke="#F472B6" 
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <path 
            d="M 152 70 Q 158 28 130 42 Z" 
            fill="url(#earGradient)" 
            opacity="0.75" 
          />

          {/* Head & Body (cozy round pear shape) */}
          <ellipse 
            cx="100" 
            cy="110" 
            rx="64" 
            ry="58" 
            fill="url(#furGradient)" 
            stroke="#F472B6" 
            strokeWidth="3.5" 
          />

          {/* Forehead cute patch / spot */}
          <ellipse cx="100" cy="58" rx="14" ry="6" fill="#FCE7F3" opacity="0.9" />

          {/* Eyes */}
          {isRunning ? (
            isBreak ? (
              // Happy squint eyes when having break
              <g stroke="#475569" strokeWidth="3.5" strokeLinecap="round" fill="none">
                <path d="M 68 98 Q 78 88 88 98" />
                <path d="M 112 98 Q 122 88 132 98" />
              </g>
            ) : (
              // Big focused shiny eyes when focusing
              <g>
                <ellipse cx="78" cy="98" rx="7.5" ry="9.5" fill="#334155" />
                <circle cx="76" cy="95" r="3.2" fill="#FFFFFF" />
                <circle cx="81" cy="101" r="1.5" fill="#FFFFFF" />

                <ellipse cx="122" cy="98" rx="7.5" ry="9.5" fill="#334155" />
                <circle cx="120" cy="95" r="3.2" fill="#FFFFFF" />
                <circle cx="125" cy="101" r="1.5" fill="#FFFFFF" />
              </g>
            )
          ) : (
            // Peaceful sleeping eyes when paused
            <g stroke="#475569" strokeWidth="3.5" strokeLinecap="round" fill="none">
              <path d="M 68 100 Q 78 108 88 100" />
              <path d="M 112 100 Q 122 108 132 100" />
            </g>
          )}

          {/* Blush cheeks */}
          <ellipse cx="64" cy="112" rx="10" ry="6" fill="url(#cheeksGradient)" opacity="0.6" />
          <ellipse cx="136" cy="112" rx="10" ry="6" fill="url(#cheeksGradient)" opacity="0.6" />

          {/* Nose */}
          <polygon points="97,105 103,105 100,108" fill="#F43F5E" />

          {/* Mouth :3 */}
          <path 
            d="M 94 110 Q 97 114 100 110 Q 103 114 106 110" 
            stroke="#475569" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            fill="none" 
          />

          {/* Cute Whiskers */}
          <g stroke="#94A3B8" strokeWidth="2" strokeLinecap="round">
            <line x1="52" y1="104" x2="32" y2="101" />
            <line x1="52" y1="112" x2="30" y2="114" />
            <line x1="148" y1="104" x2="168" y2="101" />
            <line x1="148" y1="112" x2="170" y2="114" />
          </g>

          {/* Little front paws */}
          <ellipse cx="80" cy="148" rx="13" ry="10" fill="#FFFFFF" stroke="#F472B6" strokeWidth="3" />
          <ellipse cx="120" cy="148" rx="13" ry="10" fill="#FFFFFF" stroke="#F472B6" strokeWidth="3" />

          {/* Paw pads */}
          <circle cx="80" cy="149" r="4.5" fill="#FBCFE8" />
          <circle cx="120" cy="149" r="4.5" fill="#FBCFE8" />

          {/* Cup of hot tea if in break */}
          {isBreak && (
            <g className="mascot-tea animate-float">
              <rect x="91" y="132" width="18" height="20" rx="4" fill="url(#cupGradient)" stroke="#8B5CF6" strokeWidth="2" />
              <path d="M 109 137 Q 115 142 109 147" stroke="#8B5CF6" strokeWidth="2" fill="none" />
              {/* Steam */}
              <path d="M 96 128 Q 94 122 97 118" stroke="#DDD6FE" strokeWidth="2" strokeLinecap="round" fill="none" />
              <path d="M 103 126 Q 106 120 102 116" stroke="#DDD6FE" strokeWidth="2" strokeLinecap="round" fill="none" />
            </g>
          )}

          {/* Sleeping Zzz if paused */}
          {!isRunning && (
            <g className="animate-float-slow" fill="#A78BFA" fontWeight="800">
              <text x="145" y="70" fontSize="16">z</text>
              <text x="156" y="52" fontSize="20">Z</text>
              <text x="170" y="32" fontSize="24">Z</text>
            </g>
          )}
        </svg>
      </div>

      {/* Mascot bottom badge */}
      <div className="mascot-meta">
        <span className="mascot-name">Моти 🐾</span>
        {completedToday > 0 && (
          <span className="mascot-tag">
            <Heart size={13} className="text-pink inline-icon" /> {completedToday} фокус-сессий
          </span>
        )}
      </div>
    </div>
  );
}

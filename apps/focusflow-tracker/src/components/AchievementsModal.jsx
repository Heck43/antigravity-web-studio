import React from 'react';
import { 
  X, 
  Trophy, 
  Award, 
  Flame, 
  Zap, 
  Target, 
  Star, 
  CheckCircle2, 
  Lock 
} from 'lucide-react';

export default function AchievementsModal({ 
  isOpen, 
  onClose, 
  habits, 
  todayStats, 
  bestStreak, 
  focusSessions 
}) {
  if (!isOpen) return null;

  // Calculate statistics
  let totalCompletionsAllTime = 0;
  habits.forEach(h => {
    if (h.history) {
      totalCompletionsAllTime += Object.values(h.history).filter(Boolean).length;
    }
  });

  const totalFocusMins = focusSessions.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);

  // Badge list definition
  const badges = [
    {
      id: 'first-step',
      title: 'First Step',
      description: 'Log your first completed habit.',
      icon: Star,
      color: '#10b981',
      unlocked: totalCompletionsAllTime >= 1,
      progress: `${Math.min(totalCompletionsAllTime, 1)} / 1`
    },
    {
      id: 'three-day-streak',
      title: 'Momentum Builder',
      description: 'Reach an active streak of at least 3 days.',
      icon: Flame,
      color: '#f59e0b',
      unlocked: bestStreak >= 3,
      progress: `${Math.min(bestStreak, 3)} / 3 days`
    },
    {
      id: 'seven-day-streak',
      title: 'Unstoppable Habit',
      description: 'Achieve a 7-day consecutive streak.',
      icon: Award,
      color: '#6366f1',
      unlocked: bestStreak >= 7,
      progress: `${Math.min(bestStreak, 7)} / 7 days`
    },
    {
      id: 'focus-centurion',
      title: 'Deep Diver',
      description: 'Accumulate 50+ minutes of focused Pomodoro work.',
      icon: Zap,
      color: '#06b6d4',
      unlocked: totalFocusMins >= 50,
      progress: `${Math.min(totalFocusMins, 50)} / 50 mins`
    },
    {
      id: 'perfect-day',
      title: 'Flawless Routine',
      description: 'Complete 100% of all scheduled habits in a single day.',
      icon: Target,
      color: '#ec4899',
      unlocked: todayStats.percentage === 100 && todayStats.total > 0,
      progress: `${todayStats.percentage}% today`
    },
    {
      id: 'century-club',
      title: 'Century Club',
      description: 'Complete 100 total habit check-ins.',
      icon: Trophy,
      color: '#8b5cf6',
      unlocked: totalCompletionsAllTime >= 100,
      progress: `${Math.min(totalCompletionsAllTime, 100)} / 100 check-ins`
    }
  ];

  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content animate-scale-up" 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="achievements-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Trophy size={20} className="text-amber" />
            <h2 id="achievements-modal-title" className="modal-title">
              Achievements & Milestones
            </h2>
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

        <div className="achievements-body">
          {/* Header Summary */}
          <div className="achievements-summary-banner">
            <div>
              <span className="summary-title">Trophy Case</span>
              <p className="summary-subtext">Earn badges as you build discipline and focus habits.</p>
            </div>
            <div className="trophy-count-pill">
              <Trophy size={14} className="text-amber" />
              <span>{unlockedCount} of {badges.length} Unlocked</span>
            </div>
          </div>

          {/* Badges Grid */}
          <div className="badges-grid">
            {badges.map(badge => {
              const IconComp = badge.icon;
              return (
                <div 
                  key={badge.id} 
                  className={`badge-card ${badge.unlocked ? 'unlocked' : 'locked'}`}
                  style={{ '--badge-theme': badge.color }}
                >
                  <div className="badge-icon-box">
                    {badge.unlocked ? (
                      <IconComp size={24} style={{ color: badge.color }} />
                    ) : (
                      <Lock size={20} className="text-muted" />
                    )}
                  </div>
                  <div className="badge-info">
                    <div className="badge-name-row">
                      <h4 className="badge-title">{badge.title}</h4>
                      {badge.unlocked && (
                        <span className="badge-unlocked-tag">UNLOCKED</span>
                      )}
                    </div>
                    <p className="badge-description">{badge.description}</p>
                    <div className="badge-progress-tag">
                      <span>{badge.progress}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

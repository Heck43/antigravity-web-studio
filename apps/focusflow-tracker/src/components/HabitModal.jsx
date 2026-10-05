import React, { useState, useEffect } from 'react';
import { X, Sparkles, Check } from 'lucide-react';

const CATEGORIES = ['Focus', 'Health', 'Fitness', 'Mindset', 'Tech', 'Learning'];
const PRESET_COLORS = [
  '#6366f1', // Indigo
  '#10b981', // Emerald
  '#06b6d4', // Cyan
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#8b5cf6', // Violet
  '#3b82f6', // Blue
  '#14b8a6'  // Teal
];

export default function HabitModal({ isOpen, onClose, onSave, editingHabit }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Focus');
  const [targetFrequency, setTargetFrequency] = useState('Daily');
  const [color, setColor] = useState('#6366f1');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingHabit) {
      setTitle(editingHabit.title || '');
      setCategory(editingHabit.category || 'Focus');
      setTargetFrequency(editingHabit.targetFrequency || 'Daily');
      setColor(editingHabit.color || '#6366f1');
    } else {
      setTitle('');
      setCategory('Focus');
      setTargetFrequency('Daily');
      setColor('#6366f1');
    }
    setError('');
  }, [editingHabit, isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a habit name');
      return;
    }

    const payload = {
      title: title.trim(),
      category,
      targetFrequency,
      color,
      id: editingHabit ? editingHabit.id : `habit-${Date.now()}`
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content animate-scale-up" 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="habit-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Sparkles size={18} className="text-indigo" />
            <h2 id="habit-modal-title" className="modal-title">
              {editingHabit ? 'Edit Habit' : 'Create New Habit'}
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

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="form-error-banner">{error}</div>}

          {/* Habit Name */}
          <div className="form-group">
            <label htmlFor="habit-title-input" className="form-label">
              Habit Name *
            </label>
            <input
              id="habit-title-input"
              type="text"
              className="form-input"
              placeholder="e.g. 30m Coding / Reading / Morning Jog"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              autoFocus
              maxLength={60}
            />
          </div>

          {/* Category selection */}
          <div className="form-group">
            <label className="form-label">Category</label>
            <div className="category-select-grid">
              {CATEGORIES.map(cat => (
                <button
                  type="button"
                  key={cat}
                  className={`category-select-pill ${category === cat ? 'selected' : ''}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Frequency */}
          <div className="form-group">
            <label className="form-label">Frequency Target</label>
            <div className="frequency-options">
              {['Daily', 'Weekdays', 'Weekends'].map(freq => (
                <label key={freq} className="radio-pill-label">
                  <input
                    type="radio"
                    name="frequency"
                    value={freq}
                    checked={targetFrequency === freq}
                    onChange={(e) => setTargetFrequency(e.target.value)}
                  />
                  <span>{freq}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Color accent */}
          <div className="form-group">
            <label className="form-label">Accent Color</label>
            <div className="color-palette-grid">
              {PRESET_COLORS.map(c => (
                <button
                  type="button"
                  key={c}
                  className={`color-swatch-btn ${color === c ? 'active' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                  aria-label={`Select color ${c}`}
                >
                  {color === c && <Check size={14} className="text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="modal-actions-row">
            <button 
              type="button" 
              className="btn-cancel" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
            >
              {editingHabit ? 'Save Changes' : 'Create Habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

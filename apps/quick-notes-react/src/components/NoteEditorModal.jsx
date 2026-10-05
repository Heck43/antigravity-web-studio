import React, { useState, useEffect, useRef } from 'react';
import { X, Pin, Tag, Palette, Check } from 'lucide-react';
import { NOTE_COLORS } from '../sampleNotes';

export function NoteEditorModal({
  isOpen,
  onClose,
  onSave,
  editingNote
}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [color, setColor] = useState('cyan');
  const [pinned, setPinned] = useState(false);
  const [error, setError] = useState('');

  const titleInputRef = useRef(null);

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title || '');
      setContent(editingNote.content || '');
      setTagsInput(editingNote.tags ? editingNote.tags.join(', ') : '');
      setColor(editingNote.color || 'cyan');
      setPinned(editingNote.pinned || false);
    } else {
      setTitle('');
      setContent('');
      setTagsInput('');
      setColor('cyan');
      setPinned(false);
    }
    setError('');
  }, [editingNote, isOpen]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        titleInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        handleSubmit(e);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, title, content, tagsInput, color, pinned]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) {
      setError('Укажите хотя бы заголовок или текст заметки');
      return;
    }

    // Process tags
    const parsedTags = tagsInput
      .split(',')
      .map(t => t.trim().replace(/^#/, '').toLowerCase())
      .filter(t => t.length > 0);

    // Unique tags
    const uniqueTags = Array.from(new Set(parsedTags));

    onSave({
      id: editingNote ? editingNote.id : `note-${Date.now()}`,
      title: title.trim() || 'Без заголовка',
      content: content.trim(),
      tags: uniqueTags,
      color,
      pinned,
      createdAt: editingNote?.createdAt || Date.now(),
      updatedAt: Date.now()
    });

    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-heading"
      >
        <div className="modal-header">
          <h2 id="modal-heading" className="modal-title">
            {editingNote ? 'Редактировать заметку' : 'Создать новую заметку'}
          </h2>
          <button 
            type="button" 
            className="icon-btn modal-close-btn" 
            onClick={onClose}
            aria-label="Закрыть окно"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="form-error-banner">{error}</div>}

          <div className="form-group">
            <input
              ref={titleInputRef}
              type="text"
              className="input-title"
              placeholder="Заголовок заметки..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
            />
          </div>

          <div className="form-group">
            <textarea
              className="input-textarea"
              placeholder="Текст заметки... (можно писать списки, код или ссылки)"
              rows={8}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (error) setError('');
              }}
            />
          </div>

          <div className="form-group">
            <label className="field-label" htmlFor="tags-input">
              <Tag size={14} />
              <span>Теги (через запятую):</span>
            </label>
            <input
              id="tags-input"
              type="text"
              className="input-text"
              placeholder="работа, идеи, проект"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
            />
          </div>

          <div className="modal-options-row">
            <div className="color-picker-group">
              <span className="field-label-small">
                <Palette size={14} />
                <span>Цвет:</span>
              </span>
              <div className="color-swatches" role="radiogroup" aria-label="Цвет заметки">
                {NOTE_COLORS.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    className={`color-swatch-btn ${color === c.id ? 'active' : ''}`}
                    style={{ backgroundColor: c.border }}
                    onClick={() => setColor(c.id)}
                    title={c.label}
                    role="radio"
                    aria-checked={color === c.id}
                  >
                    {color === c.id && <Check size={12} color="#000" strokeWidth={3} />}
                  </button>
                ))}
              </div>
            </div>

            <label className="pin-toggle-label">
              <input
                type="checkbox"
                checked={pinned}
                onChange={(e) => setPinned(e.target.checked)}
              />
              <Pin size={15} className={pinned ? 'pinned-active' : ''} />
              <span>Закрепить сверху</span>
            </label>
          </div>

          <div className="modal-footer">
            <span className="keyboard-hint">Ctrl + Enter для сохранения</span>
            <div className="modal-buttons">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Отмена
              </button>
              <button type="submit" className="btn btn-primary">
                {editingNote ? 'Сохранить изменения' : 'Создать'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

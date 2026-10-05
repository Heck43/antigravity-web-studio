import React, { useState } from 'react';
import { Pin, Copy, Check, Edit3, Trash2, Calendar } from 'lucide-react';
import { NOTE_COLORS } from '../sampleNotes';

export function NoteCard({
  note,
  onTogglePin,
  onEditNote,
  onDeleteNote,
  onSelectTag
}) {
  const [copied, setCopied] = useState(false);

  const colorConfig = NOTE_COLORS.find(c => c.id === note.color) || NOTE_COLORS[0];

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      const fullText = `${note.title}\n\n${note.content}`;
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <article 
      className={`note-card ${note.pinned ? 'is-pinned' : ''}`}
      style={{
        '--note-accent': colorConfig.border,
        '--note-tint': colorConfig.bg,
        '--note-text-accent': colorConfig.text
      }}
    >
      <div className="card-top-bar">
        <span className="card-accent-pill" style={{ backgroundColor: colorConfig.border }}></span>
        <div className="card-actions-quick">
          <button
            type="button"
            className={`icon-btn pin-btn ${note.pinned ? 'pinned-active' : ''}`}
            onClick={() => onTogglePin(note.id)}
            title={note.pinned ? 'Открепить заметку' : 'Закрепить заметку вверху'}
            aria-label={note.pinned ? 'Открепить' : 'Закрепить'}
          >
            <Pin size={16} />
          </button>

          <button
            type="button"
            className="icon-btn"
            onClick={handleCopy}
            title="Скопировать заметку в буфер"
            aria-label="Скопировать заметку"
          >
            {copied ? <Check size={16} className="text-emerald" /> : <Copy size={16} />}
          </button>

          <button
            type="button"
            className="icon-btn"
            onClick={() => onEditNote(note)}
            title="Редактировать заметку"
            aria-label="Редактировать"
          >
            <Edit3 size={16} />
          </button>

          <button
            type="button"
            className="icon-btn icon-btn-danger"
            onClick={() => onDeleteNote(note.id)}
            title="Удалить заметку"
            aria-label="Удалить"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="card-content-area" onClick={() => onEditNote(note)}>
        <h3 className="card-title">{note.title}</h3>
        <p className="card-body-text">{note.content}</p>
      </div>

      {note.tags && note.tags.length > 0 && (
        <div className="card-tags-list">
          {note.tags.map((tag) => (
            <button
              key={tag}
              type="button"
              className="card-tag-badge"
              onClick={(e) => {
                e.stopPropagation();
                onSelectTag(tag);
              }}
              title={`Фильтровать по тегу #${tag}`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      <div className="card-footer">
        <span className="card-date">
          <Calendar size={12} />
          {formatDate(note.updatedAt || note.createdAt)}
        </span>
      </div>
    </article>
  );
}

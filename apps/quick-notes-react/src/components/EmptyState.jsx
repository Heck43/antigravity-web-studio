import React from 'react';
import { NotebookPen, SearchX, Plus } from 'lucide-react';

export function EmptyState({ isSearching, searchQuery, selectedTag, onResetFilter, onOpenCreateModal }) {
  if (isSearching || selectedTag) {
    return (
      <div className="empty-state">
        <div className="empty-icon-wrap">
          <SearchX size={36} className="text-muted" />
        </div>
        <h3 className="empty-title">Ничего не найдено</h3>
        <p className="empty-text">
          По запросу {searchQuery ? `«${searchQuery}»` : ''} {selectedTag ? `с тегом #${selectedTag}` : ''} заметок нет.
        </p>
        <button type="button" className="btn btn-secondary" onClick={onResetFilter}>
          Сбросить фильтры
        </button>
      </div>
    );
  }

  return (
    <div className="empty-state">
      <div className="empty-icon-wrap">
        <NotebookPen size={40} className="neon-icon-glow" />
      </div>
      <h3 className="empty-title">Заметок пока нет</h3>
      <p className="empty-text">
        Создайте свою первую заметку, чтобы сохранить важные мысли, ссылки или идеи.
      </p>
      <button type="button" className="btn btn-primary" onClick={onOpenCreateModal}>
        <Plus size={18} />
        <span>Создать заметку</span>
      </button>
    </div>
  );
}

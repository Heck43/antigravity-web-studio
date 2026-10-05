import React, { useRef } from 'react';
import { 
  Sparkles, 
  Search, 
  Plus, 
  Download, 
  Upload, 
  FileText, 
  Pin,
  Trash2
} from 'lucide-react';

export function Header({
  searchQuery,
  setSearchQuery,
  onOpenCreateModal,
  totalNotes,
  pinnedCount,
  onExportNotes,
  onImportNotes,
  onClearAllNotes
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportNotes(file);
      e.target.value = '';
    }
  };

  return (
    <header className="app-header">
      <div className="header-top">
        <div className="brand-group">
          <div className="brand-logo">
            <Sparkles className="neon-icon-glow" size={24} />
          </div>
          <div>
            <h1 className="app-title">Quick Notes</h1>
            <p className="app-subtitle">Быстрый умный блокнот на React</p>
          </div>
        </div>

        <div className="header-stats">
          <div className="stat-pill" title="Всего заметок в хранилище">
            <FileText size={15} />
            <span>Всего: <strong>{totalNotes}</strong></span>
          </div>
          <div className="stat-pill stat-pinned" title="Закрепленные заметки">
            <Pin size={15} />
            <span>Закреплено: <strong>{pinnedCount}</strong></span>
          </div>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onExportNotes}
            title="Экспортировать все заметки в JSON файл"
          >
            <Download size={16} />
            <span className="btn-label-desktop">Экспорт</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            style={{ display: 'none' }}
          />

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => fileInputRef.current?.click()}
            title="Импортировать заметки из JSON бэкапа"
          >
            <Upload size={16} />
            <span className="btn-label-desktop">Импорт</span>
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={onOpenCreateModal}
          >
            <Plus size={18} />
            <span>Новая заметка</span>
          </button>
        </div>
      </div>

      <div className="header-search-bar">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Поиск по названию, тексту или #тегам (нажмите «/»)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="global-search-input"
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
              aria-label="Очистить поиск"
            >
              ✕
            </button>
          )}
          <span className="search-shortcut-badge" aria-hidden="true">/</span>
        </div>
      </div>
    </header>
  );
}

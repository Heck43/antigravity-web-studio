import React from 'react';
import { Tag, ArrowDownUp } from 'lucide-react';

export function TagFilterBar({
  allTags,
  selectedTag,
  onSelectTag,
  sortOption,
  onSortChange
}) {
  return (
    <div className="filter-bar">
      <div className="tags-scroll-container">
        <button
          type="button"
          className={`tag-chip ${selectedTag === null ? 'active' : ''}`}
          onClick={() => onSelectTag(null)}
        >
          <Tag size={13} />
          <span>Все теги</span>
        </button>

        {allTags.map(({ tag, count }) => (
          <button
            key={tag}
            type="button"
            className={`tag-chip ${selectedTag === tag ? 'active' : ''}`}
            onClick={() => onSelectTag(selectedTag === tag ? null : tag)}
          >
            <span>#{tag}</span>
            <span className="tag-count">{count}</span>
          </button>
        ))}
      </div>

      <div className="sort-dropdown-wrapper">
        <ArrowDownUp size={14} className="sort-icon" />
        <select
          value={sortOption}
          onChange={(e) => onSortChange(e.target.value)}
          className="sort-select"
          aria-label="Сортировка заметок"
        >
          <option value="newest">Сначала новые</option>
          <option value="oldest">Сначала старые</option>
          <option value="title">По названию (А-Я)</option>
        </select>
      </div>
    </div>
  );
}

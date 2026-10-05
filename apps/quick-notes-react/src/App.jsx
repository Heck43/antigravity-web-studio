import React, { useState, useMemo, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { INITIAL_NOTES } from './sampleNotes';
import { Header } from './components/Header';
import { TagFilterBar } from './components/TagFilterBar';
import { NoteCard } from './components/NoteCard';
import { NoteEditorModal } from './components/NoteEditorModal';
import { EmptyState } from './components/EmptyState';
import { Toast } from './components/Toast';
import { Pin, Sparkles } from 'lucide-react';

export default function App() {
  const [notes, setNotes] = useLocalStorage('quick_notes_items_v1', INITIAL_NOTES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [sortOption, setSortOption] = useState('newest');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        const searchInput = document.getElementById('global-search-input');
        searchInput?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Compute all tags with usage counts
  const allTags = useMemo(() => {
    const counts = {};
    notes.forEach(note => {
      (note.tags || []).forEach(tag => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return Object.entries(counts).map(([tag, count]) => ({ tag, count }));
  }, [notes]);

  // Filter notes based on search & tag
  const filteredNotes = useMemo(() => {
    let result = [...notes];

    // Filter by tag
    if (selectedTag) {
      result = result.filter(note => (note.tags || []).includes(selectedTag));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(note => {
        const inTitle = note.title.toLowerCase().includes(q);
        const inContent = note.content.toLowerCase().includes(q);
        const inTags = (note.tags || []).some(t => t.toLowerCase().includes(q));
        return inTitle || inContent || inTags;
      });
    }

    // Sort notes
    result.sort((a, b) => {
      if (sortOption === 'newest') {
        return (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt);
      }
      if (sortOption === 'oldest') {
        return (a.updatedAt || a.createdAt) - (b.updatedAt || b.createdAt);
      }
      if (sortOption === 'title') {
        return a.title.localeCompare(b.title, 'ru');
      }
      return 0;
    });

    return result;
  }, [notes, searchQuery, selectedTag, sortOption]);

  const pinnedNotes = useMemo(() => filteredNotes.filter(n => n.pinned), [filteredNotes]);
  const otherNotes = useMemo(() => filteredNotes.filter(n => !n.pinned), [filteredNotes]);

  // Handlers
  const handleOpenCreate = () => {
    setEditingNote(null);
    setIsModalOpen(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const handleSaveNote = (savedNote) => {
    setNotes(prev => {
      const exists = prev.some(n => n.id === savedNote.id);
      if (exists) {
        return prev.map(n => n.id === savedNote.id ? savedNote : n);
      } else {
        return [savedNote, ...prev];
      }
    });
    showToast(editingNote ? 'Заметка обновлена' : 'Заметка создана', 'success');
  };

  const handleTogglePin = (id) => {
    setNotes(prev => prev.map(n => {
      if (n.id === id) {
        const nextState = !n.pinned;
        showToast(nextState ? 'Заметка закреплена' : 'Заметка откреплена', 'info');
        return { ...n, pinned: nextState };
      }
      return n;
    }));
  };

  const handleDeleteNote = (id) => {
    const target = notes.find(n => n.id === id);
    if (!target) return;
    if (window.confirm(`Удалить заметку «${target.title}»?`)) {
      setNotes(prev => prev.filter(n => n.id !== id));
      showToast('Заметка удалена', 'info');
    }
  };

  // Export JSON
  const handleExportNotes = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(notes, null, 2));
      const downloadAnchor = document.createElement('a');
      const filename = `quick-notes-backup-${new Date().toISOString().slice(0, 10)}.json`;
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", filename);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Заметки успешно экспортированы!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Ошибка при экспорте заметок', 'error');
    }
  };

  // Import JSON
  const handleImportNotes = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed)) {
          // Validate structure
          const validNotes = parsed.filter(item => item && typeof item.title === 'string');
          if (validNotes.length === 0) {
            showToast('В файле не обнаружены подходящие заметки', 'error');
            return;
          }
          setNotes(prev => {
            const existingIds = new Set(prev.map(p => p.id));
            const newEntries = validNotes.filter(item => !existingIds.has(item.id));
            return [...newEntries, ...prev];
          });
          showToast(`Импортировано заметок: ${validNotes.length}`, 'success');
        } else {
          showToast('Неверный формат файла JSON', 'error');
        }
      } catch (err) {
        console.error(err);
        showToast('Не удалось прочитать файл JSON', 'error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="app-container">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenCreateModal={handleOpenCreate}
        totalNotes={notes.length}
        pinnedCount={notes.filter(n => n.pinned).length}
        onExportNotes={handleExportNotes}
        onImportNotes={handleImportNotes}
      />

      <main className="app-main">
        <TagFilterBar
          allTags={allTags}
          selectedTag={selectedTag}
          onSelectTag={setSelectedTag}
          sortOption={sortOption}
          onSortChange={setSortOption}
        />

        {filteredNotes.length === 0 ? (
          <EmptyState
            isSearching={Boolean(searchQuery)}
            searchQuery={searchQuery}
            selectedTag={selectedTag}
            onResetFilter={() => {
              setSearchQuery('');
              setSelectedTag(null);
            }}
            onOpenCreateModal={handleOpenCreate}
          />
        ) : (
          <div className="notes-sections-wrapper">
            {/* Pinned Section */}
            {pinnedNotes.length > 0 && (
              <section className="notes-section">
                <div className="section-header">
                  <Pin size={16} className="pinned-section-icon" />
                  <h2 className="section-title">Закрепленные заметки</h2>
                  <span className="section-counter">{pinnedNotes.length}</span>
                </div>
                <div className="notes-grid">
                  {pinnedNotes.map(note => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onTogglePin={handleTogglePin}
                      onEditNote={handleEditNote}
                      onDeleteNote={handleDeleteNote}
                      onSelectTag={setSelectedTag}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Other Notes Section */}
            {otherNotes.length > 0 && (
              <section className="notes-section">
                {pinnedNotes.length > 0 && (
                  <div className="section-header">
                    <Sparkles size={16} className="other-section-icon" />
                    <h2 className="section-title">Все остальные</h2>
                    <span className="section-counter">{otherNotes.length}</span>
                  </div>
                )}
                <div className="notes-grid">
                  {otherNotes.map(note => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onTogglePin={handleTogglePin}
                      onEditNote={handleEditNote}
                      onDeleteNote={handleDeleteNote}
                      onSelectTag={setSelectedTag}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Quick Notes React • Локальное сохранение данных • Нажмите <kbd>/</kbd> для поиска</p>
      </footer>

      <NoteEditorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveNote}
        editingNote={editingNote}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />
    </div>
  );
}

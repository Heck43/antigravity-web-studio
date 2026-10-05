export const INITIAL_NOTES = [
  {
    id: 'note-1',
    title: '🚀 Добро пожаловать в Quick Notes',
    content: 'Это ваш персональный блокнот на React!\n\n• Добавляйте заметки через кнопку «Новая заметка» или шорткат\n• Закрепляйте важные мысли вверху списка\n• Используйте теги для быстрой фильтрации\n• Экспортируйте заметки в JSON или Markdown в любой момент.',
    tags: ['обучение', 'старт'],
    color: 'cyan',
    pinned: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
    updatedAt: Date.now() - 1000 * 60 * 60 * 2,
  },
  {
    id: 'note-2',
    title: '💡 Идеи для улучшения продукта',
    content: '1. Добавить поддержку чек-листов внутри заметки\n2. Реализовать синхронизацию с облаком\n3. Горячая клавиша: "/" для мгновенного перехода в строку поиска\n4. Цветовое кодирование карточек для разного контекста',
    tags: ['идеи', 'продукт'],
    color: 'violet',
    pinned: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
    updatedAt: Date.now() - 1000 * 60 * 30,
  },
  {
    id: 'note-3',
    title: '📦 Список покупок и оборудования',
    content: '• Механическая клавиатура с линейными свитчами\n• Подставка под монитор с кабель-менеджментом\n• USB-C хаб с поддержкой 4K@60Hz\n• Настольный коврик из микрофибры',
    tags: ['личное', 'покупки'],
    color: 'emerald',
    pinned: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24,
  },
  {
    id: 'note-4',
    title: '⚡ Шпаргалка по полезным командам',
    content: 'npm run dev — запуск сервера разработки\nnpm run build — проверка сборки в продакшн\n\nШорткаты в приложении:\n- Escape: закрыть модальное окно\n- Ctrl+Enter: сохранить заметку в редакторе',
    tags: ['разработка', 'шпаргалка'],
    color: 'amber',
    pinned: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 36,
    updatedAt: Date.now() - 1000 * 60 * 60 * 12,
  }
];

export const NOTE_COLORS = [
  { id: 'cyan', label: 'Циан', bg: 'rgba(6, 182, 212, 0.12)', border: '#06b6d4', text: '#22d3ee' },
  { id: 'violet', label: 'Фиолетовый', bg: 'rgba(139, 92, 246, 0.12)', border: '#8b5cf6', text: '#a78bfa' },
  { id: 'emerald', label: 'Изумрудный', bg: 'rgba(16, 185, 129, 0.12)', border: '#10b981', text: '#34d399' },
  { id: 'amber', label: 'Янтарный', bg: 'rgba(245, 158, 11, 0.12)', border: '#f59e0b', text: '#fbbf24' },
  { id: 'rose', label: 'Розовый', bg: 'rgba(244, 63, 94, 0.12)', border: '#f43f5e', text: '#fb7185' },
];

/**
 * Менеджер учебных задач (Study Task Manager)
 * Чистый JavaScript без сторонних библиотек (SPA, localStorage, CRUD, фильтрация, сортировка, статистика)
 */

(function () {
  'use strict';

  // Ключ для хранения в localStorage
  const STORAGE_KEY = 'study_task_manager_tasks_v1';

  // Демонстрационные задачи при первом запуске
  const INITIAL_TASKS = [
    {
      id: 'task-init-1',
      title: 'Подготовка к коллоквиуму по высшей математике',
      description: 'Повторить интегралы, ряды Тейлора и дифференциальные уравнения 2-го порядка.',
      priority: 'high',
      dueDate: getRelativeDateString(1), // завтра
      completed: false,
      createdAt: Date.now() - 3600000 * 24
    },
    {
      id: 'task-init-2',
      title: 'Лабораторная работа №3: Реляционные базы данных',
      description: 'Составить сложные SQL-запросы с JOIN, GROUP BY и подзапросами в PostgreSQL.',
      priority: 'medium',
      dueDate: getRelativeDateString(3), // через 3 дня
      completed: false,
      createdAt: Date.now() - 3600000 * 12
    },
    {
      id: 'task-init-3',
      title: 'Курсовая работа: согласовать план с научным руководителем',
      description: 'Отправить структуру первой главы и список актуальной литературы на почту.',
      priority: 'high',
      dueDate: getRelativeDateString(5), // через 5 дней
      completed: false,
      createdAt: Date.now() - 3600000 * 6
    },
    {
      id: 'task-init-4',
      title: 'Прочитать главу 4 по архитектуре операционных систем',
      description: 'Изучить семафоры Дейкстры, мьютексы и алгоритмы синхронизации процессов.',
      priority: 'low',
      dueDate: getRelativeDateString(-2), // 2 дня назад, уже сделано
      completed: true,
      createdAt: Date.now() - 3600000 * 48
    }
  ];

  // Состояние приложения
  let tasks = [];
  let currentFilter = 'all'; // 'all' | 'active' | 'completed' | 'high'
  let currentSort = 'dueDate-asc';
  let searchQuery = '';

  // DOM Элементы
  const taskForm = document.getElementById('taskForm');
  const taskTitleInput = document.getElementById('taskTitle');
  const taskDescriptionInput = document.getElementById('taskDescription');
  const taskPriorityInput = document.getElementById('taskPriority');
  const taskDueDateInput = document.getElementById('taskDueDate');
  const taskTitleError = document.getElementById('taskTitleError');
  const taskDueDateError = document.getElementById('taskDueDateError');

  const taskList = document.getElementById('taskList');
  const emptyState = document.getElementById('emptyState');
  const emptyStateTitle = document.getElementById('emptyStateTitle');
  const emptyStateMessage = document.getElementById('emptyStateMessage');
  const filteredCountBadge = document.getElementById('filteredCountBadge');

  // Статистика
  const statTotal = document.getElementById('statTotal');
  const statActive = document.getElementById('statActive');
  const statCompleted = document.getElementById('statCompleted');
  const statPercent = document.getElementById('statPercent');
  const progressBarFill = document.getElementById('progressBarFill');
  const progressBar = document.getElementById('progressBar');
  const currentDateBadge = document.getElementById('currentDateBadge');

  // Поиск и сортировка
  const searchInput = document.getElementById('searchInput');
  const searchClearBtn = document.getElementById('searchClearBtn');
  const sortSelect = document.getElementById('sortSelect');
  const filterChips = document.querySelectorAll('.filter-chip');

  // Модальное окно редактирования
  const editModal = document.getElementById('editModal');
  const editTaskForm = document.getElementById('editTaskForm');
  const editTaskId = document.getElementById('editTaskId');
  const editTaskTitle = document.getElementById('editTaskTitle');
  const editTaskDescription = document.getElementById('editTaskDescription');
  const editTaskPriority = document.getElementById('editTaskPriority');
  const editTaskDueDate = document.getElementById('editTaskDueDate');
  const editTaskTitleError = document.getElementById('editTaskTitleError');
  const editTaskDueDateError = document.getElementById('editTaskDueDateError');
  const editModalCloseBtn = document.getElementById('editModalCloseBtn');
  const editModalCancelBtn = document.getElementById('editModalCancelBtn');

  // Контейнер уведомлений
  const toastContainer = document.getElementById('toastContainer');

  // ==========================================================================
  // Вспомогательные функции дат
  // ==========================================================================

  function getRelativeDateString(daysOffset) {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    return formatDateToISO(d);
  }

  function formatDateToISO(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function formatHumanDate(dateStr) {
    if (!dateStr) return 'Без срока';

    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;

    const targetDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const diffDays = Math.round((targetDate - today) / (1000 * 60 * 60 * 24));

    const months = [
      'янв.', 'фев.', 'мар.', 'апр.', 'мая', 'июн.',
      'июл.', 'авг.', 'сен.', 'окт.', 'нояб.', 'дек.'
    ];

    const formattedDayMonth = `${targetDate.getDate()} ${months[targetDate.getMonth()]}`;

    if (diffDays === 0) {
      return { text: `Сегодня (${formattedDayMonth})`, status: 'today' };
    } else if (diffDays === 1) {
      return { text: `Завтра (${formattedDayMonth})`, status: 'tomorrow' };
    } else if (diffDays === -1) {
      return { text: `Вчера (${formattedDayMonth})`, status: 'overdue' };
    } else if (diffDays < 0) {
      return { text: `Просрочено (${formattedDayMonth})`, status: 'overdue' };
    } else if (diffDays <= 7) {
      return { text: `${formattedDayMonth} (через ${diffDays} дн.)`, status: 'upcoming' };
    }

    return { text: formattedDayMonth, status: 'normal' };
  }

  function renderCurrentDate() {
    if (!currentDateBadge) return;
    const now = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const dateFormatted = now.toLocaleDateString('ru-RU', options);
    // Делаем первую букву заглавной
    currentDateBadge.textContent = dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1);
  }

  // ==========================================================================
  // Хранилище (localStorage)
  // ==========================================================================

  function loadTasks() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          tasks = parsed;
          return;
        }
      }
    } catch (err) {
      console.warn('Не удалось прочитать задачи из localStorage, используем стартовые', err);
    }
    // Если пусто или ошибка — инициализируем стартовыми учебными задачами
    tasks = [...INITIAL_TASKS];
    saveTasks();
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (err) {
      console.error('Ошибка сохранения в localStorage:', err);
      showToast('Ошибка сохранения данных в браузере', 'danger');
    }
  }

  // ==========================================================================
  // Статистика
  // ==========================================================================

  function updateStatistics() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const active = total - completed;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    statTotal.textContent = total;
    statActive.textContent = active;
    statCompleted.textContent = completed;
    statPercent.textContent = `${percent}%`;

    progressBarFill.style.width = `${percent}%`;
    progressBar.setAttribute('aria-valuenow', percent);
  }

  // ==========================================================================
  // Фильтрация и сортировка
  // ==========================================================================

  function getProcessedTasks() {
    let result = [...tasks];

    // 1. Фильтрация
    if (currentFilter === 'active') {
      result = result.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
      result = result.filter(t => t.completed);
    } else if (currentFilter === 'high') {
      result = result.filter(t => t.priority === 'high');
    }

    // 2. Поиск по строке
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(t => 
        (t.title && t.title.toLowerCase().includes(q)) || 
        (t.description && t.description.toLowerCase().includes(q))
      );
    }

    // 3. Сортировка
    const priorityWeights = { high: 3, medium: 2, low: 1 };

    result.sort((a, b) => {
      if (currentSort === 'dueDate-asc') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      } else if (currentSort === 'dueDate-desc') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return b.dueDate.localeCompare(a.dueDate);
      } else if (currentSort === 'priority-desc') {
        const weightDiff = (priorityWeights[b.priority] || 0) - (priorityWeights[a.priority] || 0);
        if (weightDiff !== 0) return weightDiff;
        // при одинаковом приоритете — ближайший дедлайн
        return (a.dueDate || '').localeCompare(b.dueDate || '');
      } else if (currentSort === 'created-desc') {
        return (b.createdAt || 0) - (a.createdAt || 0);
      }
      return 0;
    });

    return result;
  }

  // ==========================================================================
  // Отрисовка задач
  // ==========================================================================

  function renderTasks() {
    updateStatistics();

    const filtered = getProcessedTasks();
    filteredCountBadge.textContent = `${filtered.length} ${pluralizeTasks(filtered.length)}`;

    // Очистка списка
    taskList.innerHTML = '';

    if (filtered.length === 0) {
      taskList.hidden = true;
      emptyState.hidden = false;

      if (searchQuery.trim() !== '') {
        emptyStateTitle.textContent = 'Ничего не найдено';
        emptyStateMessage.textContent = `По запросу «${searchQuery}» нет совпадений. Попробуйте изменить формулировку.`;
      } else if (currentFilter === 'active') {
        emptyStateTitle.textContent = 'Нет активных задач';
        emptyStateMessage.textContent = 'Отличная работа! Все запланированные задачи уже выполнены.';
      } else if (currentFilter === 'completed') {
        emptyStateTitle.textContent = 'Нет выполненных задач';
        emptyStateMessage.textContent = 'Отмечайте выполненные задания галочкой, чтобы видеть свой прогресс.';
      } else if (currentFilter === 'high') {
        emptyStateTitle.textContent = 'Нет задач с высоким приоритетом';
        emptyStateMessage.textContent = 'Срочных заданий сейчас нет. Можно спокойно заняться текущими делами.';
      } else {
        emptyStateTitle.textContent = 'Список учебных задач пуст';
        emptyStateMessage.textContent = 'Добавьте первую задачу с помощью формы, чтобы не забыть о дедлайне.';
      }
      return;
    }

    taskList.hidden = false;
    emptyState.hidden = true;

    const priorityLabels = {
      high: 'Высокий',
      medium: 'Средний',
      low: 'Низкий'
    };

    filtered.forEach(task => {
      const li = document.createElement('li');
      li.className = `task-item priority-${task.priority} ${task.completed ? 'completed' : ''}`;
      li.setAttribute('data-id', task.id);

      const dateMeta = formatHumanDate(task.dueDate);
      const isOverdue = !task.completed && (dateMeta.status === 'overdue' || (dateMeta.status === 'today'));

      let dateBadgeClass = 'badge badge-date';
      if (!task.completed) {
        if (dateMeta.status === 'overdue') dateBadgeClass += ' date-overdue';
        else if (dateMeta.status === 'today') dateBadgeClass += ' date-today';
      }

      li.innerHTML = `
        <div class="task-checkbox-wrapper">
          <input 
            type="checkbox" 
            class="task-checkbox" 
            aria-label="Отметить задачу «${escapeHtml(task.title)}» как выполненную"
            ${task.completed ? 'checked' : ''}
          >
        </div>
        <div class="task-content">
          <h3 class="task-title">${escapeHtml(task.title)}</h3>
          ${task.description ? `<p class="task-desc">${escapeHtml(task.description)}</p>` : ''}
          <div class="task-meta">
            <span class="badge badge-priority-${task.priority}">
              <span aria-hidden="true">&#9679;</span>
              ${priorityLabels[task.priority] || 'Обычный'}
            </span>
            <span class="${dateBadgeClass}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              ${escapeHtml(dateMeta.text)}
            </span>
            ${task.completed ? '<span class="badge" style="background:#ecfdf5;color:#059669;">✓ Сдано</span>' : ''}
          </div>
        </div>
        <div class="task-actions">
          <button type="button" class="btn-icon btn-edit" title="Редактировать задачу" aria-label="Редактировать «${escapeHtml(task.title)}»">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button type="button" class="btn-icon btn-delete" title="Удалить задачу" aria-label="Удалить «${escapeHtml(task.title)}»">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      `;

      // Привязка обработчиков внутри задачи
      const checkbox = li.querySelector('.task-checkbox');
      checkbox.addEventListener('change', () => toggleTaskCompletion(task.id));

      const editBtn = li.querySelector('.btn-edit');
      editBtn.addEventListener('click', () => openEditModal(task.id));

      const deleteBtn = li.querySelector('.btn-delete');
      deleteBtn.addEventListener('click', () => deleteTask(task.id));

      taskList.appendChild(li);
    });
  }

  // ==========================================================================
  // Операции над задачами (CRUD)
  // ==========================================================================

  function handleAddTask(e) {
    e.preventDefault();

    const title = taskTitleInput.value.trim();
    const description = taskDescriptionInput.value.trim();
    const priority = taskPriorityInput.value;
    const dueDate = taskDueDateInput.value;

    let hasError = false;

    if (!title) {
      taskTitleInput.classList.add('input-error');
      taskTitleError.classList.add('visible');
      hasError = true;
    } else {
      taskTitleInput.classList.remove('input-error');
      taskTitleError.classList.remove('visible');
    }

    if (!dueDate) {
      taskDueDateInput.classList.add('input-error');
      taskDueDateError.classList.add('visible');
      hasError = true;
    } else {
      taskDueDateInput.classList.remove('input-error');
      taskDueDateError.classList.remove('visible');
    }

    if (hasError) return;

    const newTask = {
      id: 'task-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      title: title,
      description: description,
      priority: priority,
      dueDate: dueDate,
      completed: false,
      createdAt: Date.now()
    };

    tasks.unshift(newTask);
    saveTasks();
    renderTasks();

    // Сброс формы и фокус
    taskForm.reset();
    setDefaultDueDate();
    showToast('Задача успешно добавлена!', 'success');
  }

  function toggleTaskCompletion(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    task.completed = !task.completed;
    saveTasks();
    renderTasks();

    const statusMessage = task.completed 
      ? `Задача «${task.title}» выполнена!` 
      : `Задача «${task.title}» возвращена в работу`;
    showToast(statusMessage, task.completed ? 'success' : 'info');
  }

  function deleteTask(taskId) {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;

    const taskTitle = tasks[taskIndex].title;
    tasks.splice(taskIndex, 1);
    saveTasks();
    renderTasks();

    showToast(`Задача «${taskTitle}» удалена`, 'info');
  }

  // ==========================================================================
  // Модальное окно редактирования
  // ==========================================================================

  function openEditModal(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    editTaskId.value = task.id;
    editTaskTitle.value = task.title;
    editTaskDescription.value = task.description || '';
    editTaskPriority.value = task.priority;
    editTaskDueDate.value = task.dueDate;

    editTaskTitle.classList.remove('input-error');
    editTaskTitleError.classList.remove('visible');
    editTaskDueDate.classList.remove('input-error');
    editTaskDueDateError.classList.remove('visible');

    editModal.hidden = false;
    editTaskTitle.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeEditModal() {
    editModal.hidden = true;
    document.body.style.overflow = '';
  }

  function handleSaveEdit(e) {
    e.preventDefault();

    const taskId = editTaskId.value;
    const title = editTaskTitle.value.trim();
    const description = editTaskDescription.value.trim();
    const priority = editTaskPriority.value;
    const dueDate = editTaskDueDate.value;

    let hasError = false;

    if (!title) {
      editTaskTitle.classList.add('input-error');
      editTaskTitleError.classList.add('visible');
      hasError = true;
    } else {
      editTaskTitle.classList.remove('input-error');
      editTaskTitleError.classList.remove('visible');
    }

    if (!dueDate) {
      editTaskDueDate.classList.add('input-error');
      editTaskDueDateError.classList.add('visible');
      hasError = true;
    } else {
      editTaskDueDate.classList.remove('input-error');
      editTaskDueDateError.classList.remove('visible');
    }

    if (hasError) return;

    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.title = title;
      task.description = description;
      task.priority = priority;
      task.dueDate = dueDate;
      task.updatedAt = Date.now();

      saveTasks();
      renderTasks();
      closeEditModal();
      showToast('Изменения сохранены!', 'success');
    }
  }

  // ==========================================================================
  // Уведомления (Toasts)
  // ==========================================================================

  function showToast(message, type = 'info') {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');

    const iconSvg = type === 'success'
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';

    toast.innerHTML = `
      <span aria-hidden="true">${iconSvg}</span>
      <span>${escapeHtml(message)}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 260);
    }, 2800);
  }

  // ==========================================================================
  // Утилиты
  // ==========================================================================

  function escapeHtml(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function pluralizeTasks(count) {
    const abs = Math.abs(count) % 100;
    const d = abs % 10;
    if (abs > 10 && abs < 20) return 'задач';
    if (d > 1 && d < 5) return 'задачи';
    if (d === 1) return 'задача';
    return 'задач';
  }

  function setDefaultDueDate() {
    // По умолчанию ставим дедлайн через 2 дня
    taskDueDateInput.value = getRelativeDateString(2);
  }

  // ==========================================================================
  // Инициализация событий
  // ==========================================================================

  function initEventListeners() {
    // Форма добавления задачи
    taskForm.addEventListener('submit', handleAddTask);

    // Очистка ошибок при вводе
    taskTitleInput.addEventListener('input', () => {
      if (taskTitleInput.value.trim()) {
        taskTitleInput.classList.remove('input-error');
        taskTitleError.classList.remove('visible');
      }
    });

    taskDueDateInput.addEventListener('input', () => {
      if (taskDueDateInput.value) {
        taskDueDateInput.classList.remove('input-error');
        taskDueDateError.classList.remove('visible');
      }
    });

    // Форма редактирования
    editTaskForm.addEventListener('submit', handleSaveEdit);
    editModalCloseBtn.addEventListener('click', closeEditModal);
    editModalCancelBtn.addEventListener('click', closeEditModal);

    // Клик вне модального окна закрывает его
    editModal.addEventListener('click', (e) => {
      if (e.target === editModal) closeEditModal();
    });

    // Клавиша Escape закрывает модальное окно
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !editModal.hidden) {
        closeEditModal();
      }
    });

    // Фильтры
    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        filterChips.forEach(c => {
          c.classList.remove('active');
          c.setAttribute('aria-selected', 'false');
        });
        chip.classList.add('active');
        chip.setAttribute('aria-selected', 'true');
        currentFilter = chip.getAttribute('data-filter') || 'all';
        renderTasks();
      });
    });

    // Сортировка
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderTasks();
    });

    // Поиск
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      searchClearBtn.hidden = searchQuery.trim() === '';
      renderTasks();
    });

    searchClearBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      searchClearBtn.hidden = true;
      searchInput.focus();
      renderTasks();
    });
  }

  // Запуск при старте
  function init() {
    renderCurrentDate();
    loadTasks();
    setDefaultDueDate();
    initEventListeners();
    renderTasks();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

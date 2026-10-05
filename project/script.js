/**
 * МЕНЕДЖЕР УЧЕБНЫХ ЗАДАЧ (StudyTaskManager)
 * Модульная реализация на чистом JavaScript (ES6+) без внешних библиотек
 * Возможности:
 * - Добавление, редактирование, удаление задач
 * - Отметка выполнения с мгновенным пересчетом статистики
 * - Фильтры: Все, Активные, Выполненные, Высокий приоритет
 * - Сортировка: по дедлайну, по приоритету, по дате создания
 * - Живой поиск по названию и описанию
 * - Персистентность через localStorage с обработкой ошибок
 * - Калькулятор дедлайнов (просрочено / сегодня / завтра / дни)
 * - Демо-данные для учебных задач
 * - Всплывающие уведомления (Toasts)
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. КОНСТАНТЫ И НАСТРОЙКИ
  // =========================================================================
  const STORAGE_KEY = 'study_task_manager_v2';

  // Демо-набор учебных задач для первого запуска
  const INITIAL_SAMPLE_TASKS = [
    {
      id: 'task-sample-1',
      title: 'Подготовка к коллоквиуму по математическому анализу',
      description: 'Повторить билеты 1-15, выучить доказательства теорем Коши и Лагранжа.',
      priority: 'high',
      deadline: getOffsetDateString(1), // Завтра
      completed: false,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'task-sample-2',
      title: 'Курсовая работа: черновик теоретической главы',
      description: 'Составить список источников (не менее 20) и написать введение по ГОСТу.',
      priority: 'high',
      deadline: getOffsetDateString(4), // Через 4 дня
      completed: false,
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: 'task-sample-3',
      title: 'Лабораторная работа №3: Архитектура БД',
      description: 'Построить ER-диаграмму и написать SQL-скрипты для создания триггеров.',
      priority: 'medium',
      deadline: getOffsetDateString(7), // Через неделю
      completed: false,
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
    {
      id: 'task-sample-4',
      title: 'Прочитать статью по машинному обучению',
      description: 'Разобрать архитектуру Transformer и сделать краткий конспект к семинару.',
      priority: 'low',
      deadline: getOffsetDateString(10), // Через 10 дней
      completed: true,
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    }
  ];

  // Вспомогательная функция для генерации смещенных дат (YYYY-MM-DD)
  function getOffsetDateString(daysOffset) {
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

  // =========================================================================
  // 2. СОСТОЯНИЕ ПРИЛОЖЕНИЯ (State)
  // =========================================================================
  const state = {
    tasks: [],
    filter: 'all', // 'all' | 'active' | 'completed' | 'high'
    search: '',
    sort: 'deadline-asc', // 'deadline-asc' | 'deadline-desc' | 'priority-desc' | 'priority-asc' | 'created-desc' | 'created-asc'
    editingId: null
  };

  // =========================================================================
  // 3. ССЫЛКИ НА ЭЛЕМЕНТЫ DOM (DOM Elements Cache)
  // =========================================================================
  const dom = {
    // Форма добавления
    taskForm: document.getElementById('task-form'),
    taskTitle: document.getElementById('task-title'),
    taskDescription: document.getElementById('task-description'),
    taskPriority: document.getElementById('task-priority'),
    taskDeadline: document.getElementById('task-deadline'),
    titleError: document.getElementById('title-error'),
    deadlineError: document.getElementById('deadline-error'),

    // Панель задач
    tasksList: document.getElementById('tasks-list'),
    emptyState: document.getElementById('empty-state'),
    taskSearch: document.getElementById('task-search'),
    clearSearch: document.getElementById('clear-search'),
    taskSort: document.getElementById('task-sort'),
    filteredCount: document.getElementById('filtered-count'),
    filterButtons: document.querySelectorAll('.filter-btn'),

    // Статистика
    statTotal: document.getElementById('stat-total'),
    statCompleted: document.getElementById('stat-completed'),
    statPending: document.getElementById('stat-pending'),
    statPercent: document.getElementById('stat-percent'),
    progressFill: document.getElementById('progress-fill'),
    progressContainer: document.getElementById('progress-container'),

    // Счетчики фильтров
    countAll: document.getElementById('count-all'),
    countActive: document.getElementById('count-active'),
    countCompleted: document.getElementById('count-completed'),
    countHigh: document.getElementById('count-high'),

    // Кнопка сброса к примерам
    btnQuickSample: document.getElementById('btn-quick-sample'),

    // Модальное окно редактирования
    editModal: document.getElementById('edit-modal'),
    modalCloseBtn: document.getElementById('modal-close-btn'),
    modalCancelBtn: document.getElementById('modal-cancel-btn'),
    editForm: document.getElementById('edit-form'),
    editTaskId: document.getElementById('edit-task-id'),
    editTitle: document.getElementById('edit-title'),
    editDescription: document.getElementById('edit-description'),
    editPriority: document.getElementById('edit-priority'),
    editDeadline: document.getElementById('edit-deadline'),
    editCompleted: document.getElementById('edit-completed'),
    editTitleError: document.getElementById('edit-title-error'),
    editDeadlineError: document.getElementById('edit-deadline-error'),

    // Тосты
    toastContainer: document.getElementById('toast-container')
  };

  // =========================================================================
  // 4. РАБОТА С LOCALSTORAGE
  // =========================================================================
  function loadTasksFromStorage() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Ошибка чтения из localStorage:', err);
    }
    // Если пусто или ошибка — загружаем начальные учебные задачи
    return [...INITIAL_SAMPLE_TASKS];
  }

  function saveTasksToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
    } catch (err) {
      console.error('Ошибка записи в localStorage:', err);
      showToast('Не удалось сохранить данные в хранилище браузера', 'danger');
    }
  }

  // =========================================================================
  // 5. ВАЛИДАЦИЯ И БЕЗОПАСНОСТЬ (Validation & Escaping)
  // =========================================================================
  function escapeHTML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function validateTaskInput(titleInput, deadlineInput, titleErrorEl, deadlineErrorEl) {
    let isValid = true;

    const titleValue = titleInput.value.trim();
    if (!titleValue) {
      titleInput.classList.add('input-invalid');
      if (titleErrorEl) titleErrorEl.classList.add('visible');
      isValid = false;
    } else {
      titleInput.classList.remove('input-invalid');
      if (titleErrorEl) titleErrorEl.classList.remove('visible');
    }

    const deadlineValue = deadlineInput.value.trim();
    if (!deadlineValue) {
      deadlineInput.classList.add('input-invalid');
      if (deadlineErrorEl) deadlineErrorEl.classList.add('visible');
      isValid = false;
    } else {
      deadlineInput.classList.remove('input-invalid');
      if (deadlineErrorEl) deadlineErrorEl.classList.remove('visible');
    }

    return isValid;
  }

  // Сброс ошибок формы при вводе
  function setupInputValidationClear(input, errorEl) {
    input.addEventListener('input', () => {
      input.classList.remove('input-invalid');
      if (errorEl) errorEl.classList.remove('visible');
    });
  }

  // =========================================================================
  // 6. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ ДАТ И ДЕДЛАЙНОВ
  // =========================================================================
  function getDeadlineMeta(deadlineStr, isCompleted) {
    if (!deadlineStr) {
      return { text: 'Бессрочно', isOverdue: false, isToday: false, badgeClass: '' };
    }

    const todayStr = formatDateToISO(new Date());

    // Форматирование даты в красивый вид (например: 15 окт. 2026)
    const [year, month, day] = deadlineStr.split('-').map(Number);
    const deadlineDate = new Date(year, month - 1, day);
    const months = ['янв.', 'фев.', 'мар.', 'апр.', 'мая', 'июн.', 'июл.', 'авг.', 'сен.', 'окт.', 'ноя.', 'дек.'];
    const formattedDate = `${day} ${months[month - 1]} ${year}`;

    if (isCompleted) {
      return {
        text: `Срок: ${formattedDate}`,
        isOverdue: false,
        isToday: false,
        badgeClass: ''
      };
    }

    // Расчет разницы в днях
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(year, month - 1, day);
    target.setHours(0, 0, 0, 0);

    const diffMs = target.getTime() - today.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      const overdueDays = Math.abs(diffDays);
      const daysText = pluralizeDays(overdueDays);
      return {
        text: `Просрочено на ${overdueDays} ${daysText} (${formattedDate})`,
        isOverdue: true,
        isToday: false,
        badgeClass: 'overdue'
      };
    } else if (diffDays === 0) {
      return {
        text: `Сегодня дедлайн! (${formattedDate})`,
        isOverdue: false,
        isToday: true,
        badgeClass: 'due-today'
      };
    } else if (diffDays === 1) {
      return {
        text: `Завтра (${formattedDate})`,
        isOverdue: false,
        isToday: false,
        badgeClass: ''
      };
    } else {
      const daysText = pluralizeDays(diffDays);
      return {
        text: `Осталось ${diffDays} ${daysText} (${formattedDate})`,
        isOverdue: false,
        isToday: false,
        badgeClass: ''
      };
    }
  }

  function pluralizeDays(count) {
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (mod100 >= 11 && mod100 <= 19) return 'дней';
    if (mod10 === 1) return 'день';
    if (mod10 >= 2 && mod10 <= 4) return 'дня';
    return 'дней';
  }

  function getPriorityLabel(priority) {
    switch (priority) {
      case 'high':
        return 'Высокий';
      case 'medium':
        return 'Средний';
      case 'low':
      default:
        return 'Низкий';
    }
  }

  // =========================================================================
  // 7. СОРТИРОВКА И ФИЛЬТРАЦИЯ
  // =========================================================================
  function getFilteredAndSortedTasks() {
    // 1. Фильтрация
    let list = state.tasks.filter(task => {
      // Таб-фильтр
      if (state.filter === 'active' && task.completed) return false;
      if (state.filter === 'completed' && !task.completed) return false;
      if (state.filter === 'high' && task.priority !== 'high') return false;

      // Поиск по тексту
      if (state.search) {
        const query = state.search.toLowerCase();
        const inTitle = (task.title || '').toLowerCase().includes(query);
        const inDesc = (task.description || '').toLowerCase().includes(query);
        if (!inTitle && !inDesc) return false;
      }

      return true;
    });

    // 2. Сортировка
    const priorityWeight = { high: 3, medium: 2, low: 1 };

    list.sort((a, b) => {
      // Завершенные задачи обычно визуально остаются на своем месте или в зависимости от выбранной сортировки
      switch (state.sort) {
        case 'deadline-asc': {
          // Сначала ближайшие дедлайны
          if (!a.deadline && !b.deadline) return 0;
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return a.deadline.localeCompare(b.deadline);
        }
        case 'deadline-desc': {
          // Сначала дальние дедлайны
          if (!a.deadline && !b.deadline) return 0;
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return b.deadline.localeCompare(a.deadline);
        }
        case 'priority-desc': {
          const diff = (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
          if (diff !== 0) return diff;
          return (a.deadline || '').localeCompare(b.deadline || '');
        }
        case 'priority-asc': {
          const diff = (priorityWeight[a.priority] || 0) - (priorityWeight[b.priority] || 0);
          if (diff !== 0) return diff;
          return (a.deadline || '').localeCompare(b.deadline || '');
        }
        case 'created-asc': {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        case 'created-desc':
        default: {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      }
    });

    return list;
  }

  // =========================================================================
  // 8. РЕНДЕРИНГ И ОБНОВЛЕНИЕ ИНТЕРФЕЙСА (Render Engine)
  // =========================================================================
  function render() {
    renderStats();
    renderTasks();
  }

  function renderStats() {
    const total = state.tasks.length;
    const completed = state.tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    // Счетчики в шапке статистики
    if (dom.statTotal) dom.statTotal.textContent = total;
    if (dom.statCompleted) dom.statCompleted.textContent = completed;
    if (dom.statPending) dom.statPending.textContent = pending;
    if (dom.statPercent) dom.statPercent.textContent = `${percent}%`;

    if (dom.progressFill) dom.progressFill.style.width = `${percent}%`;
    if (dom.progressContainer) {
      dom.progressContainer.setAttribute('aria-valuenow', percent);
    }

    // Счетчики на кнопках фильтров
    const highCount = state.tasks.filter(t => t.priority === 'high').length;
    if (dom.countAll) dom.countAll.textContent = total;
    if (dom.countActive) dom.countActive.textContent = pending;
    if (dom.countCompleted) dom.countCompleted.textContent = completed;
    if (dom.countHigh) dom.countHigh.textContent = highCount;
  }

  function renderTasks() {
    const filteredTasks = getFilteredAndSortedTasks();

    if (dom.filteredCount) {
      dom.filteredCount.textContent = filteredTasks.length;
    }

    // Если список пуст
    if (filteredTasks.length === 0) {
      dom.tasksList.innerHTML = '';
      if (dom.emptyState) dom.emptyState.hidden = false;
      return;
    }

    if (dom.emptyState) dom.emptyState.hidden = true;

    // Генерация HTML карточек
    const html = filteredTasks.map(task => {
      const isCompleted = !!task.completed;
      const priorityLabel = getPriorityLabel(task.priority);
      const deadlineMeta = getDeadlineMeta(task.deadline, isCompleted);

      const completedClass = isCompleted ? 'is-completed' : '';
      const priorityClass = `priority-${task.priority}`;

      return `
        <article class="task-item ${completedClass} ${priorityClass}" data-id="${escapeHTML(task.id)}">
          <div class="task-checkbox-wrapper">
            <button 
              type="button" 
              class="task-checkbox-btn" 
              data-action="toggle" 
              data-id="${escapeHTML(task.id)}"
              aria-label="${isCompleted ? 'Отметить как невыполненную' : 'Отметить как выполненную'}"
              title="${isCompleted ? 'Отметить как невыполненную' : 'Отметить как выполненную'}"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </button>
          </div>

          <div class="task-content">
            <div class="task-main">
              <h3 class="task-title">${escapeHTML(task.title)}</h3>
              
              <div class="task-actions">
                <button 
                  type="button" 
                  class="btn-icon edit-action" 
                  data-action="edit" 
                  data-id="${escapeHTML(task.id)}"
                  title="Редактировать задачу"
                  aria-label="Редактировать задачу ${escapeHTML(task.title)}"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                </button>
                <button 
                  type="button" 
                  class="btn-icon delete-action" 
                  data-action="delete" 
                  data-id="${escapeHTML(task.id)}"
                  title="Удалить задачу"
                  aria-label="Удалить задачу ${escapeHTML(task.title)}"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
            </div>

            ${task.description ? `<p class="task-desc">${escapeHTML(task.description)}</p>` : ''}

            <div class="task-meta">
              <!-- Бейдж приоритета -->
              <span class="badge badge-priority-${escapeHTML(task.priority)}">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
                ${priorityLabel} приоритет
              </span>

              <!-- Бейдж дедлайна -->
              <span class="badge badge-deadline ${deadlineMeta.badgeClass}">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                ${deadlineMeta.text}
              </span>

              ${isCompleted ? `
                <span class="badge badge-status-done">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Выполнено
                </span>
              ` : ''}
            </div>
          </div>
        </article>
      `;
    }).join('');

    dom.tasksList.innerHTML = html;
  }

  // =========================================================================
  // 9. ОПЕРАЦИИ НАД ЗАДАЧАМИ (CRUD Operations)
  // =========================================================================
  function addTask(title, description, priority, deadline) {
    const newTask = {
      id: 'task-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      title: title.trim(),
      description: description.trim(),
      priority: priority || 'medium',
      deadline: deadline || '',
      completed: false,
      createdAt: new Date().toISOString()
    };

    state.tasks.unshift(newTask);
    saveTasksToStorage();
    render();
    showToast('Учебная задача успешно добавлена!', 'success');
  }

  function toggleTask(id) {
    const task = state.tasks.find(t => t.id === id);
    if (!task) return;

    task.completed = !task.completed;
    saveTasksToStorage();
    render();

    if (task.completed) {
      showToast('Задача выполнена! Отличная работа 🎉', 'success');
    } else {
      showToast('Задача возвращена в активные', 'info');
    }
  }

  function deleteTask(id) {
    const index = state.tasks.findIndex(t => t.id === id);
    if (index === -1) return;

    const deleted = state.tasks[index];
    state.tasks.splice(index, 1);
    saveTasksToStorage();
    render();

    showToast(`Задача «${deleted.title.substring(0, 25)}...» удалена`, 'warning');
  }

  function updateTask(id, updatedData) {
    const task = state.tasks.find(t => t.id === id);
    if (!task) return;

    task.title = updatedData.title.trim();
    task.description = updatedData.description.trim();
    task.priority = updatedData.priority;
    task.deadline = updatedData.deadline;
    task.completed = updatedData.completed;
    task.updatedAt = new Date().toISOString();

    saveTasksToStorage();
    render();
    showToast('Изменения сохранены', 'success');
  }

  // =========================================================================
  // 10. МОДАЛЬНОЕ ОКНО РЕДАКТИРОВАНИЯ (Modal Logic)
  // =========================================================================
  function openEditModal(id) {
    const task = state.tasks.find(t => t.id === id);
    if (!task) return;

    state.editingId = id;
    dom.editTaskId.value = task.id;
    dom.editTitle.value = task.title;
    dom.editDescription.value = task.description || '';
    dom.editPriority.value = task.priority || 'medium';
    dom.editDeadline.value = task.deadline || '';
    dom.editCompleted.checked = !!task.completed;

    // Сбросить валидацию
    dom.editTitle.classList.remove('input-invalid');
    dom.editDeadline.classList.remove('input-invalid');
    if (dom.editTitleError) dom.editTitleError.classList.remove('visible');
    if (dom.editDeadlineError) dom.editDeadlineError.classList.remove('visible');

    dom.editModal.hidden = false;
    document.body.style.overflow = 'hidden';

    // Фокус на поле названия
    setTimeout(() => {
      dom.editTitle.focus();
    }, 50);
  }

  function closeEditModal() {
    dom.editModal.hidden = true;
    document.body.style.overflow = '';
    state.editingId = null;
  }

  // =========================================================================
  // 11. СИСТЕМА УВЕДОМЛЕНИЙ (Toast Notifications)
  // =========================================================================
  function showToast(message, type = 'info', duration = 3000) {
    if (!dom.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'status');

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
    } else if (type === 'warning' || type === 'danger') {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
    } else {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
    }

    toast.innerHTML = `
      ${iconSvg}
      <span class="toast-message">${escapeHTML(message)}</span>
    `;

    dom.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 250);
    }, duration);
  }

  // =========================================================================
  // 12. ОБРАБОТЧИКИ СОБЫТИЙ (Event Listeners Setup)
  // =========================================================================
  function initEventListeners() {
    // 1. Отправка формы создания новой задачи
    if (dom.taskForm) {
      dom.taskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const isValid = validateTaskInput(
          dom.taskTitle,
          dom.taskDeadline,
          dom.titleError,
          dom.deadlineError
        );

        if (!isValid) return;

        addTask(
          dom.taskTitle.value,
          dom.taskDescription.value,
          dom.taskPriority.value,
          dom.taskDeadline.value
        );

        // Очистить форму
        dom.taskForm.reset();
        // Вернуть дефолтный приоритет
        dom.taskPriority.value = 'medium';
      });

      setupInputValidationClear(dom.taskTitle, dom.titleError);
      setupInputValidationClear(dom.taskDeadline, dom.deadlineError);
    }

    // 2. Делегирование событий в списке задач (чекбокс, редактирование, удаление)
    if (dom.tasksList) {
      dom.tasksList.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;

        const action = button.dataset.action;
        const id = button.dataset.id;
        if (!action || !id) return;

        if (action === 'toggle') {
          toggleTask(id);
        } else if (action === 'edit') {
          openEditModal(id);
        } else if (action === 'delete') {
          if (confirm('Вы уверены, что хотите удалить эту учебную задачу?')) {
            deleteTask(id);
          }
        }
      });
    }

    // 3. Вкладки фильтрации
    dom.filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        dom.filterButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });

        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        state.filter = btn.dataset.filter || 'all';
        render();
      });
    });

    // 4. Поиск в реальном времени
    if (dom.taskSearch) {
      dom.taskSearch.addEventListener('input', () => {
        state.search = dom.taskSearch.value.trim();
        if (dom.clearSearch) {
          dom.clearSearch.hidden = !state.search;
        }
        render();
      });
    }

    if (dom.clearSearch) {
      dom.clearSearch.addEventListener('click', () => {
        dom.taskSearch.value = '';
        state.search = '';
        dom.clearSearch.hidden = true;
        dom.taskSearch.focus();
        render();
      });
    }

    // 5. Выпадающий список сортировки
    if (dom.taskSort) {
      dom.taskSort.addEventListener('change', () => {
        state.sort = dom.taskSort.value;
        render();
      });
    }

    // 6. Форма модального окна (сохранение редактирования)
    if (dom.editForm) {
      dom.editForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const isValid = validateTaskInput(
          dom.editTitle,
          dom.editDeadline,
          dom.editTitleError,
          dom.editDeadlineError
        );

        if (!isValid) return;

        updateTask(dom.editTaskId.value, {
          title: dom.editTitle.value,
          description: dom.editDescription.value,
          priority: dom.editPriority.value,
          deadline: dom.editDeadline.value,
          completed: dom.editCompleted.checked
        });

        closeEditModal();
      });

      setupInputValidationClear(dom.editTitle, dom.editTitleError);
      setupInputValidationClear(dom.editDeadline, dom.editDeadlineError);
    }

    // 7. Закрытие модального окна
    if (dom.modalCloseBtn) dom.modalCloseBtn.addEventListener('click', closeEditModal);
    if (dom.modalCancelBtn) dom.modalCancelBtn.addEventListener('click', closeEditModal);

    if (dom.editModal) {
      dom.editModal.addEventListener('click', (e) => {
        if (e.target === dom.editModal) {
          closeEditModal();
        }
      });
    }

    // Закрытие модального окна по Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !dom.editModal.hidden) {
        closeEditModal();
      }
    });

    // 8. Кнопка сброса к учебным примерам
    if (dom.btnQuickSample) {
      dom.btnQuickSample.addEventListener('click', () => {
        if (confirm('Сбросить текущий список и загрузить демонстрационные учебные задачи?')) {
          state.tasks = JSON.parse(JSON.stringify(INITIAL_SAMPLE_TASKS));
          // Обновим дедлайны примеров относительно сегодняшнего дня
          state.tasks[0].deadline = getOffsetDateString(1);
          state.tasks[1].deadline = getOffsetDateString(4);
          state.tasks[2].deadline = getOffsetDateString(7);
          state.tasks[3].deadline = getOffsetDateString(10);

          saveTasksToStorage();
          render();
          showToast('Демонстрационные задачи успешно загружены', 'info');
        }
      });
    }
  }

  // =========================================================================
  // 13. ИНИЦИАЛИЗАЦИЯ ПРИ ЗАПУСКЕ (App Init)
  // =========================================================================
  function init() {
    // Установка даты по умолчанию (например, через 3 дня) в input date
    if (dom.taskDeadline && !dom.taskDeadline.value) {
      dom.taskDeadline.value = getOffsetDateString(3);
    }

    // Загрузка сохраненных задач
    state.tasks = loadTasksFromStorage();

    // Навешивание обработчиков событий
    initEventListeners();

    // Первичная отрисовка
    render();
  }

  // Запуск приложения после готовности DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

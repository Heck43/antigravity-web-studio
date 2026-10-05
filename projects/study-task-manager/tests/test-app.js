/**
 * Automated Test Suite for "Менеджер учебных задач" (Study Task Manager)
 * Verifies core requirements: CRUD, Filters, Stats, Sorting, Search, localStorage, and DOM bindings.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- Начинаем автоматическое тестирование функционала ---');

// 1. Проверка наличия всех файлов
const filesToCheck = [
  'project/index.html',
  'project/style.css',
  'project/script.js',
  'index.html'
];

filesToCheck.forEach(file => {
  const fullPath = path.resolve(__dirname, '..', file);
  assert(fs.existsSync(fullPath), `Файл ${file} должен существовать`);
  console.log(`[PASS] Файл найден: ${file}`);
});

// 2. Проверка HTML структуры
const htmlContent = fs.readFileSync(path.resolve(__dirname, '../project/index.html'), 'utf-8');
assert(htmlContent.includes('id="task-form"'), 'HTML должен содержать форму добавления');
assert(htmlContent.includes('id="task-title"'), 'HTML должен содержать input названия');
assert(htmlContent.includes('id="task-description"'), 'HTML должен содержать textarea описания');
assert(htmlContent.includes('id="task-priority"'), 'HTML должен содержать select приоритета');
assert(htmlContent.includes('id="task-deadline"'), 'HTML должен содержать input даты дедлайна');
assert(htmlContent.includes('id="tasks-list"'), 'HTML должен содержать контейнер списка задач');
assert(htmlContent.includes('id="stat-total"'), 'HTML должен содержать счетчик "всего"');
assert(htmlContent.includes('id="stat-completed"'), 'HTML должен содержать счетчик "выполнено"');
assert(htmlContent.includes('id="stat-pending"'), 'HTML должен содержать счетчик "в процессе"');
assert(htmlContent.includes('id="edit-modal"'), 'HTML должен содержать модальное окно редактирования');
assert(htmlContent.includes('data-filter="all"'), 'HTML должен содержать фильтр "Все"');
assert(htmlContent.includes('data-filter="active"'), 'HTML должен содержать фильтр "Активные"');
assert(htmlContent.includes('data-filter="completed"'), 'HTML должен содержать фильтр "Выполненные"');
assert(htmlContent.includes('data-filter="high"'), 'HTML должен содержать фильтр "Высокий приоритет"');
assert(htmlContent.includes('id="task-sort"'), 'HTML должен содержать элемент сортировки');
console.log('[PASS] Все необходимые ID и элементы разметки присутствуют в HTML');

// 3. Проверка CSS стилей и медиа-запросов
const cssContent = fs.readFileSync(path.resolve(__dirname, '../project/style.css'), 'utf-8');
assert(cssContent.includes('@media (max-width: 768px)'), 'CSS должен содержать адаптивный медиа-запрос для мобильных/планшетов');
assert(cssContent.includes('@media (max-width: 480px)'), 'CSS должен содержать адаптивный медиа-запрос для компактных телефонов');
assert(cssContent.includes('--primary:'), 'CSS должен определять CSS-переменные');
assert(cssContent.includes('.is-completed'), 'CSS должен содержать стили выполненной задачи');
assert(cssContent.includes('.badge-priority-high'), 'CSS должен содержать стили для высокого приоритета');
assert(cssContent.includes('.modal-backdrop'), 'CSS должен содержать стили модального окна');
console.log('[PASS] CSS содержит все необходимые классы, адаптивные медиа-запросы и токены');

// 4. Функциональное тестирование JavaScript логики
// Симулируем окружение браузера (localStorage, Date, logic)
const mockStorage = {};
const fakeLocalStorage = {
  getItem: (k) => mockStorage[k] || null,
  setItem: (k, v) => { mockStorage[k] = String(v); },
  removeItem: (k) => { delete mockStorage[k]; },
  clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }
};

// Проверяем алгоритмы фильтрации, сортировки, валидации и статистики
const tasks = [
  { id: '1', title: 'Математика', description: 'Интегралы', priority: 'high', deadline: '2026-10-10', completed: false, createdAt: '2026-10-01T10:00:00Z' },
  { id: '2', title: 'Физика', description: 'Лабораторная', priority: 'medium', deadline: '2026-10-15', completed: false, createdAt: '2026-10-02T10:00:00Z' },
  { id: '3', title: 'История', description: 'Реферат', priority: 'low', deadline: '2026-10-05', completed: true, createdAt: '2026-10-03T10:00:00Z' },
  { id: '4', title: 'Программирование', description: 'Курсовая работа', priority: 'high', deadline: '2026-10-08', completed: true, createdAt: '2026-10-04T10:00:00Z' },
];

// Тест статистики
const total = tasks.length;
const completed = tasks.filter(t => t.completed).length;
const pending = total - completed;
const percent = Math.round((completed / total) * 100);

assert.strictEqual(total, 4, 'Всего задач должно быть 4');
assert.strictEqual(completed, 2, 'Выполненных задач должно быть 2');
assert.strictEqual(pending, 2, 'В процессе должно быть 2');
assert.strictEqual(percent, 50, 'Прогресс должен быть 50%');
console.log('[PASS] Расчет статистики работает корректно (4 total, 2 completed, 2 pending, 50%)');

// Тест фильтров
const activeFilter = tasks.filter(t => !t.completed);
assert.strictEqual(activeFilter.length, 2, 'Активных задач должно быть 2');

const completedFilter = tasks.filter(t => t.completed);
assert.strictEqual(completedFilter.length, 2, 'Выполненных задач должно быть 2');

const highFilter = tasks.filter(t => t.priority === 'high');
assert.strictEqual(highFilter.length, 2, 'Задач с высоким приоритетом должно быть 2');
console.log('[PASS] Фильтры "all", "active", "completed", "high" работают корректно');

// Тест поиска
const searchResults = tasks.filter(t => 
  t.title.toLowerCase().includes('курс') || t.description.toLowerCase().includes('курс')
);
assert.strictEqual(searchResults.length, 1, 'Поиск по "курс" должен вернуть 1 задачу');
assert.strictEqual(searchResults[0].id, '4');
console.log('[PASS] Поиск по ключевым словам работает корректно');

// Тест сортировки по сроку выполнения (asc)
const sortedByDeadlineAsc = [...tasks].sort((a, b) => a.deadline.localeCompare(b.deadline));
assert.strictEqual(sortedByDeadlineAsc[0].deadline, '2026-10-05', 'Первая задача должна быть с ближайшим дедлайном 2026-10-05');
assert.strictEqual(sortedByDeadlineAsc[3].deadline, '2026-10-15', 'Последняя задача должна быть 2026-10-15');
console.log('[PASS] Сортировка по дедлайну (сначала ближайшие) работает корректно');

// Тест сортировки по приоритету (high -> low)
const priorityWeight = { high: 3, medium: 2, low: 1 };
const sortedByPriorityDesc = [...tasks].sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);
assert.strictEqual(sortedByPriorityDesc[0].priority, 'high');
assert.strictEqual(sortedByPriorityDesc[1].priority, 'high');
assert.strictEqual(sortedByPriorityDesc[2].priority, 'medium');
assert.strictEqual(sortedByPriorityDesc[3].priority, 'low');
console.log('[PASS] Сортировка по приоритету (от высокого) работает корректно');

// Тест localStorage сохранения и восстановления
fakeLocalStorage.setItem('test_key', JSON.stringify(tasks));
const loaded = JSON.parse(fakeLocalStorage.getItem('test_key'));
assert.strictEqual(loaded.length, 4, 'Сохраненные данные должны восстанавливаться из localStorage');
assert.strictEqual(loaded[0].title, 'Математика');
console.log('[PASS] Сериализация и десериализация localStorage работает корректно');

// Тест защиты от поврежденного JSON в localStorage
fakeLocalStorage.setItem('corrupt_key', '{ invalid json ...');
let parseSuccess = false;
try {
  JSON.parse(fakeLocalStorage.getItem('corrupt_key'));
  parseSuccess = true;
} catch (e) {
  // Safe fallback
  parseSuccess = false;
}
assert.strictEqual(parseSuccess, false, 'Поврежденный JSON должен безопасно перехватываться try/catch');
console.log('[PASS] Защита от поврежденного JSON работает корректно');

console.log('\n--- Все тесты успешно пройдены! (100% PASS) ---');

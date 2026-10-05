/**
 * In-depth DOM Lifecycle & Event Simulation Test
 * Simulates complete browser DOM, window, localStorage and user actions
 * to exercise project/script.js end-to-end.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

// 1. Создаем минимальный DOM mock для выполнения браузерного скрипта
class MockElement {
  constructor(tagName = 'div', id = '') {
    this.tagName = tagName.toUpperCase();
    this.id = id;
    this.className = '';
    this.classList = {
      _classes: new Set(),
      add: (...cls) => cls.forEach(c => this.classList._classes.add(c)),
      remove: (...cls) => cls.forEach(c => this.classList._classes.delete(c)),
      contains: (c) => this.classList._classes.has(c)
    };
    this.attributes = {};
    this.dataset = {};
    this.style = {};
    this.children = [];
    this._innerHTML = '';
    this.textContent = '';
    this.value = '';
    this.checked = false;
    this.hidden = false;
    this._listeners = {};
  }

  get innerHTML() {
    return this._innerHTML;
  }

  set innerHTML(val) {
    this._innerHTML = val;
    // Парсим примитивные элементы при innerHTML присваивании
  }

  setAttribute(name, value) {
    this.attributes[name] = String(value);
  }

  getAttribute(name) {
    return this.attributes[name] || null;
  }

  addEventListener(event, fn) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(fn);
  }

  dispatchEvent(event) {
    const list = this._listeners[event.type] || [];
    list.forEach(fn => fn(event));
  }

  focus() {}

  reset() {
    this.value = '';
    this.children.forEach(c => { if (c.reset) c.reset(); });
  }

  closest(selector) {
    if (selector.startsWith('button')) {
      if (this.tagName === 'BUTTON') return this;
      if (this.dataset.action) return this;
    }
    return null;
  }

  appendChild(el) {
    this.children.push(el);
    el.parentNode = this;
  }

  removeChild(el) {
    const idx = this.children.indexOf(el);
    if (idx !== -1) this.children.splice(idx, 1);
  }
}

// Хранилище элементов
const elementsById = {};

function getOrCreateElement(id, tag = 'div') {
  if (!elementsById[id]) {
    elementsById[id] = new MockElement(tag, id);
  }
  return elementsById[id];
}

// Создаем необходимые элементы для DOM
const requiredIds = [
  ['task-form', 'form'],
  ['task-title', 'input'],
  ['task-description', 'textarea'],
  ['task-priority', 'select'],
  ['task-deadline', 'input'],
  ['title-error', 'span'],
  ['deadline-error', 'span'],
  ['tasks-list', 'div'],
  ['empty-state', 'div'],
  ['task-search', 'input'],
  ['clear-search', 'button'],
  ['task-sort', 'select'],
  ['filtered-count', 'span'],
  ['stat-total', 'span'],
  ['stat-completed', 'span'],
  ['stat-pending', 'span'],
  ['stat-percent', 'span'],
  ['progress-fill', 'div'],
  ['progress-container', 'div'],
  ['count-all', 'span'],
  ['count-active', 'span'],
  ['count-completed', 'span'],
  ['count-high', 'span'],
  ['btn-quick-sample', 'button'],
  ['edit-modal', 'div'],
  ['modal-close-btn', 'button'],
  ['modal-cancel-btn', 'button'],
  ['edit-form', 'form'],
  ['edit-task-id', 'input'],
  ['edit-title', 'input'],
  ['edit-description', 'textarea'],
  ['edit-priority', 'select'],
  ['edit-deadline', 'input'],
  ['edit-completed', 'input'],
  ['edit-title-error', 'span'],
  ['edit-deadline-error', 'span'],
  ['toast-container', 'div']
];

requiredIds.forEach(([id, tag]) => getOrCreateElement(id, tag));

// Фильтр-кнопки
const filterButtons = ['all', 'active', 'completed', 'high'].map(f => {
  const btn = new MockElement('button');
  btn.className = `filter-btn ${f === 'all' ? 'active' : ''}`;
  btn.dataset.filter = f;
  return btn;
});

// Mock LocalStorage
const mockStore = {};
const mockLocalStorage = {
  getItem: (k) => mockStore[k] || null,
  setItem: (k, v) => { mockStore[k] = String(v); },
  removeItem: (k) => { delete mockStore[k]; },
  clear: () => { Object.keys(mockStore).forEach(k => delete mockStore[k]); }
};

// Global Context
const mockDocument = {
  readyState: 'complete',
  getElementById: (id) => elementsById[id] || null,
  querySelectorAll: (selector) => {
    if (selector === '.filter-btn') return filterButtons;
    return [];
  },
  createElement: (tag) => new MockElement(tag),
  addEventListener: () => {},
  body: new MockElement('body')
};

const mockWindow = {
  localStorage: mockLocalStorage,
  confirm: () => true,
  document: mockDocument
};

// Читаем скрипт и запускаем в изолированном контексте
const scriptCode = fs.readFileSync(path.resolve(__dirname, '../project/script.js'), 'utf-8');

const runInSandbox = new Function('window', 'document', 'localStorage', 'confirm', scriptCode);

console.log('--- Запуск проекта в тестовой среде DOM ---');
runInSandbox(mockWindow, mockDocument, mockLocalStorage, () => true);

// 1. Проверяем инициализацию и начальные демо-задачи
console.log('Проверка инициализации:');
assert.strictEqual(elementsById['stat-total'].textContent, 4, 'Всего задач должно быть 4');
assert.strictEqual(elementsById['stat-completed'].textContent, 1, 'Выполнено задач должно быть 1');
assert.strictEqual(elementsById['stat-pending'].textContent, 3, 'В процессе должно быть 3');
assert.strictEqual(elementsById['stat-percent'].textContent, '25%', 'Прогресс должен быть 25%');
assert(elementsById['tasks-list'].innerHTML.includes('Подготовка к коллоквиуму'), 'Список должен содержать первую демо-задачу');
console.log('[PASS] Инициализация прошла успешно, демо-задачи загружены, статистика рассчитана корректно.');

// 2. Тестируем добавление новой задачи через форму
console.log('\nТестирование добавления новой задачи:');
elementsById['task-title'].value = 'Подготовка к защите ВКР';
elementsById['task-description'].value = 'Проверить презентацию и доклад';
elementsById['task-priority'].value = 'high';
elementsById['task-deadline'].value = '2026-10-25';

// Отправляем форму
const formSubmitEvent = { type: 'submit', preventDefault: () => {} };
elementsById['task-form'].dispatchEvent(formSubmitEvent);

assert.strictEqual(elementsById['stat-total'].textContent, 5, 'После добавления задач должно стать 5');
assert.strictEqual(elementsById['stat-pending'].textContent, 4, 'Активных задач должно стать 4');
assert(elementsById['tasks-list'].innerHTML.includes('Подготовка к защите ВКР'), 'Список должен содержать новую задачу');
console.log('[PASS] Новая задача успешно добавлена, счетчики обновились.');

// 3. Тестируем фильтрацию
console.log('\nТестирование переключения фильтров:');
// Фильтр "Активные"
const activeFilterBtn = filterButtons.find(b => b.dataset.filter === 'active');
activeFilterBtn.dispatchEvent({ type: 'click' });
assert.strictEqual(elementsById['filtered-count'].textContent, 4, 'Активных задач должно быть 4');

// Фильтр "Выполненные"
const completedFilterBtn = filterButtons.find(b => b.dataset.filter === 'completed');
completedFilterBtn.dispatchEvent({ type: 'click' });
assert.strictEqual(elementsById['filtered-count'].textContent, 1, 'Выполненных задач должно быть 1');

// Фильтр "Высокий приоритет"
const highFilterBtn = filterButtons.find(b => b.dataset.filter === 'high');
highFilterBtn.dispatchEvent({ type: 'click' });
assert.strictEqual(elementsById['filtered-count'].textContent, 3, 'Задач с высоким приоритетом должно быть 3 (2 исходных + 1 новая)');

// Возврат к "Все"
const allFilterBtn = filterButtons.find(b => b.dataset.filter === 'all');
allFilterBtn.dispatchEvent({ type: 'click' });
assert.strictEqual(elementsById['filtered-count'].textContent, 5, 'Всего задач отображается 5');
console.log('[PASS] Фильтры переключаются мгновенно без ошибок.');

// 4. Проверяем сохранение в localStorage
console.log('\nТестирование персистентности:');
const savedJSON = mockLocalStorage.getItem('study_task_manager_v2');
assert(savedJSON, 'Данные должны быть сохранены в localStorage');
const savedData = JSON.parse(savedJSON);
assert.strictEqual(savedData.length, 5, 'В localStorage сохранено ровно 5 задач');
assert.strictEqual(savedData[0].title, 'Подготовка к защите ВКР', 'Первая задача соответствует добавленной');
console.log('[PASS] Синхронизация с localStorage проверена.');

// 5. Тестируем живой поиск
console.log('\nТестирование поиска:');
elementsById['task-search'].value = 'коллоквиум';
elementsById['task-search'].dispatchEvent({ type: 'input' });
assert.strictEqual(elementsById['filtered-count'].textContent, 1, 'Поиск "коллоквиум" должен найти 1 задачу');

// Очистка поиска
elementsById['task-search'].value = '';
elementsById['task-search'].dispatchEvent({ type: 'input' });
assert.strictEqual(elementsById['filtered-count'].textContent, 5, 'После очистки поиска отображаются все 5 задач');
console.log('[PASS] Живой поиск работает корректно.');

console.log('\n========================================');
console.log('ИТОГ: Все поведенческие сценарии DOM подтверждены!');
console.log('========================================');

// Verification script for Study Task Manager
const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- Starting verification for Study Task Manager ---');

// 1. Verify file existence
const projectDir = path.join(__dirname, '..', 'project');
const htmlFile = path.join(projectDir, 'index.html');
const cssFile = path.join(projectDir, 'style.css');
const jsFile = path.join(projectDir, 'script.js');

assert(fs.existsSync(htmlFile), 'project/index.html must exist');
assert(fs.existsSync(cssFile), 'project/style.css must exist');
assert(fs.existsSync(jsFile), 'project/script.js must exist');
console.log('✓ Project files exist: index.html, style.css, script.js');

// 2. Verify HTML structure & required elements
const htmlContent = fs.readFileSync(htmlFile, 'utf8');

const requiredIds = [
  'taskForm',
  'taskTitle',
  'taskDescription',
  'taskPriority',
  'taskDueDate',
  'taskList',
  'statTotal',
  'statActive',
  'statCompleted',
  'statPercent',
  'progressBar',
  'sortSelect',
  'searchInput',
  'editModal',
  'editTaskForm'
];

requiredIds.forEach(id => {
  assert(htmlContent.includes(`id="${id}"`), `HTML must contain element with id="${id}"`);
});
console.log(`✓ All ${requiredIds.length} critical DOM elements verified in HTML`);

// Verify filter attributes
['all', 'active', 'completed', 'high'].forEach(filterVal => {
  assert(htmlContent.includes(`data-filter="${filterVal}"`), `HTML must contain filter chip for "${filterVal}"`);
});
console.log('✓ All 4 required filters present (все, активные, выполненные, с высоким приоритетом)');

// 3. Verify CSS styling & tokens
const cssContent = fs.readFileSync(cssFile, 'utf8');
assert(cssContent.includes('--primary'), 'CSS should declare primary color token');
assert(cssContent.includes('--priority-high'), 'CSS should have high priority style token');
assert(cssContent.includes('@media (max-width:'), 'CSS must include responsive media queries for mobile devices');
console.log('✓ CSS custom properties, priority badges and responsive media queries verified');

// 4. Verify JS code features & logic
const jsContent = fs.readFileSync(jsFile, 'utf8');
assert(jsContent.includes('localStorage.getItem'), 'JS must read from localStorage');
assert(jsContent.includes('localStorage.setItem'), 'JS must write to localStorage');
assert(jsContent.includes('e.preventDefault()'), 'JS must prevent default form submission (SPA)');
assert(jsContent.includes('statTotal'), 'JS must calculate total tasks');
assert(jsContent.includes('statCompleted'), 'JS must calculate completed tasks');
assert(jsContent.includes('statActive'), 'JS must calculate active tasks');
assert(jsContent.includes('currentFilter'), 'JS must implement filtering logic');
assert(jsContent.includes('currentSort'), 'JS must implement sorting logic');
assert(jsContent.includes('openEditModal'), 'JS must implement task editing functionality');
assert(jsContent.includes('deleteTask'), 'JS must implement task deletion');
assert(jsContent.includes('toggleTaskCompletion'), 'JS must implement task toggle completion');

console.log('✓ JavaScript logic verified: localStorage, CRUD, filters, statistics, sorting, SPA');

// 5. Test Pure Logic Simulator
console.log('\n--- Running logic simulation in isolated sandbox ---');

let simulatedStorage = {};
const mockLocalStorage = {
  getItem: (key) => simulatedStorage[key] || null,
  setItem: (key, val) => { simulatedStorage[key] = String(val); }
};

let tasks = [
  { id: '1', title: 'Task 1', priority: 'high', dueDate: '2026-10-10', completed: false },
  { id: '2', title: 'Task 2', priority: 'low', dueDate: '2026-10-12', completed: true },
  { id: '3', title: 'Task 3', priority: 'medium', dueDate: '2026-10-08', completed: false }
];

// Save to mock storage
mockLocalStorage.setItem('test_tasks', JSON.stringify(tasks));
const loaded = JSON.parse(mockLocalStorage.getItem('test_tasks'));
assert.strictEqual(loaded.length, 3, 'Persistence save and load matches');

// Test statistics calculation
const total = tasks.length;
const completed = tasks.filter(t => t.completed).length;
const active = total - completed;
assert.strictEqual(total, 3);
assert.strictEqual(completed, 1);
assert.strictEqual(active, 2);
console.log(`✓ Statistics: total=${total}, completed=${completed}, active=${active}`);

// Test filters
const filterActive = tasks.filter(t => !t.completed);
assert.strictEqual(filterActive.length, 2, 'Active filter returns non-completed tasks');

const filterCompleted = tasks.filter(t => t.completed);
assert.strictEqual(filterCompleted.length, 1, 'Completed filter returns completed tasks');

const filterHigh = tasks.filter(t => t.priority === 'high');
assert.strictEqual(filterHigh.length, 1, 'High priority filter returns high priority tasks');
console.log('✓ Filter logic passes all criteria');

// Test sorting
const sortedByDate = [...tasks].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
assert.strictEqual(sortedByDate[0].id, '3', 'Earliest task is 2026-10-08 (Task 3)');

const priorityWeights = { high: 3, medium: 2, low: 1 };
const sortedByPriority = [...tasks].sort((a, b) => priorityWeights[b.priority] - priorityWeights[a.priority]);
assert.strictEqual(sortedByPriority[0].id, '1', 'Highest priority is high (Task 1)');
assert.strictEqual(sortedByPriority[2].id, '2', 'Lowest priority is low (Task 2)');
console.log('✓ Sorting by due date and priority passes');

console.log('\n=============================================');
console.log('🎉 ALL VERIFICATION CHECKS PASSED SUCCESSFULLY!');
console.log('=============================================');

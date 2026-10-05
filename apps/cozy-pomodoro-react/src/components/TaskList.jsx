import React, { useState } from 'react';
import { Plus, Check, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { soundManager } from '../utils/audioEngine';

export default function TaskList({ tasks, setTasks }) {
  const [newTitle, setNewTitle] = useState('');
  const [pomosEst, setPomosEst] = useState(2);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    soundManager.playClick();
    const newTask = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      estimatedPomos: Number(pomosEst),
      completedPomos: 0,
      completed: false,
      createdAt: new Date().toISOString()
    };

    setTasks(prev => [newTask, ...prev]);
    setNewTitle('');
    setPomosEst(2);
  };

  const toggleTask = (taskId) => {
    soundManager.playClick();
    setTasks(prev =>
      prev.map(task => {
        if (task.id === taskId) {
          const nextCompleted = !task.completed;
          if (nextCompleted) {
            soundManager.playChime('break');
          }
          return { ...task, completed: nextCompleted };
        }
        return task;
      })
    );
  };

  const deleteTask = (taskId) => {
    soundManager.playClick();
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const clearCompleted = () => {
    soundManager.playClick();
    setTasks(prev => prev.filter(t => !t.completed));
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <section className="card task-card" aria-label="Список дел">
      <div className="card-header">
        <div className="header-title-group">
          <span className="card-emoji">📝</span>
          <h2 className="card-title">Маленькие дела на сегодня</h2>
        </div>
        {completedCount > 0 && (
          <button
            type="button"
            className="btn-text-subtle"
            onClick={clearCompleted}
            title="Очистить выполненные задачи"
          >
            Очистить готовые ({completedCount})
          </button>
        )}
      </div>

      {/* Progress pill */}
      {tasks.length > 0 && (
        <div className="task-progress-bar-wrap">
          <div className="task-progress-info">
            <span>Прогресс дел:</span>
            <span>{completedCount} из {tasks.length}</span>
          </div>
          <div className="task-progress-track">
            <div
              className="task-progress-fill"
              style={{
                width: `${tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0}%`
              }}
            />
          </div>
        </div>
      )}

      {/* Add Task Form */}
      <form onSubmit={handleAddTask} className="task-form">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Какую маленькую задачу сделаем? :3"
          className="task-input"
          aria-label="Название новой задачи"
        />

        <div className="task-form-controls">
          <label className="task-pomo-select-label">
            <span>🍅 Оценка:</span>
            <select
              value={pomosEst}
              onChange={(e) => setPomosEst(Number(e.target.value))}
              className="task-select"
              aria-label="Оценка в помидорках"
            >
              <option value={1}>1 помидорка (~25м)</option>
              <option value={2}>2 помидорки (~50м)</option>
              <option value={3}>3 помидорки (~1ч 15м)</option>
              <option value={4}>4 помидорки (~1ч 40м)</option>
              <option value={5}>5 помидорок (~2ч+)</option>
            </select>
          </label>

          <button
            type="submit"
            className="btn-add-task"
            disabled={!newTitle.trim()}
            aria-label="Добавить задачу"
          >
            <Plus size={18} />
            <span>Добавить</span>
          </button>
        </div>
      </form>

      {/* Tasks list */}
      <div className="task-items-list" role="list">
        {tasks.length === 0 ? (
          <div className="task-empty-state">
            <span className="empty-emoji">🌱</span>
            <p>Список пуст! Добавь задачу, чтобы котик Моти помог тебе сфокусироваться.</p>
          </div>
        ) : (
          tasks.map(task => (
            <div
              key={task.id}
              role="listitem"
              className={`task-row ${task.completed ? 'task-done' : ''}`}
            >
              <button
                type="button"
                className="task-checkbox"
                onClick={() => toggleTask(task.id)}
                aria-label={task.completed ? `Снять отметку с: ${task.title}` : `Отметить выполненным: ${task.title}`}
              >
                {task.completed ? (
                  <CheckCircle2 size={20} className="text-mint" />
                ) : (
                  <Circle size={20} className="text-muted" />
                )}
              </button>

              <div className="task-details">
                <span className="task-text">{task.title}</span>
                <div className="task-badges">
                  <span className="task-pomo-dots" title={`Оценка: ${task.estimatedPomos} сессий`}>
                    {'🍅'.repeat(task.estimatedPomos)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="btn-delete-task"
                onClick={() => deleteTask(task.id)}
                aria-label={`Удалить задачу ${task.title}`}
                title="Удалить"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

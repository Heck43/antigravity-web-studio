# Recipe: Robust LocalStorage State Manager

A production-safe pattern for browser data persistence with schema defaults, serialization, and quota fallback.

```javascript
/**
 * Safe LocalStorage State Wrapper
 */
class StateManager {
  constructor(storageKey, defaultState = {}) {
    this.key = storageKey;
    this.defaultState = defaultState;
    this.state = this.load();
    this.listeners = [];
  }

  load() {
    try {
      const raw = localStorage.getItem(this.key);
      if (!raw) return structuredClone(this.defaultState);
      return { ...this.defaultState, ...JSON.parse(raw) };
    } catch (err) {
      console.warn(`[StateManager] Failed to load state from ${this.key}:`, err);
      return structuredClone(this.defaultState);
    }
  }

  save() {
    try {
      localStorage.setItem(this.key, JSON.stringify(this.state));
      this.notify();
    } catch (err) {
      console.error(`[StateManager] Failed to persist state to ${this.key}:`, err);
    }
  }

  get(prop) {
    return prop ? this.state[prop] : this.state;
  }

  set(updates) {
    this.state = { ...this.state, ...updates };
    this.save();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this.state));
  }
}
```

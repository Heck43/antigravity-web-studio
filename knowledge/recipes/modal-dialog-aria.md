# Recipe: Accessible Modal Dialog (WAI-ARIA Compliant)

A clean vanilla JavaScript modal controller that handles keyboard traps, `Escape` key dismissal, focus restoration, and scroll lock.

```javascript
class AccessibleModal {
  constructor(modalElement, { openTriggerSelector, closeTriggerSelector } = {}) {
    this.modal = modalElement;
    this.previouslyFocused = null;
    this.isOpen = false;

    this.closeButtons = this.modal.querySelectorAll(closeTriggerSelector || '[data-modal-close]');
    this.init();
  }

  init() {
    this.closeButtons.forEach(btn => btn.addEventListener('click', () => this.close()));
    
    // Backdrop click dismisses
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });

    // Keyboard listener (Escape & Tab trap)
    document.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        this.close();
      } else if (e.key === 'Tab') {
        this.trapFocus(e);
      }
    });
  }

  open() {
    this.previouslyFocused = document.activeElement;
    this.modal.classList.add('is-active');
    this.modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // lock scroll
    this.isOpen = true;

    // Focus first interactive element inside modal
    const focusable = this.getFocusableElements();
    if (focusable.length > 0) focusable[0].focus();
  }

  close() {
    this.modal.classList.remove('is-active');
    this.modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    this.isOpen = false;

    if (this.previouslyFocused) {
      this.previouslyFocused.focus();
    }
  }

  getFocusableElements() {
    return Array.from(this.modal.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ));
  }

  trapFocus(e) {
    const focusable = this.getFocusableElements();
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}
```

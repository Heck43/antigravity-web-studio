# Design & Technical Sources

1. **Modern Study Planner & Task UI Patterns**:
   - Modern task management principles: Clear priority indicators, progress visualization, inline status updates.
   - Reference: Dribbble Student Study Planner UI systems & Notion task cards.
2. **Accessible Web Form Controls**:
   - W3C WAI-ARIA Authoring Practices for Modals, Checkboxes, and Filter Tabs:
     - `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
     - Accessible form labels with `<label for="...">`
     - Keyboard trap and `Escape` key listeners for modal views
3. **HTML5 LocalStorage Best Practices**:
   - JSON serialization with schema validation and fallback error handling (`try/catch` in case of quota or privacy restrictions).
4. **Mobile Responsive Patterns**:
   - Touch targets minimum 44px x 44px
   - Elastic Flexbox wrapping and CSS Grid with `minmax()`

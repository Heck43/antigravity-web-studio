# Design Tokens & System: Менеджер учебных задач

## Цветовая палитра (Color Palette)
- **Primary (Основной акцент)**: `#4F46E5` (Indigo-600) — цвет академической концентрации
- **Primary Hover**: `#4338CA` (Indigo-700)
- **Primary Soft / Surface**: `#EEF2FF` (Indigo-50)
- **Background**: `#F8FAFC` (Slate-50) — мягкий чистый фон
- **Card Background**: `#FFFFFF` (White)
- **Surface Muted**: `#F1F5F9` (Slate-100)
- **Text Main**: `#0F172A` (Slate-900)
- **Text Muted**: `#64748B` (Slate-500)
- **Text Light**: `#94A3B8` (Slate-400)
- **Border Default**: `#E2E8F0` (Slate-200)
- **Border Focus**: `#6366F1` (Indigo-500)

### Приоритеты (Priority Colors)
- **Высокий (High)**:
  - Text: `#DC2626` (Red-600)
  - Background: `#FEF2F2` (Red-50)
  - Border: `#FCA5A5` (Red-300)
  - Accent Indicator: `#EF4444` (Red-500)
- **Средний (Medium)**:
  - Text: `#D97706` (Amber-600)
  - Background: `#FFFBEB` (Amber-50)
  - Border: `#FCD34D` (Amber-300)
  - Accent Indicator: `#F59E0B` (Amber-500)
- **Низкий (Low)**:
  - Text: `#0D9488` (Teal-600)
  - Background: `#F0FDFA` (Teal-50)
  - Border: `#99F6E4` (Teal-200)
  - Accent Indicator: `#14B8A6` (Teal-500)

### Статусы выполнения (Status Colors)
- **Выполнено (Success)**: `#10B981` (Emerald-500), Background: `#ECFDF5`
- **Просрочено (Overdue Danger)**: `#E11D48` (Rose-600), Background: `#FFE4E6`

## Типографика (Typography)
- Шрифт интерфейса: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
- Иерархия:
  - Заголовок H1: `1.75rem` (28px), вес `700`, line-height `1.25`
  - Заголовок H2: `1.25rem` (20px), вес `600`
  - H3 / Карточки: `1.05rem` (16.8px), вес `600`
  - Основной текст: `0.9375rem` (15px), line-height `1.5`
  - Мелкий текст/бейдж: `0.8125rem` (13px), вес `500`

## Пространственная сетка и компоненты (Layout & Components)
- `border-radius`:
  - Карточки: `16px`
  - Кнопки и инпуты: `10px`
  - Бейджи и чипсы: `9999px` (full pill)
- Тени (Box Shadow):
  - Card: `0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)`
  - Card Hover: `0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)`
  - Modal: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)`
- Адаптивность:
  - `< 640px`: Одноколоночная компоновка, плавающие действия, компактные карточки статистики
  - `640px - 1024px`: Двухколоночный грид аналитики, адаптивная форма
  - `> 1024px`: Сбалансированный контейнер до 1100px по центру страницы.

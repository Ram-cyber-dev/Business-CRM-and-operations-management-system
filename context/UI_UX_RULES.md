# UI/UX Rules

## Design System
- **Library:** Tailwind CSS + shadcn/ui.
- **Tone:** Professional, clean, density-comfortable.
- **Colors:**
  - **Primary:** Slate/Zinc (dark mode compatible).
  - **Accents:** Blue (links), Green (Success), Red (Danger/Overdue).

## Layout Structure
- **Global:** Sidebar Navigation (Left) + Content Area (Right).
- **Sidebar:**
  - Fixed width (`w-64`).
  - Active state highlighting (Background + Text Color).
- **Content:**
  - Padding: `p-8` standard.
  - Page Title: `text-2xl font-bold` + Breadcrumb/Description.

## Component Patterns
1.  **Tables:**
    - Clean Headers (`bg-slate-50`).
    - Row Hover effects.
    - Status Badges (Pills).
    - Actions Column (Right aligned).

2.  **Forms:**
    - Modals for creation (to preserve context).
    - inline validation errors.
    - Logical grouping of fields.

3.  **States:**
    - **Loading:** Skeleton screens or standard spinners.
    - **Empty:** "No X found. Create one?" with a CTA.

## Accessibility
- All interactive elements must have focus states.
- Semantic HTML (`<button>`, `<table>`, `<form>`) is mandatory.

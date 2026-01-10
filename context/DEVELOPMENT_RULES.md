# Development Rules

> **Strict guidelines for maintaining codebase integrity.**

## 1. Do Not Break "Locked" Code
- **Phases 1-5 are LOCKED.**
- Do not refactor `auth`, `onboarding`, or core `dashboard` logic without explicit user instruction.
- **Refactoring:** If you must refactor, verify it against the **Smoke Test** in `AGENT_HANDOFF.md`.

## 2. RLS First
- **Never** write a Server Action that manually checks `if (user.id == owner_id)`.
- Trust the Database Policies.
- **Always** pass `workspace_id` explicitly when creating data to ensure it lands in the right tenant.

## 3. Server Actions & Mutations
- **Structure:**
  1. Authenticate (`getUser`).
  2. Validate Input (`Zod`).
  3. Perform DB Operation.
  4. `revalidatePath`.
  5. Return Standard Response (`{ success: true }` or `{ error: string }`).

## 4. Components
- **Client Components:** Use `'use client'` strictly when interactivity (hooks) is needed.
- **Server Components:** Default choice. Use for fetching data.

## 5. File Structure
- `src/app`: Routing & Pages.
- `src/components`: UI primitives & Feature components.
- `src/lib`: Utilities (Supabase client, helpers).
- `db/`: SQL migrations and seeds.

**Violation of these rules will result in rejected PRs/changes.**

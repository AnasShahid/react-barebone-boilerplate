# Todo: Fix Fragile Areas

**Created:** 2026-02-21
**Area:** architecture / store / auth
**Priority:** high

## Description

Fix all fragile areas identified in `.planning/codebase/CONCERNS.md`. These are patterns that work today but are brittle, hide bugs, or will cause issues as the codebase scales.

## Fragile Areas to Fix

### 1. `window.Clerk.session.getToken()` — High Priority
- **Location:** `src/utils/auth.ts`
- **Problem:** Direct global access; not reactive; silently returns `null` if Clerk hasn't initialized
- **Fix:** Replace with Clerk's `useAuth()` hook (already available). Update RTK Query `baseQuery` to use the hook-based token retrieval pattern.

### 2. `redux-persist` with `serializableCheck: false` — Medium Priority
- **Location:** `src/store/index.ts`
- **Problem:** Disabling serialization check can hide bugs where non-serializable values enter the store
- **Fix:** Enable selectively — audit all slice state for non-serializable values (Dates, functions, class instances), then configure `serializableCheck` with an `ignoredActions` / `ignoredPaths` allowlist instead of blanket `false`.

### 3. i18n Flat Namespace Merge — Medium Priority
- **Location:** `src/i18n.ts` + all `features/*/locales/`
- **Problem:** All feature locales merged into a single flat namespace — key collisions silently overwrite each other
- **Fix:** Add feature-specific key prefixes consistently (e.g., `auth.loginPage.title`, `projects.listPage.title`). Update all `t()` call sites to use the prefixed keys.

### 4. `USER_LOGOUT` Plain String Action — Low Priority
- **Location:** `src/store/root-reducer.ts` (or equivalent)
- **Problem:** Global state reset depends on a plain string action type `'USER_LOGOUT'` — not type-safe
- **Fix:** Create a typed action with `createAction('USER_LOGOUT')` from RTK and use the `.type` property in the root reducer.

## Context

Identified during codebase mapping. Branch `fix-fragile-areas` already checked out.

## Related Files

- `src/utils/auth.ts` — window.Clerk global access
- `src/store/index.ts` — serializableCheck: false
- `src/i18n.ts` — flat namespace merge
- `src/store/root-reducer.ts` — USER_LOGOUT plain string

## Notes

- Fix #1 (auth) and #5 (USER_LOGOUT) are low-risk, self-contained changes.
- Fix #3 (i18n) has the widest blast radius — touches all `t()` call sites across all features. Do last.
- Also open: Command palette stub (`app-layout.tsx` `CommandDialog` wired to hardcoded items, not router config) — lower priority, separate todo.

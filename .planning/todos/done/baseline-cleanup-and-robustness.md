# Todo: Baseline Cleanup & Robustness

**Created:** 2026-02-21
**Area:** global / cross-cutting
**Priority:** high

## Description

Establish a clean, well-documented, tech-debt-free baseline boilerplate so that new features can be built on top of a solid foundation. Address all high and medium priority concerns identified in `.planning/codebase/CONCERNS.md`, plus add a graceful Clerk configuration fallback.

## Tasks

### High Priority

- [x] **Fix `auth/index.js` broken barrel exports** — Removed empty stub exports; deleted `store/actions`, `store/reducers`, `store/epics`, `services/api` stub directories entirely.
- [x] **Migrate feature code from `.jsx`/`.js` to `.tsx`/`.ts`** — Core infrastructure fully migrated: lib, config, utils, store, services, all feature stores/selectors/services. `tsc --noEmit` passes with zero errors. Rule enforced: all new files must be `.tsx`/`.ts`.
- [x] **Graceful Clerk config fallback** — `src/config/env.js` now collects missing vars; `ConfigurationError` component (shadcn/ui) renders at app root when env is invalid; `main.tsx` updated.

### Medium Priority

- [x] **Remove `redux-observable` / `rxjs` dead dependencies** — Uninstalled from `package.json`.
- [x] **Remove `console.log` statements from production code** — Removed from `uploadRequirementDocument` in `features/projects/services/index.js`.
- [ ] **Wire up the Command Palette (⌘K)** — Deferred to future iteration.
- [x] **Resolve `projects-v2` route ambiguity** — `/projects-v2` removed; `ProjectsListPageV2` is canonical at `/projects`.

### Low Priority

- [x] **Remove `axios` / `use-axios.js`** — `axios` uninstalled; unused `src/hooks/use-axios.js` deleted.
- [x] **Delete `lib/utils copy.ts`** — Deleted.
- [x] **Clean up commented-out code** — Breadcrumb block removed from `app-layout.jsx`; `SignInPage` import and commented route removed from `auth/routes.jsx`.

### Additional (from conversation)

- [x] **Robust env config error UI** — `src/config/env.js` no longer throws; `ConfigurationError` component created; `main.tsx` renders it gracefully.
- [x] **Document barrel export rule** — `CONCERNS.md` updated with TS migration plan and resolved items.

## Context

Identified during codebase mapping (`/gsd-map-codebase`). The goal is a clean baseline boilerplate before new feature development begins. The user confirmed: fix high + medium priority concerns from `CONCERNS.md`, plus add Clerk key graceful fallback.

## Related Files

- `.planning/codebase/CONCERNS.md` — Source of all identified issues
- `src/features/auth/index.js` — Broken barrel exports
- `src/main.tsx` — Clerk bootstrap; crash point for missing key
- `src/config/env.js` — Env validation; throws on missing vars
- `src/utils/auth.js` — `window.Clerk` fragile token access
- `src/store/index.js` — `serializableCheck: false`
- `src/store/root-reducer.js` — `USER_LOGOUT` string action
- `src/layouts/app-layout.jsx` — Commented-out breadcrumb, stub command palette
- `src/features/auth/routes.jsx` — Commented-out signin route
- `src/features/projects/services/index.js` — `console.log` in production
- `src/lib/utils copy.ts` — Duplicate file to delete
- `package.json` — `axios`, `redux-observable`, `rxjs` to evaluate

## Notes

- UI components for error/fallback screens must use **shadcn/ui** components (per workspace rules)
- Forms must use **react-hook-form** + **zod** (per workspace rules)
- All static text strings must go through **i18n locale files** (per workspace rules)
- The TypeScript migration should be incremental — start with new files in `.tsx`/`.ts` and migrate existing files feature by feature
- Clerk publishable keys are safe to expose client-side (they are designed to be public); the concern is only about the app crashing when the key is absent

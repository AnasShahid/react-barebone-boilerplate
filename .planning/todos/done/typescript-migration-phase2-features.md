# Todo: TypeScript Migration Phase 2 — Feature Files

**Created:** 2026-02-21
**Area:** features
**Priority:** high

## Description

Migrate all remaining `.js`/`.jsx` files in `src/features/` to `.ts`/`.tsx`.
136 files across 12 features. Goal: zero `tsc --noEmit` errors, no import/reference errors.

## Features to Migrate (in dependency order)

- [ ] `meta` — trivial index barrel
- [ ] `data-table` — utility helpers
- [ ] `dashboard` — simple page + routes
- [ ] `user` — account page + routes + hooks
- [ ] `pricing` — pricing card + page + routes
- [ ] `invite` — accept invite component/page + routes
- [ ] `auth` — login/signup forms + hooks + routes
- [ ] `onboarding` — multi-step forms + context + routes
- [ ] `organization` — org management components + pages + routes
- [ ] `config-templates` — config template components + pages + routes
- [ ] `customers` — customer components/forms/dialogs + pages + routes
- [ ] `projects` — largest feature; project cards, requirements, tabs + pages + routes

## Related Files

- `src/features/*/index.js` — barrel exports
- `src/features/*/routes.jsx` — route definitions
- `src/features/*/components/*.jsx` — UI components
- `src/features/*/pages/*.jsx` — page containers
- `src/features/*/hooks/*.js` — custom hooks

## Notes

- Run `tsc --noEmit` after each feature batch to catch errors early
- Barrel `index.js` files → `index.ts`; component files → `.tsx`
- Add prop interfaces for all components
- Use `import type` for type-only imports (verbatimModuleSyntax)
- Delete old `.js`/`.jsx` files after each feature is migrated
- Commit after each feature

# Technical Concerns

## Tech Debt

| Area | Issue | Impact | Priority | Status |
|------|-------|--------|----------|--------|
| Mixed JS/TS | Most feature code is `.jsx`/`.js` while entry points are `.tsx`/`.ts`. No type safety in features, services, or store | No compile-time safety for API responses, Redux state, or component props | High | ✅ **Resolved (Phase 1 + 2)** — All shared infrastructure, `src/components/ui/`, all `src/features/` components, pages, routes, and services migrated. `tsc --noEmit` exits 0. Only `src/components/tiptap-*` remains as `.jsx` (third-party editor primitives, deferred). |
| `lib/utils copy.ts` | Duplicate file alongside `utils.ts` and `utils.js` | Confusion, dead code | Low | ✅ Resolved — file deleted |
| `auth/index.js` exports | Exported from empty stub paths (`./store/actions`, `./store/reducers`, `./store/epics`, `./services/api`) | Broken barrel export | High | ✅ Resolved — stubs removed, only real exports remain |
| Commented-out breadcrumb | `app-layout.jsx` had a large commented-out `<Breadcrumb>` block | Dead code, visual noise | Low | ✅ Resolved — removed |
| Commented-out signin route | `auth/routes.jsx` had `SignInPage` route commented out | Unclear intent | Low | ✅ Resolved — removed unused import and comment |
| `console.log` in production code | `features/projects/services/index.js` had debug logs in `uploadRequirementDocument` | Leaks debug info in production | Medium | ✅ Resolved — removed |
| `redux-observable` / `rxjs` | Installed but no epics exist in the codebase | Unused dependency adding bundle weight | Medium | ✅ Resolved — uninstalled |
| `axios` / `use-axios.js` | `axios` installed; `use-axios.js` hook existed but was never used anywhere | Unnecessary dependency | Low | ✅ Resolved — uninstalled, hook deleted |
| Command palette stub | `app-layout.jsx` `CommandDialog` has hardcoded static items not wired to navigation | Non-functional feature | Medium | **Open — wire to router config in future iteration** |
| `projects-v2` route | `/projects-v2` existed alongside `/projects` | Ambiguous canonical route | Medium | ✅ Resolved — `/projects-v2` removed; `ProjectsListPageV2` is canonical at `/projects` |

## Known Issues

| Issue | Location | Status |
|-------|----------|--------|
| `serializableCheck: false` | `src/store/index.ts` | **Open** — Required for `redux-persist` but suppresses serialization warnings. Audit store before enabling selectively. |
| Token fetched via `window.Clerk` | `src/utils/auth.ts` | **Open** — Fragile global access; works in browser but breaks in test environments. Migrate to Clerk React hooks when refactoring API layer. |

## TypeScript Migration Plan (Incremental)

The codebase is mixed JS/TS. The goal is to migrate incrementally without breaking existing functionality.

**Rule going forward:** All new files must be `.tsx` / `.ts`. No new `.jsx` / `.js` files.

### Migration Status

| Step | Scope | Status |
|------|-------|--------|
| 1 | `src/lib/` — utilities and error handler | ✅ Done |
| 2 | `src/config/env.js` → `env.ts` | ✅ Done |
| 3 | `src/utils/auth.js` → `auth.ts` | ✅ Done |
| 4 | `src/store/` — `RootState` and `AppDispatch` types | ✅ Done |
| 5 | `src/services/api-slice.js` → `api-slice.ts` | ✅ Done |
| 6 | Feature stores (`features/*/store/`) | ✅ Done |
| 7 | Feature services (`features/*/services/`) | ✅ Done |
| 8 | Feature components, pages, routes — all `.jsx` → `.tsx` | ✅ Done |
| 9 | `src/components/ui/` — all `.jsx` → `.tsx` | ✅ Done |
| 10 | `src/components/tiptap-*` — editor primitives | **Deferred** — third-party editor layer, low risk |

`tsc --noEmit` exits **0**. No `.jsx`/`.js` files remain in `src/features/` or `src/components/ui/`.

### Key Types to Define

| Type | Location | Purpose |
|------|----------|---------|
| `RootState` | `src/store/index.ts` | Typed `useSelector` |
| `AppDispatch` | `src/store/index.ts` | Typed `useDispatch` |
| `EnvConfig` | `src/config/env.ts` | Typed env config object |
| Per-feature state interfaces | `features/*/store/` | Typed slice state |
| API response types | `features/*/services/` | Typed RTK Query responses |

## Fragile Areas

| Area | Why Fragile | Recommendation |
|------|-------------|----------------|
| `window.Clerk.session.getToken()` | Direct global access; not reactive; silently returns `null` if Clerk hasn't initialized | Replace with Clerk's `useAuth()` hook — already available in `use-clerk-auth.js` |
| `redux-persist` with `serializableCheck: false` | Disabling serialization check can hide bugs where non-serializable values enter the store | Enable selectively or audit store for non-serializable values |
| i18n flat namespace merge | All feature locales merged into a single flat namespace — key collisions silently overwrite each other | Add feature-specific key prefixes (e.g., `auth.loginPage.title`) consistently |
| `onQueryStarted` dual-write pattern | RTK Query results cached by RTK Query AND manually dispatched to Redux slices — two sources of truth | Prefer RTK Query cache as single source of truth; use RTK Query's cache selectors |
| `USER_LOGOUT` action | Global state reset depends on a plain string action type `'USER_LOGOUT'` — not type-safe | Create a typed action with `createAction` from RTK during TS migration |

## Security Considerations

| Area | Concern | Status |
|------|---------|--------|
| Environment variables | All `VITE_*` vars embedded in client bundle at build time — never put secrets here | Acceptable for publishable keys; backend secrets must stay server-side |
| Clerk publishable key | Exposed in client bundle via `VITE_CLERK_PUBLISHABLE_KEY` | Expected and safe — publishable keys are designed to be public |
| Missing env vars | Previously crashed the app silently; now shows a `ConfigurationError` UI | ✅ Resolved — graceful fallback implemented |
| JWT token handling | Token fetched from Clerk session and attached to every API request | Secure; tokens are short-lived and managed by Clerk |
| `redux-persist` localStorage | Entire Redux state (including user/org data) persisted to localStorage | Sensitive data in localStorage is accessible to XSS; consider encrypting or selectively persisting |
| RBAC permissions | `PERMISSIONS` constants defined client-side — enforcement must also exist server-side | Client-side permissions are UI-only; backend must validate all operations |

# Architecture

## Overview

A modular, feature-sliced React SPA (Single Page Application) backed by a REST API. The application is organized around discrete business features, each self-contained with its own components, pages, routes, services (RTK Query), Redux slice, and locale files. Authentication is delegated entirely to Clerk. State is managed via Redux Toolkit with redux-persist for cross-session persistence.

## Patterns

| Pattern | Where Used | Notes |
|---------|------------|-------|
| Feature-Sliced Design | `src/features/` | Each feature owns its own components, pages, routes, services, store, locales |
| Container/Presenter | `features/*/pages/` vs `features/*/components/` | Pages compose components; components are self-contained |
| RTK Query (API layer) | `src/services/api-slice.js` + `features/*/services/` | Single base `apiSlice`, extended via `injectEndpoints` per feature |
| Redux Slices | `features/*/store/*-slice.js` | RTK `createSlice` for local state; RTK Query for server state |
| Optimistic Updates | `features/projects/services/index.js` | `onQueryStarted` dispatches to Redux before API confirms |
| Barrel Exports | `features/*/index.js`, `features/*/components/index.js` | Re-export public API of each feature/component group. Only export what is needed.|
| Layout-based Routing | `src/router/index.jsx` | Layouts wrap route groups; Clerk guards control access |
| Singleton Config | `src/config/env.js` | Frozen env config object validated at startup |
| i18n Namespace Merging | `src/i18n.js` | Each feature's locale JSON merged into a single flat translation namespace |

## Layers

| Layer | Responsibility | Key Files |
|-------|---------------|-----------|
| Entry | Bootstrap React, Clerk, Redux, i18n | `src/main.tsx`, `src/App.tsx`, `src/i18n.js` |
| Router | Route definitions, layout guards, Clerk auth gates | `src/router/index.jsx`, `features/*/routes.jsx` |
| Layouts | Shared UI shells (sidebar, header, auth wrapper) | `src/layouts/` |
| Pages | Route-level containers; compose feature components | `features/*/pages/` |
| Components | Reusable UI: feature-specific + common + shadcn/ui | `src/components/`, `features/*/components/` |
| Services | RTK Query endpoint definitions per feature | `src/services/api-slice.js`, `features/*/services/index.js` |
| Store | Redux slices + root reducer + persisted store | `src/store/`, `features/*/store/` |
| Config | Environment variables, app-level config | `src/config/env.js` |
| Constants | Static data: permissions, sidebar dimensions | `src/constants/` |
| Utils / Lib | Auth token helper, `cn()` utility, error handler, TipTap utils | `src/utils/`, `src/lib/` |
| Locales | i18n JSON per feature, merged in `i18n.js` | `src/locales/`, `features/*/locales/` |

## Data Flow

```
User Action
  → React Component (react-hook-form / event handler)
  → RTK Query mutation/query hook (from features/*/services)
    → fetchBaseQuery (attaches Clerk JWT Bearer token)
    → REST API (VITE_API_URL/v1/...)
    → onQueryStarted: dispatch to Redux slice (optimistic / sync)
    → Cache invalidation via providesTags / invalidatesTags
  → Redux store updated
  → Component re-renders via useSelector / RTK Query hook
```

State reset on logout is handled by the `USER_LOGOUT` action in `root-reducer.js`, which resets the entire Redux state to `undefined`.

## Routing Structure

```
/ (AppLayout — requires SignedIn)
  /dashboard
  /projects
  /projects/:id
  /projects/:id/requirements
  /customers
  /config-templates
  /pricing
  /user/*
  /401, /500, /*

/auth (AuthLayout — requires SignedOut)
  /auth/login
  /auth/signup
  /auth/forgot-password

/onboarding (OnboardingLayout — requires SignedIn)
  /onboarding/*

/invite/* (no layout guard — public)
```

## External Services

| Service | Purpose | Integration Point |
|---------|---------|-------------------|
| Clerk | Authentication, session management, JWT issuance | `src/main.tsx` (ClerkProvider), `src/utils/auth.js` (token fetch via `window.Clerk.session`) |
| REST API | Backend business logic | `src/services/api-slice.js` (`VITE_API_URL/v1`) |
| Browser localStorage | Redux state persistence | `redux-persist` with `redux-persist/lib/storage` |

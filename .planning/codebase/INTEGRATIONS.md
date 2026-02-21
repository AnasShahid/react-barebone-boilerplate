# External Integrations

## APIs

| API | Purpose | Auth Method |
|-----|---------|-------------|
| Backend REST API (`VITE_API_URL/v1`) | All business data (projects, customers, config templates, requirements, users, organizations) | Bearer JWT token from Clerk session |

### API Slice Tag Types

The RTK Query base slice declares the following cache tag types:
- `user`, `organizations`, `customers`, `config-templates`, `requirements`, `requirement`

### API Endpoints (by feature)

| Feature | Endpoints |
|---------|-----------|
| `projects` | `createProject`, `getAllProjects`, `getProjectById`, `updateProject`, `getProjectRequirements`, `createProjectRequirements`, `updateProjectRequirements`, `deleteProjectRequirements`, `getSingleProjectRequirement`, `uploadRequirementDocument`, `deleteRequirementDocument` |
| `user` | `getMyProfile` (and others) |
| `customers` | CRUD endpoints |
| `config-templates` | CRUD endpoints |
| `organization` | CRUD + member management endpoints |
| `auth` | Login, signup, forgot password (via Clerk UI components) |
| `meta` | App metadata endpoints |

## Services

| Service | Purpose | Config |
|---------|---------|--------|
| **Clerk** | Authentication, session management, JWT token issuance, user/org management | `VITE_CLERK_PUBLISHABLE_KEY` env var; `ClerkProvider` in `main.tsx`; `afterSignOutUrl`, `signInFallbackRedirectUrl`, `signUpFallbackRedirectUrl` configured |
| **Browser localStorage** | Redux state persistence across sessions | `redux-persist` with `redux-persist/lib/storage`; persist key: `'app'` |

## Authentication Flow

1. `ClerkProvider` wraps the entire app in `main.tsx`
2. Routes are guarded by Clerk's `<SignedIn>` / `<SignedOut>` components in `router/index.jsx`
3. API calls attach a Bearer JWT via `prepareHeaders` in `api-slice.js`
4. Token is fetched from `window.Clerk.session.getToken()` (via `src/utils/auth.js`)
5. On logout, `USER_LOGOUT` action resets entire Redux state

## Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `VITE_APP_ENV` | Current environment (`development`, `qa`, `production`) | Yes |
| `VITE_API_URL` | Base URL for the backend REST API | Yes |
| `VITE_APP_TITLE` | Application title (used in SEO/head tags) | Yes |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk authentication publishable key | Yes |

All variables are validated at startup in `src/config/env.js` — the app throws if any are missing.

## Build Modes

| Mode | Command | `.env` File |
|------|---------|------------|
| Development | `npm run dev` | `.env` |
| QA | `npm run server:qa` / `npm run build:qa` | `.env.qa` (Vite convention) |
| Production | `npm run server:prod` / `npm run build:prod` | `.env.production` (Vite convention) |

## Docker

| File | Purpose |
|------|---------|
| `Dockerfile` | Multi-stage build: Node build + Nginx static serving |
| `docker-compose.yml` | Local containerized environment |
| `nginx.conf` | Nginx config for SPA routing (all paths → `index.html`) |

## i18n

| Language | Code | Status |
|----------|------|--------|
| English | `en` | Primary / fallback |
| Spanish | `es` | Supported |

Language detection is automatic via `i18next-browser-languagedetector`.

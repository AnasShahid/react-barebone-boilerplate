# Directory Structure

```
react-boilerplate/
├── .env                        # Local environment variables (gitignored)
├── .env.example                # Environment variable template
├── .github/                    # GitHub Actions CI/CD workflows
├── .husky/                     # Git hooks (pre-commit)
├── .planning/                  # Planning and codebase documentation
├── .prettierrc                 # Prettier formatting config
├── .windsurf/                  # Windsurf IDE workflows and rules
├── Dockerfile                  # Docker container definition
├── docker-compose.yml          # Docker Compose for local containerized dev
├── eslint.config.js            # ESLint flat config (v9)
├── index.html                  # HTML entry point
├── nginx.conf                  # Nginx config for production static serving
├── components.json             # shadcn/ui CLI configuration
├── package.json                # Dependencies and scripts
├── tsconfig.json               # Root TypeScript config
├── tsconfig.app.json           # App TypeScript config
├── tsconfig.node.json          # Node TypeScript config (Vite)
├── vite.config.ts              # Vite build config with @ alias
└── src/
    ├── main.tsx                # App bootstrap: Clerk + React DOM
    ├── App.tsx                 # Root: Redux Provider + PersistGate + ThemeProvider + Router
    ├── App.css                 # App-level styles
    ├── index.css               # Global CSS (Tailwind base + CSS variables)
    ├── i18n.js                 # i18next setup; merges all feature locale files
    ├── assets/                 # Static assets compiled by Vite
    ├── components/             # Shared/common components
    │   ├── ui/                 # shadcn/ui generated components (40 components)
    │   ├── layout/             # Layout-specific shared components
    │   ├── tiptap-extension/   # Custom TipTap extensions
    │   ├── tiptap-icons/       # Icons for TipTap toolbar
    │   ├── tiptap-node/        # Custom TipTap node components
    │   ├── tiptap-templates/   # TipTap editor templates
    │   ├── tiptap-ui/          # TipTap UI toolbar components
    │   ├── tiptap-ui-primitive/# TipTap primitive UI elements
    │   ├── app-sidebar.jsx     # Main application sidebar
    │   ├── nav-main.jsx        # Primary navigation items
    │   ├── nav-projects.jsx    # Projects navigation section
    │   ├── nav-secondary.jsx   # Secondary navigation items
    │   ├── nav-user.jsx        # User menu in sidebar
    │   ├── org-switcher.jsx    # Organization switcher dropdown
    │   ├── mode-toggle.jsx     # Dark/light mode toggle
    │   ├── seo.jsx             # SEO head tag management
    │   ├── spinner.jsx         # Loading spinner
    │   ├── otp-form.jsx        # OTP input form
    │   ├── document-viewer.jsx # Document preview component
    │   └── resources-page-header.jsx # Reusable page header
    ├── config/
    │   └── env.js              # Validated, frozen env config singleton
    ├── constants/
    │   ├── permissions.js      # RBAC permission definitions (org, user, role, invite, customer)
    │   └── sidebar.constants.js# Sidebar dimension/cookie constants
    ├── features/               # Feature modules (see Feature Structure below)
    │   ├── auth/               # Authentication pages and hooks
    │   ├── config-templates/   # Configuration template management
    │   ├── customers/          # Customer management
    │   ├── dashboard/          # Dashboard overview
    │   ├── data-table/         # Shared data table feature
    │   ├── invite/             # User invitation flow
    │   ├── meta/               # App metadata / global meta state
    │   ├── onboarding/         # User onboarding flow
    │   ├── organization/       # Organization management
    │   ├── pricing/            # Pricing plans page
    │   ├── projects/           # Project and requirements management
    │   └── user/               # User profile management
    ├── hooks/                  # Shared custom React hooks
    ├── layouts/
    │   ├── app-layout.jsx      # Main app shell: sidebar + header + ⌘K command palette
    │   ├── auth-layout.jsx     # Centered auth form layout
    │   ├── onboarding-layout.jsx # Onboarding step layout
    │   ├── edit-org-layout.jsx # Organization edit layout
    │   └── root-layout.jsx     # Root layout wrapper
    ├── lib/
    │   ├── utils.js            # cn() utility (clsx + tailwind-merge)
    │   ├── utils.ts            # TypeScript version of cn()
    │   ├── error-handler.js    # ErrorHandler class for API/route errors
    │   └── tiptap-utils.js     # TipTap editor utility functions
    ├── locales/
    │   ├── en.json             # Common English translations
    │   └── es.json             # Common Spanish translations
    ├── pages/
    │   ├── home/               # Home page
    │   └── error/              # 404, 401, 500 error pages
    ├── providers/
    │   └── theme-provider.tsx  # next-themes ThemeProvider wrapper
    ├── router/
    │   └── index.jsx           # createBrowserRouter: all routes assembled here
    ├── services/
    │   └── api-slice.js        # RTK Query base apiSlice with Clerk JWT auth
    ├── store/
    │   ├── index.js            # configureStore with redux-persist
    │   └── root-reducer.js     # combineReducers + USER_LOGOUT reset handler
    ├── styles/                 # Additional global style files
    └── utils/
        └── auth.js             # getAuthToken / getFreshAuthToken via window.Clerk
```

## Feature Structure (per feature)

```
features/<feature-name>/
├── index.js                    # Public barrel export for the feature
├── components/
│   └── index.js                # Barrel export for feature components
├── locales/
│   ├── en.json                 # English translations for this feature
│   └── es.json                 # Spanish translations for this feature
├── pages/                      # Route-level page components
├── routes.jsx                  # React Router route definitions
├── services/
│   └── index.js                # RTK Query injectEndpoints for this feature
└── store/
    ├── <name>-slice.js         # RTK createSlice
    └── selectors.js            # Reselect/plain selectors
```

## Key Directories

| Directory | Purpose | Key Files |
|-----------|---------|-----------|
| `src/features/` | All business features, self-contained | 12 feature modules |
| `src/components/ui/` | shadcn/ui component library (40 components) | `button.jsx`, `dialog.jsx`, `sidebar.jsx`, etc. |
| `src/components/tiptap-*` | TipTap WYSIWYG editor ecosystem | Extensions, nodes, UI, icons |
| `src/store/` | Redux store configuration | `index.js`, `root-reducer.js` |
| `src/services/` | RTK Query base slice | `api-slice.js` |
| `src/router/` | All routes assembled | `index.jsx` |
| `src/layouts/` | Application layout shells | 5 layout files |
| `src/locales/` | Common i18n strings | `en.json`, `es.json` |

## Entry Points

| Entry | Type | Purpose |
|-------|------|---------|
| `index.html` | HTML | Vite HTML entry, mounts `#root` |
| `src/main.tsx` | TSX | React DOM render, ClerkProvider, i18n init |
| `src/App.tsx` | TSX | Redux Provider, PersistGate, ThemeProvider, RouterProvider |
| `src/router/index.jsx` | JSX | All route definitions with layout guards |
| `src/store/index.js` | JS | Redux store with persistence |
| `src/services/api-slice.js` | JS | RTK Query base API slice |
| `src/i18n.js` | JS | i18next initialization with all locale merges |

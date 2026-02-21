# Technology Stack

## Languages

| Language | Version | Usage |
|----------|---------|-------|
| JavaScript (ESM) | ES2020+ | Primary language for features, services, stores, routes |
| TypeScript | ~5.9.3 | Entry point (`main.tsx`, `App.tsx`), config files, lib utilities |
| JSX/TSX | - | React component files |

## Frameworks

| Framework | Version | Purpose |
|-----------|---------|---------|
| React | ^19.2.0 | UI rendering and component model |
| React Router DOM | ^7.9.6 | Client-side routing with nested layouts |
| Redux Toolkit (RTK) | ^2.11.0 | State management and slice creation |
| RTK Query | (bundled with RTK) | API data fetching, caching, and cache invalidation |
| TailwindCSS | ^4.1.17 | Utility-first CSS styling |
| shadcn/ui | (via Radix UI) | Accessible, composable UI component library |
| TipTap | ^3.11.0 | WYSIWYG rich text editor |

## Dependencies

### Production

| Package | Version | Purpose |
|---------|---------|---------|
| `@clerk/clerk-react` | ^5.56.2 | Authentication provider (sign-in, sign-up, session management) |
| `@clerk/themes` | ^2.4.39 | Clerk UI theming |
| `@reduxjs/toolkit` | ^2.11.0 | Redux state management and RTK Query |
| `react-redux` | ^9.2.0 | React bindings for Redux |
| `redux` | ^5.0.1 | Core Redux library |
| `redux-persist` | ^6.0.0 | Persists Redux state to localStorage |
| `redux-observable` | ^3.0.0-rc.2 | Epic-based side effects (partially used) |
| `rxjs` | ^7.8.2 | Reactive extensions (used with redux-observable) |
| `react-hook-form` | ^7.66.1 | Form state management |
| `@hookform/resolvers` | ^5.2.2 | Zod resolver for react-hook-form |
| `zod` | ^4.1.12 | Schema validation for forms |
| `i18next` | ^25.6.3 | Internationalization framework |
| `react-i18next` | ^16.3.5 | React bindings for i18next |
| `i18next-browser-languagedetector` | ^8.2.0 | Auto-detect browser language |
| `sonner` | ^2.0.7 | Toast notification system |
| `lucide-react` | ^0.554.0 | Icon library |
| `date-fns` | ^4.1.0 | Date manipulation utilities |
| `axios` | ^1.13.2 | HTTP client (available but RTK Query is primary) |
| `next-themes` | ^0.4.6 | Theme switching (dark/light mode) |
| `clsx` | ^2.1.1 | Conditional className utility |
| `tailwind-merge` | ^3.4.0 | Merge Tailwind classes without conflicts |
| `class-variance-authority` | ^0.7.1 | Component variant management |
| `cmdk` | ^1.1.1 | Command palette (⌘K) |
| `@tanstack/react-table` | ^8.21.3 | Headless data table |
| `react-markdown` | ^10.1.0 | Markdown rendering |
| `react-doc-viewer` | ^0.1.15 | Document viewer component |
| `react-day-picker` | ^9.11.2 | Date picker component |
| `input-otp` | ^1.4.2 | OTP input component |
| `@floating-ui/react` | ^0.27.16 | Floating UI positioning |
| `lowlight` | ^3.3.0 | Syntax highlighting (used with TipTap) |
| `tiptap-markdown` | ^0.9.0 | Markdown extension for TipTap |
| All `@radix-ui/*` | ^1.x–^2.x | Headless accessible UI primitives (backing shadcn/ui) |
| All `@tiptap/*` | ^3.11.0 | TipTap editor extensions |

### Development

| Package | Version | Purpose |
|---------|---------|---------|
| `vite` | ^7.2.4 | Build tool and dev server |
| `@vitejs/plugin-react` | ^5.1.1 | React Fast Refresh for Vite |
| `@tailwindcss/vite` | ^4.1.17 | TailwindCSS Vite plugin |
| `eslint` | ^9.39.1 | JavaScript/TypeScript linting |
| `typescript-eslint` | ^8.46.4 | TypeScript-aware ESLint rules |
| `eslint-plugin-react-hooks` | ^7.0.1 | Lint React hooks rules |
| `eslint-plugin-react-refresh` | ^0.4.24 | Lint React Refresh compatibility |
| `prettier` | ^3.6.2 | Code formatting |
| `husky` | ^9.1.7 | Git hooks (pre-commit: format + lint) |
| `typescript` | ~5.9.3 | TypeScript compiler |
| `tw-animate-css` | ^1.4.0 | Animation utilities for Tailwind |

## Build Tools

| Tool | Config File | Purpose |
|------|-------------|---------|
| Vite | `vite.config.ts` | Dev server, bundling, HMR |
| TypeScript | `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` | Type checking |
| ESLint | `eslint.config.js` | Linting (flat config format) |
| Prettier | `.prettierrc` | Code formatting |
| Husky | `.husky/` | Pre-commit hooks |
| Docker | `Dockerfile`, `docker-compose.yml` | Containerization |
| Nginx | `nginx.conf` | Production static file serving |

## Path Aliases

| Alias | Resolves To |
|-------|-------------|
| `@` | `./src` |

# Coding Conventions

## Naming

| Type | Convention | Example |
|------|------------|---------|
| Feature directories | `kebab-case` | `config-templates/`, `data-table/` |
| Component files | `kebab-case.jsx` or `kebab-case.tsx` | `app-sidebar.jsx`, `theme-provider.tsx` |
| Page files | `kebab-case.jsx` | `login.jsx`, `projects-list.jsx` |
| Service files | `index.js` inside `services/` | `features/projects/services/index.js` |
| Slice files | `<name>-slice.js` | `projects-slice.js`, `requirements-slice.js` |
| Selector files | `selectors.js` | `features/user/store/selectors.js` |
| Route files | `routes.jsx` | `features/auth/routes.jsx` |
| Hook files | `use-<name>.js` | `use-auth.js` |
| Locale files | `en.json`, `es.json` | `features/projects/locales/en.json` |
| Constants files | `<name>.constants.js` | `sidebar.constants.js` |
| Config files | `<name>.js` | `env.js` |
| React components | `PascalCase` | `AppSidebar`, `LoginPage`, `ProjectsListPage` |
| React hooks | `camelCase` prefixed with `use` | `useGetMyProfileQuery`, `useAuth` |
| Redux actions | `camelCase` | `setProjects`, `clearProjects` |
| Redux slice names | `camelCase` | `projects`, `configTemplates` |
| RTK Query hooks | Auto-generated: `use<EndpointName>Query/Mutation` | `useGetAllProjectsQuery`, `useCreateProjectMutation` |
| Environment variables | `VITE_` prefix, `SCREAMING_SNAKE_CASE` | `VITE_API_URL`, `VITE_CLERK_PUBLISHABLE_KEY` |
| i18n translation keys | `camelCase` grouped by component | `{ "loginPage": { "title": "..." } }` |

## Code Style

- **Language mix**: Most feature code is `.jsx`/`.js` (JavaScript); entry points and lib utilities use `.tsx`/`.ts` (TypeScript)
- **Component self-sufficiency**: Components handle their own API calls and Redux interactions via RTK Query hooks — props are minimized
- **Forms**: Always `react-hook-form` + `zod` schema validation via `@hookform/resolvers/zod`
- **Notifications**: Always `sonner` (`toast.success()`, `toast.error()`) — never `alert()` or custom modals for notifications
- **Loading states**: Skeleton components for data-fetching loading states; spinner for action loading states
- **Error pages**: Dedicated `/401`, `/500`, `/*` (404) routes with page components
- **Barrel exports**: Every feature and component group exposes a public API via `index.js`
- **Locale strings**: All user-visible static text must be in locale JSON files, never hardcoded in JSX
- **Path imports**: Always use `@/` alias (e.g., `@/components/ui/button`) — no relative `../../` traversals across feature boundaries
- **Tailwind classes**: Use `cn()` from `@/lib/utils` for conditional/merged class names
- **Theme**: `dark` mode default in `AppLayout`; `next-themes` + `ThemeProvider` for switching

## Formatting

| Aspect | Convention |
|--------|------------|
| Indentation | 2 spaces (no tabs) |
| Quotes | Single quotes (`'`) |
| Semicolons | Required |
| Trailing commas | ES5 style (objects, arrays, function params) |
| Print width | 100 characters |
| Arrow function parens | Always (`(x) => x`) |
| Bracket spacing | `{ key: value }` |
| Bracket same line | Closing `>` on new line |
| End of line | LF |
| Quote props | As needed (no unnecessary quotes on object keys) |

## Linting

| Tool | Config |
|------|--------|
| ESLint | `eslint.config.js` (flat config v9) |
| TypeScript ESLint | `tseslint.configs.recommended` |
| React Hooks | `eslint-plugin-react-hooks` (recommended) |
| React Refresh | `eslint-plugin-react-refresh` (Vite mode) |
| Prettier | `.prettierrc` |

## Git Hooks

| Hook | Command |
|------|---------|
| `pre-commit` | `npm run format && npm run lint` (via Husky) |

## shadcn/ui Component Usage

- All custom UI components must be based on shadcn/ui primitives
- shadcn/ui components are installed into `src/components/ui/` via the CLI
- `components.json` configures the shadcn/ui CLI (aliases, style, base color)
- Use `cn()` for all className merging in component variants

## Feature Module Rules

- A `routes.jsx` only renders `Page` components — never directly renders feature `components/`
- Pages are presentational compositions only
- Components are self-encapsulated: they fetch their own data and manage their own state
- Each feature re-exports its public API from `features/<name>/index.js`

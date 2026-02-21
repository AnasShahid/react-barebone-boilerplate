# Testing

## Framework

| Type | Framework | Config |
|------|-----------|--------|
| Unit / Component | Jest | `jest.config.cjs` |
| Component rendering | React Testing Library (`@testing-library/react`) | — |
| User interaction | `@testing-library/user-event` | — |
| E2E | Not configured | — |

## Test Location

| Type | Location | Pattern |
|------|----------|---------|
| Page tests | `features/<name>/__tests__/pages/` | `<page-name>.test.jsx` |
| Component tests | `features/<name>/__tests__/components/` (convention) | `<component-name>.test.jsx` |

Currently only one test file exists:
- `src/features/auth/__tests__/pages/login.test.jsx`

## Test Patterns

Tests follow this structure:
- **Mocking**: `jest.mock()` for hooks and router (`react-router-dom`)
- **Setup**: `beforeEach` clears mocks and sets up mock return values
- **Assertions**: `screen.getBy*` queries + `expect(...).toBeInTheDocument()`
- **User events**: `userEvent.type()` for realistic input simulation
- **Async**: `waitFor()` for async state updates after form submission

Example test cases in `login.test.jsx`:
1. Renders form fields
2. Shows validation errors for empty fields
3. Validates email format
4. Calls login function with credentials
5. Navigates after successful login
6. Shows error message on failure
7. Disables submit button while loading
8. Toggles password visibility

## Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Run tests for a specific module/project
npm run test:module
```

## Coverage

No coverage configuration detected. Coverage thresholds are not enforced.

## Gaps

- Only 1 test file exists for 12 features — test coverage is very low
- No integration or E2E tests
- No tests for RTK Query services, Redux slices, or selectors
- No tests for shared components (sidebar, nav, org-switcher, etc.)

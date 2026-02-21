# Todo: Fix npm package vulnerabilities

**Created:** 2026-02-21
**Area:** dependencies
**Priority:** high

## Description

Fix all npm package vulnerabilities reported by `npm audit`. 23 vulnerabilities were present (4 moderate, 19 high). All have been resolved.

## Context

User requested fixing all npm install vulnerabilities without breaking the build.

## Related Files

- `package.json` — Added `overrides` block for `tar` and `minimatch`; ran `npm audit fix` for non-breaking fixes

## What Was Done

1. **`npm audit fix`** — Fixed non-breaking vulnerabilities:
   - `react-router` / `react-router-dom` CSRF/XSS (upgraded to safe version)
   - `ajv` ReDoS (upgraded)
   - `lodash` prototype pollution (upgraded)
   - `markdown-it` ReDoS (upgraded)
   - `@typescript-eslint/*` chain (upgraded to 8.56.0)

2. **npm `overrides`** in `package.json` — Fixed transitive dependency chains without breaking changes:
   - `tar: ^7.5.9` — fixes `@mapbox/node-pre-gyp` → `canvas` → `react-doc-viewer` chain
   - `minimatch: ^10.2.2` — fixes `@eslint/*` and `@typescript-eslint/typescript-estree` chain

## Result

`found 0 vulnerabilities` — build compiles successfully.

## Notes

- `react-doc-viewer` kept at `^0.1.15` (no downgrade needed thanks to overrides)
- `eslint` kept at `^9.x` to maintain peer dep compatibility with `eslint-plugin-react-hooks@7`
- Node.js engine warnings (`v20.13.1` vs required `^20.19.0`) are pre-existing and unrelated to vulnerabilities

# Todo: Fix RTK Query Dual-Write Pattern

**Created:** 2026-02-21
**Area:** services / rtk-query
**Priority:** medium

## Description

Remove the `onQueryStarted` dual-write pattern across all feature services. RTK Query results are currently cached by RTK Query AND manually dispatched into Redux slices — creating two sources of truth for the same data.

## Problem

```ts
async onQueryStarted(data, { dispatch, queryFulfilled }) {
  const { data: newRequirement } = await queryFulfilled;
  dispatch(addRequirement({ ... })); // <-- redundant write to slice
}
```

RTK Query already caches the response. The manual `dispatch` creates a second copy in the Redux slice. These can diverge when RTK Query refetches (invalidation, window focus) without the `onQueryStarted` firing again.

**Impacts:**
- Stale data divergence between cache and slice after invalidation/refetch
- Optimistic update rollbacks only revert the cache, not the slice
- Double render cycles per API response
- Harder to trace bugs — components reading from slice see different data than those reading from cache

## Fix

1. Audit all `features/*/services/index.ts` for `onQueryStarted` blocks that only dispatch to a slice
2. Remove those `dispatch` calls
3. Migrate component reads from `useSelector(selectX)` to `useXQuery().data`
4. Remove now-unused slice actions/reducers if the slice only existed to hold API data

## Known Locations

- `src/features/projects/services/index.ts` — `createProjectRequirements` dispatches `addRequirement`
- `src/features/config-templates/services/index.ts` — likely has same pattern (open in IDE)
- All other `features/*/services/index.ts` files — need audit

## Context

Deferred from `fix-fragile-areas.md` — requires per-feature audit before removing dispatches. Wide blast radius across component `useSelector` call sites.

## Notes

- Do a feature-by-feature audit: one feature at a time, verify no component reads from the slice before removing the dispatch.
- `invalidatesTags` is the correct RTK Query mechanism for post-mutation cache updates — keep those, only remove manual `dispatch` in `onQueryStarted`.

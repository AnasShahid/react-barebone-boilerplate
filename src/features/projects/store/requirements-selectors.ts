import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/store';
import type { Requirement, RequirementsState } from './requirements-slice';

interface RequirementFilters {
  status?: string;
  search?: string;
  sortBy?: keyof Requirement;
  sortOrder?: 'asc' | 'desc';
}

const selectRequirementsState = (state: RootState): RequirementsState => state.requirements;

export const selectAllRequirements = createSelector(
  [selectRequirementsState],
  (requirements) => requirements
);

export const selectProjectRequirements = createSelector(
  [selectRequirementsState, (_state: RootState, projectId: string) => projectId],
  (requirements, projectId): Requirement[] => {
    const requirementIds = requirements.byProjectId[projectId] ?? [];
    return requirementIds.map((id) => requirements.byId[id]).filter(Boolean) as Requirement[];
  }
);

export const selectRequirementById = createSelector(
  [selectRequirementsState, (_state: RootState, requirementId: string) => requirementId],
  (requirements, requirementId): Requirement | undefined => requirements.byId[requirementId]
);

export const selectProjectRequirementsLoading = createSelector(
  [selectRequirementsState, (_state: RootState, projectId: string) => projectId],
  (requirements, projectId): boolean => requirements.loading[projectId] ?? false
);

export const selectProjectRequirementsError = createSelector(
  [selectRequirementsState, (_state: RootState, projectId: string) => projectId],
  (requirements, projectId): string | null => requirements.errors[projectId] ?? null
);

export const selectProjectRequirementsCount = createSelector(
  [selectRequirementsState, (_state: RootState, projectId: string) => projectId],
  (requirements, projectId): number => {
    const requirementIds = requirements.byProjectId[projectId] ?? [];
    return requirementIds.length;
  }
);

export const selectFilteredProjectRequirements = createSelector(
  [
    selectProjectRequirements,
    (_state: RootState, _projectId: string, filters?: RequirementFilters) => filters,
  ],
  (requirements, filters: RequirementFilters = {}): Requirement[] => {
    let filtered = [...requirements];

    if (filters.status) {
      filtered = filtered.filter((req) => req.status === filters.status);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (req) =>
          (req.title as string | undefined)?.toLowerCase().includes(searchLower) ||
          (req.description as string | undefined)?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.sortBy) {
      const sortBy = filters.sortBy;
      filtered.sort((a, b) => {
        const aVal = String(a[sortBy] ?? '');
        const bVal = String(b[sortBy] ?? '');
        if (filters.sortOrder === 'desc') {
          return bVal > aVal ? 1 : -1;
        }
        return aVal > bVal ? 1 : -1;
      });
    }

    return filtered;
  }
);

export const selectAreProjectRequirementsLoaded = createSelector(
  [selectRequirementsState, (_state: RootState, projectId: string) => projectId],
  (requirements, projectId): boolean =>
    Object.prototype.hasOwnProperty.call(requirements.byProjectId, projectId)
);

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/store';
import type { Organization } from './org-slice';

export const selectAllOrganizations = (state: RootState): Organization[] => state.organizations;

export const selectDefaultOrganization = createSelector(
  [selectAllOrganizations],
  (organizations) => organizations.find((org) => org.is_default) ?? null
);

export const selectOrganizationPermissions = createSelector(
  [selectAllOrganizations, (_state: RootState, organizationId?: string) => organizationId],
  (organizations, organizationId) => {
    const organization = organizationId
      ? organizations.find((org) => org.id === organizationId)
      : organizations.find((org) => org.is_default);
    return organization ? (organization.permissions as string[] | undefined) ?? null : null;
  }
);

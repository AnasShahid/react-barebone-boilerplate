import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit';

export interface OrganizationInvite {
  id: string;
  email: string;
  status: string;
  [key: string]: unknown;
}

export interface OrganizationRole {
  id: string;
  name: string;
  [key: string]: unknown;
}

export interface Organization {
  id: string;
  name: string;
  invites?: OrganizationInvite[];
  available_roles?: OrganizationRole[];
  [key: string]: unknown;
}

type OrgState = Organization[];

const initialState: OrgState = [];

const orgSlice = createSlice({
  name: 'organizations',
  initialState,
  reducers: {
    setOrganizations: (_state, action: PayloadAction<Organization[]>) => action.payload,
    clearOrganizations: () => [],
    setUserInvitesForOrganization: (
      state,
      action: PayloadAction<{ organization_id: string; invites: OrganizationInvite[] }>
    ) => {
      const { organization_id, invites } = action.payload;
      const orgIndex = state.findIndex((org) => org.id === organization_id);
      if (orgIndex !== -1) {
        state[orgIndex].invites = invites;
      }
    },
    setAvailableRolesForOrganization: (
      state,
      action: PayloadAction<{ organization_id: string; available_roles: OrganizationRole[] }>
    ) => {
      const { organization_id, available_roles } = action.payload;
      const orgIndex = state.findIndex((org) => org.id === organization_id);
      if (orgIndex !== -1) {
        state[orgIndex].available_roles = available_roles;
      }
    },
  },
});

export const {
  setOrganizations,
  clearOrganizations,
  setUserInvitesForOrganization,
  setAvailableRolesForOrganization,
} = orgSlice.actions;

export default orgSlice.reducer;

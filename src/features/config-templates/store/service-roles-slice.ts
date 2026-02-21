import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit';

export interface ServiceRole {
  id: string;
  name: string;
  [key: string]: unknown;
}

export interface ServiceRolesState {
  data: ServiceRole[];
}

const initialState: ServiceRolesState = {
  data: [],
};

const serviceRolesSlice = createSlice({
  name: 'service-roles',
  initialState,
  reducers: {
    setServiceRoles: (
      state,
      action: PayloadAction<{ serviceRoles?: ServiceRole[] }>
    ) => {
      state.data = action.payload?.serviceRoles ?? [];
    },
    addServiceRole: (state, action: PayloadAction<ServiceRole>) => {
      state.data.push(action.payload);
    },
    clearServiceRoles: () => initialState,
  },
});

export const { setServiceRoles, addServiceRole, clearServiceRoles } = serviceRolesSlice.actions;

export default serviceRolesSlice.reducer;

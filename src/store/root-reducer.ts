import { combineReducers, createAction } from '@reduxjs/toolkit';
import userSlice from '@/features/user/store/user-slice';
import { apiSlice } from '@/services/api-slice';
import orgSlice from '@/features/organization/store/org-slice';
import metaSlice from '@/features/meta/store/meta-slice';
import customersSlice from '@/features/customers/store/customers-slice';
import configTemplatesSlice from '@/features/config-templates/store/config-templates-slice';
import serviceRolesSlice from '@/features/config-templates/store/service-roles-slice';
import projectsSlice from '@/features/projects/store/projects-slice';
import requirementsSlice from '@/features/projects/store/requirements-slice';

const appReducer = combineReducers({
  user: userSlice,
  organizations: orgSlice,
  meta: metaSlice,
  customers: customersSlice,
  projects: projectsSlice,
  requirements: requirementsSlice,
  configTemplates: configTemplatesSlice,
  [apiSlice.reducerPath]: apiSlice.reducer,
  serviceRoles: serviceRolesSlice,
});

export type AppState = ReturnType<typeof appReducer>;

export const userLogout = createAction('USER_LOGOUT');

const rootReducer = (state: AppState | undefined, action: { type: string }): AppState => {
  if (action.type === userLogout.type) {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export default rootReducer;

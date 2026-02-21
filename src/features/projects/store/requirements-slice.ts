import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Requirement {
  id: string;
  title?: string;
  description?: string;
  projectId?: string;
  [key: string]: unknown;
}

export interface RequirementsState {
  byProjectId: Record<string, string[]>;
  byId: Record<string, Requirement>;
  loading: Record<string, boolean>;
  errors: Record<string, string | null>;
}

const initialState: RequirementsState = {
  byProjectId: {},
  byId: {},
  loading: {},
  errors: {},
};

const requirementsSlice = createSlice({
  name: 'requirements',
  initialState,
  reducers: {
    setProjectRequirements: (
      state,
      action: PayloadAction<{ projectId: string; requirements: Requirement[] }>
    ) => {
      const { projectId, requirements } = action.payload;
      state.byProjectId[projectId] = requirements.map((req) => req.id);
      requirements.forEach((requirement) => {
        state.byId[requirement.id] = requirement;
      });
      state.loading[projectId] = false;
      state.errors[projectId] = null;
    },

    setRequirementsLoading: (
      state,
      action: PayloadAction<{ projectId: string; loading: boolean }>
    ) => {
      const { projectId, loading } = action.payload;
      state.loading[projectId] = loading;
    },

    setRequirementsError: (
      state,
      action: PayloadAction<{ projectId: string; error: string }>
    ) => {
      const { projectId, error } = action.payload;
      state.errors[projectId] = error;
      state.loading[projectId] = false;
    },

    addRequirement: (
      state,
      action: PayloadAction<{ projectId: string; requirement: Requirement }>
    ) => {
      const { projectId, requirement } = action.payload;
      state.byId[requirement.id] = requirement;
      if (!state.byProjectId[projectId]) {
        state.byProjectId[projectId] = [];
      }
      state.byProjectId[projectId].push(requirement.id);
    },

    updateRequirement: (
      state,
      action: PayloadAction<{ requirement: Requirement }>
    ) => {
      const { requirement } = action.payload;
      if (state.byId[requirement.id]) {
        state.byId[requirement.id] = { ...state.byId[requirement.id], ...requirement };
      }
    },

    removeRequirement: (
      state,
      action: PayloadAction<{ projectId: string; requirementId: string }>
    ) => {
      const { projectId, requirementId } = action.payload;
      delete state.byId[requirementId];
      if (state.byProjectId[projectId]) {
        state.byProjectId[projectId] = state.byProjectId[projectId].filter(
          (id) => id !== requirementId
        );
      }
    },

    clearProjectRequirements: (state, action: PayloadAction<{ projectId: string }>) => {
      const { projectId } = action.payload;
      if (state.byProjectId[projectId]) {
        state.byProjectId[projectId].forEach((requirementId) => {
          delete state.byId[requirementId];
        });
      }
      delete state.byProjectId[projectId];
      delete state.loading[projectId];
      delete state.errors[projectId];
    },

    clearAllRequirements: () => initialState,
  },
});

export const {
  setProjectRequirements,
  setRequirementsLoading,
  setRequirementsError,
  addRequirement,
  updateRequirement,
  removeRequirement,
  clearProjectRequirements,
  clearAllRequirements,
} = requirementsSlice.actions;

export default requirementsSlice.reducer;

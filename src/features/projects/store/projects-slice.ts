import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Project {
  id: string;
  name: string;
  status?: string;
  [key: string]: unknown;
}

export interface ProjectsState {
  data: Project[];
}

const initialState: ProjectsState = {
  data: [],
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<Project[] | undefined>) => {
      state.data = action.payload ?? [];
    },
    clearProjects: () => initialState,
  },
});

export const { setProjects, clearProjects } = projectsSlice.actions;

export default projectsSlice.reducer;

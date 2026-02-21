import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit';

export interface ConfigTemplate {
  id: string;
  name: string;
  [key: string]: unknown;
}

export interface ConfigTemplatesState {
  data: ConfigTemplate[];
}

const initialState: ConfigTemplatesState = {
  data: [],
};

const configTemplatesSlice = createSlice({
  name: 'config-templates',
  initialState,
  reducers: {
    setConfigTemplates: (
      state,
      action: PayloadAction<{ configTemplates?: ConfigTemplate[] }>
    ) => {
      state.data = action.payload?.configTemplates ?? [];
    },
    clearConfigTemplates: () => initialState,
  },
});

export const { setConfigTemplates, clearConfigTemplates } = configTemplatesSlice.actions;

export default configTemplatesSlice.reducer;

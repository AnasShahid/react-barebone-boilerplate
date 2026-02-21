import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit';

export interface MetaState {
  permissions: string[];
}

const initialState: MetaState = {
  permissions: [],
};

const metaSlice = createSlice({
  name: 'meta',
  initialState,
  reducers: {
    setPermissions: (state, action: PayloadAction<string[]>) => {
      state.permissions = action.payload;
    },
    clearMeta: () => initialState,
  },
});

export const { setPermissions, clearMeta } = metaSlice.actions;

export default metaSlice.reducer;

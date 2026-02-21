import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Customer {
  id: string;
  name: string;
  [key: string]: unknown;
}

export interface Pagination {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

export type CustomerLayout = 'grid' | 'list';

export interface CustomersState {
  data: Customer[];
  pagination: Pagination;
  layout: CustomerLayout;
}

const initialState: CustomersState = {
  data: [],
  pagination: {},
  layout: 'grid',
};

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setCustomers: (
      state,
      action: PayloadAction<{ customers?: Customer[]; pagination?: Pagination }>
    ) => {
      state.data = action.payload?.customers ?? [];
      state.pagination = action.payload?.pagination ?? {};
    },
    setLayout: (state, action: PayloadAction<CustomerLayout>) => {
      state.layout = action.payload;
    },
    clearCustomers: () => initialState,
  },
});

export const { setCustomers, clearCustomers, setLayout } = customersSlice.actions;

export default customersSlice.reducer;

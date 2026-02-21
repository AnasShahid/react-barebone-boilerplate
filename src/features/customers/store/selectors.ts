import type { RootState } from '@/store';
import type { CustomersState, CustomerLayout } from './customers-slice';

export const selectAllCustomers = (state: RootState): CustomersState => state.customers;
export const selectLayout = (state: RootState): CustomerLayout => state.customers.layout;

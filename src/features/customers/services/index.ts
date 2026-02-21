import { apiSlice } from '@/services/api-slice';
import { setCustomers } from '../store/customers-slice';
import type { Customer, Pagination } from '../store/customers-slice';

interface CustomersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

interface CustomersResponse {
  customers?: Customer[];
  pagination?: Pagination;
}

export const customersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCustomer: builder.mutation<Customer, Record<string, unknown>>({
      query: (customer) => ({
        body: customer,
        method: 'POST',
        url: 'customers',
      }),
      invalidatesTags: ['customers'],
    }),
    updateCustomer: builder.mutation<Customer, { id: string; [key: string]: unknown }>({
      query: ({ id, ...customer }) => ({
        body: customer,
        method: 'PUT',
        url: `customers/${id}`,
      }),
      invalidatesTags: ['customers'],
    }),
    getAllCustomers: builder.query<CustomersResponse, CustomersQueryParams | void>({
      query: (params = { page: 1, limit: 15 }) => {
        const { page = 1, limit = 15, search, status } = params ?? {};
        let queryString = `customers?page=${page}&limit=${limit}`;
        if (search) queryString += `&search=${encodeURIComponent(search)}`;
        if (status) queryString += `&status=${encodeURIComponent(status)}`;
        return queryString;
      },
      providesTags: ['customers'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCustomers(data));
        } catch (error) {
          console.error('Failed to fetch customers:', error);
        }
      },
    }),
    getCustomerById: builder.query<Customer, string>({
      query: (id) => `customers/${id}`,
    }),
    deleteCustomer: builder.mutation<void, string>({
      query: (id) => ({
        method: 'DELETE',
        url: `customers/${id}`,
      }),
      invalidatesTags: ['customers'],
    }),
    addCustomerContact: builder.mutation<
      Record<string, unknown>,
      { customerId: string; contact: Record<string, unknown> }
    >({
      query: ({ customerId, contact }) => ({
        body: contact,
        method: 'POST',
        url: `customers/${customerId}/contacts`,
      }),
    }),
    updateCustomerContact: builder.mutation<
      Record<string, unknown>,
      { contactId: string; [key: string]: unknown }
    >({
      query: ({ contactId, ...contact }) => ({
        body: contact,
        method: 'PUT',
        url: `customers/contacts/${contactId}`,
      }),
    }),
    deleteCustomerContact: builder.mutation<void, { contactId: string }>({
      query: ({ contactId }) => ({
        method: 'DELETE',
        url: `customers/contacts/${contactId}`,
      }),
    }),
    updateCustomerStatus: builder.mutation<
      Record<string, unknown>,
      { id: string; new_status: string; change_reason: string }
    >({
      query: ({ id, new_status, change_reason }) => ({
        body: { new_status, change_reason },
        method: 'PATCH',
        url: `customers/${id}/status`,
      }),
    }),
  }),
});

export const {
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useGetAllCustomersQuery,
  useGetCustomerByIdQuery,
  useDeleteCustomerMutation,
  useAddCustomerContactMutation,
  useUpdateCustomerContactMutation,
  useDeleteCustomerContactMutation,
  useUpdateCustomerStatusMutation,
} = customersApi;

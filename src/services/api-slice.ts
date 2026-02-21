import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { tokenProvider } from '@/utils/token-provider';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL + '/v1',
  prepareHeaders: async (headers) => {
    try {
      const token = await tokenProvider.getToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    } catch (error) {
      console.error('Error fetching auth token:', error);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  endpoints: () => ({}),
  tagTypes: ['user', 'organizations', 'customers', 'config-templates', 'requirements', 'requirement'],
});

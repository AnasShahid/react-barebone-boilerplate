import { apiSlice } from '@/services/api-slice';
import { setPermissions } from '../store/meta-slice';

export const metaApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrganizationPermissions: builder.query<string[], string>({
      query: (organizationId) => `permissions/org/${organizationId}`,
      providesTags: ['meta' as never],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setPermissions(data));
        } catch (error) {
          console.error('Failed to fetch permissions:', error);
        }
      },
    }),
  }),
});

export const { useGetOrganizationPermissionsQuery } = metaApi;

import { apiSlice } from '@/services/api-slice';
import { setUser } from '../store/user-slice';
import { setOrganizations } from '@/features/organization/store/org-slice';
import type { Organization } from '@/features/organization/store/org-slice';

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyProfile: builder.query<Record<string, unknown>, void>({
      query: () => 'users/me',
      providesTags: (result) => {
        if (!result) return [{ type: 'user' as const, id: 'UNKNOWN' }];
        return [{ type: 'user' as const, id: String(result.id ?? 'UNKNOWN') }];
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const userRoleOrgs = data.user_role_orgs as Array<{
            organization: Record<string, unknown>;
            is_default?: boolean;
            role: { permissions: string; [key: string]: unknown };
          }>;
          const organizations: Organization[] = userRoleOrgs.map((element) => ({
            ...(element.organization as Organization),
            is_default: element.is_default,
            role: element.role,
            permissions: element.role.permissions.split(',').filter(Boolean),
          }));
          dispatch(setUser(data as Parameters<typeof setUser>[0]));
          dispatch(setOrganizations(organizations));
        } catch (error) {
          console.error('Failed to fetch profile:', error);
        }
      },
    }),
    getOrganizationUsers: builder.query<Record<string, unknown>, string>({
      query: (orgId) => `users/organization/${orgId}`,
    }),
  }),
});

export const { useGetMyProfileQuery, useGetOrganizationUsersQuery } = usersApi;

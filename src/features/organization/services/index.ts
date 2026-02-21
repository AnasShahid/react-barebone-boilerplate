import { apiSlice } from '@/services/api-slice';
import { setAvailableRolesForOrganization } from '../store/org-slice';
import type { OrganizationRole } from '../store/org-slice';

export const organizationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrganizationById: builder.query<Record<string, unknown>, string>({
      query: (id) => `organizations/${id}`,
    }),
    getAllUserOrganizations: builder.query<Record<string, unknown>[], void>({
      query: () => 'organizations',
      providesTags: ['organizations'],
    }),
    createOrganizationWithRoles: builder.mutation<
      Record<string, unknown>,
      Record<string, unknown>
    >({
      query: (orgData) => ({
        body: orgData,
        method: 'POST',
        url: 'organizations/with-role',
      }),
      invalidatesTags: ['organizations', 'user'],
    }),
    updateOrganization: builder.mutation<
      Record<string, unknown>,
      { id: string; [key: string]: unknown }
    >({
      query: ({ id, ...data }) => ({
        url: `organizations/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['organizations'],
    }),
    setDefaultOrganization: builder.mutation<void, string>({
      query: (id) => ({
        method: 'POST',
        url: `organizations/${id}/default`,
      }),
      invalidatesTags: ['organizations', 'user'],
    }),
    getAllOrganizationRoles: builder.query<OrganizationRole[], string>({
      query: (organizationId) => `roles?organizationId=${organizationId}`,
      providesTags: ['organizations'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAvailableRolesForOrganization({ organization_id: arg, available_roles: data }));
        } catch (error) {
          console.error('Failed to fetch roles:', error);
        }
      },
    }),
    updateOrganizationRole: builder.mutation<
      Record<string, unknown>,
      { id: string; name: string; description: string; permissions: string }
    >({
      query: (role) => ({
        method: 'PATCH',
        url: `roles/${role.id}`,
        body: { name: role.name, description: role.description, permissions: role.permissions },
      }),
      invalidatesTags: ['organizations'],
    }),
    deleteOrganizationRole: builder.mutation<void, string>({
      query: (id) => ({
        method: 'DELETE',
        url: `roles/${id}`,
      }),
      invalidatesTags: ['organizations'],
    }),
    createOrganizationRole: builder.mutation<
      Record<string, unknown>,
      { name: string; description: string; permissions: string; organization_id: string }
    >({
      query: (role) => ({
        method: 'POST',
        url: 'roles',
        body: {
          name: role.name,
          description: role.description,
          permissions: role.permissions,
          organizationId: role.organization_id,
        },
      }),
      invalidatesTags: ['organizations'],
    }),
    deleteOrganizationById: builder.mutation<void, string>({
      query: (id) => ({
        method: 'DELETE',
        url: `organizations/${id}`,
      }),
      invalidatesTags: ['organizations', 'user'],
    }),
    updateUserRole: builder.mutation<void, { userId: string; roleIds: string[] }>({
      query: ({ userId, roleIds }) => ({
        method: 'POST',
        url: 'roles/assign',
        body: { userId, roleIds },
      }),
      invalidatesTags: ['organizations', 'user'],
    }),
    updateInvitationRole: builder.mutation<void, { invitationId: string; roleIds: string[] }>({
      query: ({ invitationId, roleIds }) => ({
        method: 'POST',
        url: 'roles/assign-invite',
        body: { invitationId, roleIds },
      }),
      invalidatesTags: ['organizations', 'invitations' as never],
    }),
  }),
});

export const {
  useGetOrganizationByIdQuery,
  useGetAllUserOrganizationsQuery,
  useCreateOrganizationWithRolesMutation,
  useUpdateOrganizationMutation,
  useSetDefaultOrganizationMutation,
  useGetAllOrganizationRolesQuery,
  useUpdateOrganizationRoleMutation,
  useDeleteOrganizationRoleMutation,
  useCreateOrganizationRoleMutation,
  useDeleteOrganizationByIdMutation,
  useUpdateUserRoleMutation,
  useUpdateInvitationRoleMutation,
} = organizationApi;

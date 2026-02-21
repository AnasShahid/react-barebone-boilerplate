import { apiSlice } from '@/services/api-slice';
import { setUserInvitesForOrganization } from '@/features/organization/store/org-slice';
import type { OrganizationInvite } from '@/features/organization/store/org-slice';

export const invitesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendUserInvite: builder.mutation<Record<string, unknown>, Record<string, unknown>>({
      query: (invite) => ({
        body: invite,
        method: 'POST',
        url: 'invites',
      }),
      invalidatesTags: ['organizations'],
    }),
    getInvitesByOrganizationId: builder.query<OrganizationInvite[], string>({
      query: (id) => `invites/organization/${id}`,
      providesTags: ['organizations'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUserInvitesForOrganization({ invites: data, organization_id: arg }));
        } catch (error) {
          console.error('Failed to fetch invites:', error);
        }
      },
    }),
    deleteInvitation: builder.mutation<void, string>({
      query: (id) => ({
        method: 'DELETE',
        url: `invites/${id}`,
      }),
      invalidatesTags: ['organizations'],
    }),
    getInviteStatusByToken: builder.query<Record<string, unknown>, string>({
      query: (id) => `invites/token/${id}`,
    }),
    acceptInviteByToken: builder.mutation<void, string>({
      query: (id) => ({
        method: 'POST',
        url: `invites/token/${id}/accept`,
      }),
      invalidatesTags: ['organizations', 'user'],
    }),
    rejectInviteByToken: builder.mutation<void, string>({
      query: (id) => ({
        method: 'POST',
        url: `invites/token/${id}/reject`,
      }),
      invalidatesTags: ['organizations', 'user'],
    }),
  }),
});

export const {
  useSendUserInviteMutation,
  useGetInvitesByOrganizationIdQuery,
  useDeleteInvitationMutation,
  useGetInviteStatusByTokenQuery,
  useAcceptInviteByTokenMutation,
  useRejectInviteByTokenMutation,
} = invitesApi;

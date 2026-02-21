import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useGetOrganizationUsersQuery } from '@/features/user';
import { useGetInvitesByOrganizationIdQuery, useDeleteInvitationMutation } from '@/features/invite';
import { useUpdateUserRoleMutation, useUpdateInvitationRoleMutation } from '../services';
import { OrgUsersTable, OrgInvitesTable } from '../components';
import { SEO } from '@/components/seo';

interface OrgRole { id: string; name: string; [key: string]: unknown; }
interface OrgUser { id?: string; first_name?: string; last_name?: string; [key: string]: unknown; }
interface OrgInvite { id: string; email?: string; [key: string]: unknown; }

export const EditOrganizationUsers = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { orgId } = useParams<{ orgId: string }>();
  const { data, isLoading, refetch } = useGetOrganizationUsersQuery(orgId ?? '');
  const { data: invites, isLoading: isInvitesLoading, refetch: refetchInvites } = useGetInvitesByOrganizationIdQuery(orgId ?? '');
  const [deleteInvitation, { isLoading: isDeletingInvitation }] = useDeleteInvitationMutation();
  const [updateUserRole, { isLoading: isUpdatingUserRole }] = useUpdateUserRoleMutation();
  const [updateInviteRole, { isLoading: isUpdatingInviteRole }] = useUpdateInvitationRoleMutation();

  useEffect(() => {
    if (orgId) { refetch(); refetchInvites(); }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDeleteInvite = async (invite: OrgInvite) => {
    try {
      await deleteInvitation(invite.id).unwrap();
      toast.success(t('organization.pages.editOrganizationUsers.invitationDeletedSuccess'));
      await refetchInvites();
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(t('organization.pages.editOrganizationUsers.invitationDeletedError', { message: err.data?.message ?? t('organization.common.unknownError') }));
    }
  };

  const handleChangeUserRole = async (user: OrgUser, role: OrgRole) => {
    try {
      await updateUserRole({ userId: user.id as string, roleIds: [role.id] }).unwrap();
      toast.success(t('organization.pages.editUsers.roleUpdatedSuccess', { user: `${user.first_name} ${user.last_name}`, role: role.name }));
      await refetch();
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(t('organization.pages.editUsers.roleUpdatedError', { message: err.data?.message ?? t('organization.common.unknownError') }));
    }
  };

  const handleChangeInviteRole = async (invite: OrgInvite, role: OrgRole) => {
    try {
      await updateInviteRole({ invitationId: invite.id, roleIds: [role.id] }).unwrap();
      toast.success(t('organization.pages.editOrganizationUsers.inviteRoleUpdatedSuccess', { email: invite.email, role: role.name }));
      await refetchInvites();
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(t('organization.pages.editOrganizationUsers.inviteRoleUpdatedError', { message: err.data?.message ?? t('organization.common.unknownError') }));
    }
  };

  return (
    <>
      <SEO title={t('organization.pages.editOrganizationUsers.title')} />
      <div className="flex flex-col">
        <div className="border-b border-b-[#333237] flex justify-between">
          <h1 className="text-[1.0625rem] font-bold mb-[1rem]">{t('organization.pages.editOrganizationUsers.title')}</h1>
          <Button variant="ghost" size="sm" onClick={() => navigate('/account/organizations')}>
            <ArrowLeft /> {t('organization.pages.editOrganizationUsers.backToOrgs')}
          </Button>
        </div>
        <div className="py-6">
          <OrgUsersTable
            users={(data as { users?: OrgUser[] } | undefined)?.users}
            isLoading={isLoading || isUpdatingUserRole}
            onInviteUser={() => console.log('invite user')}
            onRemoveUser={() => console.log('remove user')}
            onChangeRole={handleChangeUserRole}
            organizationId={orgId}
          />
          <OrgInvitesTable
            invites={invites as OrgInvite[] | undefined}
            isLoading={isInvitesLoading}
            onResendInvite={(invite) => console.log('resend invite', invite)}
            onDeleteInvite={handleDeleteInvite}
            onChangeRole={handleChangeInviteRole as (invite: unknown, role: unknown) => void}
            isPerformingSE={isDeletingInvitation || isUpdatingInviteRole}
          />
        </div>
      </div>
    </>
  );
};

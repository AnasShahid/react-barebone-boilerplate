import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useGetOrganizationPermissionsQuery } from '@/features/meta';
import { useGetAllOrganizationRolesQuery, useUpdateOrganizationRoleMutation, useDeleteOrganizationRoleMutation, useCreateOrganizationRoleMutation } from '@/features/organization';
import { Spinner } from '@/components/spinner';
import { OrgRolesTable } from '../components/org-roles-table';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { SEO } from '@/components/seo';
import { skipToken } from '@reduxjs/toolkit/query';

interface OrgRole {
  id?: string;
  name?: string;
  organization_id?: string;
  [key: string]: unknown;
}

export const EditOrganizationRoles = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { orgId } = useParams<{ orgId: string }>();
  const { isLoading: isFetchingPermissions } = useGetOrganizationPermissionsQuery(orgId ?? skipToken);
  const { data: organizationRoles, isLoading: isFetchingOrganizationRoles } = useGetAllOrganizationRolesQuery(orgId ?? skipToken);
  const [updateOrganizationRole, { isLoading: isUpdatingOrganizationRole }] = useUpdateOrganizationRoleMutation();
  const [deleteOrganizationRole, { isLoading: isDeletingOrganizationRole }] = useDeleteOrganizationRoleMutation();
  const [createOrganizationRole, { isLoading: isCreatingOrganizationRole }] = useCreateOrganizationRoleMutation();
  const isLoading = isFetchingPermissions || isFetchingOrganizationRoles;

  const handleAddRole = async (role: OrgRole) => {
    try {
      await createOrganizationRole({ ...role, organization_id: orgId }).unwrap();
      toast.success('Role created successfully');
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message ?? 'Failed to create role');
    }
  };

  const handleEditRole = async (role: OrgRole) => {
    try {
      await updateOrganizationRole(role).unwrap();
      toast.success('Role updated successfully');
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message ?? 'Failed to update role');
    }
  };

  const handleDeleteRole = async (role: OrgRole) => {
    try {
      await deleteOrganizationRole(role.id as string).unwrap();
      toast.success('Role deleted successfully');
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message ?? 'Failed to delete role');
    }
  };

  return (
    <>
      <SEO title={t('organization.pages.editOrganizationRoles.title')} />
      <div className="flex flex-col">
        <div className="border-b border-b-[#333237] flex justify-between">
          <h1 className="text-[1.0625rem] font-bold mb-[1rem]">{t('organization.pages.editOrganizationRoles.title')}</h1>
          <Button variant="ghost" size="sm" onClick={() => navigate('/account/organizations')}>
            <ArrowLeft /> {t('organization.pages.editOrganizationRoles.backToOrgs')}
          </Button>
        </div>
        <div className="py-6">
          {isLoading ? (
            <Spinner />
          ) : (
            <OrgRolesTable
              roles={organizationRoles as OrgRole[] | undefined}
              onAddRole={handleAddRole}
              onEditRole={handleEditRole}
              onDeleteRole={handleDeleteRole}
              isLoading={isLoading}
              isPerformingSE={isUpdatingOrganizationRole || isDeletingOrganizationRole || isCreatingOrganizationRole}
            />
          )}
        </div>
      </div>
    </>
  );
};

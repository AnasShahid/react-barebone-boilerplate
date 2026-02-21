import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { skipToken } from '@reduxjs/toolkit/query';
import { useGetOrganizationByIdQuery, useUpdateOrganizationMutation } from '../services';
import { Spinner } from '@/components/spinner';
import { EditOrgForm } from '../components';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { SEO } from '@/components/seo';

export const EditOrganizationInfo = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { orgId } = useParams<{ orgId: string }>();
  const { data, isLoading, refetch } = useGetOrganizationByIdQuery(orgId ?? skipToken);
  const [updateOrganization, { isLoading: isUpdating }] = useUpdateOrganizationMutation();

  useEffect(() => {
    if (orgId) refetch();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFormSubmit = async (formData: Record<string, unknown>) => {
    try {
      await updateOrganization({ id: orgId, ...formData }).unwrap();
      toast.success('Organization updated successfully!');
      refetch();
    } catch (error) {
      console.error('Error updating organization:', error);
      toast.error('Failed to update organization. Please try again.');
    }
  };

  return (
    <>
      <SEO title={t('organization.editOrganizationInfo.title')} />
      <div className="flex flex-col">
        <div className="border-b border-b-[#333237] flex justify-between">
          <h1 className="text-[1.0625rem] font-bold mb-[1rem]">{t('organization.editOrganizationInfo.title')}</h1>
          <Button variant="ghost" size="sm" onClick={() => navigate('/account/organizations')}>
            <ArrowLeft /> {t('organization.editOrganizationInfo.backToOrgs')}
          </Button>
        </div>
        <div className="py-6">
          {isLoading ? (
            <Spinner />
          ) : (
            <EditOrgForm organization={data as Record<string, unknown>} onSubmit={handleFormSubmit} isLoading={isLoading || isUpdating} />
          )}
        </div>
      </div>
    </>
  );
};

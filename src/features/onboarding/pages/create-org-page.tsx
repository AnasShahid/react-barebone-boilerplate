import { useNavigate } from 'react-router-dom';
import { CreateOrgForm } from '../components/create-org-form';
import { useTranslation } from 'react-i18next';
import { useOnboarding } from '../context/onboarding-context';
import { SEO } from '@/components/seo';

export const CreateOrganizationPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { createOrganization, isLoading } = useOnboarding();

  const handleCreateOrg = async (data: { name: string }) => {
    try {
      const org = await createOrganization(data as Record<string, unknown>);
      if (org) {
        navigate('/onboarding/invite');
      }
    } catch (error) {
      console.error('Failed to create organization:', error);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <SEO
        title="Create your Organization"
        description="Setup your first organization to start using React-boilerplate."
      />
      <div className="content-container max-w-[450px] mx-auto">
        <h1 className="text-3xl font-bold">{t('onboarding.createOrg.title')}</h1>
        <p className="mt-2 text-sm">{t('onboarding.createOrg.description')}</p>
        <div className="px-4 py-6 border border-gray-800 rounded-lg mt-5">
          <CreateOrgForm onSubmit={handleCreateOrg} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

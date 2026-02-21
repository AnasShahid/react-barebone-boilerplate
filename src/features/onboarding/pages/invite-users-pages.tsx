import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { InviteUsersForm } from '../components/invite-users-form';
import { useTranslation } from 'react-i18next';
import { useOnboarding } from '../context/onboarding-context';
import type { InviteItem } from '../context/onboarding-context';
import { SEO } from '@/components/seo';

export const InviteUsersPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { inviteUsers, isLoading, organization } = useOnboarding();

  useEffect(() => {
    if (!organization) {
      navigate('/onboarding/create-org');
    }
  }, [organization, navigate]);

  const handleInviteUsers = async (emails: InviteItem[]) => {
    try {
      await inviteUsers(emails);
      navigate('/onboarding/complete');
    } catch (error) {
      console.error('Failed to invite users:', error);
    }
  };

  const getOrgMemberRoleId = (): string | null => {
    if (!organization) return null;
    const memberRole = organization.roles.find(
      (role) => role.name.toLowerCase() === 'member'
    );
    return memberRole?.id ?? null;
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <SEO
        title="Invite your Colleagues"
        description="Invite your colleagues to your organization and start using React-boilerplate together."
      />
      <div className="content-container max-w-[450px] min-w-[450px] mx-auto">
        <h1 className="text-3xl font-bold">{t('onboarding.invite.title')}</h1>
        <p className="mt-2 text-sm">{t('onboarding.invite.description')}</p>
        <div className="px-4 py-6 border border-gray-800 rounded-lg mt-5">
          <InviteUsersForm
            onSubmit={handleInviteUsers}
            isLoading={isLoading}
            organization={organization?.id}
            role={getOrgMemberRoleId()}
          />
        </div>
      </div>
    </div>
  );
};

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useCreateOrganizationWithRolesMutation } from '@/features/organization';
import { toast } from 'sonner';
import { useSendUserInviteMutation } from '@/features/invite';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface OrgRole {
  id: string;
  name: string;
}

interface Organization {
  id: string;
  roles: OrgRole[];
  [key: string]: unknown;
}

export interface InviteItem {
  invitee_email: string;
  organization_id: string | null | undefined;
  role_id: string | null | undefined;
}

interface OnboardingContextValue {
  isLoading: boolean;
  error: string | null;
  organization: Organization | null;
  invitedUsers: unknown[];
  createOrganization: (orgData: Record<string, unknown>) => Promise<Organization>;
  inviteUsers: (emails: InviteItem[]) => Promise<unknown[]>;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(() => {
    const savedOrg = sessionStorage.getItem('onboarding_organization');
    return savedOrg ? (JSON.parse(savedOrg) as Organization) : null;
  });
  const [invitedUsers, setInvitedUsers] = useState<unknown[]>([]);
  const navigate = useNavigate();

  const [createOrganizationWithRoles] = useCreateOrganizationWithRolesMutation();
  const [sendUserInvite] = useSendUserInviteMutation();

  const { t } = useTranslation();

  useEffect(() => {
    const storedInviteData = localStorage.getItem('inviteData');
    if (storedInviteData) {
      const inviteData = JSON.parse(storedInviteData) as { token?: string };
      navigate(`/accept-invite?token=${inviteData?.token}`);
      localStorage.removeItem('inviteData');
    }
  }, []);

  useEffect(() => {
    if (organization) {
      sessionStorage.setItem('onboarding_organization', JSON.stringify(organization));
    }
  }, [organization]);

  const createOrganization = useCallback(
    async (orgData: Record<string, unknown>): Promise<Organization> => {
      try {
        setIsLoading(true);
        setError(null);
        const orgResponse = await createOrganizationWithRoles(orgData);
        if ('error' in orgResponse && orgResponse.error) {
          const err = orgResponse.error as { data?: { message?: string } };
          throw new Error(err.data?.message ?? 'Failed to create organization');
        }
        const org = (orgResponse as { data: Organization }).data;
        setOrganization(org);
        toast.success(t('notifications.organizations.created.success'));
        return org;
      } catch (err) {
        setError((err as Error).message);
        toast.error(t('notifications.organizations.created.failed'));
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [createOrganizationWithRoles, t]
  );

  const inviteUsers = useCallback(
    async (emails: InviteItem[]): Promise<unknown[]> => {
      try {
        setIsLoading(true);
        setError(null);

        if (!organization) {
          throw new Error(t('errors.organization.notFound'));
        }

        const invitedResults: unknown[] = [];
        for (const email of emails) {
          const invited = await sendUserInvite(email as unknown as Parameters<typeof sendUserInvite>[0]);
          if ('error' in invited && invited.error) {
            const err = invited.error as { data?: { message?: string } };
            throw new Error(err.data?.message ?? 'Failed to invite user');
          }
          invitedResults.push(invited);
        }

        setInvitedUsers(invitedResults);
        toast.success(t('notifications.invitations.sent.success'));
        return invitedResults;
      } catch (err) {
        setError((err as Error).message);
        toast.error(t('notifications.invitations.sent.failed'));
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [sendUserInvite, organization, t]
  );

  const resetOnboarding = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setOrganization(null);
    setInvitedUsers([]);
    sessionStorage.removeItem('onboarding_organization');
  }, []);

  const value: OnboardingContextValue = {
    isLoading,
    error,
    organization,
    invitedUsers,
    createOrganization,
    inviteUsers,
    resetOnboarding,
  };

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding(): OnboardingContextValue {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}

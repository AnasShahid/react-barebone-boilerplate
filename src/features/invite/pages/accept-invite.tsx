import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { SEO } from '@/components/seo';
import { Spinner } from '@/components/spinner';
import { useUser } from '@clerk/clerk-react';
import { AcceptInvite } from '../components';
import { useGetInviteStatusByTokenQuery } from '../services';
import { skipToken } from '@reduxjs/toolkit/query';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const AcceptInvitePage = () => {
  const [searchParams] = useSearchParams();
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  const token = searchParams.get('token');
  const { data: invite, isLoading: isInviteLoading, refetch } = useGetInviteStatusByTokenQuery(token ?? skipToken);

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (invite && invite?.status === 'pending') {
      const inviteObj = {
        email: invite?.invitee_email,
        token: token,
        organization_id: invite?.organization_id,
      };
      localStorage.setItem('inviteData', JSON.stringify(inviteObj));
      if (!isSignedIn) {
        navigate('/auth/signup');
      }
    }
  }, [invite, isSignedIn, token]);

  const renderInviteContent = () => {
    if (isInviteLoading) {
      return <Spinner />;
    }

    if (!invite) {
      return (
        <Alert variant="destructive">
          <AlertDescription>This invite link is invalid or has been removed.</AlertDescription>
        </Alert>
      );
    }

    if (invite.status !== 'pending') {
      return (
        <div className="flex flex-col gap-4">
          <Alert variant="destructive">
            <AlertDescription>
              This invite is no longer valid. It may have been used, canceled, or rejected.
            </AlertDescription>
          </Alert>
          <Button onClick={() => navigate('/account/organizations')}>Create an Organization</Button>
        </div>
      );
    }

    if (invite.is_expired) {
      return (
        <Alert variant="destructive">
          <AlertDescription>
            This invite has expired. Please contact the organization admin to request a new invite.
          </AlertDescription>
        </Alert>
      );
    }

    if (isSignedIn) {
      return <AcceptInvite invite={invite as Record<string, unknown>} />;
    }

    return (
      <div className="text-center">
        <Spinner />
        <p className="mt-4">Redirecting to sign up...</p>
        <Button variant="outline" className="mt-2" onClick={() => navigate('/auth/signup')}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Click here if you&apos;re not redirected
        </Button>
      </div>
    );
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <SEO
        title="Accept Invite"
        description="Accept your organization invite and start using React-boilerplate."
      />
      <div className="content-container max-w-md mx-auto p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Organization Invitation</h1>
        {renderInviteContent()}
      </div>
    </div>
  );
};

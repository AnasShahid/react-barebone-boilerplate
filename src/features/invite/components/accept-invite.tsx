import { Button } from '@/components/ui/button';
import { useAcceptInviteByTokenMutation, useRejectInviteByTokenMutation } from '../services';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Inviter {
  first_name: string;
  last_name: string;
}

interface Role {
  name: string;
}

interface Invite {
  token?: string;
  inviter?: Inviter;
  role?: Role;
  [key: string]: unknown;
}

interface AcceptInviteProps {
  invite: Invite;
}

export const AcceptInvite = ({ invite }: AcceptInviteProps) => {
  const [acceptInvite, { isLoading: isAccepting }] = useAcceptInviteByTokenMutation();
  const [rejectInvite, { isLoading: isRejecting }] = useRejectInviteByTokenMutation();
  const navigate = useNavigate();

  const getErrorMessage = (status: number, actionType: string): string => {
    switch (status) {
      case 400: return 'Invalid or expired invite';
      case 403: return `You do not have permission to ${actionType} this invite`;
      case 404: return 'Invite not found or already processed';
      case 409: return 'You are already a member of this organization';
      default: return `Failed to ${actionType} invite`;
    }
  };

  const handleError = (error: unknown, actionType: string) => {
    const err = error as { data?: { message?: string }; status?: number };
    const errorMessage =
      err.data?.message ??
      (err.status
        ? `Error ${err.status}: ${getErrorMessage(err.status, actionType)}`
        : `Failed to ${actionType} invite. Please try again later.`);
    toast.error(errorMessage);
  };

  const handleAccept = async () => {
    try {
      await acceptInvite(invite?.token ?? '').unwrap();
      navigate('/dashboard');
      toast.success('Invite accepted successfully');
    } catch (error) {
      handleError(error, 'accept');
    }
  };

  const handleReject = async () => {
    try {
      await rejectInvite(invite?.token ?? '').unwrap();
      navigate('/dashboard');
      toast.success('Invite rejected successfully');
    } catch (error) {
      handleError(error, 'reject');
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-[300px] mx-auto">
      <p className="text-sm text-center">
        <span className="font-bold">
          {invite?.inviter?.first_name} {invite?.inviter?.last_name}
        </span>{' '}
        has invited you to join the role of{' '}
        <span className="font-bold">{invite?.role?.name}</span> in their organization.
      </p>
      <div className="flex gap-2 justify-center">
        <Button variant="default" onClick={handleAccept} className="w-full" disabled={isAccepting}>
          Accept
        </Button>
        <Button variant="destructive" onClick={handleReject} className="w-full" disabled={isRejecting}>
          Reject
        </Button>
      </div>
    </div>
  );
};

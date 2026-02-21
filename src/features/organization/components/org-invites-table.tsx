import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ReactNode } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  MoreVertical,
  Trash2,
  Crown,
  Shield,
  User,
  Clock,
  Check,
  X,
  Loader2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';

interface Inviter {
  first_name?: string;
  last_name?: string;
}

interface Invite {
  id: string;
  invitee_email?: string;
  inviter?: Inviter;
  invited_at?: string;
  invite_expiry?: string;
  role_name?: string;
  status?: string;
  [key: string]: unknown;
}

interface StatusDetails {
  text: string;
  color: string;
  icon: ReactNode;
}

interface OrgInvitesTableProps {
  invites?: Invite[];
  onResendInvite?: (invite: Invite) => void;
  onDeleteInvite?: (invite: Invite) => void;
  onChangeRole?: (invite: Invite, role: unknown) => void;
  isLoading?: boolean;
  isPerformingSE?: boolean;
}

export const OrgInvitesTable = ({
  invites = [],
  onDeleteInvite,
  isLoading = false,
  isPerformingSE = false,
}: OrgInvitesTableProps) => {
  const { t } = useTranslation();
  const [sortColumn, setSortColumn] = useState('invited_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const sortedInvites = [...(invites || [])].sort((a, b) => {
    if (sortColumn === 'invited_at' || sortColumn === 'invite_expiry') {
      const aValue = new Date((a[sortColumn] as string) ?? '').getTime();
      const bValue = new Date((b[sortColumn] as string) ?? '').getTime();
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    } else if (sortColumn === 'inviter') {
      const aName = a.inviter ? `${a.inviter.first_name} ${a.inviter.last_name}`.toLowerCase() : '';
      const bName = b.inviter ? `${b.inviter.first_name} ${b.inviter.last_name}`.toLowerCase() : '';
      return sortDirection === 'asc' ? aName.localeCompare(bName) : bName.localeCompare(aName);
    } else {
      const aValue = ((a[sortColumn] as string | undefined)?.toLowerCase?.()) ?? '';
      const bValue = ((b[sortColumn] as string | undefined)?.toLowerCase?.()) ?? '';
      return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
  });

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isExpired = (expiryDate?: string): boolean =>
    expiryDate ? new Date(expiryDate) < new Date() : false;

  const getStatusDetails = (invite: Invite): StatusDetails => {
    const expired = isExpired(invite.invite_expiry as string | undefined);
    const status = invite.status?.toLowerCase() ?? '';
    if (status === 'rejected') return { text: t('organization.invitesTable.statusLabels.rejected'), color: 'bg-red-100 text-red-800', icon: <X size={12} className="mr-1 text-red-800" /> };
    if (expired || status === 'expired') return { text: t('organization.invitesTable.statusLabels.expired'), color: 'bg-amber-100 text-amber-800', icon: <Clock size={12} className="mr-1 text-amber-800" /> };
    if (status === 'accepted') return { text: t('organization.invitesTable.statusLabels.accepted'), color: 'bg-green-100 text-green-800', icon: <Check size={12} className="mr-1 text-green-800" /> };
    return { text: t('organization.invitesTable.statusLabels.pending'), color: 'bg-blue-100 text-blue-800', icon: <Clock size={12} className="mr-1 text-blue-800" /> };
  };

  const getRoleIcon = (roleName?: string): ReactNode => {
    if (!roleName) return <User size={16} />;
    const role = roleName.toLowerCase();
    if (role.includes('admin')) return <Crown size={16} className="text-yellow-400" />;
    if (role.includes('owner')) return <Crown size={16} className="text-amber-500" />;
    if (role.includes('manager')) return <Shield size={16} className="text-blue-400" />;
    return <User size={16} />;
  };

  const renderSkeletonRows = () =>
    Array(3).fill(0).map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
        <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
        <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
        <TableCell><div className="flex items-center gap-1"><Skeleton className="h-4 w-4 rounded-full" /><Skeleton className="h-4 w-[100px]" /></div></TableCell>
        <TableCell><div className="flex items-center gap-1"><Skeleton className="h-4 w-[80px]" /></div></TableCell>
        <TableCell><Skeleton className="h-5 w-[70px] rounded-full" /></TableCell>
        <TableCell className="text-right"><Skeleton className="h-8 w-8 rounded-full ml-auto" /></TableCell>
      </TableRow>
    ));

  return (
    <div className="rounded-md border mt-8">
      <div className="flex justify-start items-center px-4 py-2 border-b">
        <h3 className="text-lg font-medium">{t('organization.invitesTable.title')}</h3>
        {isPerformingSE && <Loader2 className="animate-spin ml-2" />}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {['invitee_email', 'inviter', 'invited_at', 'invite_expiry', 'role_name', 'status'].map((col) => (
              <TableHead key={col} className="cursor-pointer" onClick={() => handleSort(col)}>
                {t(`organization.invitesTable.${col === 'invitee_email' ? 'email' : col === 'inviter' ? 'invitedBy' : col === 'invited_at' ? 'invitedDate' : col === 'invite_expiry' ? 'expiry' : col === 'role_name' ? 'role' : 'status'}`)}
                {sortColumn === col && <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </TableHead>
            ))}
            <TableHead className="text-right">{t('organization.invitesTable.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? renderSkeletonRows() : sortedInvites.length === 0 ? (
            <TableRow><TableCell colSpan={7} className="text-center py-6">{t('organization.invitesTable.noInvitesFound')}</TableCell></TableRow>
          ) : (
            sortedInvites.map((invite) => {
              const expired = isExpired(invite.invite_expiry as string | undefined);
              const statusDetails = getStatusDetails(invite);
              const isInactive = expired || invite.status?.toLowerCase() === 'rejected';
              return (
                <TableRow key={invite.id} className={isInactive ? 'opacity-70' : ''}>
                  <TableCell>{invite.invitee_email}</TableCell>
                  <TableCell>{invite.inviter ? `${invite.inviter.first_name} ${invite.inviter.last_name}` : t('organization.invitesTable.unknown')}</TableCell>
                  <TableCell>{formatDate(invite.invited_at)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock size={14} className={expired ? 'text-amber-500' : 'text-gray-400'} />
                      <span className={expired ? 'text-amber-500' : ''}>{formatDate(invite.invite_expiry)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {getRoleIcon(invite.role_name)}
                      <span>{invite.role_name || t('organization.common.member')}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs rounded-full inline-flex items-center ${statusDetails.color}`}>
                      {statusDetails.icon}{statusDetails.text}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0" disabled={invite.status?.toLowerCase() === 'rejected'}>
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{t('organization.common.actions')}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onDeleteInvite?.(invite)} className="cursor-pointer text-red-500">
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>{t('organization.invitesTable.deleteInvite')}</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

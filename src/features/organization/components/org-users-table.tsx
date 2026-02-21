import { useState } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@clerk/clerk-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MoreVertical, Mail, UserMinus, Crown, Shield, User, UserCog } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { SendUserInvites } from './send-user-invites';
import { RoleSelectorDialog } from './role-selector-dialog';

interface OrgRole { id: string; name: string; [key: string]: unknown; }
interface OrgUser { id?: string; first_name?: string; last_name?: string; email?: string; avatarUrl?: string; role?: OrgRole; [key: string]: unknown; }
interface OrgUsersTableProps {
  users?: OrgUser[];
  onInviteUser?: (invites: unknown) => void;
  onRemoveUser?: (user: OrgUser) => void;
  onChangeRole?: (user: OrgUser, role: OrgRole) => void;
  isLoading?: boolean;
  organizationId?: string;
}

export const OrgUsersTable = ({ users = [], onInviteUser, onRemoveUser, onChangeRole, isLoading = false, organizationId }: OrgUsersTableProps) => {
  const { t } = useTranslation();
  const { userId: currentUserId } = useAuth();
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [roleSelectorOpen, setRoleSelectorOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<OrgUser | null>(null);

  const sortedUsers = [...(users || [])].sort((a, b) => {
    const aValue = ((a[sortColumn] as string | undefined)?.toLowerCase?.()) ?? '';
    const bValue = ((b[sortColumn] as string | undefined)?.toLowerCase?.()) ?? '';
    return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
  });

  const handleSort = (column: string) => {
    if (sortColumn === column) { setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'); }
    else { setSortColumn(column); setSortDirection('asc'); }
  };

  const getRoleIcon = (role?: OrgRole): ReactNode => {
    if (!role) return <User size={16} />;
    const n = role.name?.toLowerCase() ?? '';
    if (n.includes('admin')) return <Crown size={16} className="text-yellow-400" />;
    if (n.includes('owner')) return <Crown size={16} className="text-amber-500" />;
    if (n.includes('manager')) return <Shield size={16} className="text-blue-400" />;
    return <User size={16} />;
  };

  const renderSkeletonRows = () => Array(5).fill(0).map((_, i) => (
    <TableRow key={`sk-${i}`}>
      <TableCell><div className="flex items-center gap-2"><Skeleton className="h-8 w-8 rounded-full" /><Skeleton className="h-4 w-[150px]" /></div></TableCell>
      <TableCell><Skeleton className="h-4 w-[180px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
      <TableCell className="text-right"><Skeleton className="h-8 w-8 rounded-full ml-auto" /></TableCell>
    </TableRow>
  ));

  return (
    <div className="rounded-md border">
      <div className="flex justify-between items-center px-4 py-2 border-b">
        <h3 className="text-lg font-medium">{t('organization.usersTable.title')}</h3>
        <SendUserInvites organizationId={organizationId} onSendInvites={(invites) => { if (onInviteUser) onInviteUser(invites); }} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {['name', 'email', 'role'].map((col) => (
              <TableHead key={col} className="cursor-pointer" onClick={() => handleSort(col)}>
                {t(`organization.usersTable.${col}`)}{sortColumn === col && <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </TableHead>
            ))}
            <TableHead className="text-right">{t('organization.usersTable.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? renderSkeletonRows() : sortedUsers.length === 0 ? (
            <TableRow><TableCell colSpan={4} className="text-center py-6">{t('organization.usersTable.noUsersFound')}</TableCell></TableRow>
          ) : sortedUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium flex items-center gap-2">
                {user.avatarUrl ? <img src={user.avatarUrl} alt={user.first_name} className="h-8 w-8 rounded-full" /> : <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">{user.first_name?.charAt(0) ?? '?'}</div>}
                {user.first_name} {user.last_name}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell><div className="flex items-center gap-1">{getRoleIcon(user.role)}<span>{user.role?.name || t('organization.common.member')}</span></div></TableCell>
              <TableCell className="text-right">
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0"><span className="sr-only">Open menu</span><MoreVertical className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{t('organization.common.actions')}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => { setSelectedUser(user); setRoleSelectorOpen(true); }} className="cursor-pointer" disabled={currentUserId === user.id}>
                      <UserCog className="mr-2 h-4 w-4" /><span>{t('organization.usersTable.updateRole')}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => { window.location.href = `mailto:${user.email}`; }} className="cursor-pointer">
                      <Mail className="mr-2 h-4 w-4" /><span>{t('organization.usersTable.emailUser')}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onRemoveUser?.(user)} className="cursor-pointer text-red-500" disabled={currentUserId === user.id}>
                      <UserMinus className="mr-2 h-4 w-4" /><span>{t('organization.usersTable.removeUser')}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedUser && (
        <RoleSelectorDialog
          open={roleSelectorOpen}
          onOpenChange={setRoleSelectorOpen}
          organizationId={organizationId}
          user={selectedUser}
          onUpdateRole={(user, role) => { onChangeRole?.(user, role); }}
        />
      )}
    </div>
  );
};

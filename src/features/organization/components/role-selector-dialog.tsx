import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Crown, Shield, User } from 'lucide-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useGetAllOrganizationRolesQuery } from '../services';

interface OrgRole {
  id: string;
  name: string;
  [key: string]: unknown;
}

interface OrgUser {
  id?: string;
  first_name?: string;
  last_name?: string;
  role?: OrgRole;
  [key: string]: unknown;
}

interface RoleSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId?: string;
  user?: OrgUser;
  onUpdateRole: (user: OrgUser, role: OrgRole) => void;
}

export const RoleSelectorDialog = ({
  open,
  onOpenChange,
  organizationId,
  user,
  onUpdateRole,
}: RoleSelectorDialogProps) => {
  const { t } = useTranslation();
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const { data: roles, isLoading: isRolesLoading } = useGetAllOrganizationRolesQuery(organizationId ?? skipToken);

  useEffect(() => {
    if (user?.role && roles && (roles as OrgRole[]).length > 0) {
      setSelectedRoleId(user.role.id);
    }
  }, [user, roles]);

  const handleUpdateRole = () => {
    if (!selectedRoleId) {
      toast.error(t('organization.roleSelectorDialog.selectRoleError'));
      return;
    }
    const selectedRole = (roles as OrgRole[] | undefined)?.find((role) => role.id === selectedRoleId);
    if (!selectedRole || !user) return;
    onUpdateRole(user, selectedRole);
    onOpenChange(false);
  };

  const getRoleIcon = (roleName: string | undefined) => {
    if (!roleName) return <User size={16} />;
    const lower = roleName.toLowerCase();
    if (lower.includes('admin') || lower.includes('owner')) return <Crown size={16} className="text-yellow-400" />;
    if (lower.includes('manager')) return <Shield size={16} className="text-blue-400" />;
    return <User size={16} />;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('organization.roleSelectorDialog.title')}</DialogTitle>
          <DialogDescription>
            {t('organization.roleSelectorDialog.description', {
              user: `${user?.first_name ?? ''} ${user?.last_name ?? ''}`,
            })}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="role-select">{t('organization.roleSelectorDialog.selectRole')}</Label>
            {isRolesLoading ? (
              <div className="h-10 bg-secondary animate-pulse rounded-md"></div>
            ) : (
              <Select value={selectedRoleId} onValueChange={setSelectedRoleId} disabled={isRolesLoading}>
                <SelectTrigger id="role-select">
                  <SelectValue placeholder={t('organization.roleSelectorDialog.selectPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {(roles as OrgRole[] | undefined)
                    ?.filter((role) => role.id !== user?.role?.id)
                    .map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        <div className="flex items-center gap-2">
                          {getRoleIcon(role.name)}
                          <span>{role.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('organization.common.cancel')}
          </Button>
          <Button onClick={handleUpdateRole} disabled={!selectedRoleId || isRolesLoading}>
            {t('organization.roleSelectorDialog.updateRole')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

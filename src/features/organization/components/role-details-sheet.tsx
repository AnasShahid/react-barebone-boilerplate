import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PERMISSIONS } from '@/constants/permissions';
import { AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface OrgRole {
  id?: string;
  name?: string;
  description?: string;
  permissions?: string;
  is_system_role?: boolean;
  [key: string]: unknown;
}

interface RoleDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: OrgRole | null;
  onSave: (role: OrgRole) => void;
  isSystemRole?: boolean;
  isLoading?: boolean;
}

interface FormErrors {
  name?: string;
  description?: string;
}

export const RoleDetailsSheet = ({
  open,
  onOpenChange,
  role,
  onSave,
  isSystemRole = false,
  isLoading = false,
}: RoleDetailsSheetProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const { t } = useTranslation();

  useEffect(() => {
    if (role && open) {
      setName(role.name ?? '');
      setDescription(role.description ?? '');
      const permissionArray = role.permissions
        ? role.permissions.split(',').map((p) => p.trim()).filter(Boolean)
        : [];
      setSelectedPermissions(permissionArray);
      setErrors({});
    }
  }, [role, open]);

  useEffect(() => {
    if (!open) {
      setName('');
      setDescription('');
      setSelectedPermissions([]);
      setErrors({});
    }
  }, [open]);

  const permissionsByCategory = Object.entries(PERMISSIONS).map(([category, perms]) => ({
    category: category.charAt(0).toUpperCase() + category.slice(1),
    permissions: Object.values(perms) as { id: string; description: string }[],
  }));

  const handleTogglePermission = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId) ? prev.filter((id) => id !== permissionId) : [...prev, permissionId]
    );
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!name.trim()) newErrors.name = t('organization.roleDetailsSheet.roleNameRequired');
    if (!description.trim()) newErrors.description = t('organization.roleDetailsSheet.roleDescriptionRequired');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave({ ...role, name, description, permissions: selectedPermissions.join(',') });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md md:max-w-lg">
        <SheetHeader>
          <SheetTitle>{role?.id ? 'Edit Role' : 'Add New Role'}</SheetTitle>
          <SheetDescription>
            {role?.id ? 'Update the role details and permissions' : 'Create a new role with specific permissions'}
          </SheetDescription>
        </SheetHeader>
        <div className="py-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className={errors.name ? 'text-destructive' : ''}>
              {t('organization.roleDetailsSheet.roleName')} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              disabled={isSystemRole || isLoading}
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <div className="flex items-center text-destructive text-sm mt-1">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.name}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className={errors.description ? 'text-destructive' : ''}>
              {t('organization.roleDetailsSheet.roleDescription')} <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              disabled={isSystemRole || isLoading}
              placeholder="Describe the purpose and scope of this role"
              className={`resize-none h-20 ${errors.description ? 'border-destructive' : ''}`}
            />
            {errors.description && (
              <div className="flex items-center text-destructive text-sm mt-1">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.description}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label>{t('organization.roleDetailsSheet.rolePermissions')}</Label>
            {isSystemRole && (
              <div className="text-amber-500 text-sm mt-1 mb-2 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {t('organization.roleDetailsSheet.systemRolePermissions')}
              </div>
            )}
            <ScrollArea className="h-[300px] pr-4 rounded-md border">
              <div className="p-4 space-y-6">
                {permissionsByCategory.map(({ category, permissions }) => (
                  <div key={category} className="space-y-2">
                    <h4 className="text-sm font-medium">{category}</h4>
                    <div className="space-y-2">
                      {permissions.map((permission) => (
                        <div key={permission.id} className="flex items-start space-x-2">
                          <Checkbox
                            id={permission.id}
                            checked={selectedPermissions.includes(permission.id)}
                            onCheckedChange={() => handleTogglePermission(permission.id)}
                            disabled={isSystemRole || isLoading}
                            className="mt-1"
                          />
                          <div className="grid gap-1">
                            <Label htmlFor={permission.id} className="leading-none font-medium cursor-pointer">
                              {permission.id.split('.')[1].replace(/_/g, ' ')}
                            </Label>
                            <p className="text-xs text-muted-foreground">{permission.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="text-xs text-muted-foreground mt-2">
              {t('organization.roleDetailsSheet.selectedPermissions')} {selectedPermissions.length}{' '}
              {t('organization.roleDetailsSheet.permissions')}
            </div>
          </div>
        </div>
        <SheetFooter className="sm:justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            {t('organization.roleDetailsSheet.cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={isSystemRole || isLoading}>
            {isLoading
              ? t('organization.roleDetailsSheet.saving')
              : role?.id
              ? t('organization.roleDetailsSheet.updateRole')
              : t('organization.roleDetailsSheet.createRole')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

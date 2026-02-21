import { useState } from 'react';
import type { MouseEvent } from 'react';
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
  Plus,
  Edit,
  Trash2,
  Lock,
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
import { RoleDetailsSheet } from './role-details-sheet';
import { useTranslation } from 'react-i18next';

interface OrgRole {
  id?: string;
  name?: string;
  description?: string;
  permissions?: string;
  is_system_role?: boolean;
  [key: string]: unknown;
}

interface OrgRolesTableProps {
  roles?: OrgRole[];
  onAddRole?: (role: OrgRole) => void;
  onEditRole?: (role: OrgRole) => void;
  onDeleteRole?: (role: OrgRole) => void;
  isLoading?: boolean;
  isPerformingSE?: boolean;
}

export const OrgRolesTable = ({
  roles = [],
  onAddRole,
  onEditRole,
  onDeleteRole,
  isLoading = false,
  isPerformingSE = false,
}: OrgRolesTableProps) => {
  const { t } = useTranslation();
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<OrgRole | null>(null);

  const sortedRoles = [...(roles || [])].sort((a, b) => {
    if (sortColumn === 'is_system_role') {
      return sortDirection === 'asc'
        ? a.is_system_role === b.is_system_role ? 0 : a.is_system_role ? -1 : 1
        : a.is_system_role === b.is_system_role ? 0 : a.is_system_role ? 1 : -1;
    }
    const aValue = ((a[sortColumn] as string | undefined)?.toLowerCase?.()) ?? '';
    const bValue = ((b[sortColumn] as string | undefined)?.toLowerCase?.()) ?? '';
    return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
  });

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const formatPermissions = (permissionsString?: string) => {
    if (!permissionsString) return <span className="text-gray-400">{t('organization.common.noPermissions')}</span>;
    const permissionIds = permissionsString.split(',').map((p) => p.trim()).filter((p) => p);
    if (permissionIds.length === 0) return <span className="text-gray-400">{t('organization.common.noPermissions')}</span>;
    return (
      <div className="flex items-center">
        <span className="px-2 py-1 rounded-full text-xs font-medium">
          {permissionIds.length} {permissionIds.length === 1 ? 'permission' : 'permissions'}
        </span>
      </div>
    );
  };

  const renderSkeletonRows = () =>
    Array(3).fill(0).map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
        <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
        <TableCell><div className="flex flex-col gap-1"><Skeleton className="h-4 w-[180px]" /><Skeleton className="h-4 w-[150px]" /></div></TableCell>
        <TableCell><Skeleton className="h-5 w-[40px] rounded-full" /></TableCell>
        <TableCell className="text-right"><Skeleton className="h-8 w-8 rounded-full ml-auto" /></TableCell>
      </TableRow>
    ));

  return (
    <div className="rounded-md border">
      <div className="flex justify-between items-center px-4 py-2 border-b">
        <h3 className="text-lg font-medium">{t('organization.common.roles')}</h3>
        <div className="flex items-center gap-3">
          {isPerformingSE && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Button
            size="sm"
            onClick={(e: MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              setCurrentRole(null);
              setIsSheetOpen(true);
            }}
            disabled={isLoading}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t('organization.common.addRole')}
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer w-[200px]" onClick={() => handleSort('name')}>
              {t('organization.rolesTable.name')}{sortColumn === 'name' && <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('description')}>
              {t('organization.rolesTable.description')}{sortColumn === 'description' && <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
            </TableHead>
            <TableHead>{t('organization.rolesTable.permissions')}</TableHead>
            <TableHead className="cursor-pointer w-[100px]" onClick={() => handleSort('is_system_role')}>
              {t('organization.rolesTable.isSystemRole')}{sortColumn === 'is_system_role' && <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
            </TableHead>
            <TableHead className="text-right w-[80px]">{t('organization.rolesTable.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? renderSkeletonRows() : sortedRoles.length === 0 ? (
            <TableRow><TableCell colSpan={5} className="text-center py-6">{t('organization.rolesTable.noData')}</TableCell></TableRow>
          ) : (
            sortedRoles.map((role) => (
              <TableRow key={role.id}>
                <TableCell className="font-medium">{role.name}</TableCell>
                <TableCell>{role.description || <span className="text-gray-400">{t('organization.rolesTable.noDescription')}</span>}</TableCell>
                <TableCell className="whitespace-pre-line">{formatPermissions(role.permissions)}</TableCell>
                <TableCell>
                  {role.is_system_role ? (
                    <div className="flex items-center"><Lock size={14} className="text-amber-500 mr-1" /><span className="text-amber-500">{t('organization.rolesTable.isASystemRole')}</span></div>
                  ) : (
                    <span className="text-gray-500">{t('organization.rolesTable.isNotASystemRole')}</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>{t('organization.rolesTable.actions')}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={(e: MouseEvent) => { e.preventDefault(); setCurrentRole(role); setIsSheetOpen(true); }}
                        className="cursor-pointer"
                        disabled={role.is_system_role}
                      >
                        <Edit className="mr-2 h-4 w-4" />{t('organization.rolesTable.edit')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDeleteRole?.(role)} className="cursor-pointer text-red-600" disabled={role.is_system_role}>
                        <Trash2 className="mr-2 h-4 w-4" />{t('organization.rolesTable.delete')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <RoleDetailsSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        role={currentRole}
        isSystemRole={currentRole?.is_system_role}
        isLoading={isLoading}
        onSave={(updatedRole) => {
          if (updatedRole.id) { onEditRole?.(updatedRole); } else { onAddRole?.(updatedRole); }
          setIsSheetOpen(false);
        }}
      />
    </div>
  );
};

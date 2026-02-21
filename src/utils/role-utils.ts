interface RoleOrg {
  roleId: string | undefined;
  roleName: string | undefined;
  organizationId: string | undefined;
  organizationName: string | undefined;
  isDefault: boolean | undefined;
  permissions: string[];
}

interface UserOrganization {
  id: string | undefined;
  name: string | undefined;
  roleId: string | undefined;
  roleName: string | undefined;
  isDefault: boolean | undefined;
}

interface UserRoles {
  roles: string[];
  defaultRole: string | undefined;
  defaultOrganization: { id: string | undefined; name: string | undefined } | null;
  organizations: UserOrganization[];
  permissions: string[];
  hasRole: (roleName: string) => boolean;
  hasAnyRole: (roleNames: string[]) => boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissionList: string[]) => boolean;
}

interface UserRoleOrgData {
  role?: { id?: string; name?: string; permissions?: string };
  organization?: { id?: string; name?: string };
  is_default?: boolean;
}

interface UserData {
  user_role_orgs?: UserRoleOrgData[];
}

const emptyRoles: UserRoles = {
  roles: [],
  defaultRole: undefined,
  defaultOrganization: null,
  organizations: [],
  permissions: [],
  hasRole: () => false,
  hasPermission: () => false,
  hasAnyRole: () => false,
  hasAnyPermission: () => false,
};

export const extractUserRoles = (user: UserData | null | undefined): UserRoles => {
  if (!user?.user_role_orgs?.length) return emptyRoles;

  const roleOrgs: RoleOrg[] = user.user_role_orgs.map((userRoleOrg) => ({
    roleId: userRoleOrg.role?.id,
    roleName: userRoleOrg.role?.name,
    organizationId: userRoleOrg.organization?.id,
    organizationName: userRoleOrg.organization?.name,
    isDefault: userRoleOrg.is_default,
    permissions: userRoleOrg.role?.permissions?.split(',').filter(Boolean) ?? [],
  }));

  const defaultRoleOrg = roleOrgs.find((r) => r.isDefault) ?? roleOrgs[0];
  const roles = [...new Set(roleOrgs.map((r) => r.roleName))].filter(
    (r): r is string => r !== undefined
  );
  const permissions = [...new Set(roleOrgs.flatMap((r) => r.permissions))].filter(Boolean);
  const organizations: UserOrganization[] = roleOrgs
    .filter((r) => r.organizationId)
    .map((r) => ({
      id: r.organizationId,
      name: r.organizationName,
      roleId: r.roleId,
      roleName: r.roleName,
      isDefault: r.isDefault,
    }));

  return {
    roles,
    defaultRole: defaultRoleOrg?.roleName,
    defaultOrganization: defaultRoleOrg
      ? { id: defaultRoleOrg.organizationId, name: defaultRoleOrg.organizationName }
      : null,
    organizations,
    permissions,
    hasRole: (roleName) => roles.includes(roleName),
    hasAnyRole: (roleNames) => roleNames.some((role) => roles.includes(role)),
    hasPermission: (permission) => permissions.includes(permission),
    hasAnyPermission: (permissionList) =>
      permissionList.some((permission) => permissions.includes(permission)),
  };
};

export const getRedirectPathForRole = (userRoles: UserRoles | null | undefined): string => {
  if (!userRoles?.roles.length) return '/auth/login';
  if (userRoles.hasRole('Super Admin') || userRoles.hasRole('Company Admin'))
    return '/company-admin';
  if (userRoles.hasRole('Lane Manager')) return '/score-keeper';
  return '/dashboard';
};

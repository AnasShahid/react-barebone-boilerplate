interface Permission {
  id: string;
  description: string;
}

interface PermissionCategory {
  [key: string]: Permission;
}

interface PermissionsConfig {
  organization: PermissionCategory;
  user: PermissionCategory;
  role: PermissionCategory;
  invite: PermissionCategory;
  customer: PermissionCategory;
}

const PERMISSIONS: PermissionsConfig = {
  organization: {
    view: { id: 'organization.view', description: 'View organization details and information' },
    edit: { id: 'organization.edit', description: 'Edit organization details and settings' },
    delete: { id: 'organization.delete', description: 'Delete an organization' },
    manage_members: { id: 'organization.manage_members', description: 'Add, remove, or manage organization members' },
    manage_roles: { id: 'organization.manage_roles', description: 'Create, edit or assign roles within the organization' },
    admin: { id: 'organization.admin', description: 'Full administrative access to organization settings and data' },
  },
  user: {
    view: { id: 'user.view', description: 'View user profiles and information' },
    edit: { id: 'user.edit', description: 'Edit user information and settings' },
    delete: { id: 'user.delete', description: 'Delete user accounts' },
    manage_roles: { id: 'user.manage_roles', description: 'Assign or revoke roles for users' },
    admin: { id: 'user.admin', description: 'Full administrative access to user management' },
  },
  role: {
    view: { id: 'role.view', description: 'View role configurations and assignments' },
    edit: { id: 'role.edit', description: 'Edit existing roles and their permissions' },
    delete: { id: 'role.delete', description: 'Delete roles from the system' },
    assign: { id: 'role.assign', description: 'Assign roles to users' },
    admin: { id: 'role.admin', description: 'Full administrative access to role management' },
  },
  invite: {
    create: { id: 'invite.create', description: 'Create and send invitations to users' },
    view: { id: 'invite.view', description: 'View pending and past invitations' },
    delete: { id: 'invite.delete', description: 'Delete or cancel invitations' },
  },
  customer: {
    view: { id: 'customer.view', description: 'View customer details and information' },
    edit: { id: 'customer.edit', description: 'Edit customer details and settings' },
    delete: { id: 'customer.delete', description: 'Delete customer records' },
    admin: { id: 'customer.admin', description: 'Full administrative access to customer management' },
  },
};

const ALL_PERMISSIONS: string[] = Object.values(PERMISSIONS).flatMap((category) =>
  (Object.values(category) as Permission[]).map((permission) => permission.id)
);

export { PERMISSIONS, ALL_PERMISSIONS };
export type { Permission, PermissionCategory, PermissionsConfig };

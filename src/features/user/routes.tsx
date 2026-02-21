import AccountPage from './pages/account-page';
import { OrganizationsPage, EditOrganizationInfo, EditOrganizationUsers, EditOrganizationRoles } from '@/features/organization';
import EditOrgLayout from '@/layouts/edit-org-layout';

export const userRoutes = [
  {
    path: '/account/*',
    element: <AccountPage />,
    children: [
      {
        path: 'organizations',
        element: <OrganizationsPage />,
      },
      {
        path: 'organizations/:orgId',
        element: <EditOrgLayout />,
        children: [
          {
            index: true,
            path: 'info',
            element: <EditOrganizationInfo />,
          },
          {
            path: 'users',
            element: <EditOrganizationUsers />,
          },
          {
            path: 'roles',
            element: <EditOrganizationRoles />,
          },
        ],
      },
    ],
  },
];

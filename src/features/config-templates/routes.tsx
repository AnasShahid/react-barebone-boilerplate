import { ConfigTemplatesListPage } from "./pages/config-templates-list-page";
import { ServiceRolesListPage } from "./pages/service-roles-list-page";

export const configTemplatesRoutes = [
  {
    path: "/config-templates",
    element: <ConfigTemplatesListPage />,
  },
  {
    path: "/config-templates/service-roles",
    element: <ServiceRolesListPage />,
  },
];

import { ProjectsListPageV2, SingleProjectPage, RequirementsPage } from "./pages";

export const projectsRoutes = [
  {
    path: "/projects",
    element: <ProjectsListPageV2 />,
  },
  {
    path: "/projects/:id",
    element: <SingleProjectPage />,
  },
  {
    path: "/projects/:id/requirements",
    element: <RequirementsPage />,
  },
];

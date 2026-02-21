import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { createBrowserRouter } from 'react-router-dom';
import { NotFoundPage } from '@/pages/error/not-found';
import { UnauthorizedPage } from '@/pages/error/unauthorized';
import { ServerErrorPage } from '@/pages/error/server-error';
import AuthLayout from '@/layouts/auth-layout';
import AppLayout from '@/layouts/app-layout';
import { authRoutes } from '@/features/auth/index.ts';
import { pricingRoutes } from '@/features/pricing/index.ts';
import { dashboardRoutes } from '@/features/dashboard/index.ts';
import { userRoutes } from '@/features/user/index.ts';
import { onboardingRoutes } from '@/features/onboarding/index.ts';
import OnboardingLayout from '@/layouts/onboarding-layout';
import { inviteRoutes } from '@/features/invite/index.ts';
import { customersRoutes } from '@/features/customers/index.ts';
import { configTemplatesRoutes } from '../features/config-templates/index.ts';
import { projectsRoutes } from '../features/projects/index.ts';

export const router = createBrowserRouter([
  {
    element: (
      <>
        <SignedIn>
          <AppLayout />
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </>
    ),
    errorElement: <NotFoundPage />,
    children: [
      ...pricingRoutes,
      ...dashboardRoutes,
      ...userRoutes,
      ...customersRoutes,
      ...configTemplatesRoutes,
      ...projectsRoutes,
      { path: '401', element: <UnauthorizedPage /> },
      { path: '500', element: <ServerErrorPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    element: (
      <SignedOut>
        <AuthLayout />
      </SignedOut>
    ),
    errorElement: <NotFoundPage />,
    children: [
      ...authRoutes,
      { path: '401', element: <UnauthorizedPage /> },
      { path: '500', element: <ServerErrorPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    element: (
      <>
        <SignedIn>
          <OnboardingLayout />
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </>
    ),
    children: [...onboardingRoutes],
  },
  ...inviteRoutes,
]);

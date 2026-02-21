import { redirect } from 'react-router-dom';
import { OnboardingProvider } from './context';
import {
  CreateOrganizationPage,
  OnboardingPage,
  InviteUsersPage,
  WelcomePage,
} from './pages';

const OnboardingRoutes = () => (
  <OnboardingProvider>
    <OnboardingPage />
  </OnboardingProvider>
);

const CreateOrgRoute = () => (
  <OnboardingProvider>
    <CreateOrganizationPage />
  </OnboardingProvider>
);

const InviteUsersRoute = () => (
  <OnboardingProvider>
    <InviteUsersPage />
  </OnboardingProvider>
);

const WelcomeRoute = () => (
  <OnboardingProvider>
    <WelcomePage />
  </OnboardingProvider>
);

export const onboardingRoutes = [
  {
    path: '/onboarding',
    children: [
      {
        index: true,
        loader() {
          return redirect('welcome');
        },
      },
      { path: 'welcome', element: <OnboardingRoutes /> },
      { path: 'create-org', element: <CreateOrgRoute /> },
      { path: 'invite', element: <InviteUsersRoute /> },
      { path: 'complete', element: <WelcomeRoute /> },
    ],
  },
];

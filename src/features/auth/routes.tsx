import { LoginPage } from './pages/login';
import { SignupPage } from './pages/signup';
import { ForgotPasswordPage } from './pages/forgot-password';

export const authRoutes = [
  {
    path: 'auth',
    children: [
      { path: 'login/*', element: <LoginPage /> },
      { path: 'signup/*', element: <SignupPage /> },
      { path: 'forgot-password/*', element: <ForgotPasswordPage /> },
    ],
  },
];

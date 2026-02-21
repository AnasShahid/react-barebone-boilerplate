import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PasswordField } from './password-field';
import { useClerkAuth } from '../hooks';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';

interface LoginFormProps {
  className?: string;
  [key: string]: unknown;
}

export function LoginForm({ className, ...props }: LoginFormProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signInWithEmailAndPassword, isLoading, error, isLoaded } = useClerkAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      const result = await signInWithEmailAndPassword(email, password);
      if (result && result.success) {
        toast.success('Successfully logged in!');
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error((err as Error)?.message ?? 'Failed to log in');
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {t('auth.login.title', 'Login to React-boilerplate AI')}
          </CardTitle>
          <CardDescription>
            {t('auth.login.description', 'Enter your credentials to access the dashboard')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">{t('auth.login.email', 'Email')}</label>
              <Input
                type="email"
                placeholder={t('auth.login.emailPlaceholder', 'email@example.com')}
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
                disabled={!isLoaded || isLoading}
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-2 justify-between">
                <label className="text-sm font-medium">
                  {t('auth.login.password', 'Password')}
                </label>
                <Link className="text-sm text-right" to="/auth/forgot-password">
                  {t('auth.login.forgotPassword', 'Forgot password?')}
                </Link>
              </div>
              <PasswordField
                placeholder={t('auth.login.passwordPlaceholder', 'Enter your password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={!isLoaded || isLoading}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#D35400] hover:bg-[#FF8C00] mt-2 text-white"
              disabled={!isLoaded || isLoading || !email || !password}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('auth.login.signingIn', 'Signing in...')}
                </>
              ) : (
                t('auth.login.submit', 'Sign In')
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <button
              onClick={() => navigate('/auth/signup')}
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

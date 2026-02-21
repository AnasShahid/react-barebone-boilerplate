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
import { Loader2, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface PasswordResetFormProps {
  className?: string;
  onSubmit?: (email: string) => Promise<void>;
  isLoading?: boolean;
  error?: string;
  [key: string]: unknown;
}

export function PasswordResetForm({
  className,
  onSubmit,
  isLoading = false,
  error,
  ...props
}: PasswordResetFormProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;

    try {
      await onSubmit?.(email);
    } catch (err) {
      toast.error((err as Error)?.message ?? 'Failed to send reset email');
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {t('auth.resetPassword.title', 'Reset Password')}
          </CardTitle>
          <CardDescription>
            {t(
              'auth.resetPassword.description',
              'Enter your email to receive a password reset link'
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">
                {t('auth.resetPassword.email', 'Email')}
              </label>
              <Input
                type="email"
                placeholder={t('auth.resetPassword.emailPlaceholder', 'you@example.com')}
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#D35400] hover:bg-[#FF8C00] mt-2 text-white"
              disabled={isLoading || !email}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('auth.resetPassword.sending', 'Sending...')}
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  {t('auth.resetPassword.submit', 'Send Reset Code')}
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex items-center justify-center">
          <Link className="text-sm text-center" to="/auth/login">
            Return to login!
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

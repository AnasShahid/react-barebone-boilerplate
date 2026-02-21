import { useState } from 'react';
import type { FormEvent } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PasswordField } from './password-field';
import { Loader2, LockKeyhole } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface NewPasswordFormProps {
  className?: string;
  onSubmit?: (password: string) => Promise<void>;
  isLoading?: boolean;
  error?: string;
  [key: string]: unknown;
}

export function NewPasswordForm({
  className,
  onSubmit,
  isLoading = false,
  error,
  ...props
}: NewPasswordFormProps) {
  const { t } = useTranslation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) return;

    if (newPassword !== confirmPassword) {
      toast.error(t('auth.newPassword.passwordMismatch', 'Passwords do not match'));
      return;
    }

    if (newPassword.length < 8) {
      toast.error(
        t('auth.newPassword.passwordTooShort', 'Password must be at least 8 characters long')
      );
      return;
    }

    try {
      await onSubmit?.(newPassword);
    } catch (err) {
      toast.error((err as Error)?.message ?? 'Failed to reset password');
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {t('auth.newPassword.title', 'Set New Password')}
          </CardTitle>
          <CardDescription>
            {t('auth.newPassword.description', 'Create a new password for your account')}
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
                {t('auth.newPassword.newPassword', 'New Password')}
              </label>
              <PasswordField
                placeholder={t('auth.newPassword.newPasswordPlaceholder', 'Enter new password')}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">
                {t('auth.newPassword.confirmPassword', 'Confirm Password')}
              </label>
              <PasswordField
                placeholder={t(
                  'auth.newPassword.confirmPasswordPlaceholder',
                  'Confirm new password'
                )}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#D35400] hover:bg-[#FF8C00] mt-2 text-white"
              disabled={isLoading || !newPassword || !confirmPassword}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('auth.newPassword.resetting', 'Resetting...')}
                </>
              ) : (
                <>
                  <LockKeyhole className="mr-2 h-4 w-4" />
                  {t('auth.newPassword.submit', 'Reset Password')}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

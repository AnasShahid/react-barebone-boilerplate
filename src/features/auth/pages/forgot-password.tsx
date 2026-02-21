import { useState } from 'react';
import { useClerkAuth } from '../hooks';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { PasswordResetForm, OTPForm, NewPasswordForm } from '../components';
import { SEO } from '@/components/seo';

type ResetStep = 'email' | 'code' | 'password';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [isSubmittingReset, setIsSubmittingReset] = useState(false);
  const [resetStep, setResetStep] = useState<ResetStep>('email');
  const { resetPassword, verifyResetCode, setNewPassword: setNewPasswordClerk, isLoading } = useClerkAuth();

  const handleResetPasswordSubmit = async (email: string) => {
    setIsSubmittingReset(true);
    try {
      const result = await resetPassword(email);
      if (result?.success) {
        toast.success('Password reset email sent');
        setResetStep('code');
      } else {
        toast.error(result?.error ?? 'Failed to send reset email');
      }
    } catch {
      toast.error('Password reset failed');
    } finally {
      setIsSubmittingReset(false);
    }
  };

  const handleCodeVerification = async (verificationCode: string) => {
    try {
      const result = await verifyResetCode(verificationCode);
      if (result?.success && result?.needsNewPassword) {
        toast.success('Code verified successfully');
        setResetStep('password');
      } else if (result?.success && result?.complete) {
        toast.success('Password reset completed');
        navigate('/login');
      } else {
        toast.error(result?.error ?? 'Invalid verification code');
      }
    } catch {
      toast.error('Code verification failed');
    }
  };

  const handleNewPasswordSubmit = async (newPassword: string) => {
    try {
      const result = await setNewPasswordClerk(newPassword);
      if (result?.success) {
        toast.success('Password reset successfully! You are now logged in.');
        navigate('/dashboard');
      } else {
        toast.error(result?.error ?? 'Failed to reset password');
      }
    } catch {
      toast.error('Failed to reset password');
    }
  };

  return (
    <>
      {resetStep === 'email' && (
        <>
          <SEO title="Forgot Password" />
          <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="max-w-sm w-full">
              <PasswordResetForm onSubmit={handleResetPasswordSubmit} isLoading={isSubmittingReset} />
            </div>
          </div>
        </>
      )}
      {resetStep === 'code' && (
        <>
          <SEO title="Verify reset code" />
          <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="max-w-sm">
              <OTPForm onVerify={handleCodeVerification} onResend={async () => setResetStep('code')} isLoading={isLoading} />
            </div>
          </div>
        </>
      )}
      {resetStep === 'password' && (
        <>
          <SEO title="Create a new password" />
          <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="max-w-sm w-full">
              <NewPasswordForm onSubmit={handleNewPasswordSubmit} isLoading={isLoading} />
            </div>
          </div>
        </>
      )}
    </>
  );
}

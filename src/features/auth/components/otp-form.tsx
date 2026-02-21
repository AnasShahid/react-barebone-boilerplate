import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Loader2, Key } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface OTPFormProps {
  className?: string;
  onVerify?: (code: string) => Promise<void>;
  onResend?: () => Promise<void>;
  isLoading?: boolean;
  error?: string;
  [key: string]: unknown;
}

export function OTPForm({ onVerify, onResend, isLoading = false, error, ...props }: OTPFormProps) {
  const { t } = useTranslation();
  const [verificationCode, setVerificationCode] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!verificationCode || verificationCode.length !== 6) return;
    try {
      await onVerify?.(verificationCode);
    } catch (err) {
      toast.error((err as Error)?.message ?? 'Verification failed');
    }
  };

  const handleResend = async () => {
    try {
      await onResend?.();
      toast.success('Code resent successfully');
    } catch (err) {
      toast.error((err as Error)?.message ?? 'Failed to resend code');
    }
  };

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle className="text-2xl">{t('auth.otp.title', 'Enter verification code')}</CardTitle>
        <CardDescription>{t('auth.otp.description', 'Enter the 6-digit code sent to your email')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="flex flex-col items-center">
            <InputOTP maxLength={6} id="otp" required value={verificationCode} onChange={setVerificationCode} disabled={isLoading}>
              <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <Button type="submit" className="w-full bg-[#D35400] hover:bg-[#FF8C00] mt-2 text-white" disabled={isLoading || verificationCode.length !== 6}>
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('auth.otp.verifying', 'Verifying...')}</>
            ) : (
              <><Key className="mr-2 h-4 w-4" />{t('auth.otp.verify', 'Verify Code')}</>
            )}
          </Button>
          <div className="text-center mt-2">
            <Button variant="link" type="button" onClick={handleResend} disabled={isLoading}>
              {t('auth.otp.resend', 'Resend code')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

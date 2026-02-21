import { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useClerkAuth } from '@/features/auth/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, User, Mail, Lock, Eye, EyeOff, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

interface FormData {
  firstName: string;
  lastName: string;
  emailAddress: string;
  username: string;
  password: string;
}

interface InviteData {
  token?: string;
  email?: string;
  [key: string]: unknown;
}

interface ClerkErrorItem {
  message: string;
  longMessage?: string;
  code?: string;
  meta?: { paramName?: string };
}

interface FormErrors {
  [key: string]: string;
}

export function SignupForm({ ...props }) {
  const { createSignUp, verifyEmailCode, isLoading, isLoaded } = useClerkAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    emailAddress: '',
    username: '',
    password: '',
  });

  const [inviteData, setInviteData] = useState<InviteData | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [verificationCode, setVerificationCode] = useState('');
  const [needsEmailVerification, setNeedsEmailVerification] = useState(false);

  useEffect(() => {
    const storedInviteData = localStorage.getItem('inviteData');
    if (storedInviteData) {
      try {
        const invite = JSON.parse(storedInviteData) as InviteData;
        setInviteData(invite);
        setFormData((prev) => ({ ...prev, emailAddress: invite.email ?? '' }));
      } catch (error) {
        console.error('Failed to parse invite data:', error);
      }
    }
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.emailAddress.trim()) newErrors.emailAddress = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
      newErrors.emailAddress = 'Please enter a valid email address';
    }
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoaded || !validateForm()) return;

    const result = await createSignUp(formData, inviteData);

    if (result.success) {
      if (result.status === 'NEEDS_EMAIL_VERIFICATION') {
        setNeedsEmailVerification(true);
        toast.success(result.message ?? '');
      } else if (result.status === 'SIGNED_IN') {
        toast.success(result.message ?? '');
        if (inviteData) localStorage.removeItem('inviteData');
      }
    } else {
      if (result.errors) {
        const newErrors: FormErrors = {};
        (result.errors as ClerkErrorItem[]).forEach((error) => {
          if (error.meta?.paramName) {
            newErrors[error.meta.paramName] = error.longMessage ?? error.message;
          }
        });
        setErrors(newErrors);
      }
      toast.error(result.error ?? '');
    }
  };

  const handleVerifyEmail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!verificationCode.trim()) {
      setErrors({ verificationCode: 'Verification code is required' });
      return;
    }

    const result = await verifyEmailCode(verificationCode);

    if (result.success) {
      toast.success(result.message ?? '');
      if (inviteData) localStorage.removeItem('inviteData');
    } else {
      if (result.errors) {
        const newErrors: FormErrors = {};
        (result.errors as ClerkErrorItem[]).forEach((error) => {
          if (error.code === 'form_code_incorrect') {
            newErrors.verificationCode = 'Invalid verification code';
          } else {
            newErrors.verificationCode = error.longMessage ?? error.message;
          }
        });
        setErrors(newErrors);
      } else {
        setErrors({ verificationCode: result.error ?? '' });
      }
      toast.error(result.error ?? '');
    }
  };

  return (
    <>
      {inviteData && (
        <Alert variant="default">
          <UserPlus className="h-4 w-4" />
          <AlertDescription>
            You&apos;re signing up with an invitation to join the organization.
          </AlertDescription>
        </Alert>
      )}
      <Card {...props}>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {needsEmailVerification ? 'Verify your email' : 'Create your account'}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {needsEmailVerification
              ? `We've sent a verification code to ${formData.emailAddress}. Please enter it below.`
              : 'Welcome! Please fill in the details to get started.'}
          </p>
        </CardHeader>
        <CardContent>
          {needsEmailVerification ? (
            <form onSubmit={handleVerifyEmail} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="verificationCode">Verification Code</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="verificationCode"
                    name="verificationCode"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setVerificationCode(e.target.value);
                      if (errors.verificationCode) {
                        setErrors((prev) => ({ ...prev, verificationCode: '' }));
                      }
                    }}
                    className={`pl-10 ${errors.verificationCode ? 'border-red-500' : ''}`}
                    required
                    maxLength={6}
                  />
                </div>
                {errors.verificationCode && (
                  <p className="text-sm text-red-500">{errors.verificationCode}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Didn&apos;t receive the code? Check your spam folder or{' '}
                  <button
                    type="button"
                    onClick={() => setNeedsEmailVerification(false)}
                    className="text-primary hover:underline"
                  >
                    go back to signup
                  </button>
                </p>
              </div>
              <Button type="submit" className="w-full bg-[#D35400] hover:bg-[#FF8C00] mt-2" disabled={isLoading}>
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Verifying...</>
                ) : 'Verify Email'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="firstName" name="firstName" type="text" placeholder="John" value={formData.firstName} onChange={handleInputChange} className={`pl-10 ${errors.firstName ? 'border-red-500' : ''}`} required />
                  </div>
                  {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="lastName" name="lastName" type="text" placeholder="Doe" value={formData.lastName} onChange={handleInputChange} className={`pl-10 ${errors.lastName ? 'border-red-500' : ''}`} required />
                  </div>
                  {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="emailAddress">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="emailAddress" name="emailAddress" type="email" placeholder="john@example.com" value={formData.emailAddress} onChange={handleInputChange} className={`pl-10 ${errors.emailAddress ? 'border-red-500' : ''}`} required disabled={!!inviteData} />
                </div>
                {errors.emailAddress && <p className="text-sm text-red-500">{errors.emailAddress}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="username" name="username" type="text" placeholder="johndoe" value={formData.username} onChange={handleInputChange} className={`pl-10 ${errors.username ? 'border-red-500' : ''}`} required />
                </div>
                {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
                <p className="text-xs text-muted-foreground">Username must be at least 3 characters long</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={formData.password} onChange={handleInputChange} className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                <p className="text-xs text-muted-foreground">Password must be at least 8 characters long</p>
              </div>
              <div id="clerk-captcha" data-cl-size="flexible"></div>
              <Button type="submit" className="w-full bg-[#D35400] hover:bg-[#FF8C00] mt-2 text-white" disabled={isLoading}>
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating account...</>
                ) : 'Create account'}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Separator />
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <button onClick={() => navigate('/auth/login')} className="text-primary hover:underline font-medium">
              Sign in
            </button>
          </p>
        </CardFooter>
      </Card>
    </>
  );
}

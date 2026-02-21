import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/orange-tab';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PasswordField } from '../components';
import { useClerkAuth } from '../hooks';
import { Settings, ArrowLeft, LockKeyhole, Loader2, Clipboard, Mail, Key } from 'lucide-react';
import { toast } from 'sonner';

type ResetStep = 'email' | 'code' | 'password';

export function SignInPage() {
  const [isResetPasswordMode, setIsResetPasswordMode] = useState(false);
  const [isSubmittingReset, setIsSubmittingReset] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetStep, setResetStep] = useState<ResetStep>('email');
  const [resetEmail, setResetEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { signInWithEmailAndPassword, resetPassword, verifyResetCode, setNewPassword: setNewPasswordClerk, isLoading, error, isLoaded } = useClerkAuth();

  const handleAdminLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) return;
    try {
      await signInWithEmailAndPassword(email, password);
      toast.success('Successfully logged in!');
    } catch (err) {
      toast.error((err as Error)?.message ?? 'Failed to log in');
    }
  };

  const handleResetPasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmittingReset(true);
    try {
      const result = await resetPassword(resetEmail);
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

  const handleCodeVerification = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!verificationCode) return;
    try {
      const result = await verifyResetCode(verificationCode);
      if (result?.success && result?.needsNewPassword) {
        toast.success('Code verified successfully');
        setResetStep('password');
      } else if (result?.success && result?.complete) {
        toast.success('Password reset completed');
        setIsResetPasswordMode(false);
        setResetStep('email');
      } else {
        toast.error(result?.error ?? 'Invalid verification code');
      }
    } catch {
      toast.error('Code verification failed');
    }
  };

  const handleNewPasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) return;
    if (newPassword !== confirmPassword) { toast.error('Passwords do not match'); return; }
    if (newPassword.length < 8) { toast.error('Password must be at least 8 characters long'); return; }
    try {
      const result = await setNewPasswordClerk(newPassword);
      if (result?.success) {
        toast.success('Password reset successfully! You are now logged in.');
        setIsResetPasswordMode(false);
        setResetStep('email');
        setResetEmail(''); setVerificationCode(''); setNewPassword(''); setConfirmPassword('');
      } else {
        toast.error(result?.error ?? 'Failed to reset password');
      }
    } catch {
      toast.error('Failed to reset password');
    }
  };

  const resetPasswordFlow = () => {
    setIsResetPasswordMode(false);
    setResetStep('email');
    setResetEmail(''); setVerificationCode(''); setNewPassword(''); setConfirmPassword('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="user" className="w-full">
            <div className="flex justify-center mb-6">
              <TabsList className="shadow-sm rounded-full py-6">
                <TabsTrigger value="user" className="rounded-full px-4 py-2 dark:hover:bg-slate-800 dark:hover:text-white">
                  <Settings className="mr-2 h-4 w-4" /> Admin Login
                </TabsTrigger>
                <TabsTrigger value="scorekeeper" className="rounded-full px-4 py-2 dark:hover:bg-slate-800 dark:hover:text-white">
                  <Clipboard className="mr-2 h-4 w-4" />Scorekeeper
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="user">
              {!isResetPasswordMode ? (
                <Card className="dark:bg-background">
                  <CardHeader>
                    <CardTitle className="text-2xl">Login to Bombhole</CardTitle>
                    <CardDescription>Enter your admin credentials to access the dashboard</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAdminLogin} className="space-y-6">
                      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input type="email" placeholder="admin@example.com" value={email} onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} required disabled={!isLoaded || isLoading} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Password</label>
                        <PasswordField placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={!isLoaded || isLoading} />
                      </div>
                      <Button type="submit" className="w-full bg-[#D35400] hover:bg-[#FF8C00] mt-2" disabled={!isLoaded || isLoading || !email || !password}>
                        {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in...</> : 'Sign In'}
                      </Button>
                      <div className="text-center mt-4">
                        <Button variant="link" type="button" onClick={() => setIsResetPasswordMode(true)} disabled={!isLoaded || isLoading}>Forgot password?</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-2xl">
                      <Button variant="ghost" size="sm" className="mr-2 p-0" onClick={resetPasswordFlow}><ArrowLeft className="h-4 w-4" /></Button>
                      {resetStep === 'email' && 'Reset Password'}
                      {resetStep === 'code' && 'Verify Code'}
                      {resetStep === 'password' && 'Set New Password'}
                    </CardTitle>
                    <CardDescription>
                      {resetStep === 'email' && 'Enter your email to receive a password reset link'}
                      {resetStep === 'code' && 'Enter the 6-digit code sent to your email'}
                      {resetStep === 'password' && 'Create a new password for your account'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {resetStep === 'email' && (
                      <form onSubmit={handleResetPasswordSubmit} className="space-y-6">
                        <div className="flex flex-col gap-2">
                          <label htmlFor="reset-email" className="text-sm font-medium">Email</label>
                          <Input id="reset-email" type="email" placeholder="you@example.com" className="w-full" value={resetEmail} onChange={(e: ChangeEvent<HTMLInputElement>) => setResetEmail(e.target.value)} required disabled={isSubmittingReset} />
                        </div>
                        <Button type="submit" className="w-full bg-[#D35400] hover:bg-[#FF8C00] mt-2" disabled={isSubmittingReset || !resetEmail}>
                          {isSubmittingReset ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}Send Reset Code
                        </Button>
                      </form>
                    )}
                    {resetStep === 'code' && (
                      <form onSubmit={handleCodeVerification} className="space-y-6">
                        <div className="flex flex-col gap-2">
                          <label htmlFor="verification-code" className="text-sm font-medium">Verification Code</label>
                          <Input id="verification-code" type="text" placeholder="123456" className="w-full text-center text-lg tracking-widest" value={verificationCode} onChange={(e: ChangeEvent<HTMLInputElement>) => setVerificationCode(e.target.value)} maxLength={6} required disabled={isLoading} />
                        </div>
                        <Button type="submit" className="w-full bg-[#D35400] hover:bg-[#FF8C00] mt-2" disabled={isLoading || verificationCode.length !== 6}>
                          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Key className="mr-2 h-4 w-4" />}Verify Code
                        </Button>
                        <div className="text-center mt-4">
                          <Button variant="link" type="button" onClick={() => setResetStep('email')} disabled={isLoading}>Resend code</Button>
                        </div>
                      </form>
                    )}
                    {resetStep === 'password' && (
                      <form onSubmit={handleNewPasswordSubmit} className="space-y-6">
                        <div className="flex flex-col gap-2">
                          <label htmlFor="new-password" className="text-sm font-medium">New Password</label>
                          <PasswordField id="new-password" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required disabled={isLoading} />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label htmlFor="confirm-password" className="text-sm font-medium">Confirm Password</label>
                          <PasswordField id="confirm-password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={isLoading} />
                        </div>
                        <Button type="submit" className="w-full bg-[#D35400] hover:bg-[#FF8C00] mt-2" disabled={isLoading || !newPassword || !confirmPassword}>
                          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LockKeyhole className="mr-2 h-4 w-4" />}Reset Password
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="scorekeeper">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Scorekeeper Login</CardTitle>
                  <CardDescription>Enter your assigned credentials</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium">Username</label>
                      <Input placeholder="scorekeeper_username" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium">PIN</label>
                      <Input type="password" placeholder="••••" />
                    </div>
                    <Button type="submit" className="w-full mt-2">Login</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <div className="lg:col-span-3 bg-[#2D1B4A] rounded-xl shadow-lg overflow-hidden hidden lg:block">
          <div className="p-8 flex flex-col h-full justify-center">
            <div className="mb-6 flex items-center">
              <div className="h-12 w-12 bg-[#D35400] rounded-full flex items-center justify-center">
                <span className="font-bold text-white text-2xl">B</span>
              </div>
              <h1 className="font-bold text-3xl text-white ml-3">Bombhole</h1>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">The Ultimate Bombhole Scoring Solution</h2>
            <p className="text-gray-300 mb-6">Manage your Bombhole games with our powerful scoring system.</p>
            <ul className="space-y-4 text-white">
              <li className="flex items-center"><span className="h-8 w-8 bg-[#D35400] rounded-full flex items-center justify-center mr-3">✓</span>Real-time scoring updates</li>
              <li className="flex items-center"><span className="h-8 w-8 bg-[#D35400] rounded-full flex items-center justify-center mr-3">✓</span>Customizable game segments</li>
              <li className="flex items-center"><span className="h-8 w-8 bg-[#D35400] rounded-full flex items-center justify-center mr-3">✓</span>QR code registration</li>
              <li className="flex items-center"><span className="h-8 w-8 bg-[#D35400] rounded-full flex items-center justify-center mr-3">✓</span>TV display integration</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

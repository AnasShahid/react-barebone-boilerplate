import { useState, useCallback } from 'react';
import { useSignIn, useSignUp, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

interface ClerkError {
  message: string;
  longMessage?: string;
  code?: string;
  meta?: { paramName?: string };
}

interface ClerkErrorResponse {
  errors?: ClerkError[];
}

interface AuthResult {
  success: boolean;
  error?: string;
  status?: string;
  message?: string;
  needsNewPassword?: boolean;
  complete?: boolean;
  errors?: ClerkError[];
}

interface UserData {
  emailAddress: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
}

interface InviteData {
  token?: string;
  email?: string;
  [key: string]: unknown;
}

export const useClerkAuth = () => {
  const { signIn, isLoaded, setActive } = useSignIn();
  const { signUp, isLoaded: signUpLoaded, setActive: setSignUpActive } = useSignUp();
  const { user } = useUser();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signInWithEmailAndPassword = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      if (!isLoaded) return { success: false, error: 'Auth not loaded' };

      setIsLoading(true);
      setError(null);

      try {
        const result = await signIn!.create({ identifier: email, password });

        if (result.status === 'complete') {
          await setActive!({ session: result.createdSessionId });
          navigate('/landing', { replace: true });
          return { success: true };
        } else {
          return { success: false, error: 'Authentication incomplete' };
        }
      } catch (err) {
        const clerkErr = err as ClerkErrorResponse;
        setError(clerkErr.errors?.[0]?.message ?? 'Sign in failed');
        return { success: false, error: clerkErr.errors?.[0]?.message ?? 'Sign in failed' };
      } finally {
        setIsLoading(false);
      }
    },
    [signIn, setActive, isLoaded, navigate]
  );

  const resetPassword = useCallback(
    async (email: string): Promise<AuthResult | undefined> => {
      if (!isLoaded) return;

      setIsLoading(true);
      setError(null);

      try {
        await signIn!.create({ identifier: email });

        const firstFactor = signIn!.supportedFirstFactors?.find(
          (factor) => factor.strategy === 'reset_password_email_code'
        );

        if (firstFactor && firstFactor.strategy === 'reset_password_email_code') {
          await signIn!.prepareFirstFactor({
            strategy: 'reset_password_email_code',
            emailAddressId: firstFactor.emailAddressId,
          });
          return { success: true, message: 'Password reset email sent' };
        }
      } catch (err) {
        const clerkErr = err as ClerkErrorResponse;
        setError(clerkErr.errors?.[0]?.message ?? 'Password reset failed');
        return { success: false, error: clerkErr.errors?.[0]?.message ?? 'Password reset failed' };
      } finally {
        setIsLoading(false);
      }
    },
    [signIn, isLoaded]
  );

  const verifyResetCode = useCallback(
    async (code: string): Promise<AuthResult | undefined> => {
      if (!isLoaded) return;

      setIsLoading(true);
      setError(null);

      try {
        const result = await signIn!.attemptFirstFactor({
          strategy: 'reset_password_email_code',
          code,
        });

        if (result.status === 'needs_new_password') {
          return { success: true, needsNewPassword: true };
        } else if (result.status === 'complete') {
          await setActive!({ session: result.createdSessionId });
          return { success: true, complete: true };
        }

        return { success: false, error: 'Verification failed' };
      } catch (err) {
        const clerkErr = err as ClerkErrorResponse;
        setError(clerkErr.errors?.[0]?.message ?? 'Invalid verification code');
        return { success: false, error: clerkErr.errors?.[0]?.message ?? 'Invalid verification code' };
      } finally {
        setIsLoading(false);
      }
    },
    [signIn, setActive, isLoaded]
  );

  const setNewPassword = useCallback(
    async (password: string): Promise<AuthResult | undefined> => {
      if (!isLoaded) return;

      setIsLoading(true);
      setError(null);

      try {
        const result = await signIn!.resetPassword({ password });

        if (result.status === 'complete') {
          await setActive!({ session: result.createdSessionId });
          navigate('/dashboard');
          return { success: true, message: 'Password reset successfully' };
        }

        return { success: false, error: 'Failed to reset password' };
      } catch (err) {
        const clerkErr = err as ClerkErrorResponse;
        setError(clerkErr.errors?.[0]?.message ?? 'Failed to reset password');
        return { success: false, error: clerkErr.errors?.[0]?.message ?? 'Failed to reset password' };
      } finally {
        setIsLoading(false);
      }
    },
    [signIn, setActive, isLoaded, navigate]
  );

  const createSignUp = useCallback(
    async (userData: UserData, inviteData: InviteData | null = null): Promise<AuthResult> => {
      if (!signUpLoaded || !signUp) return { success: false, error: 'Not loaded' };

      setIsLoading(true);
      setError(null);

      try {
        const unsafeMetadata: Record<string, unknown> = {};
        if (inviteData) {
          unsafeMetadata.inviteToken = inviteData.token;
        }

        const result = await signUp.create({
          emailAddress: userData.emailAddress,
          password: userData.password,
          firstName: userData.firstName,
          lastName: userData.lastName,
          username: userData.username,
          unsafeMetadata,
        });

        if (result.status === 'complete') {
          await setSignUpActive!({ session: result.createdSessionId });
          navigate('/landing', { replace: true });
          return {
            success: true,
            status: 'SIGNED_IN',
            message: inviteData
              ? 'Account created and invite accepted successfully!'
              : 'Account created successfully!',
          };
        } else if (result.status === 'missing_requirements') {
          if (result.unverifiedFields.includes('email_address')) {
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
            return {
              success: true,
              status: 'NEEDS_EMAIL_VERIFICATION',
              message: 'Please check your email and enter the verification code to complete signup.',
            };
          } else {
            return {
              success: false,
              status: 'ERROR',
              error: `Missing required fields: ${result.missingFields.join(', ')}`,
            };
          }
        } else {
          return {
            success: false,
            status: 'ERROR',
            error: `Signup failed with status: ${result.status}`,
          };
        }
      } catch (err) {
        const clerkErr = err as ClerkErrorResponse;
        const errorMessage = clerkErr.errors?.[0]?.message ?? 'Signup failed';
        setError(errorMessage);
        return {
          success: false,
          status: 'ERROR',
          error: errorMessage,
          errors: clerkErr.errors,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [signUpLoaded, signUp, setSignUpActive, navigate]
  );

  const verifyEmailCode = useCallback(
    async (code: string): Promise<AuthResult> => {
      if (!signUpLoaded || !signUp) return { success: false, error: 'Not loaded' };

      setIsLoading(true);
      setError(null);

      try {
        const result = await signUp.attemptEmailAddressVerification({ code });

        if (result.status === 'complete') {
          await setSignUpActive!({ session: result.createdSessionId });
          navigate('/landing', { replace: true });
          return {
            success: true,
            status: 'SIGNED_IN',
            message: 'Email verified successfully! Welcome to the platform.',
          };
        } else {
          return {
            success: false,
            status: 'ERROR',
            error: `Email verification failed with status: ${result.status}`,
          };
        }
      } catch (err) {
        const clerkErr = err as ClerkErrorResponse;
        const errorMessage = clerkErr.errors?.[0]?.message ?? 'Email verification failed';
        setError(errorMessage);
        return {
          success: false,
          status: 'ERROR',
          error: errorMessage,
          errors: clerkErr.errors,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [signUpLoaded, signUp, setSignUpActive, navigate]
  );

  return {
    signInWithEmailAndPassword,
    resetPassword,
    verifyResetCode,
    setNewPassword,
    createSignUp,
    verifyEmailCode,
    isLoading,
    error,
    isSignedIn: user,
    isLoaded: isLoaded && signUpLoaded,
  };
};

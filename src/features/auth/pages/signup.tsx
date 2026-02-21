import { SignupForm } from '@/features/auth/components/signup-form';
import { SEO } from '@/components/seo';

export function SignupPage() {
  return (
    <>
      <SEO title="Create an account" />
      <div className="flex items-center justify-center min-h-[calc(100vh-1px)] p-4">
        <div className="w-full max-w-md space-y-4">
          <SignupForm />
        </div>
      </div>
    </>
  );
}

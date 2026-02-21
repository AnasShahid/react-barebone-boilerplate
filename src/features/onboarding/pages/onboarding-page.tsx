import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SEO } from '@/components/seo';

export function OnboardingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <SEO title="Welcome to React-boilerplate" description="User onboarding and account setup." />
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="content-container max-w-[450px] mx-auto">
          <h1 className="text-3xl font-bold">{t('onboarding.stepOne.title')}</h1>
          <p className="mt-2 text-sm">{t('onboarding.stepOne.description')}</p>
          <p className="mt-3 text-sm">{t('onboarding.stepOne.secondaryDescription')}</p>
          <Button
            onClick={() => navigate('/onboarding/create-org')}
            variant="default"
            className="mt-5"
          >
            {t('onboarding.stepOne.button')} <ArrowRight />
          </Button>
        </div>
      </div>
    </>
  );
}

import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SEO } from '@/components/seo';

export const WelcomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/dashboard');
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <SEO
        title="You're all set!"
        description="You have completed basic steps to get started with React-boilerplate."
      />
      <div className="content-container max-w-[450px] mx-auto">
        <h1 className="text-3xl font-bold">{t('onboarding.welcome.title')}</h1>
        <p className="mt-2 text-sm">{t('onboarding.welcome.description')}</p>
        <p className="mt-2 text-sm">{t('onboarding.welcome.secondaryDescription')}</p>
        <Button onClick={handleStart} variant="default" className="mt-5">
          {t('onboarding.welcome.action')} <ArrowRight />
        </Button>
      </div>
    </div>
  );
};

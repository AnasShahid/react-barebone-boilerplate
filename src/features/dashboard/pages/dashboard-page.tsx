import { useTranslation } from 'react-i18next';
import { SEO } from '@/components/seo';

export default function DashboardPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto py-12">
      <SEO title="Dashboard" description="Dashboard page" />
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t('dashboard.title')}</h1>
        <p className="text-xl text-muted-foreground">{t('dashboard.subtitle')}</p>
      </div>
      <div className="flex flex-wrap justify-center gap-8"></div>
    </div>
  );
}

import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-4">{t('home.title')}</h1>
        <p className="text-xl text-muted-foreground mb-8">{t('home.subtitle')}</p>
        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link to="/auth/signup">{t('home.getStarted')}</Link>
          </Button>
          <Button variant="outline">{t('home.learnMore')}</Button>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-3xl font-bold text-center mb-8">{t('home.features.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="p-6 rounded-lg border bg-card text-card-foreground">
            <h3 className="text-lg font-semibold mb-2">{t('home.features.javascript')}</h3>
            <p className="text-muted-foreground">Type-safe development with Javascript</p>
          </div>
          <div className="p-6 rounded-lg border bg-card text-card-foreground">
            <h3 className="text-lg font-semibold mb-2">{t('home.features.components')}</h3>
            <p className="text-muted-foreground">Beautiful and accessible components</p>
          </div>
          <div className="p-6 rounded-lg border bg-card text-card-foreground">
            <h3 className="text-lg font-semibold mb-2">{t('home.features.themes')}</h3>
            <p className="text-muted-foreground">Switch between light and dark modes</p>
          </div>
          <div className="p-6 rounded-lg border bg-card text-card-foreground">
            <h3 className="text-lg font-semibold mb-2">{t('home.features.i18n')}</h3>
            <p className="text-muted-foreground">Multi-language support</p>
          </div>
        </div>
      </div>
    </div>
  );
}

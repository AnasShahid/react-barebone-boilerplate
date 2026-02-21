import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export function UnauthorizedPage() {
  const { t } = useTranslation();

  return (
    <div className="container flex h-[calc(100vh-4rem)] items-center justify-center">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="flex flex-col gap-2">
            <span className="text-7xl font-bold text-primary">401</span>
            <span className="text-2xl">{t('error.unauthorized.title')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{t('error.unauthorized.description')}</p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button asChild variant="outline">
            <Link to="/">{t('error.action.backHome')}</Link>
          </Button>
          <Button asChild>
            <Link to="/login">{t('error.action.login')}</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

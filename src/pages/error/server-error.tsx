import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

export function ServerErrorPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="container flex h-[calc(100vh-4rem)] items-center justify-center">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="flex flex-col gap-2">
            <span className="text-7xl font-bold text-primary">500</span>
            <span className="text-2xl">{t('error.serverError.title')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{t('error.serverError.description')}</p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button asChild variant="outline">
            <Link to="/">{t('error.action.backHome')}</Link>
          </Button>
          <Button onClick={() => navigate(0)}>{t('error.action.tryAgain')}</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

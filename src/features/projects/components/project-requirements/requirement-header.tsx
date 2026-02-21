import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const RequirementHeader = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col">
        <CardTitle>{t('projects.requirements.title')}</CardTitle>
        <CardDescription>
          {t('projects.requirements.description')}
        </CardDescription>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate('requirements')}
      >
        <ArrowRight className="mr-1 h-4 w-4" />
        View All Requirements
      </Button>
    </div>
  );
};

export default RequirementHeader;

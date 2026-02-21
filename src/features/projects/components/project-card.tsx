import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export const ProjectCard = ({ project, onViewProject, onDeleteProject }) => {
  const { t } = useTranslation();

  const getProjectTypeBadge = () => {
    const typeMap = {
      'partnership': { variant: 'outline', label: t('projects.type.partnership', 'Partnership') },
      'internal': { variant: 'secondary', label: t('projects.type.internal', 'Internal') },
      'client': { variant: 'default', label: t('projects.type.client', 'Client') },
    };

    return typeMap[project.project_type] || { variant: 'outline', label: project.project_type };
  };

  const getPaymentFrequencyLabel = () => {
    const frequencyMap = {
      'milestone_bound': t('projects.paymentFrequency.milestoneBound', 'Milestone Bound'),
      'monthly': t('projects.paymentFrequency.monthly', 'Monthly'),
      'weekly': t('projects.paymentFrequency.weekly', 'Weekly'),
    };

    return frequencyMap[project.payment_frequency] || project.payment_frequency;
  };

  const typeBadge = getProjectTypeBadge();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold tracking-tight">{project.name || "Unnamed Project"}</h3>
            </div>
            <div className="flex items-center space-x-2">
              <div className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                {typeBadge.label}
              </div>
            </div>
          </div>
        </CardTitle>
        {project.customer && (
          <CardDescription className="whitespace-nowrap overflow-hidden text-ellipsis max-w-full block">
            {t('projects.customer', 'Customer')}: {project.customer.name}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">{t('projects.paymentFrequency', 'Payment Frequency')}</span>
                <span className="text-sm font-medium">{getPaymentFrequencyLabel()}</span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">{t('projects.projectType', 'Project Type')}</span>
                <span className="text-sm font-medium">{typeBadge.label}</span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">{t('projects.startDate', 'Start Date')}</span>
                <span className="text-sm font-medium">
                  {project.start_date
                    ? format(new Date(project.start_date), 'MMM d, yyyy')
                    : t('common.notSet', 'Not set')}
                </span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">{t('projects.plannedEndDate', 'End Date')}</span>
                <span className="text-sm font-medium">
                  {project.planned_end_date
                    ? format(new Date(project.planned_end_date), 'MMM d, yyyy')
                    : t('common.notSet', 'Not set')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">{t('projects.actions.delete', 'Delete')}</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('projects.deleteConfirm', 'Are you sure you want to delete this project?')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('projects.deleteWarning', 'This action cannot be undone. This will permanently delete the project {name} and all associated data.', {
                  name: project?.name
                })}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('common.cancel', 'Cancel')}</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDeleteProject && onDeleteProject(project)} className="bg-destructive hover:bg-destructive/90">
                {t('common.delete', 'Delete')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <Button onClick={() => onViewProject && onViewProject(project)}>
          {t('projects.actions.view', 'View Project')}
        </Button>
      </CardFooter>
    </Card>
  );
};

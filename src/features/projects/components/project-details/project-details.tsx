import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { UserPen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { InlineEditableField } from '../../components/inline-editable-field';
import { Skeleton } from '@/components/ui/skeleton';

export const ProjectDetails = ({ 
  project, 
  isLoading, 
  handleFieldUpdate, 
  isUpdating,
  setIsCustomerModalOpen,
  projectTypesOptions,
  paymentFrequencyOptions
}) => {
  const { t } = useTranslation();

  const PROJECT_TYPE = {
    FIXED_BID: 'fixed_bid',
    TIME_AND_MATERIAL: 'time_and_material',
    PARTNERSHIP: 'partnership',
  };

  const getProjectTypeLabel = (typeValue) => {
    const typeMap = {
      [PROJECT_TYPE.FIXED_BID]: t('projects.type.fixedBid'),
      [PROJECT_TYPE.TIME_AND_MATERIAL]: t('projects.type.timeAndMaterial'),
      [PROJECT_TYPE.PARTNERSHIP]: t('projects.type.partnership'),
    };
    return typeMap[typeValue] || typeValue || t('projects.type.unknown');
  };

  const getPaymentFrequencyLabel = () => {
    const frequencyMap = {
      'milestone_bound': t('projects.paymentFrequencies.milestoneBound'),
      'monthly': t('projects.paymentFrequencies.monthly'),
      'weekly': t('projects.paymentFrequencies.weekly'),
    };

    return frequencyMap[project.payment_frequency] || project.payment_frequency;
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Skeleton className="h-48 w-full rounded-lg" />
          </div>
          <div className="md:col-span-2">
            <Skeleton className="h-12 w-full mb-4 rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        </div>
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  return (
    <>
      <div className='space-y-6 mb-2'>
        <div className="flex flex-row gap-2">
          <div className="flex flex-row gap-2 items-center">
            <h1 className="text-2xl font-bold">
              {project.name}
            </h1>
          </div>
        </div>
      </div>
      <div className="grid w-full items-center gap-2">
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
          {/* Left Column for Project Details */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground mb-1">{t('projects.paymentFrequencyLabel')}</span>
              <InlineEditableField
                value={project.payment_frequency}
                displayValue={getPaymentFrequencyLabel()}
                type="select"
                options={paymentFrequencyOptions}
                onSave={handleFieldUpdate}
                fieldName="payment_frequency"
                placeholder={t('projects.selectPaymentFrequency')}
              />
            </div>

            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground mb-1">{t('projects.projectType')}</span>
              <InlineEditableField
                value={project.project_type}
                displayValue={getProjectTypeLabel(project.project_type)}
                type="select"
                options={projectTypesOptions}
                onSave={handleFieldUpdate}
                fieldName="project_type"
                placeholder={t('projects.selectProjectType')}
              />
            </div>

            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground mb-1">{t('projects.startDate')}</span>
              <InlineEditableField
                value={project.start_date}
                displayValue={project.start_date ? format(new Date(project.start_date), 'MMM d, yyyy') : t('common.notSet')}
                type="date"
                onSave={handleFieldUpdate}
                fieldName="start_date"
              />
            </div>

            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground mb-1">{t('projects.plannedEndDate')}</span>
              <InlineEditableField
                value={project.planned_end_date}
                displayValue={project.planned_end_date ? format(new Date(project.planned_end_date), 'MMM d, yyyy') : t('common.notSet')}
                type="date"
                onSave={handleFieldUpdate}
                fieldName="planned_end_date"
              />
            </div>
          </div>
          {/* Right Column for Customer Details */}
          <div className="flex-1 flex flex-col pt-4 sm:pt-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-muted-foreground">{t('projects.customer')}</span>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => setIsCustomerModalOpen(true)}
                disabled={isUpdating}
              >
                <UserPen className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex items-start mt-2">
              <div className="mr-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={project?.customer?.logo} alt={project?.customer?.name} />
                  <AvatarFallback>{getInitials(project?.customer?.name)}</AvatarFallback>
                </Avatar>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-lg font-bold">{project?.customer?.name}</h1>
                </div>
                <div className='flex flex-row gap-3 text-gray-500 text-sm'>
                  <span>{project?.customer?.primary_email || t("customers.noEmailProvided")}</span>
                  {' | '}
                  <span>{project?.customer?.primary_phone || t("customers.noPhoneProvided")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

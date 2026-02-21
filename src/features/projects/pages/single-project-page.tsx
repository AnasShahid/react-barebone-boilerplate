import { useEffect, useState } from 'react';
import { SEO } from '@/components/seo';
import { useParams } from 'react-router-dom';
import { useGetProjectByIdQuery, useUpdateProjectMutation } from '../services';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { SelectCustomerModal } from '../components/select-customer-modal';
import { ProjectHeader, ProjectDetails, ProjectTabs } from '../components';



export const SingleProjectPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { data: project, isLoading, refetch } = useGetProjectByIdQuery(id);
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  useEffect(() => {
    refetch();
  }, [refetch, id]);

  const PROJECT_TYPE = {
    FIXED_BID: 'fixed_bid',
    TIME_AND_MATERIAL: 'time_and_material',
    PARTNERSHIP: 'partnership',
  };

  const PAYMENT_FREQUENCY = {
    MILESTONE_BOUND: 'milestone_bound',
    MONTHLY: 'monthly',
    WEEKLY: 'weekly',
  };

  const projectTypesOptions = [
    { value: PROJECT_TYPE.FIXED_BID, label: t('projects.type.fixedBid') },
    { value: PROJECT_TYPE.TIME_AND_MATERIAL, label: t('projects.type.timeAndMaterial') },
    { value: PROJECT_TYPE.PARTNERSHIP, label: t('projects.type.partnership') },
  ];

  const paymentFrequencyOptions = [
    { value: PAYMENT_FREQUENCY.MILESTONE_BOUND, label: t('projects.paymentFrequencies.milestoneBound') },
    { value: PAYMENT_FREQUENCY.MONTHLY, label: t('projects.paymentFrequencies.monthly') },
    { value: PAYMENT_FREQUENCY.WEEKLY, label: t('projects.paymentFrequencies.weekly') },
  ];

  const handleFieldUpdate = async (fieldName, fieldValue) => {
    try {
      await updateProject({
        id,
        data: { [fieldName]: fieldValue }
      }).unwrap();
      toast.success(t(`projects.${fieldName}Updated`), {
        description: t(`projects.${fieldName}UpdateSuccess`)
      });
      refetch();
    } catch (error) {
      console.error(`Failed to update project ${fieldName}:`, error);
      toast.error(t(`projects.${fieldName}UpdateFailed`), {
        description: t('common.error')
      });
    }
  };

  return (
    <>
      <SEO title={t('projects.overview.title')} description={t('projects.overview.description')} />
      <div className="mx-auto w-full mb-4 mt-4">
        <ProjectHeader projectId={id} />
        
        {isLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <div className="h-48 w-full rounded-lg bg-gray-200 animate-pulse" />
              </div>
              <div className="md:col-span-2">
                <div className="h-12 w-full mb-4 rounded-lg bg-gray-200 animate-pulse" />
                <div className="h-32 w-full rounded-lg bg-gray-200 animate-pulse" />
              </div>
            </div>
            <div className="h-64 w-full rounded-lg bg-gray-200 animate-pulse" />
          </div>
        ) : project && (
          <ProjectDetails 
            project={project}
            isLoading={isLoading}
            handleFieldUpdate={handleFieldUpdate}
            isUpdating={isUpdating}
            setIsCustomerModalOpen={setIsCustomerModalOpen}
            projectTypesOptions={projectTypesOptions}
            paymentFrequencyOptions={paymentFrequencyOptions}
          />
        )}
      </div>

      {project && (
        <ProjectTabs 
          projectId={id} 
        />
      )}

      <SelectCustomerModal
        open={isCustomerModalOpen}
        onOpenChange={setIsCustomerModalOpen}
        onSelectCustomer={(customer) => handleFieldUpdate('customer_id', customer.id)}
        currentCustomerId={project?.customer?.id}
      />
    </>
  );
};

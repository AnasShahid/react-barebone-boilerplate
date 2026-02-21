import { SEO } from '@/components/seo';
import { ResourcesPageHeader } from '@/components/resources-page-header';
import { AddConfigTemplateSheet, ConfigTemplateCard } from '@/features/config-templates/components';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, FrownIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useGetAllConfigTemplatesQuery } from '@/features/config-templates/services';

export const ConfigTemplatesListPage = () => {
  const { t } = useTranslation();
  const { data, isLoading, refetch } = useGetAllConfigTemplatesQuery();
  const configTemplates = data?.configTemplates ?? [];

  const handleConfigTemplateAdded = () => { refetch(); };

  const renderConfigTemplateCards = () => {
    if (!configTemplates || configTemplates.length === 0) {
      return (
        <div className="col-span-full flex flex-col items-center justify-center py-12 px-4">
          <FrownIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Configuration Templates Found</h3>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            You haven&apos;t created any configuration templates yet. Create your first one to get started.
          </p>
          <AddConfigTemplateSheet
            triggerButton={
              <Button variant="default">
                <Plus className="mr-2 h-4 w-4" />
                {t("config-templates.addConfigTemplate", "Add Config Template")}
              </Button>
            }
            onConfigTemplateAdded={handleConfigTemplateAdded}
          />
        </div>
      );
    }

    return configTemplates.map((configTemplate) => (
      <ConfigTemplateCard key={configTemplate.id} configTemplate={configTemplate} />
    ));
  };

  return (
    <>
      <SEO
        title={t("config-templates.title", "Configuration Templates")}
        description={t("config-templates.description", "Manage configuration templates for your organization's projects.")}
      />
      <ResourcesPageHeader
        title={t("config-templates.title", "Configuration Templates")}
        action={
          <div className="flex items-center gap-4">
            <AddConfigTemplateSheet
              triggerButton={
                <Button variant="default" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  {t("config-templates.addConfigTemplate", "Add Config Template")}
                </Button>
              }
              onConfigTemplateAdded={handleConfigTemplateAdded}
            />
          </div>
        }
      />
      <div className="mt-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderConfigTemplateCards()}
          </div>
        )}
      </div>
    </>
  );
};

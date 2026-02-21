import { useGetProjectRequirementsQuery, useGetProjectByIdQuery } from "../services";
import RequirementsList from "../components/project-requirements/requirements-list";
import { useEffect, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { SEO } from '@/components/seo';
import { useTranslation } from "react-i18next";
import CreateRequirementModal from "../components/project-requirements/create-requirement-modal";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Plus, MousePointerClick } from "lucide-react";
import RequirementDetails from "../components/project-requirements/requirement-details";
import {
  Card,
  CardContent,
} from '@/components/ui/card';

export const RequirementsPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const requirementIdFromUrl = searchParams.get('requirementId');
  

  const { data: project, isLoading: isLoadingProject } = useGetProjectByIdQuery(id, {
    skip: !id,
  });

  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: requirementsData, isLoading: isLoadingRequirements, refetch } = useGetProjectRequirementsQuery(id);

  useEffect(() => {
    if (id && !requirementsData) {
      refetch();
    }
  }, [id, requirementsData, refetch]);

  useEffect(() => {
    if (requirementIdFromUrl && requirementsData) {
      const foundRequirement = requirementsData.find(req => req.id === requirementIdFromUrl);
      if (foundRequirement) {
        setSelectedRequirement(foundRequirement);
      }
    }
  }, [requirementIdFromUrl, requirementsData]);

  const handleDeleteRequirement = () => {
    setSelectedRequirement(null);
    refetch();
  };

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  return (
    <div>
      <SEO title={t('projects.requirements.title')} description={t('projects.requirements.description')} />

      {project && !isLoadingProject && (
        <Breadcrumb className="mb-4 mt-2">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/projects">{t('projects.allProjects', 'Projects')}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={`/projects/${id}`}>{project.name}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t('projects.requirements.title', 'Requirements')}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )}

      {/* <ResourcesPageHeader
        title={t('projects.requirements.title', 'Requirements')}
        description={t('projects.requirements.description', 'Manage your project requirements here')}
        action={
          <Button
            variant="default"
            size="sm"
            onClick={openCreateModal}
          >
            <PlusIcon className="mr-1 h-4 w-4" />
            {t('projects.requirements.addRequirementButton')}
          </Button>
        }
      /> */}

      <div className="flex flex-row gap-2">
        <RequirementsList
          requirements={requirementsData}
          onSelectRequirement={(requirement) => { setSelectedRequirement(requirement) }}
          isLoading={isLoadingRequirements}
          projectId={id}
          selectedRequirement={selectedRequirement}
        />
        {selectedRequirement && (
          <RequirementDetails
            selectedRequirement={selectedRequirement}
            onAddRequirement={() => { }}
            onEditRequirement={() => { }}
            onDeleteRequirement={handleDeleteRequirement}
            isLoading={isLoadingRequirements}
            projectId={id}
          />
        )}
        {!selectedRequirement && (
          <Card className="flex-1 max-w-[75%]">
            <CardContent className="flex flex-col items-center justify-center h-full">
              <MousePointerClick className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-center text-muted-foreground">
                {t('projects.requirements.noRequirementSelected')}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={openCreateModal}
              >
                <Plus className="mr-1 h-4 w-4" />
                {t('projects.requirements.addRequirementButton')}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Requirement Modal */}
      <CreateRequirementModal
        projectId={id}
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onSuccess={refetch}
      />
    </div>
  );
};

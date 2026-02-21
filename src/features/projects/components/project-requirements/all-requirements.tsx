import { 
  useGetProjectRequirementsQuery, 
  useDeleteProjectRequirementsMutation,
} from "@/features/projects/services";
import {
  selectProjectRequirements,
  selectProjectRequirementsLoading,
  selectProjectRequirementsError
} from '@/features/projects/store/requirements-selectors';
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, ArrowRight, DotIcon, PlusIcon, FileMinus, Eye, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { RequirementItemSkeleton } from "./requirement-item-skeleton";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"; 
import { toast } from "sonner";
import CreateRequirementModal from "./create-requirement-modal";

export const AllRequirements = ({ projectId }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  // RTK Query hook for API calls
  const { isLoading: apiIsLoading, refetch } = useGetProjectRequirementsQuery(projectId);
  
  // Redux selectors for accessing cached data
  const requirements = useSelector(state => selectProjectRequirements(state, projectId));
  const isLoadingRequirements = useSelector(state => selectProjectRequirementsLoading(state, projectId));
  const requirementsError = useSelector(state => selectProjectRequirementsError(state, projectId));
  const [deleteProjectRequirement, { isLoading: isDeletingRequirement }] = useDeleteProjectRequirementsMutation();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [requirementToDelete, setRequirementToDelete] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleViewRequirement = (requirementId) => {
    navigate({ pathname: "requirements", search: `?requirementId=${requirementId}` });
  };

  const openDeleteDialog = (requirement) => {
    setRequirementToDelete(requirement);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setRequirementToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  const handleDeleteRequirementConfirmed = async () => {
    if (!requirementToDelete) return;

    try {
      await deleteProjectRequirement({
        id: requirementToDelete.id,
        projectId // Include projectId for optimistic updates
      }).unwrap();
      toast.success(t('projects.requirements.notifications.deleteSuccess', { name: requirementToDelete.name }));
      refetch();
      closeDeleteDialog();
    } catch (error) {
      console.error("Failed to delete requirement:", error);
      toast.error(t('projects.requirements.notifications.deleteError', { name: requirementToDelete.name }));
      // Optionally, keep dialog open or handle error specifically
    }
  };

  // Combined loading state
  const isLoading = isLoadingRequirements || apiIsLoading || isDeletingRequirement;

  // Show error if there's an issue loading requirements
  if (requirementsError && !isLoading) {
    return (
      <Card className="p-4">
        <div className="text-red-500">
          {t('projects.requirements.notifications.loadError')}
          <Button onClick={refetch} className="ml-2">{t('common.retry')}</Button>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('projects.requirements.title')}</CardTitle>
              <CardDescription>
                {t('projects.requirements.description')}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <PlusIcon className="mr-1 h-4 w-4" />
                {t('projects.requirements.addRequirementButton')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('requirements')}
              >
                <ArrowRight className="mr-1 h-4 w-4" />
                {t('projects.requirements.viewAll')}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <ScrollArea className="h-[calc(100vh-540px)]">
              {Array(3).fill(0).map((_, index) => (
                <RequirementItemSkeleton key={index} />
              ))}
            </ScrollArea>
          ) : requirements?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-540px)] text-muted-foreground">
              <FileMinus className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-center max-w-[400px]">{t('projects.requirements.noRequirements')}</p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-540px)]">
              {requirements?.map((requirement) => (
                <div
                  key={requirement.id}
                  className="flex items-center gap-3 rounded-lg border p-3 text-left text-sm transition-all hover:bg-muted mb-2"
                >
                  <div className="mt-0.5 rounded-md p-1 bg-blue-50 flex-shrink-0">
                    <FileText className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center min-w-0">
                        <p className="font-medium leading-none truncate" title={requirement?.name}>{requirement?.name}</p>
                        <Badge variant="outline" className="ml-2 text-xs flex-shrink-0">
                          v{requirement?.version || '1.0'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span>
                        {t('projects.requirements.lastUpdated')} {format(new Date(requirement?.updatedAt || new Date()), 'MMM d, yyyy')}
                      </span>
                      <DotIcon className="h-4 w-4 text-blue-500" />
                      <span>
                        {requirement?.documents?.length} {t('projects.requirements.documents')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-auto flex-shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => handleViewRequirement(requirement.id)} title={t('common.view')}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(requirement)} className="text-destructive hover:text-destructive-foreground hover:bg-destructive/90" title={t('common.delete')}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {requirementToDelete && (
        <ConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={closeDeleteDialog}
          onConfirm={handleDeleteRequirementConfirmed}
          title={t('projects.requirements.deleteDialog.title', { name: requirementToDelete.name })}
          description={t('projects.requirements.deleteDialog.description')}
          confirmText={t('common.delete')}
          cancelText={t('common.cancel')}
          isLoading={isDeletingRequirement}
        />
      )}

      {/* Create Requirement Modal */}
      <CreateRequirementModal
        projectId={projectId}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={refetch}
      />
    </div>
  );
};

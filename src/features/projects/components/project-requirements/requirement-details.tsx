import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { MousePointerClick, Dot, Trash, EyeIcon, Pencil, Expand, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import RequirementDocuments from './requirement-documents';
import ProjectRequirementsModal from './project-requirements-modal';
import { useDeleteProjectRequirementsMutation, useGetSingleProjectRequirementQuery } from '../../services';
import { projectsApi } from '../../services';
import rehypeRaw from 'rehype-raw'

const RequirementDetails = ({
  selectedRequirement,
  onAddRequirement,
  onEditRequirement,
  onDeleteRequirement,
  onDocumentDelete,
  isLoading,
  projectId
}) => {
  const { t } = useTranslation();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteRequirementMutation, { isLoading: isDeletingRequirement }] = useDeleteProjectRequirementsMutation();
  const { data: requirement, isLoading: isSingleRequirementLoading, refetch: refetchRequirement } = useGetSingleProjectRequirementQuery(selectedRequirement?.id, { skip: !selectedRequirement?.id });
  const dispatch = useDispatch();

  const prevRequirementId = useRef(null);

  useEffect(() => {
    if (!selectedRequirement?.id && prevRequirementId.current) {
      dispatch(
        projectsApi.util.invalidateTags([
          { type: 'requirement', id: prevRequirementId.current },
        ])
      );
      prevRequirementId.current = null;
    }
  
    if (selectedRequirement?.id) {
      prevRequirementId.current = selectedRequirement.id;
    }
  }, [selectedRequirement, dispatch]);

  const handleEditRequirement = (requirementData) => {
    onEditRequirement(requirementData);
    setIsEditModalOpen(false);
  };

  const handleDeleteRequirement = async () => {
    if (!requirement) return;

    try {
      deleteRequirementMutation(requirement.id);
      onDeleteRequirement();
      setIsDeleteDialogOpen(false);
      toast.success(t('projects.requirements.requirementDeleted'));
    } catch (error) {
      console.error('Error deleting requirement:', error);
      toast.error(t('projects.requirements.requirementDeleteError'));
    }
  };

  if (!requirement) {
    return (
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
            onClick={onAddRequirement}
          >
            <Plus className="mr-1 h-4 w-4" />
            {t('projects.requirements.addRequirementButton')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const handleUploadCompleted = () => {
    console.log('upload completed');
    refetchRequirement();
  };

  const handleDocumentDelete = () => {
    console.log('document deleted');
    refetchRequirement();
  };

  return (
    <>
      <Card className="flex-1 max-w-[75%]">
        <CardHeader className="px-4 pt-4 pb-1">
          <CardTitle>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <p className="font-medium leading-none">{requirement?.name}</p>
                  <Badge variant="outline" className="ml-2 text-xs">
                    v{requirement?.version || '1.0'}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <ProjectRequirementsModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    requirement={requirement}
                    isLoading={isLoading}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isLoading}
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    <Pencil className="mr-1 h-4 w-4" />
                    {t('projects.requirements.actions.edit')}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    disabled={isLoading || isDeletingRequirement}
                  >
                    <Trash className="mr-1 h-4 w-4" />
                    {isDeletingRequirement ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('common.deleting')}
                      </>
                    ) : (
                      t('projects.requirements.actions.delete')
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardTitle>
          <CardDescription>
            <div className="flex items-center text-xs text-muted-foreground">
              <span>
                {t('projects.requirements.lastUpdated')} {format(new Date(requirement?.updatedAt || new Date()), 'MMM d, yyyy')}
              </span>
              <Dot className="mx-2 h-2 w-2" />
              <span>
                {requirement?.documents?.length || 0} {t('projects.requirements.documentCount')}
              </span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 flex flex-col gap-2 h-[calc(100vh-300px)]">
          <div className="h-[calc(100vh-500px)] border rounded-md">
            <ScrollArea
              className={`h-[calc(100vh-500px)] px-6 py-4`}
            >
              <Markdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {requirement?.requirements_text || t('projects.requirements.noContent')}
              </Markdown>
            </ScrollArea>
          </div>
          <div className='flex-1'>
            <RequirementDocuments
              selectedRequirement={requirement}
              onDocumentDelete={handleDocumentDelete}
              isLoading={isLoading}
              requirementId={requirement?.id}
              onUploadCompleted={handleUploadCompleted}
            />
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('projects.requirements.deleteRequirement')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('projects.requirements.deleteRequirementConfirmation', { name: requirement.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingRequirement}>
              {t('common.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDeleteRequirement}
              disabled={isDeletingRequirement}
            // className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeletingRequirement ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('common.deleting')}
                </>
              ) : (
                t('common.delete')
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default RequirementDetails;

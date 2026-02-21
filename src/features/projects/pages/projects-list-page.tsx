import { useState, useEffect } from 'react';
import { ResourcesPageHeader } from '@/components/resources-page-header';
import { SEO } from '@/components/seo';
import { useTranslation } from 'react-i18next';
import { AddProjectModal, ProjectsCards } from '@/features/projects/components';
import { Button } from '@/components/ui/button';
import { Plus, Search, X } from 'lucide-react';
import { useGetAllProjectsQuery } from '@/features/projects/services';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
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

export const ProjectsListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  
  const { data, isLoading, refetch, isFetching } = useGetAllProjectsQuery({
    page,
    limit,
    search: searchQuery,
    status: statusFilter
  });

  const handleProjectAdded = () => {
    refetch();
  };

  useEffect(() => {
    refetch();
  }, [page, limit, searchQuery, statusFilter, refetch]);
  
  // Handle search input changes
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to first page when search changes
  };
  
  // Clear search
  const handleClearSearch = () => {
    setSearchQuery('');
    setPage(1);
  };
  
  // Handle pagination
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Handle view project
  const handleViewProject = (project) => {
    navigate(`/projects/${project.id}`);
  };

  // Handle delete project
  const handleDeleteProject = (project) => {
    setProjectToDelete(project);
    setShowDeleteDialog(true);
  };
  
  // Confirm delete project
  const confirmDeleteProject = () => {
    // Here you would call an API to delete the project
    // For now, let's just show a toast
    
    toast.success(t('projects.deletedMessage', '{name} has been deleted successfully', {
      name: projectToDelete?.name
    }), {
      description: t('projects.deleted', 'Project deleted')
    });
    
    setShowDeleteDialog(false);
    refetch();
  };
  
  // Cancel delete project
  const cancelDeleteProject = () => {
    setShowDeleteDialog(false);
    setProjectToDelete(null);
  };

  function renderProjectCards() {
    const projects = data || [];
    const pagination = data?.pagination || { page: 1, limit, totalPages: 0, totalItems: 0 };

    return (
      <ProjectsCards
        projects={projects}
        isLoading={isLoading || isFetching}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        page={pagination.page || page}
        limit={pagination.limit || limit}
        totalPages={pagination.totalPages || 0}
        totalItems={pagination.totalItems || 0}
        onPageChange={handlePageChange}
        onViewProject={handleViewProject}
        onDeleteProject={handleDeleteProject}
      />
    );
  }

  return (
    <>
      <SEO 
        title={t("projects.title", "Projects")} 
        description={t("projects.description", "Manage all projects for your organization.")} 
      />
      <ResourcesPageHeader 
        title={t("projects.title", "Projects")}
        subtitle={t("projects.subtitle", "Manage all projects for your organization.")} 
        action={
          <div className="flex items-center gap-4 flex-row-reverse">
            <AddProjectModal 
              triggerButton={
                <Button variant="default" size="sm">
                  <Plus className="mr-2 h-4 w-4" /> 
                  {t("projects.addProject", "Add Project")}
                </Button>
              }
              onProjectAdded={handleProjectAdded}
            />
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("common.search", "Search")}
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-8 pr-8"
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        }
      />
      <div>
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          renderProjectCards()
        )}
      </div>

      {/* Delete Project Confirmation Dialog */}
      {projectToDelete && (
        <DeleteProjectDialog
          open={showDeleteDialog}
          onCancel={cancelDeleteProject}
          onConfirm={confirmDeleteProject}
          project={projectToDelete}
          t={t}
        />
      )}
    </>
  );
};

// Delete confirmation dialog component
const DeleteProjectDialog = ({ open, onCancel, onConfirm, project, t }) => {
  return (
    <AlertDialog open={open} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t('projects.deleteConfirm', 'Are you sure you want to delete this project?')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t('projects.deleteWarning', 'This action cannot be undone. This will permanently delete the project {name} and all associated data.', {
              name: <span className="font-medium">{project?.name}</span>
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {t('common.cancel', 'Cancel')}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-destructive hover:bg-destructive/90"
          >
            {t('common.delete', 'Delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

import { useTranslation } from 'react-i18next';
import { Frown, Loader2 } from 'lucide-react';
import { ProjectCard } from './project-card';

export const ProjectsCards = ({
  projects,
  isLoading,
  searchQuery,
  statusFilter,
  page,
  limit,
  totalPages,
  totalItems,
  onPageChange,
  onViewProject,
  onDeleteProject
}) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-[220px] rounded-lg border border-border bg-card p-4 shadow-sm animate-pulse">
            <div className="flex justify-between items-start mb-4">
              <div className="h-5 w-1/2 bg-muted rounded"></div>
              <div className="h-5 w-20 bg-muted rounded-full"></div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-muted rounded"></div>
                <div className="h-4 w-3/4 bg-muted rounded"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-muted rounded"></div>
                <div className="h-4 w-2/3 bg-muted rounded"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-muted rounded"></div>
                <div className="h-4 w-1/2 bg-muted rounded"></div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-3 w-3 bg-muted rounded"></div>
                <div className="h-3 w-1/3 bg-muted rounded"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-muted rounded"></div>
                <div className="h-3 w-1/3 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <Frown className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">
          {searchQuery || statusFilter
            ? t('projects.noProjectsWithFilters', 'No projects match your filters')
            : t('projects.noProjects', 'No projects found')}
        </h3>
        <p className="text-muted-foreground mt-2 max-w-md">
          {searchQuery || statusFilter
            ? t('projects.tryAdjustingFilters', 'Try adjusting your search filters to find what you\'re looking for.')
            : t('projects.createProjectMessage', 'Create your first project to get started.')}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {isLoading && (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      
      {!isLoading && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            onViewProject={onViewProject}
            onDeleteProject={onDeleteProject}
          />
        ))}
      </div>}
      
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 text-sm">
          <div className="text-muted-foreground">
            {t('common.pagination.showing', 'Showing')} {((page - 1) * limit) + 1} - {Math.min(page * limit, totalItems)} {t('common.pagination.of', 'of')} {totalItems}
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={page === 1}
              onClick={() => onPageChange(page - 1)}
            >
              {t('common.pagination.previous', 'Previous')}
            </button>
            <button
              className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={page === totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              {t('common.pagination.next', 'Next')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

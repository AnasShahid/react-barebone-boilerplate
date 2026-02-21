import { useState, useEffect } from 'react';
import { ResourcesPageHeader } from '@/components/resources-page-header';
import { SEO } from '@/components/seo';
import { useTranslation } from 'react-i18next';
import { AddProjectModal, ProjectsCards } from '@/features/projects/components';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter, X, Grid, List, MoreHorizontal, Eye, CheckSquare, Archive, Trash2 } from 'lucide-react';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTable } from '@/components/ui/data-table';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import { createTextColumn, createDateColumn, createStatusColumn, createActionsColumn } from '@/features/data-table/utils/column-helpers.jsx';

export const ProjectsListPageV2 = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  // Initialize view mode from localStorage or default to 'table'
  const [viewMode, setViewMode] = useState(() => {
    const savedViewMode = localStorage.getItem('projects-view-mode');
    return savedViewMode || 'table'; // Default to table view
  });
  
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

  // Handle view mode change and persist to localStorage
  const handleViewModeChange = (newViewMode) => {
    setViewMode(newViewMode);
    localStorage.setItem('projects-view-mode', newViewMode);
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

  // Handle view tasks
  const handleViewTasks = (project) => {
    navigate(`/projects/${project.id}/tasks`);
  };

  // Handle archive project
  const handleArchiveProject = (project) => {
    // Here you would call an API to archive the project
    toast.success(t('projects.archivedMessage', '{name} has been archived successfully', {
      name: project?.name
    }), {
      description: t('projects.archived', 'Project archived')
    });
    refetch();
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

  // Define table columns
  const projectColumns = [
    createTextColumn('name', t('projects.name', 'Project Name')),
    {
      accessorKey: 'customer.name',
      header: t('projects.customer', 'Customer'),
      cell: ({ row }) => {
        const customer = row.original.customer;
        return <div>{customer?.name || '-'}</div>;
      },
    },
    createStatusColumn('project_type', t('projects.projectType', 'Type'), {
      partnership: { variant: 'outline', label: t('projects.type.partnership', 'Partnership') },
      internal: { variant: 'secondary', label: t('projects.type.internal', 'Internal') },
      client: { variant: 'default', label: t('projects.type.client', 'Client') },
    }),
    {
      accessorKey: 'payment_frequency',
      header: t('projects.paymentFrequency', 'Payment Frequency'),
      cell: ({ row }) => {
        const frequency = row.getValue('payment_frequency');
        const frequencyMap = {
          'milestone_bound': t('projects.paymentFrequency.milestoneBound', 'Milestone Bound'),
          'monthly': t('projects.paymentFrequency.monthly', 'Monthly'),
          'weekly': t('projects.paymentFrequency.weekly', 'Weekly'),
        };
        return <div>{frequencyMap[frequency] || frequency}</div>;
      },
    },
    createDateColumn('start_date', t('projects.startDate', 'Start Date')),
    createDateColumn('planned_end_date', t('projects.plannedEndDate', 'End Date')),
    {
      id: "actions",
      header: t('projects.actions.title', 'Actions'),
      cell: ({ row }) => {
        const project = row.original;
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewProject(project);
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                {t('projects.actions.view', 'View')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewTasks(project);
                }}
              >
                <CheckSquare className="mr-2 h-4 w-4" />
                {t('projects.actions.viewTasks', 'View Tasks')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleArchiveProject(project);
                }}
              >
                <Archive className="mr-2 h-4 w-4" />
                {t('projects.actions.archive', 'Archive')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteProject(project);
                }}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t('projects.actions.delete', 'Delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];

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

  function renderProjectTable() {
    const projects = data || [];
    
    return (
      <div className="space-y-4">
        <DataTable
          columns={projectColumns}
          data={projects}
          loading={isLoading || isFetching}
          emptyMessage={t('projects.noProjects', 'No projects found.')}
          onRowClick={handleViewProject}
          pagination={{ enabled: true, pageSize: limit }}
          sorting={{ enabled: true }}
          filtering={{ enabled: true }}
        />
      </div>
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
                <Button size="sm" className="bg-[#D35400] hover:bg-[#FF8C00] text-white cursor-pointer">
                  <Plus className="mr-2 h-4 w-4" /> 
                  {t("projects.addProject", "Add Project")}
                </Button>
              }
              onProjectAdded={handleProjectAdded}
            />
            
            {/* View Toggle */}
            <div className="flex items-center border rounded-md">
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleViewModeChange('table')}
                className="rounded-r-none"
                title={t('projects.viewMode.table', 'Table View')}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'cards' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleViewModeChange('cards')}
                className="rounded-l-none"
                title={t('projects.viewMode.cards', 'Card View')}
              >
                <Grid className="h-4 w-4" />
              </Button>
            </div>
            
            <Popover>
              <PopoverTrigger>
                <Button variant="outline" className="cursor-pointer">
                  <Filter /> Filters
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                hello
              </PopoverContent>
            </Popover>
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
          viewMode === 'cards' ? renderProjectCards() : renderProjectTable()
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

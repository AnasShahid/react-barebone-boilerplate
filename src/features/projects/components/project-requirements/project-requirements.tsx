import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { toast } from 'sonner';
import { 
  useGetProjectRequirementsQuery, 
  useDeleteProjectRequirementsMutation,
} from '../../services';

import {
  selectProjectRequirements,
  selectProjectRequirementsLoading,
  selectProjectRequirementsError
} from '../../store/requirements-selectors';

// Import individual components
import RequirementHeader from './requirement-header';
import RequirementsList from './requirements-list';
import RequirementDetails from './requirement-details';
import ProjectRequirementsModal from './project-requirements-modal';
import { Button } from '@/components/ui/button';

export const ProjectRequirements = ({ 
  projectId,
}) => {
  const { t } = useTranslation();
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // RTK Query hook for API calls
  const { 
    isLoading: apiIsLoading, 
    refetch 
  } = useGetProjectRequirementsQuery(projectId);
  
  // Redux selectors for accessing cached data
  const requirements = useSelector(state => selectProjectRequirements(state, projectId));
  const isLoadingRequirements = useSelector(state => selectProjectRequirementsLoading(state, projectId));
  const requirementsError = useSelector(state => selectProjectRequirementsError(state, projectId));
  
  const [deleteRequirement, { isLoading: isDeleting }] = useDeleteProjectRequirementsMutation();

  useEffect(() => {
    refetch();
  }, [refetch]);
  
  // Combined loading state
  const isLoading = isLoadingRequirements || apiIsLoading || isDeleting;

  // Filter requirements based on search query and filter type
  const filteredRequirements = requirements?.filter(requirement => {
    const matchesSearch = requirement?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'text') return matchesSearch && requirement?.requirements_text;
    if (filterType === 'document') return matchesSearch && requirement?.documents?.length > 0;
    
    return matchesSearch;
  });

  const handleRequirementSelect = useCallback((requirement) => {
    setSelectedRequirement(requirement);
  }, []);

  const handleAddRequirement = useCallback(() => {
    setIsAddModalOpen(true);
  }, []);

  const handleDeleteRequirement = async (requirementId) => {
    try {
      if (!requirementId) {
        throw new Error('Requirement ID is required');
      }
      
      await deleteRequirement({
        id: requirementId,
        projectId // Include projectId for optimistic updates
      }).unwrap();
      
      // If the deleted requirement was selected, clear the selection
      if (selectedRequirement?.id === requirementId) {
        setSelectedRequirement(null);
      }
      
      toast.success(t('projects.requirements.requirementDeleted'));
    } catch (error) {
      console.error('Error deleting requirement:', error);
      toast.error(t('projects.requirements.requirementDeleteError'));
    }
  };

  // Handle document operations through the API
  const handleDocumentAdd = async () => {
    // In a real implementation, this would be handled by the API
    // For now, we'll just refetch the requirements after a document is added
    refetch();
  };

  const handleDocumentDelete = async () => {
    // In a real implementation, this would be handled by the API
    // For now, we'll just refetch the requirements after a document is deleted
    refetch();
  };

  // Show error if there's an issue loading requirements
  if (requirementsError) {
    return (
      <Card className="p-4">
        <div className="text-red-500">
          Error loading requirements: {requirementsError}
          <Button onClick={refetch} className="ml-2">Retry</Button>
        </div>
      </Card>
    );
  }

  // Use filtered requirements when not loading
  const requirementData = isLoading ? [] : filteredRequirements;

  return (
    <>
      <Card className="p-0">
        <CardHeader className="pt-4 pb-2">
          <RequirementHeader onAddRequirement={handleAddRequirement} />
        </CardHeader>
        <CardContent className="flex flex-row p-2 gap-2 min-h-[calc(100vh-465px)]">
          <RequirementsList 
            requirements={requirementData} 
            selectedRequirement={selectedRequirement}
            handleRequirementSelect={handleRequirementSelect}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterType={filterType}
            setFilterType={setFilterType}
            isLoading={isLoading}
          />
          <RequirementDetails 
            selectedRequirement={selectedRequirement}
            onAddRequirement={handleAddRequirement}
            onEditRequirement={() => refetch()} // Just refetch after edit
            onDeleteRequirement={handleDeleteRequirement}
            onDocumentAdd={handleDocumentAdd}
            onDocumentDelete={handleDocumentDelete}
            isLoading={isLoading}
            projectId={projectId}
          />
        </CardContent>
      </Card>
      
      {/* Add Requirement Modal */}
      {isAddModalOpen && (
        <ProjectRequirementsModal
          isOpen={isAddModalOpen}
          onClose={() => {
            console.log('Closing modal');
            setIsAddModalOpen(false);
            refetch(); // Refetch requirements after modal is closed
          }}
          projectId={projectId}
          existingRequirements={requirements}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

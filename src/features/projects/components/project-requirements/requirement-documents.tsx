import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import DocumentItem from './document-item';
import DocumentUploadModal from './document-upload-modal';
import { useDeleteRequirementDocumentMutation } from '../../services';

const RequirementDocuments = ({ 
  selectedRequirement, 
  onDocumentDelete, 
  isLoading,
  requirementId,
  onUploadCompleted,
}) => {
  const { t } = useTranslation();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [deletingDocId, setDeletingDocId] = useState(null);
  const [deleteRequirementDocument, { isLoading: isDeletingDocument }] = useDeleteRequirementDocumentMutation();

  const handleDocumentDelete = async (documentId) => {
    if (!selectedRequirement) return;
    
    setDeletingDocId(documentId);
    
    try {
      await deleteRequirementDocument(documentId);
      onDocumentDelete(selectedRequirement.id, documentId);
      toast.success(t('projects.requirements.documentDeleted'));
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error(t('projects.requirements.documentDeleteError'));
    } finally {
      setDeletingDocId(null);
    }
  };

  const handleDocumentView = (document) => {
    // In a real implementation, you would open the document in a new tab or viewer
    if (document.url) {
      window.open(document.url, '_blank');
    } else {
      toast.error(t('projects.requirements.documentNotAvailable'));
    }
  };

  const handleUploadCompleted = () => {
    setIsUploadModalOpen(false);
    onUploadCompleted();
  };
  
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between">
        <h2 className="text-md font-medium mb-2">
          {t('projects.requirements.documents')} 
          <Badge variant="outline" className="ml-2 text-xs">
            {selectedRequirement?.documents?.length || 0}
          </Badge>
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsUploadModalOpen(true)}
          disabled={isLoading}
        >
          <Plus className="mr-1 h-4 w-4" />
          {t('projects.requirements.addDocument')}
        </Button>
      </div>
      
      <div className="mt-2">
        {!selectedRequirement?.documents?.length ? (
          <div className="flex flex-col items-center justify-center p-6 border border-dashed rounded-md text-muted-foreground">
            <FileText className="h-10 w-10 mb-2" />
            <p className="text-xs text-center">{t('projects.requirements.noDocumentsYet')}</p>
            {/* <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => setIsUploadModalOpen(true)}
            >
              <Plus className="mr-1 h-2 w-2" />
              {t('projects.requirements.addFirstDocument')}
            </Button> */}
          </div>
        ) : (
          <ScrollArea orientation="horizontal" className="pb-4 max-w-[calc(100vw-650px)] w-full" type="always">
            <ScrollBar orientation="horizontal" />
            <div className="flex items-center gap-2">
              {selectedRequirement.documents.map((document) => (
                <DocumentItem 
                  key={document.id} 
                  document={document}
                  onView={handleDocumentView}
                  onDelete={handleDocumentDelete}
                  isDeleting={deletingDocId === document.id}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
      
      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        requirementId={requirementId}
        onUploadCompleted={handleUploadCompleted}
      />
    </div>
  );
};

export default RequirementDocuments;

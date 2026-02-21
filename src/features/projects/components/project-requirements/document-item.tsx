import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { FileText, Trash, EyeIcon, Loader2, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import DocumentDeleteModal from './document-delete-modal';
import { DocumentViewer } from '@/components/document-viewer';

const DocumentItem = ({ document, onView, onDelete, isDeleting }) => {
  const { t } = useTranslation();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  const handleDeleteConfirm = () => {
    onDelete(document.id);
  };
  
  const handleViewDocument = () => {
    setIsViewModalOpen(true);
    // Also call the parent onView function if provided
    if (onView) {
      onView(document);
    }
  };
  
  const handleDownload = () => {
    // In a real implementation, this would trigger a download of the document
    if (document.url) {
      window.open(document.url, '_blank');
    }
  };
  
  return (
    <>
      <div className="flex items-center justify-between gap-2 p-4 border rounded-lg hover:bg-muted min-w-[300px]">
        <FileText className="h-8 w-8 text-muted-foreground" />
        <div>
          <p className="font-medium text-sm max-w-[200px] truncate">
            {document?.file_name}
          </p>
          <p className="text-xs text-muted-foreground">
            {t('projects.requirements.documentAdded')} {format(new Date(document.createdAt), 'MMM d, yyyy')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="icon" 
                  size="icon" 
                  className="h-8 w-8 flex-shrink-0 text-destructive hover:bg-destructive/10"
                  onClick={() => setIsDeleteModalOpen(true)}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('projects.requirements.deleteDocument')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="icon" 
                  size="icon" 
                  className="h-8 w-8 flex-shrink-0"
                  onClick={handleViewDocument}
                >
                  <EyeIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('projects.requirements.viewDocument')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <DocumentViewer 
            document={document}
            open={isViewModalOpen}
            onOpenChange={setIsViewModalOpen}
          />
        </div>
      </div>
      
      {/* Document Delete Modal */}
      <DocumentDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        documentName={document.file_name}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default DocumentItem;

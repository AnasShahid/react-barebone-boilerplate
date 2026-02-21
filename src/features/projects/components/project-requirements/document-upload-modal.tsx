import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useUploadRequirementDocumentMutation } from '../../services';

const DocumentUploadModal = ({ 
  isOpen, 
  onClose, 
  requirementId,
  onUploadCompleted
}) => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadRequirementDocument, { isLoading: isUploading }] = useUploadRequirementDocumentMutation();

  useEffect(() => {
    return () => {
      setDragActive(false);
      setSelectedFile(null);
    }
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (file) => {
    // Check file type (PDF, DOC, DOCX, etc.)
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast.error(t('projects.requirements.invalidFileType'));
      return;
    }
    
    // Check file size (max 20MB)
    const maxSize = 20 * 1024 * 1024; // 20MB in bytes
    if (file.size > maxSize) {
      toast.error(t('projects.requirements.fileTooLarge'));
      return;
    }
    
    setSelectedFile(file);
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error(t('projects.requirements.noFileSelected'));
      return;
    }
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    
    // Pass a single object to the mutation trigger
    await uploadRequirementDocument({ data: formData, requirementId }); 
    setSelectedFile(null);
    // Don't clear the file immediately as it would affect the UI during upload
    // The modal will be closed after upload completes
    onUploadCompleted();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  // Reset the selected file when the modal is closed
  const handleClose = () => {
    if (!isUploading) {
      setSelectedFile(null);
    }
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('projects.requirements.uploadDocument')}</DialogTitle>
          <DialogDescription>
            {t('projects.requirements.uploadDocumentDescription')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {!selectedFile ? (
            <div
              className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-upload').click()}
            >
              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-center text-muted-foreground mb-1">
                {t('projects.requirements.dragAndDrop')}
              </p>
              <p className="text-xs text-center text-muted-foreground">
                {t('projects.requirements.supportedFormats')}
              </p>
              <Input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleFileInputChange}
                multiple={false}
              />
            </div>
          ) : (
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 truncate">
                    <div className="flex items-center space-x-2">
                      <Label className="font-medium">{selectedFile.name}</Label>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRemoveFile}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="sm:justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isUploading}
          >
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('common.uploading')}
              </>
            ) : (
              t('common.upload')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUploadModal;

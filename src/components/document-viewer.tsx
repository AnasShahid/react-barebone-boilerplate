import type { ReactNode } from 'react';
import DocViewer, { PDFRenderer, TXTRenderer } from 'react-doc-viewer';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface DocumentViewerDocument {
  url: string;
}

interface DocumentViewerProps {
  document: DocumentViewerDocument;
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const DocumentViewer = ({ document, trigger, open, onOpenChange }: DocumentViewerProps) => {
  const documents = [{ uri: document.url }];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="w-screen h-screen max-w-none max-h-none flex flex-col p-0 gap-0">
        <DialogHeader className="p-6">
          <DialogTitle>Document Viewer</DialogTitle>
        </DialogHeader>
        <div className="w-full h-full">
          <DocViewer
            className="w-full h-full"
            documents={documents}
            renderers={[PDFRenderer, TXTRenderer]}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

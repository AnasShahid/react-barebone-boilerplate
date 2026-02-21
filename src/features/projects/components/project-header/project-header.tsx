import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export const ProjectHeader = ({ projectId }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(projectId);
      setCopied(true);
      toast.success(t('common.idCopiedToClipboard'), {
        description: t('common.copied'),
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error(t('common.failedToCopy'), error);
      toast.error(t('common.failedToCopy'), {
        description: t('common.error'),
      });
    }
  };

  return (
    <div className="flex items-center mb-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/projects">{t('projects.title')}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{projectId}</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Button
              variant="ghost"
              size="sm"
              className="ml-1 p-1 h-auto"
              onClick={handleCopyId}
              title={t('common.copyId')}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

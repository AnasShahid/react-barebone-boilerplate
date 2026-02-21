import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { useGetAllUserOrganizationsQuery, useDeleteOrganizationByIdMutation } from '../services';
import { CreateOrganizationDialog } from '../components/create-organization-dialog';
import { Spinner } from '@/components/spinner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pen, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { SEO } from '@/components/seo';

interface Organization {
  id: string;
  name?: string;
  website?: string;
  description?: string;
  [key: string]: unknown;
}

export const OrganizationsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data, isLoading } = useGetAllUserOrganizationsQuery();
  const [deleteOrganization, { isLoading: isDeleting }] = useDeleteOrganizationByIdMutation();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [organizationToDelete, setOrganizationToDelete] = useState<Organization | null>(null);

  const renderOrganizations = () =>
    (data as Organization[] | undefined)?.map((organization) => (
      <Card key={organization?.id} className="w-full col-span-1 !bg-[#323235] !border-[#323235] hover:shadow-xl min-h-[212px]">
        <CardHeader>
          <CardTitle>{organization?.name}</CardTitle>
          <CardDescription>{organization?.website}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">{organization?.description}</div>
        </CardContent>
        <CardFooter className="flex flex-row gap-2">
          <Button variant="default" className="flex-1" size="sm" onClick={() => navigate(`/account/organizations/${organization?.id}/info`)}>
            <Pen /> {t('organization.common.edit')}
          </Button>
          <Button variant="destructive" className="flex-1" size="sm" onClick={() => { setOrganizationToDelete(organization); setConfirmationText(''); setDeleteDialogOpen(true); }}>
            <Trash2 /> {t('organization.common.delete')}
          </Button>
        </CardFooter>
      </Card>
    ));

  const handleDeleteOrganization = async () => {
    try {
      if (!organizationToDelete) return;
      await deleteOrganization(organizationToDelete.id).unwrap();
      toast.success(`Organization '${organizationToDelete.name}' has been deleted`);
      setDeleteDialogOpen(false);
      setOrganizationToDelete(null);
      setConfirmationText('');
    } catch (error) {
      toast.error(`Failed to delete organization: ${(error as { message?: string }).message ?? 'Unknown error'}`);
    }
  };

  return (
    <>
      <SEO title={t('organization.pages.organizationsPage.title')} />
      <div className="flex flex-col">
        <div className="border-b border-b-[#333237]">
          <h1 className="text-[1.0625rem] font-bold mb-[1rem]">{t('organization.pages.organizationsPage.title')}</h1>
        </div>
        <div className="flex-1 h-full grid grid-cols-2 gap-6 pt-6">
          {isLoading && <Spinner />}
          {!isLoading ? <>{renderOrganizations()}<CreateOrganizationDialog /></> : null}
        </div>
      </div>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive">{t('organization.pages.organizationsPage.deleteDialog.title')}</DialogTitle>
            <DialogDescription>{t('organization.pages.organizationsPage.deleteDialog.description')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <p className="text-sm text-slate-500 dark:text-slate-400">{t('organization.pages.organizationsPage.deleteDialog.confirmationText')}</p>
              <Input
                placeholder={t('organization.pages.organizationsPage.deleteDialog.confirmationPlaceholder')}
                value={confirmationText}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmationText(e.target.value)}
                className="border-destructive focus-visible:ring-destructive"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setDeleteDialogOpen(false); setConfirmationText(''); }}>{t('organization.common.cancel')}</Button>
            <Button variant="destructive" onClick={handleDeleteOrganization} disabled={confirmationText !== 'delete' || isDeleting}>
              {isDeleting ? t('organization.common.deleting') : t('organization.common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

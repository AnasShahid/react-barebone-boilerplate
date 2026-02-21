import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useCreateOrganizationWithRolesMutation } from '../services';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export const CreateOrganizationDialog = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [organizationName, setOrganizationName] = useState('');
  const [organizationDescription, setOrganizationDescription] = useState('');
  const [organizationWebsite, setOrganizationWebsite] = useState('');
  const [createOrganization, { isLoading }] = useCreateOrganizationWithRolesMutation();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!organizationName.trim()) {
      toast.error('Organization name is required');
      return;
    }

    if (!organizationDescription.trim()) {
      toast.error('Organization description is required');
      return;
    }

    try {
      await createOrganization({
        name: organizationName.trim(),
        description: organizationDescription.trim(),
        website: organizationWebsite.trim() || undefined,
      }).unwrap();
      toast.success(`Organization '${organizationName}' has been created`);
      setOrganizationName('');
      setOrganizationDescription('');
      setOrganizationWebsite('');
      setOpen(false);
    } catch (error) {
      toast.error(`Failed to create organization: ${(error as Error).message ?? 'Unknown error'}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full min-h-[212px] h-full flex flex-col items-center justify-center gap-2 py-8 border-dashed border-2 border-slate-600 !bg-[#323235] hover:bg-[#3a3a3e]">
          <PlusCircle size={24} className="text-white" />
          <span className="text-white">{t('organization.createOrganizationDialog.title')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t('organization.createOrganizationDialog.title')}</DialogTitle>
            <DialogDescription>{t('organization.createOrganizationDialog.description')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="organization-name">
                {t('organization.createOrganizationDialog.orgName')}{' '}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="organization-name"
                placeholder={t('organization.createOrganizationDialog.enterOrganizationName')}
                value={organizationName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setOrganizationName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="organization-description">
                {t('organization.createOrganizationDialog.orgDescription')}{' '}
                <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="organization-description"
                placeholder={t('organization.createOrganizationDialog.enterOrganizationDescription')}
                value={organizationDescription}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setOrganizationDescription(e.target.value)}
                required
                className="resize-none"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="organization-website">
                {t('organization.createOrganizationDialog.orgWebsite')}
              </Label>
              <Input
                id="organization-website"
                placeholder="https://example.com"
                value={organizationWebsite}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setOrganizationWebsite(e.target.value)}
                type="url"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                setOrganizationName('');
              }}
            >
              {t('organization.common.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !organizationName.trim() || !organizationDescription.trim()}
            >
              {isLoading ? t('organization.common.saving') : t('organization.common.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PlusCircle, UserPlus, X } from 'lucide-react';
import { useGetAllOrganizationRolesQuery } from '../services';
import { skipToken } from '@reduxjs/toolkit/query';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSendUserInviteMutation } from '@/features/invite';
import { toast } from 'sonner';

interface OrgRole {
  id: string;
  name: string;
}

interface InviteFormItem {
  invitee_email: string;
  role_id: string;
}

interface InviteFormValues {
  invites: InviteFormItem[];
}

interface SendUserInvitesProps {
  onSendInvites?: (invites: (InviteFormItem & { organization_id?: string })[]) => void;
  organizationId?: string;
  buttonText?: string;
  buttonIcon?: boolean;
}

export const SendUserInvites = ({
  onSendInvites,
  organizationId,
  buttonText: buttonTextProp,
  buttonIcon = true,
}: SendUserInvitesProps) => {
  const { t } = useTranslation();

  const inviteFormSchema = z.object({
    invites: z
      .array(
        z.object({
          invitee_email: z.string().email({ message: t('organization.sendUserInvites.validation.emailValid') }),
          role_id: z.string().min(1, { message: t('organization.sendUserInvites.validation.roleRequired') }),
        })
      )
      .min(1, { message: t('organization.sendUserInvites.validation.atLeastOneInvite') }),
  });

  const buttonText = buttonTextProp ?? t('organization.sendUserInvites.inviteUser');
  const [open, setOpen] = useState(false);
  const [sendUserInvite, { isLoading: isSendingInvite }] = useSendUserInviteMutation();

  const {
    data: roles = [],
    isLoading: isRolesLoading,
    isError: isRolesError,
  } = useGetAllOrganizationRolesQuery(!open || !organizationId ? skipToken : organizationId);

  const getDefaultRole = (): string => {
    const rolesArr = roles as OrgRole[];
    if (isRolesLoading || rolesArr.length === 0) return '';
    const memberRole = rolesArr.find(
      (role) => role.name.toLowerCase().includes('member') && !role.name.toLowerCase().includes('admin')
    );
    return memberRole ? memberRole.id : rolesArr[0].id;
  };

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: { invites: [{ invitee_email: '', role_id: '' }] },
  });

  useEffect(() => {
    const rolesArr = roles as OrgRole[];
    if (rolesArr.length > 0 && open) {
      const defaultRole = getDefaultRole();
      form.reset({
        invites: form.getValues().invites.map((invite) => ({
          ...invite,
          role_id: invite.role_id || defaultRole,
        })),
      });
    }
  }, [roles, open]); // eslint-disable-line react-hooks/exhaustive-deps

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'invites' });

  const handleCloseSheet = () => {
    setOpen(false);
    setTimeout(() => {
      form.reset({ invites: [{ invitee_email: '', role_id: '' }] });
      for (let i = fields.length - 1; i > 0; i--) remove(i);
    }, 300);
  };

  const onSubmit = async (data: InviteFormValues) => {
    const invitesWithOrgId = data.invites.map((invite) => ({ ...invite, organization_id: organizationId }));
    let successCount = 0;
    let failureCount = 0;
    try {
      for (const invite of invitesWithOrgId) {
        try {
          await sendUserInvite(invite as Parameters<typeof sendUserInvite>[0]).unwrap();
          successCount++;
        } catch (error) {
          console.error(`Failed to send invite to ${invite.invitee_email}:`, error);
          failureCount++;
        }
      }
      if (successCount > 0 && failureCount === 0) {
        toast.success(t('organization.sendUserInvites.toast.success', { count: successCount }));
      } else if (successCount > 0 && failureCount > 0) {
        toast.warning(t('organization.sendUserInvites.toast.partialSuccess', { successCount, failureCount }));
      } else if (failureCount > 0 && successCount === 0) {
        toast.error(t('organization.sendUserInvites.toast.failure', { count: failureCount }));
      }
      if (onSendInvites) onSendInvites(invitesWithOrgId);
      if (successCount > 0) handleCloseSheet();
    } catch (error) {
      console.error('Error processing invites:', error);
      toast.error(t('organization.sendUserInvites.toast.error'));
    }
  };

  const addInvite = () => append({ invitee_email: '', role_id: getDefaultRole() });
  const rolesArr = roles as OrgRole[];

  return (
    <Sheet
      open={open}
      onOpenChange={(isOpen: boolean) => { if (!isOpen) { handleCloseSheet(); } else { setOpen(true); } }}
    >
      <SheetTrigger asChild>
        <Button size="sm" onClick={() => setOpen(true)}>
          {buttonIcon && <UserPlus className="mr-2 h-4 w-4" />}
          {buttonText}
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md overflow-y-auto max-h-screen">
        <SheetHeader>
          <SheetTitle>{t('organization.sendUserInvites.inviteUsers')}</SheetTitle>
          <SheetDescription>{t('organization.sendUserInvites.description')}</SheetDescription>
        </SheetHeader>
        {isRolesLoading && (
          <div className="py-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-solid border-current border-r-transparent"></div>
            <p className="mt-2 text-sm text-gray-500">{t('organization.sendUserInvites.loadingRoles')}</p>
          </div>
        )}
        {isRolesError && (
          <div className="py-8 text-center">
            <p className="text-red-500">{t('organization.sendUserInvites.errorLoadingRoles')}</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={handleCloseSheet}>
              {t('organization.common.close')}
            </Button>
          </div>
        )}
        {!isRolesLoading && !isRolesError && rolesArr.length > 0 && (
          <div className="py-4 overflow-y-auto">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pb-16">
                {fields.map((field, index) => (
                  <div key={field.id} className="space-y-2 p-4 rounded-md border relative">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium">{t('organization.sendUserInvites.inviteNumber', { number: index + 1 })}</h4>
                      {fields.length > 1 && (
                        <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)} className="h-6 w-6 p-0 absolute top-2 right-2">
                          <X className="h-4 w-4" />
                          <span className="sr-only">{t('organization.sendUserInvites.removeInvite')}</span>
                        </Button>
                      )}
                    </div>
                    <FormField
                      control={form.control}
                      name={`invites.${index}.invitee_email`}
                      render={({ field: f }: { field: Record<string, unknown> }) => (
                        <FormItem>
                          <FormLabel>{t('organization.common.email')}</FormLabel>
                          <FormControl>
                            <Input placeholder={t('organization.sendUserInvites.emailPlaceholder')} {...(f as object)} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`invites.${index}.role_id`}
                      render={({ field: f }: { field: Record<string, unknown> }) => (
                        <FormItem>
                          <FormLabel>{t('organization.common.role')}</FormLabel>
                          <Select onValueChange={f.onChange as (v: string) => void} defaultValue={f.value as string} value={f.value as string}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t('organization.sendUserInvites.selectRole')} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {rolesArr.map((role) => (
                                <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>{t('organization.sendUserInvites.roleDescription')}</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addInvite} className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t('organization.sendUserInvites.addAnotherInvite')}
                </Button>
              </form>
            </Form>
          </div>
        )}
        <div className="flex justify-end gap-2 pt-4 border-t mt-auto">
          <SheetClose asChild>
            <Button type="button" variant="outline" onClick={handleCloseSheet}>{t('organization.common.cancel')}</Button>
          </SheetClose>
          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            disabled={isRolesLoading || isRolesError || isSendingInvite}
          >
            {isSendingInvite ? (
              <><div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>{t('organization.sendUserInvites.sending')}</>
            ) : t('organization.sendUserInvites.sendInvites')}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SendUserInvites;

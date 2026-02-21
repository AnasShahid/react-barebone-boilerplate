import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
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
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { InviteItem } from '../context/onboarding-context';

interface InviteUsersFormProps {
  onSubmit: (invites: InviteItem[]) => Promise<void>;
  isLoading?: boolean;
  organization?: string | null;
  role?: string | null;
}

export const InviteUsersForm = ({
  onSubmit,
  isLoading,
  organization,
  role,
}: InviteUsersFormProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const inviteSchema = z.object({
    emails: z
      .string()
      .min(1, t('onboarding.inviteUsers.form.emails.required'))
      .refine(
        (value) => {
          const emails = value.split(',').map((email) => email.trim());
          return emails.every((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
        },
        { message: t('onboarding.inviteUsers.form.emails.invalid') }
      ),
  });

  type InviteFormValues = z.infer<typeof inviteSchema>;

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { emails: '' },
  });

  const handleFormSubmit = async (data: InviteFormValues) => {
    try {
      const emails = data.emails.split(',').map((email) => email.trim());
      const transformedInvitesData: InviteItem[] = emails.map((email) => ({
        invitee_email: email,
        organization_id: organization,
        role_id: role,
      }));
      await onSubmit(transformedInvitesData);
    } catch (error) {
      form.setError('root', {
        type: 'submit',
        message:
          (error as Error).message ?? t('onboarding.inviteUsers.form.submitError'),
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="emails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('onboarding.inviteUsers.form.emails.title')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('onboarding.inviteUsers.form.emails.placeholder')}
                  {...field}
                  disabled={form.formState.isSubmitting || isLoading}
                />
              </FormControl>
              <FormDescription>{t('onboarding.inviteUsers.form.emails.description')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.formState.errors.root && (
          <div className="text-sm font-medium text-destructive">
            {form.formState.errors.root.message}
          </div>
        )}
        <div className="flex justify-center items-center gap-2">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || isLoading}
            className="flex-1"
          >
            {form.formState.isSubmitting || isLoading
              ? t('onboarding.inviteUsers.form.submitting')
              : t('onboarding.inviteUsers.form.submit')}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/onboarding/complete')}
            className="flex-1"
          >
            {t('onboarding.inviteUsers.form.skip')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

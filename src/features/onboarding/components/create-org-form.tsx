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

interface CreateOrgFormProps {
  onSubmit: (data: { name: string }) => Promise<void>;
  isLoading?: boolean;
}

export const CreateOrgForm = ({ onSubmit, isLoading }: CreateOrgFormProps) => {
  const { t } = useTranslation();

  const orgSchema = z.object({
    name: z
      .string()
      .min(3, t('onboarding.createOrg.form.name.minLength'))
      .max(50, t('onboarding.createOrg.form.name.maxLenght')),
  });

  type OrgFormValues = z.infer<typeof orgSchema>;

  const form = useForm<OrgFormValues>({
    resolver: zodResolver(orgSchema),
    defaultValues: { name: '' },
  });

  const handleFormSubmit = async (data: OrgFormValues) => {
    try {
      await onSubmit(data);
    } catch (error) {
      form.setError('root', {
        type: 'submit',
        message: (error as Error).message ?? 'Failed to create organization',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('onboarding.createOrg.form.name.title')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('onboarding.createOrg.form.name.placeholder')}
                  {...field}
                  disabled={form.formState.isSubmitting || isLoading}
                />
              </FormControl>
              <FormDescription>{t('onboarding.createOrg.form.name.description')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.formState.errors.root && (
          <div className="rounded-md bg-destructive/15 p-4">
            <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
          </div>
        )}
        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting || isLoading}
        >
          {form.formState.isSubmitting || isLoading
            ? t('onboarding.createOrg.inProgress')
            : t('onboarding.createOrg.action')}
        </Button>
      </form>
    </Form>
  );
};

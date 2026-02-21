import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { useCreateProjectRequirementsMutation } from '../../services';

// Define the form schema using Zod
const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Name is required',
  }),
});

const CreateRequirementModal = ({ projectId, isOpen, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [createProjectRequirement, { isLoading }] = useCreateProjectRequirementsMutation();

  // Initialize the form with react-hook-form and zod validation
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  // Handle form submission
  const onSubmit = async (values) => {
    try {
      await createProjectRequirement({
        ...values,
        project_id: projectId,
      }).unwrap();

      // Show success notification
      toast.success(t('projects.requirements.notifications.createSuccess'));
      
      // Reset form and close modal
      form.reset();
      onSuccess?.();
      onClose();
    } catch (error) {
      // Show error notification
      toast.error(
        error.data?.message || t('projects.requirements.notifications.createError')
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('projects.requirements.createDialog.title')}</DialogTitle>
          <DialogDescription>
            {t('projects.requirements.createDialog.description')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('projects.requirements.form.titleLabel')}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={t('projects.requirements.form.titlePlaceholder')} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? t('common.creating')
                  : t('projects.requirements.form.createButton')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRequirementModal;
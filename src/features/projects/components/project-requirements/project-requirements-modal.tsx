import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { 
  useUpdateProjectRequirementsMutation,
} from '../../services';
import { selectRequirementById } from '../../store/requirements-selectors';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor'

// Define the form schema with zod
const formSchema = (t) => z.object({
  name: z.string().min(1, { message: t('projects.requirements.nameRequired') }),
  requirements_text: z.string().optional(),
});

const ProjectRequirementsModal = ({
  onClose,
  requirement = null,
  isLoading,
  isOpen,
}) => {
  const { t } = useTranslation();
  const [editorContent, setEditorContent] = useState('');

  // Get requirement data from Redux store if available
  const storedRequirement = useSelector(state => 
    requirement?.id ? selectRequirementById(state, requirement.id) : null
  );

  // Use stored requirement data if available, otherwise use the prop
  const currentRequirement = storedRequirement || requirement;

  // RTK Query hooks for API calls
  const [updateRequirement, { isLoading: isUpdatingRequirements }] = useUpdateProjectRequirementsMutation();

  // Initialize the form with react-hook-form and zod validation
  const form = useForm({
    resolver: zodResolver(formSchema(t)),
    defaultValues: {
      name: requirement?.name || '',
      requirements_text: requirement?.requirements_text || '',
    },
  });

  // Update form values when requirement changes
  useEffect(() => {
    if (currentRequirement) {
      form.reset({
        name: currentRequirement.name || '',
        requirements_text: currentRequirement.requirements_text || '',
      });
      setEditorContent(currentRequirement.requirements_text || '');
    }
  }, [currentRequirement, form]);

  // Handle editor content change
  const handleEditorChange = (content) => {
    setEditorContent(content.editor.storage.markdown.getMarkdown());
    form.setValue('requirements_text', content.editor.storage.markdown.getMarkdown());
  };

  // Handle form submission
  const onSubmit = async (data) => {
    if (!currentRequirement?.id) {
      toast.error(t('projects.requirements.requirementNotFound'));
      return;
    }

    try {
      // Format the data for the API - only include name and requirements_text
      const formattedData = {
        name: data.name,
        requirements_text: data.requirements_text
      };

      // Call the update API with the formatted data
      await updateRequirement({
        id: currentRequirement.id,
        projectId: currentRequirement.projectId, // Include projectId for optimistic updates
        data: formattedData
      }).unwrap();

      toast.success(t('projects.requirements.requirementUpdated'));
      onClose();
    } catch (error) {
      console.error('Error updating requirement:', error);
      toast.error(t('projects.requirements.requirementUpdateError'));
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        {/* <DialogTrigger>
          <Button
            variant="outline"
            size="sm"
            disabled={isLoading}
          >
            <Pencil className="mr-1 h-4 w-4" />
            {t('projects.requirements.actions.edit')}
          </Button>
        </DialogTrigger> */}
        <DialogContent className="w-screen h-screen max-w-none max-h-none flex flex-col p-0 gap-0 [&>button]:hidden">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-1 flex-1 overflow-hidden flex flex-col">
              <div className='flex items-center justify-between gap-2 flex-1 max-h-[70px]'>
                <div className='flex-1 flex-col gap-0'>
                  <FormField
                    control={form.control}
                    name="name"
                    disabled={isLoading}
                    render={({ field }) => (
                      <>
                        {/* <FormItem className='mt-0 pt-0'>
                          <FormControl className='mt-0 pt-0'>
                            <Input className="w-full border-none" {...field} />
                          </FormControl>
                          <FormMessage />
                          <p className='text-xs text-muted-foreground mt-0 pt-0'>
                            {t('projects.requirements.nameDescription')}
                          </p>
                        </FormItem> */}
                        <span className='text-[10px] text-muted-foreground mt-0 pt-0 px-2'>Title</span>
                        <input type='text' {...field} className='w-full border-none bg-transparent px-2 py-0 outline-none' />
                      </>
                    )}
                  />
                </div>
                <div className='flex flex-1 gap-2 justify-end px-2 items-center h-full'>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isUpdatingRequirements}
                  >
                    {t('common.cancel')}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isUpdatingRequirements}
                  >
                    {isUpdatingRequirements ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('common.saving')}
                      </>
                    ) : (
                      t('common.save')
                    )}
                  </Button>
                </div>
              </div>

              <FormField
                control={form.control}
                name="requirements_text"
                disabled={isLoading}
                render={() => (
                  <FormItem className="flex-1 overflow-hidden flex flex-col mt-0 pt-0">
                    {/* <FormLabel>{t('projects.requirements.requirementText')}</FormLabel> */}
                    <FormControl className="mt-0 pt-0">
                      <div className="flex-1 overflow-hidden border rounded-md mt-0 pt-0">
                        <SimpleEditor
                          content={editorContent}
                          onChange={handleEditorChange}
                          className="min-h-[400px] mt-0 pt-0"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isUpdatingRequirements}
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdatingRequirements}
                >
                  {isUpdatingRequirements ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('common.saving')}
                    </>
                  ) : (
                    t('common.save')
                  )}
                </Button>
              </DialogFooter> */}
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectRequirementsModal;

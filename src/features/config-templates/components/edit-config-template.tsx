import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Plus, Trash2, Info, Link, Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { AddServiceRoleModal } from "./add-service-role-modal";
import { AttachServiceRoleModal } from "./attach-service-role-modal";
import { Button } from "@/components/ui/button";
import {
  Sheet, SheetContent, SheetDescription, SheetFooter,
  SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import {
  Form, FormControl, FormDescription, FormField,
  FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useUpdateConfigTemplateMutation, useGetConfigTemplateByIdQuery } from "../services";

interface AttachedRole {
  service_role_id: string;
  hourly_rate: number;
  average_experience: number;
  is_active?: boolean;
}

interface EditConfigTemplateSheetProps {
  triggerButton?: ReactNode;
  configTemplateId?: string;
  onConfigTemplateUpdated?: (values: Record<string, unknown>) => void;
}

const ESTIMATION_MODES = { HOURLY: 'hourly', DAILY: 'daily' } as const;

const configTemplateSchema = z.object({
  name: z.string().min(2, { message: "Name is required and must be at least 2 characters" }),
  estimation_mode: z.enum([ESTIMATION_MODES.HOURLY, ESTIMATION_MODES.DAILY], { message: "Please select a valid estimation mode" }),
  buffer_percentage: z.coerce.number().min(0).max(100).optional(),
  description: z.string().optional(),
  hours_per_day: z.coerce.number().min(1).max(24).optional(),
  service_roles: z.array(z.object({
    service_role_id: z.string().min(1),
    hourly_rate: z.coerce.number().min(0),
    average_experience: z.coerce.number().min(0),
  })).optional().default([]),
});

type ConfigTemplateFormValues = z.infer<typeof configTemplateSchema>;

export const EditConfigTemplateSheet = ({ triggerButton, configTemplateId, onConfigTemplateUpdated }: EditConfigTemplateSheetProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { data: configTemplate, isLoading: isFetching, refetch } = useGetConfigTemplateByIdQuery(
    configTemplateId ?? '',
    { skip: !open || !configTemplateId }
  );

  const [updateConfigTemplate] = useUpdateConfigTemplateMutation();

  const form = useForm<ConfigTemplateFormValues>({
    resolver: zodResolver(configTemplateSchema),
    defaultValues: {
      name: "", estimation_mode: ESTIMATION_MODES.HOURLY,
      buffer_percentage: 10, description: "", hours_per_day: 8, service_roles: [],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({ control: form.control, name: "service_roles" });

  useEffect(() => {
    if (configTemplate && open) {
      const ct = configTemplate as Record<string, unknown>;
      const rawRoles = (ct.service_roles as Array<Record<string, unknown>> | undefined) ?? [];
      const transformedServiceRoles = rawRoles.map(role => ({
        service_role_id: (role.id as string) || (role.service_role_id as string),
        hourly_rate: role.hourly_rate as number,
        average_experience: role.average_experience as number,
      }));
      form.reset({
        name: (ct.name as string) || "",
        estimation_mode: ((ct.estimation_mode as string) || ESTIMATION_MODES.HOURLY) as 'hourly' | 'daily',
        buffer_percentage: (ct.buffer_percentage as number) || 10,
        description: (ct.description as string) || "",
        hours_per_day: (ct.hours_per_day as number) || 8,
        service_roles: transformedServiceRoles,
      });
      if (transformedServiceRoles.length > 0) replace(transformedServiceRoles);
    }
  }, [configTemplate, open]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleOpenChange = (newOpenState: boolean) => {
    setOpen(newOpenState);
    if (newOpenState && configTemplateId) refetch();
  };

  const handleSubmit = async (values: ConfigTemplateFormValues) => {
    try {
      setIsLoading(true);
      await updateConfigTemplate({ id: configTemplateId ?? '', ...values } as { id: string; [key: string]: unknown }).unwrap();
      if (onConfigTemplateUpdated) onConfigTemplateUpdated(values as Record<string, unknown>);
      toast.success("Configuration template updated successfully");
      setOpen(false);
    } catch (e) {
      console.error("Error updating configuration template:", e);
      toast.error("Failed to update configuration template");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>{triggerButton}</SheetTrigger>
      <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Configuration Template</SheetTitle>
          <SheetDescription>Update the configuration template details.</SheetDescription>
        </SheetHeader>
        {isFetching ? (
          <div className="flex items-center justify-center h-32"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Name <span className="text-red-500">*</span></FormLabel><FormControl><Input placeholder="e.g., Mobile App Development Template" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Add a description" className="resize-none" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="estimation_mode" render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimation Mode <span className="text-red-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select estimation mode" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value={ESTIMATION_MODES.HOURLY}>Hourly</SelectItem>
                      <SelectItem value={ESTIMATION_MODES.DAILY}>Daily</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>How the estimation will be calculated</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="buffer_percentage" render={({ field }) => (
                  <FormItem><FormLabel>Buffer Percentage</FormLabel><FormControl><Input type="number" min="0" max="100" {...field} /></FormControl><FormDescription>Additional buffer as percentage (0-100)</FormDescription><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="hours_per_day" render={({ field }) => (
                  <FormItem><FormLabel>Hours Per Day</FormLabel><FormControl><Input type="number" min="1" max="24" {...field} /></FormControl><FormDescription>Working hours in a day (1-24)</FormDescription><FormMessage /></FormItem>
                )} />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <FormLabel>Service Roles</FormLabel>
                  <div className="flex gap-2">
                    <AddServiceRoleModal triggerButton={<Button type="button" variant="outline" size="sm" className="h-8 gap-1"><Plus className="h-3.5 w-3.5" />Create Role</Button>} />
                    <div onClick={(e) => e.stopPropagation()}>
                      <AttachServiceRoleModal
                        triggerButton={<Button type="button" variant="outline" size="sm" className="h-8 gap-1"><Link className="h-3.5 w-3.5" />Attach Role</Button>}
                        onServiceRoleAttached={(roleData: AttachedRole) => { append({ service_role_id: roleData.service_role_id, hourly_rate: roleData.hourly_rate, average_experience: roleData.average_experience }); }}
                      />
                    </div>
                  </div>
                </div>
                <FormDescription>Add service roles for this configuration template</FormDescription>
                {fields.length === 0 ? (
                  <div className="p-4 border border-dashed rounded-md bg-muted/50 flex items-center justify-center">
                    <div className="text-sm text-muted-foreground flex items-center"><Info className="h-4 w-4 mr-2" />No service roles added.</div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <div key={field.id} className="p-4 border rounded-md relative">
                        <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8 text-destructive hover:text-destructive-foreground hover:bg-destructive" onClick={() => remove(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField control={form.control} name={`service_roles.${index}.service_role_id`} render={({ field: f }) => (
                            <FormItem><FormLabel>Service Role</FormLabel><FormControl><Input placeholder="Enter role ID" {...f} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={form.control} name={`service_roles.${index}.hourly_rate`} render={({ field: f }) => (
                            <FormItem><FormLabel>Hourly Rate</FormLabel><FormControl><Input type="number" min="0" step="0.01" {...f} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={form.control} name={`service_roles.${index}.average_experience`} render={({ field: f }) => (
                            <FormItem><FormLabel>Avg. Experience (years)</FormLabel><FormControl><Input type="number" min="0" step="0.5" {...f} /></FormControl><FormMessage /></FormItem>
                          )} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <SheetFooter className="pt-4 sm:justify-between">
                <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>Cancel</Button>
                <Button type="submit" disabled={isLoading || isFetching}>
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Updating...</> : "Update Template"}
                </Button>
              </SheetFooter>
            </form>
          </Form>
        )}
      </SheetContent>
    </Sheet>
  );
};

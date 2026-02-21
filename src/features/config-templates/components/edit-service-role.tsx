import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useUpdateServiceRoleMutation, useGetServiceRoleByIdQuery } from "../services";

const serviceRoleSchema = z.object({
  name: z.string().min(2, { message: "Name is required and must be at least 2 characters" }),
  description: z.string().optional(),
  additional_info: z.string().optional(),
  is_active: z.boolean().default(true),
});

type ServiceRoleFormValues = z.infer<typeof serviceRoleSchema>;

interface EditServiceRoleSheetProps {
  triggerButton?: ReactNode;
  serviceRoleId?: string;
  onServiceRoleUpdated?: (values: Record<string, unknown>) => void;
}

export const EditServiceRoleSheet = ({ triggerButton, serviceRoleId, onServiceRoleUpdated }: EditServiceRoleSheetProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { data: serviceRole, isLoading: isFetching, refetch } = useGetServiceRoleByIdQuery(
    serviceRoleId ?? '',
    { skip: !open || !serviceRoleId }
  );

  const [updateServiceRole] = useUpdateServiceRoleMutation();

  const form = useForm<ServiceRoleFormValues>({
    resolver: zodResolver(serviceRoleSchema),
    defaultValues: { name: "", description: "", additional_info: "", is_active: true },
  });

  useEffect(() => {
    if (serviceRole && open) {
      const sr = serviceRole as Record<string, unknown>;
      form.reset({
        name: (sr.name as string) || "",
        description: (sr.description as string) || "",
        additional_info: (sr.additional_info as string) || "",
        is_active: (sr.is_active as boolean) ?? true,
      });
    }
  }, [serviceRole, open]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleOpenChange = (newOpenState: boolean) => {
    setOpen(newOpenState);
    if (newOpenState && serviceRoleId) refetch();
  };

  const handleSubmit = async (values: ServiceRoleFormValues) => {
    try {
      setIsLoading(true);
      await updateServiceRole({ id: serviceRoleId ?? '', ...values }).unwrap();
      if (onServiceRoleUpdated) onServiceRoleUpdated(values as Record<string, unknown>);
      toast.success("Service role updated successfully");
      setOpen(false);
    } catch (e) {
      console.error("Error updating service role:", e);
      toast.error("Failed to update service role");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>{triggerButton}</SheetTrigger>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Service Role</SheetTitle>
          <SheetDescription>Update the service role details.</SheetDescription>
        </SheetHeader>
        {isFetching ? (
          <div className="flex items-center justify-center h-32"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Name <span className="text-red-500">*</span></FormLabel><FormControl><Input placeholder="e.g., Software Developer" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Add a description" className="resize-none" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="additional_info" render={({ field }) => (
                <FormItem><FormLabel>Additional Information</FormLabel><FormControl><Textarea placeholder="Any additional information" className="resize-none" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="is_active" render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Active</FormLabel>
                    <FormDescription>Whether this service role is currently active</FormDescription>
                  </div>
                </FormItem>
              )} />
              <SheetFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>Cancel</Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Updating...</> : "Update Role"}
                </Button>
              </SheetFooter>
            </form>
          </Form>
        )}
      </SheetContent>
    </Sheet>
  );
};

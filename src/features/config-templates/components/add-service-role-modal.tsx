import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form, FormControl, FormDescription, FormField,
  FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateServiceRoleMutation, useGetAllServiceRolesQuery } from "../services";

const serviceRoleSchema = z.object({
  name: z.string().min(2, { message: "Name is required and must be at least 2 characters" }),
  description: z.string().optional(),
  additional_info: z.string().optional(),
  is_active: z.boolean().default(true),
});

type ServiceRoleFormValues = z.infer<typeof serviceRoleSchema>;

interface AddServiceRoleModalProps {
  triggerButton?: ReactNode;
  onServiceRoleAdded?: (role: Record<string, unknown>) => void;
}

export const AddServiceRoleModal = ({ triggerButton, onServiceRoleAdded }: AddServiceRoleModalProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [createServiceRole] = useCreateServiceRoleMutation();
  const { refetch } = useGetAllServiceRolesQuery();

  const form = useForm<ServiceRoleFormValues>({
    resolver: zodResolver(serviceRoleSchema),
    defaultValues: { name: "", description: "", additional_info: "", is_active: true },
  });

  const handleSubmit = async (values: ServiceRoleFormValues) => {
    try {
      setIsLoading(true);
      const response = await createServiceRole(values as Record<string, unknown>).unwrap();
      await refetch();
      if (onServiceRoleAdded) onServiceRoleAdded((response as Record<string, unknown>) || (values as Record<string, unknown>));
      toast.success("Service role added successfully");
      setOpen(false);
      form.reset();
    } catch (e) {
      console.error("Error adding service role:", e);
      toast.error("Failed to add service role");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Service Role</DialogTitle>
          <DialogDescription>Create a new service role for your organization.</DialogDescription>
        </DialogHeader>
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
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>Cancel</Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</> : "Create Role"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

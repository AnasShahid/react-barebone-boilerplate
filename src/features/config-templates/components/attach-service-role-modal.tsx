import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, Check, ChevronsUpDown } from "lucide-react";
import { useSelector } from "react-redux";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useGetAllServiceRolesQuery } from "../services";
import { cn } from "@/lib/utils";

interface ServiceRole { id: string; name: string; }
interface RoleData { service_role_id: string; hourly_rate: number; average_experience: number; is_active: boolean; service_role_name?: string; }

const attachServiceRoleSchema = z.object({
  service_role_id: z.string().min(1, { message: "Service role is required" }),
  hourly_rate: z.coerce.number().min(0),
  average_experience: z.coerce.number().min(0),
  is_active: z.boolean().default(true),
});

type AttachFormValues = z.infer<typeof attachServiceRoleSchema>;

interface AttachServiceRoleModalProps {
  triggerButton?: ReactNode;
  onServiceRoleAttached?: (roleData: RoleData) => void;
}

export const AttachServiceRoleModal = ({ triggerButton, onServiceRoleAttached }: AttachServiceRoleModalProps) => {
  const [open, setOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { refetch } = useGetAllServiceRolesQuery();
  const serviceRoles = useSelector((state: { serviceRoles?: { data?: ServiceRole[] } }) => state.serviceRoles?.data || []) as ServiceRole[];

  const baseRoles: ServiceRole[] = serviceRoles.length > 0 ? serviceRoles : [
    { id: 'dummy1', name: 'Frontend Developer' },
    { id: 'dummy2', name: 'Backend Developer' },
    { id: 'dummy3', name: 'UI/UX Designer' },
  ];

  const displayRoles = searchFilter
    ? baseRoles.filter(role => role.name.toLowerCase().includes(searchFilter.toLowerCase()))
    : baseRoles;

  const form = useForm<AttachFormValues>({
    resolver: zodResolver(attachServiceRoleSchema),
    defaultValues: { service_role_id: "", hourly_rate: 0, average_experience: 0, is_active: true },
  });

  useEffect(() => { if (open) refetch(); }, [open, refetch]);

  const handleSubmit = (e?: React.MouseEvent) => {
    const values = form.getValues();
    try {
      if (e) e.preventDefault();
      setIsLoading(true);
      const selectedRole = serviceRoles.find(role => role.id === values.service_role_id);
      const roleData: RoleData = { ...values, service_role_name: selectedRole?.name || "Unknown Role" };
      if (onServiceRoleAttached) onServiceRoleAttached(roleData);
      toast.success("Service role attached successfully");
      setOpen(false);
      form.reset();
    } catch (err) {
      console.error("Error attaching service role:", err);
      toast.error("Failed to attach service role");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Attach Service Role</DialogTitle>
          <DialogDescription>Select an existing service role and configure its parameters.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4 py-4">
            <FormField control={form.control} name="service_role_id" render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Service Role <span className="text-red-500">*</span></FormLabel>
                <div className="relative">
                  <FormControl>
                    <Button type="button" variant="outline" onClick={() => setPopoverOpen(!popoverOpen)} className="relative w-full justify-between">
                      {field.value ? displayRoles.find(r => r.id === field.value)?.name || "Select service role" : "Select service role"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                  {popoverOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-popover rounded-md border shadow-md">
                      <Input className="w-full pl-3 pr-10 text-sm h-9 rounded-t-md" placeholder="Search service roles..." value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)} />
                      <div className="max-h-60 overflow-auto p-1">
                        {displayRoles.length === 0 ? (
                          <div className="py-6 text-center text-sm">No service roles found</div>
                        ) : displayRoles.map((role) => (
                          <div key={role.id} className={cn("flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none", role.id === field.value ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground")} onClick={() => { form.setValue("service_role_id", role.id); setPopoverOpen(false); }}>
                            <span>{role.name}</span>
                            <Check className={cn("ml-auto h-4 w-4", role.id === field.value ? "opacity-100" : "opacity-0")} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="hourly_rate" render={({ field }) => (
              <FormItem><FormLabel>Hourly Rate <span className="text-red-500">*</span></FormLabel><FormControl><Input type="number" min="0" step="0.01" {...field} /></FormControl><FormDescription>Hourly rate for this service role</FormDescription><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="average_experience" render={({ field }) => (
              <FormItem><FormLabel>Average Experience (years) <span className="text-red-500">*</span></FormLabel><FormControl><Input type="number" min="0" step="0.5" {...field} /></FormControl><FormDescription>Average experience level in years</FormDescription><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="is_active" render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                <div className="space-y-1 leading-none"><FormLabel>Active</FormLabel><FormDescription>Whether this service role is active in this template</FormDescription></div>
              </FormItem>
            )} />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>Cancel</Button>
              <Button type="button" onClick={(e) => handleSubmit(e)} disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Attaching...</> : "Attach Role"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

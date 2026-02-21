import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useUpdateCustomerMutation } from '../../services';
import type { ReactNode } from "react";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const CUSTOMER_STATUS = {
  LEAD: 'LEAD', PROSPECT: 'PROSPECT', ACTIVE: 'ACTIVE', INACTIVE: 'INACTIVE',
} as const;

const customerBasicInfoSchema = z.object({
  name: z.string().min(2),
  primary_email: z.string().email(),
  status: z.enum([CUSTOMER_STATUS.LEAD, CUSTOMER_STATUS.PROSPECT, CUSTOMER_STATUS.ACTIVE, CUSTOMER_STATUS.INACTIVE]),
  primary_phone: z.string().optional(),
});

type FormValues = z.infer<typeof customerBasicInfoSchema>;

interface Customer {
  id?: string;
  name?: string;
  primary_email?: string;
  customer_status?: string;
  primary_phone?: string;
}

interface EditCustomerInfoDialogProps {
  triggerButton?: ReactNode;
  customer?: Customer;
  onCustomerUpdated?: (customer: unknown) => void;
}

export function EditCustomerInfoDialog({ triggerButton, customer, onCustomerUpdated }: EditCustomerInfoDialogProps) {
  const [open, setOpen] = useState(false);
  const [updateCustomer, { isLoading }] = useUpdateCustomerMutation();
  const { t } = useTranslation();

  const form = useForm<FormValues>({
    resolver: zodResolver(customerBasicInfoSchema),
    defaultValues: {
      name: customer?.name || "",
      primary_email: customer?.primary_email || "",
      status: (customer?.customer_status as typeof CUSTOMER_STATUS[keyof typeof CUSTOMER_STATUS]) || CUSTOMER_STATUS.LEAD,
      primary_phone: customer?.primary_phone || "",
    },
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      if (!customer?.id) { toast.error(t("customers.contact.idRequired")); return; }
      const response = await updateCustomer({ id: customer.id, ...values }).unwrap().catch((err: { data?: { message?: string } }) => {
        toast.error(err.data?.message || t("customers.customerInfo.updateError"));
        return null;
      });
      if (response) {
        toast.success(t("customers.customerInfo.updateSuccess"));
        setOpen(false);
        if (onCustomerUpdated) onCustomerUpdated(response);
      }
    } catch (e) {
      console.error("Error updating customer:", e);
      toast.error(t("customers.customerInfo.updateError"));
    }
  };

  const statusOptions = [
    { id: CUSTOMER_STATUS.LEAD, name: "Lead" },
    { id: CUSTOMER_STATUS.PROSPECT, name: "Prospect" },
    { id: CUSTOMER_STATUS.ACTIVE, name: "Active" },
    { id: CUSTOMER_STATUS.INACTIVE, name: "Inactive" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("customers.customerInfo.editTitle")}</DialogTitle>
          <DialogDescription>{t("customers.customerInfo.editDescription")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>{t('customers.createCustomerForm.customerName')} <span className="text-red-500">*</span></FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("customers.createCustomerForm.customerStatus")} <span className="text-red-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      {statusOptions.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="primary_email" render={({ field }) => (
                <FormItem><FormLabel>{t("customers.createCustomerForm.primaryEmail")} <span className="text-red-500">*</span></FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="primary_phone" render={({ field }) => (
                <FormItem><FormLabel>{t("customers.createCustomerForm.primaryPhone")}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>{t("common.cancel")}</Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t("common.saving")}</> : t("common.save")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

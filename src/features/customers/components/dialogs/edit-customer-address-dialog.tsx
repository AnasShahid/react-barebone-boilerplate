import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useUpdateCustomerMutation } from '../../services';
import type { ReactNode } from "react";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const addressSchema = z.object({
  address_line_1: z.string().optional(),
  address_line_2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postal_code: z.string().optional(),
});

const formSchema = z.object({ primary_address: addressSchema.optional() });
type FormValues = z.infer<typeof formSchema>;

interface CustomerAddress {
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
}

interface Customer {
  id?: string;
  primary_address?: CustomerAddress;
}

interface EditCustomerAddressDialogProps {
  triggerButton?: ReactNode;
  customer?: Customer;
  onCustomerUpdated?: (customer: unknown) => void;
}

const filterEmptyFields = (obj: Record<string, unknown>): Record<string, unknown> => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const filtered = filterEmptyFields(value as Record<string, unknown>);
      if (Object.keys(filtered).length > 0) acc[key] = filtered;
    } else if (typeof value === 'string' && value.trim() !== '') {
      acc[key] = value;
    } else if (value !== null && value !== undefined && value !== '') {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, unknown>);
};

export function EditCustomerAddressDialog({ triggerButton, customer, onCustomerUpdated }: EditCustomerAddressDialogProps) {
  const [open, setOpen] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [updateCustomer, { isLoading }] = useUpdateCustomerMutation();
  const { t } = useTranslation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      primary_address: { address_line_1: "", address_line_2: "", city: "", state: "", country: "", postal_code: "" },
    },
  });

  useEffect(() => {
    if (customer) {
      if (customer.primary_address) {
        setShowAddress(true);
        form.reset({ primary_address: { ...customer.primary_address } });
      } else {
        setShowAddress(false);
        form.reset({ primary_address: { address_line_1: "", address_line_2: "", city: "", state: "", country: "", postal_code: "" } });
      }
    }
  }, [customer, form]);

  const handleSubmit = async (values: FormValues) => {
    try {
      if (!customer?.id) { toast.error(t("customers.contact.idRequired")); return; }
      const updateData = { id: customer.id, primary_address: showAddress ? values.primary_address : null };
      const filteredData = filterEmptyFields(updateData as unknown as Record<string, unknown>);
      const response = await updateCustomer(filteredData as { id: string; [key: string]: unknown }).unwrap().catch((err: { data?: { message?: string } }) => {
        toast.error(err.data?.message || t("customers.customerAddress.updateError"));
        return null;
      });
      if (response) {
        toast.success(t("customers.customerAddress.updateSuccess"));
        setOpen(false);
        if (onCustomerUpdated) onCustomerUpdated(response);
      }
    } catch (e) {
      console.error("Error updating customer address:", e);
      toast.error(t("customers.customerAddress.updateError"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("customers.customerAddress.editTitle")}</DialogTitle>
          <DialogDescription>{t("customers.customerAddress.editDescription")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">{t("customers.createCustomerForm.primaryAddress")}</h3>
              <Button type="button" variant="outline" size="sm" onClick={() => setShowAddress(!showAddress)}>
                {showAddress ? <><Trash2 className="h-4 w-4 mr-1" />{t("customers.createCustomerForm.removeAddress")}</> : <><PlusCircle className="h-4 w-4 mr-1" />{t("customers.createCustomerForm.addAddress")}</>}
              </Button>
            </div>
            {showAddress && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="primary_address.address_line_1" render={({ field }) => (
                    <FormItem><FormLabel>{t("customers.createCustomerForm.addressLine1")}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="primary_address.address_line_2" render={({ field }) => (
                    <FormItem><FormLabel>{t("customers.createCustomerForm.addressLine2")}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField control={form.control} name="primary_address.city" render={({ field }) => (
                    <FormItem><FormLabel>{t("customers.createCustomerForm.city")}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="primary_address.state" render={({ field }) => (
                    <FormItem><FormLabel>{t("customers.createCustomerForm.state")}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="primary_address.postal_code" render={({ field }) => (
                    <FormItem><FormLabel>{t("customers.createCustomerForm.postalCode")}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="primary_address.country" render={({ field }) => (
                  <FormItem><FormLabel>{t("customers.createCustomerForm.country")}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
            )}
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

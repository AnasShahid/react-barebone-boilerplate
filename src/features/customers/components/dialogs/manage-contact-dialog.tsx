import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useAddCustomerContactMutation, useUpdateCustomerContactMutation } from '../../services';
import type { ReactNode } from "react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
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

const contactSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  designation: z.string().optional(),
  address: z.object({
    address_line_1: z.string().optional(),
    address_line_2: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

interface Contact {
  id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  designation?: string;
  address?: { address_line_1?: string; address_line_2?: string; city?: string; country?: string; };
}

interface ManageContactDialogProps {
  triggerButton?: ReactNode;
  customerId?: string;
  contact?: Contact | null;
  onContactSaved?: (contact: unknown) => void;
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

export function ManageContactDialog({ triggerButton, customerId, contact = null, onContactSaved }: ManageContactDialogProps) {
  const [open, setOpen] = useState(false);
  const [showContactAddress, setShowContactAddress] = useState(false);
  const { t } = useTranslation();
  const [addContact, { isLoading: isAddingContact }] = useAddCustomerContactMutation();
  const [updateContact, { isLoading: isUpdatingContact }] = useUpdateCustomerContactMutation();
  const isLoading = isAddingContact || isUpdatingContact;
  const isEditMode = !!contact;

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      first_name: "", last_name: "", email: "", phone: "", designation: "",
      address: { address_line_1: "", address_line_2: "", city: "", country: "" },
    },
  });

  useEffect(() => {
    if (contact) {
      if (contact.address) setShowContactAddress(true);
      form.reset({
        first_name: contact.first_name || "",
        last_name: contact.last_name || "",
        email: contact.email || "",
        phone: contact.phone || "",
        designation: contact.designation || "",
        address: contact.address ? {
          address_line_1: contact.address.address_line_1 || "",
          address_line_2: contact.address.address_line_2 || "",
          city: contact.address.city || "",
          country: contact.address.country || "",
        } : { address_line_1: "", address_line_2: "", city: "", country: "" },
      });
    } else {
      form.reset({ first_name: "", last_name: "", email: "", phone: "", designation: "", address: { address_line_1: "", address_line_2: "", city: "", country: "" } });
      setShowContactAddress(false);
    }
  }, [contact, form, open]);

  const handleSubmit = async (values: ContactFormValues) => {
    try {
      if (!customerId) { toast.error(t("customers.contact.idRequired")); return; }
      const filteredValues = filterEmptyFields(values as unknown as Record<string, unknown>);
      if (!showContactAddress && filteredValues.address) delete filteredValues.address;

      let response: unknown;
      if (isEditMode && contact?.id) {
        response = await updateContact({ contactId: contact.id, ...filteredValues }).unwrap().catch((err: { data?: { message?: string } }) => {
          toast.error(err.data?.message || t("customers.contact.updateError"));
          return null;
        });
        if (response) toast.success(t("customers.contact.updateSuccess"));
      } else {
        response = await addContact({ customerId, contact: filteredValues }).unwrap().catch((err: { data?: { message?: string } }) => {
          toast.error(err.data?.message || t("customers.contact.addError"));
          return null;
        });
        if (response) toast.success(t("customers.contact.addSuccess"));
      }

      if (response) {
        setOpen(false);
        if (onContactSaved) onContactSaved(response);
      }
    } catch (e) {
      console.error("Error saving contact:", e);
      toast.error(isEditMode ? t("customers.contact.updateError") : t("customers.contact.addError"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditMode ? t("customers.contact.editTitle") : t("customers.contact.addTitle")}</DialogTitle>
          <DialogDescription>{isEditMode ? t("customers.contact.editDescription") : t("customers.contact.addDescription")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="first_name" render={({ field }) => (
                <FormItem><FormLabel>{t("customers.createCustomerForm.firstName")} <span className="text-red-500">*</span></FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="last_name" render={({ field }) => (
                <FormItem><FormLabel>{t("customers.createCustomerForm.lastName")} <span className="text-red-500">*</span></FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem><FormLabel>{t("customers.createCustomerForm.email")} <span className="text-red-500">*</span></FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem><FormLabel>{t("customers.createCustomerForm.phone")} <span className="text-red-500">*</span></FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <FormField control={form.control} name="designation" render={({ field }) => (
              <FormItem><FormLabel>{t("customers.createCustomerForm.designation")}</FormLabel><FormControl><Input placeholder="e.g., CEO, Manager" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">{t("customers.createCustomerForm.contactAddress")}</h3>
              <Button type="button" variant="outline" size="sm" onClick={() => setShowContactAddress(!showContactAddress)}>
                {showContactAddress ? t("customers.createCustomerForm.removeAddress") : t("customers.createCustomerForm.addAddress")}
              </Button>
            </div>
            {showContactAddress && (
              <div className="space-y-4 border-l-2 border-muted pl-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="address.address_line_1" render={({ field }) => (
                    <FormItem><FormLabel>{t('customers.createCustomerForm.contactAddressLine1')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="address.address_line_2" render={({ field }) => (
                    <FormItem><FormLabel>{t('customers.createCustomerForm.contactAddressLine2')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="address.city" render={({ field }) => (
                    <FormItem><FormLabel>{t('customers.createCustomerForm.contactCity')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="address.country" render={({ field }) => (
                    <FormItem><FormLabel>{t('customers.createCustomerForm.contactCountry')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>{t("common.cancel")}</Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t("common.saving")}</> : isEditMode ? t("common.update") : t("common.add")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

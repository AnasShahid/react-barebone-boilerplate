import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlusCircle, Trash2, Loader2 } from "lucide-react";
import { useCreateCustomerMutation } from '../services';
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const CUSTOMER_STATUS = {
  LEAD: 'LEAD', PROSPECT: 'PROSPECT', ACTIVE: 'ACTIVE', INACTIVE: 'INACTIVE',
} as const;

const addressSchema = z.object({
  address_line_1: z.string().min(1),
  address_line_2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().optional(),
  country: z.string().min(1),
  postal_code: z.string().optional(),
});

const contactSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  designation: z.string().optional(),
  address: addressSchema.optional(),
});

const customerFormSchema = z.object({
  name: z.string().min(2),
  primary_email: z.string().email(),
  customer_status: z.enum([CUSTOMER_STATUS.LEAD, CUSTOMER_STATUS.PROSPECT, CUSTOMER_STATUS.ACTIVE, CUSTOMER_STATUS.INACTIVE]),
  primary_phone: z.string().optional(),
  primary_address: z.object({
    address_line_1: z.string().optional(),
    address_line_2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    postal_code: z.string().optional(),
  }).optional(),
  contacts: z.array(contactSchema).optional(),
});

type CustomerFormValues = z.infer<typeof customerFormSchema>;

interface AddCustomerDialogProps {
  triggerButton?: ReactNode;
  onCustomerAdded?: (customer: Record<string, unknown>) => void;
}

const filterEmptyFields = (obj: unknown): unknown => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    const filtered = obj.map(filterEmptyFields).filter(item => item !== null && item !== undefined);
    return filtered.length === 0 ? null : filtered;
  }
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (value && typeof value === 'object') {
      const filteredValue = filterEmptyFields(value);
      if (filteredValue && (typeof filteredValue !== 'object' || Object.keys(filteredValue as object).length > 0)) {
        result[key] = filteredValue;
      }
    } else if (typeof value === 'string' && value.trim() !== '') {
      result[key] = value;
    } else if (value !== null && value !== undefined && value !== '') {
      result[key] = value;
    }
  }
  return Object.keys(result).length === 0 ? null : result;
};

export function AddCustomerDialog({ triggerButton, onCustomerAdded }: AddCustomerDialogProps) {
  const [open, setOpen] = useState(false);
  const [showPrimaryAddress, setShowPrimaryAddress] = useState(false);
  const [createCustomer, { isLoading }] = useCreateCustomerMutation();
  const { t } = useTranslation();

  const customerStatusOptions = [
    { id: CUSTOMER_STATUS.LEAD, name: "Lead" },
    { id: CUSTOMER_STATUS.PROSPECT, name: "Prospect" },
    { id: CUSTOMER_STATUS.ACTIVE, name: "Active" },
    { id: CUSTOMER_STATUS.INACTIVE, name: "Inactive" },
  ];

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: "", primary_email: "", customer_status: CUSTOMER_STATUS.LEAD,
      primary_phone: "",
      primary_address: { address_line_1: "", address_line_2: "", city: "", state: "", country: "", postal_code: "" },
      contacts: [],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "contacts" });

  const handleSubmit = async (values: CustomerFormValues) => {
    try {
      const filteredValues = filterEmptyFields(values) as Record<string, unknown>;
      const response = await createCustomer(filteredValues).unwrap().catch((err: { data?: { message?: string } }) => {
        toast.error(err.data?.message || "Failed to add customer");
        return null;
      });
      if (response) {
        toast.success("Customer added successfully");
        setOpen(false);
        form.reset();
        setShowPrimaryAddress(false);
        if (onCustomerAdded) onCustomerAdded(response as Record<string, unknown>);
      }
    } catch (e) {
      console.error("Error adding customer:", e);
      toast.error("Failed to add customer");
    }
  };

  const addContact = () => {
    append({ first_name: "", last_name: "", email: "", phone: "", designation: "", address: { address_line_1: "", address_line_2: "", city: "", country: "" } });
  };

  useEffect(() => {
    form.reset({ ...form.getValues(), ...(showPrimaryAddress ? {} : { primary_address: undefined }) });
  }, [showPrimaryAddress]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("customers.createCustomerForm.title")}</DialogTitle>
          <DialogDescription>{t("customers.createCustomerForm.description")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 pt-4">
            <h3 className="text-lg font-medium">{t("customers.createCustomerForm.basicInformation")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>{t('customers.createCustomerForm.customerName')} <span className="text-red-500">*</span></FormLabel><FormControl><Input placeholder="e.g., Acme Corporation" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="customer_status" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("customers.createCustomerForm.customerStatus")} <span className="text-red-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {customerStatusOptions.map((status) => (
                        <SelectItem key={status.id} value={status.id}>{status.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="primary_email" render={({ field }) => (
                <FormItem><FormLabel>{t("customers.createCustomerForm.primaryEmail")} <span className="text-red-500">*</span></FormLabel><FormControl><Input placeholder="e.g., info@acmecorp.com" type="email" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="primary_phone" render={({ field }) => (
                <FormItem><FormLabel>{t("customers.createCustomerForm.primaryPhone")}</FormLabel><FormControl><Input placeholder="e.g., +1-123-456-7890" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <Separator />
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">{t("customers.createCustomerForm.primaryAddress")}</h3>
                {!showPrimaryAddress && (
                  <Button type="button" variant="outline" size="sm" onClick={() => setShowPrimaryAddress(true)}>
                    <PlusCircle className="h-4 w-4 mr-2" />{t("customers.createCustomerForm.addAddress")}
                  </Button>
                )}
              </div>
              {!showPrimaryAddress && <p className="text-sm text-muted-foreground mb-4">{t("customers.createCustomerForm.noAddress")}</p>}
              {showPrimaryAddress && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="primary_address.address_line_1" render={({ field }) => (
                      <FormItem><FormLabel>{t("customers.createCustomerForm.addressLine1")} <span className="text-red-500">*</span></FormLabel><FormControl><Input placeholder="e.g., 123 Main St" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="primary_address.address_line_2" render={({ field }) => (
                      <FormItem><FormLabel>{t("customers.createCustomerForm.addressLine2")}</FormLabel><FormControl><Input placeholder="e.g., Suite 100" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <FormField control={form.control} name="primary_address.city" render={({ field }) => (
                      <FormItem><FormLabel>{t("customers.createCustomerForm.city")} <span className="text-red-500">*</span></FormLabel><FormControl><Input placeholder="e.g., San Francisco" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="primary_address.state" render={({ field }) => (
                      <FormItem><FormLabel>{t("customers.createCustomerForm.state")}</FormLabel><FormControl><Input placeholder="e.g., California" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="primary_address.postal_code" render={({ field }) => (
                      <FormItem><FormLabel>{t("customers.createCustomerForm.postalCode")}</FormLabel><FormControl><Input placeholder="e.g., 94105" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <div className="mt-4">
                    <FormField control={form.control} name="primary_address.country" render={({ field }) => (
                      <FormItem><FormLabel>{t("customers.createCustomerForm.country")} <span className="text-red-500">*</span></FormLabel><FormControl><Input placeholder="e.g., United States" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <div className="mt-4">
                    <Button type="button" variant="outline" size="sm" onClick={() => { setShowPrimaryAddress(false); form.setValue('primary_address', { address_line_1: "", address_line_2: "", city: "", state: "", country: "", postal_code: "" }); }}>
                      <Trash2 className="h-4 w-4 mr-2 text-red-500" />{t("customers.createCustomerForm.removeAddress")}
                    </Button>
                  </div>
                </>
              )}
            </div>
            <Separator />
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">{t("customers.createCustomerForm.contacts")}</h3>
                <Button type="button" variant="outline" size="sm" onClick={addContact}>
                  <PlusCircle className="h-4 w-4 mr-2" />{t("customers.createCustomerForm.addContact")}
                </Button>
              </div>
              {fields.length === 0 && <p className="text-sm text-muted-foreground">{t("customers.createCustomerForm.noContacts")}</p>}
              {fields.map((field, index) => (
                <div key={field.id} className="border p-4 rounded-md mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">{t("customers.createCustomerForm.contactNumber")} {index + 1}</h4>
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name={`contacts.${index}.first_name`} render={({ field: f }) => (
                      <FormItem><FormLabel>{t("customers.createCustomerForm.firstName")} <span className="text-red-500">*</span></FormLabel><FormControl><Input {...f} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name={`contacts.${index}.last_name`} render={({ field: f }) => (
                      <FormItem><FormLabel>{t("customers.createCustomerForm.lastName")} <span className="text-red-500">*</span></FormLabel><FormControl><Input {...f} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <FormField control={form.control} name={`contacts.${index}.email`} render={({ field: f }) => (
                      <FormItem><FormLabel>{t("customers.createCustomerForm.email")} <span className="text-red-500">*</span></FormLabel><FormControl><Input type="email" {...f} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name={`contacts.${index}.phone`} render={({ field: f }) => (
                      <FormItem><FormLabel>{t("customers.createCustomerForm.phone")} <span className="text-red-500">*</span></FormLabel><FormControl><Input {...f} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <div className="mt-4">
                    <FormField control={form.control} name={`contacts.${index}.designation`} render={({ field: f }) => (
                      <FormItem><FormLabel>{t("customers.createCustomerForm.designation")}</FormLabel><FormControl><Input placeholder="e.g., CEO, Manager" {...f} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>{t('customers.createCustomerForm.cancel')}</Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t("customers.createCustomerForm.addingCustomer")}</> : t("customers.createCustomerForm.addCustomer")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

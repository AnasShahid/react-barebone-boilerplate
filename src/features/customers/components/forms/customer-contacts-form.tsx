import { useFieldArray } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { PlusCircle, Trash2 } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import {
  FormField, FormItem, FormLabel, FormControl, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CustomerContactsFormProps {
  form: UseFormReturn<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export function CustomerContactsForm({ form }: CustomerContactsFormProps) {
  const { t } = useTranslation();
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "contacts" });

  const addContact = () => {
    append({ first_name: "", last_name: "", email: "", phone: "", designation: "", address: { address_line_1: "", address_line_2: "", city: "", country: "" } });
  };

  return (
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
              <FormItem><FormLabel>{t("customers.createCustomerForm.phone")}</FormLabel><FormControl><Input {...f} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
          <div className="mt-4">
            <FormField control={form.control} name={`contacts.${index}.designation`} render={({ field: f }) => (
              <FormItem><FormLabel>{t("customers.createCustomerForm.designation")}</FormLabel><FormControl><Input placeholder="e.g., CEO, Manager" {...f} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
          <div className="mt-4">
            <details className="cursor-pointer">
              <summary className="font-medium text-sm">{t("customers.createCustomerForm.contactAddress")}</summary>
              <div className="mt-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name={`contacts.${index}.address.address_line_1`} render={({ field: f }) => (
                    <FormItem><FormLabel>{t('customers.createCustomerForm.contactAddressLine1')} <span className="text-red-500">*</span></FormLabel><FormControl><Input {...f} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name={`contacts.${index}.address.address_line_2`} render={({ field: f }) => (
                    <FormItem><FormLabel>{t('customers.createCustomerForm.contactAddressLine2')}</FormLabel><FormControl><Input {...f} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <FormField control={form.control} name={`contacts.${index}.address.city`} render={({ field: f }) => (
                    <FormItem><FormLabel>{t('customers.createCustomerForm.contactCity')} <span className="text-red-500">*</span></FormLabel><FormControl><Input {...f} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name={`contacts.${index}.address.country`} render={({ field: f }) => (
                    <FormItem><FormLabel>{t('customers.createCustomerForm.contactCountry')} <span className="text-red-500">*</span></FormLabel><FormControl><Input {...f} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
              </div>
            </details>
          </div>
        </div>
      ))}
    </div>
  );
}

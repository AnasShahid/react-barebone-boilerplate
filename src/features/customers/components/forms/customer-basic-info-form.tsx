import { useTranslation } from "react-i18next";
import type { UseFormReturn } from "react-hook-form";
import {
  FormField, FormItem, FormLabel, FormControl, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const CUSTOMER_STATUS = {
  LEAD: 'LEAD', PROSPECT: 'PROSPECT', ACTIVE: 'ACTIVE', INACTIVE: 'INACTIVE',
} as const;

const customerStatusOptions = [
  { id: CUSTOMER_STATUS.LEAD, name: "customers.statuses.LEAD" },
  { id: CUSTOMER_STATUS.PROSPECT, name: "customers.statuses.PROSPECT" },
  { id: CUSTOMER_STATUS.ACTIVE, name: "customers.statuses.ACTIVE" },
  { id: CUSTOMER_STATUS.INACTIVE, name: "customers.statuses.INACTIVE" },
];

interface CustomerBasicInfoFormProps {
  form: UseFormReturn<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export function CustomerBasicInfoForm({ form }: CustomerBasicInfoFormProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">{t("customers.createCustomerForm.basicInformation")}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem><FormLabel>{t('customers.createCustomerForm.customerName')} <span className="text-red-500">*</span></FormLabel><FormControl><Input placeholder={t("customers.createCustomerForm.placeholders.acmeCorporation")} {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="status" render={({ field }) => (
          <FormItem>
            <FormLabel>{t("customers.createCustomerForm.customerStatus")} <span className="text-red-500">*</span></FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl><SelectTrigger><SelectValue placeholder={t("customers.createCustomerForm.statusRequired")} /></SelectTrigger></FormControl>
              <SelectContent>
                {customerStatusOptions.map((status) => (
                  <SelectItem key={status.id} value={status.id}>{t(status.name)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={form.control} name="primary_email" render={({ field }) => (
          <FormItem><FormLabel>{t("customers.createCustomerForm.primaryEmail")} <span className="text-red-500">*</span></FormLabel><FormControl><Input placeholder="info@example.com" type="email" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="primary_phone" render={({ field }) => (
          <FormItem><FormLabel>{t("customers.createCustomerForm.primaryPhone")}</FormLabel><FormControl><Input placeholder="+1-234-567-8900" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
      </div>
    </div>
  );
}

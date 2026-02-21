import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PlusCircle, Trash2 } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import {
  FormField, FormItem, FormLabel, FormControl, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ShowAddressState {
  show: boolean;
  setShow: (value: boolean) => void;
}

interface CustomerAddressFormProps {
  form: UseFormReturn<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  basePath?: string;
  showAddressState?: ShowAddressState | null;
}

export function CustomerAddressForm({ form, basePath = "primary_address", showAddressState = null }: CustomerAddressFormProps) {
  const { t } = useTranslation();

  const [showAddressInternal, setShowAddressInternal] = useState(false);

  const showAddress = showAddressState?.show ?? showAddressInternal;
  const setShowAddress = showAddressState?.setShow ?? setShowAddressInternal;

  useEffect(() => {
    if (!showAddressState) {
      const addressData = form.getValues(basePath);
      const hasAddressData = addressData && (addressData.address_line_1 || addressData.city || addressData.country);
      if (hasAddressData) setShowAddressInternal(true);
    }
  }, [form, basePath, showAddressState]);

  useEffect(() => {
    if (!showAddress) {
      const update: Record<string, unknown> = {};
      update[basePath] = { address_line_1: "", address_line_2: "", city: "", state: "", country: "", postal_code: "" };
      form.reset({ ...form.getValues(), ...update });
    }
  }, [showAddress, form, basePath]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{t("customers.createCustomerForm.primaryAddress")}</h3>
        {!showAddress && (
          <Button type="button" variant="outline" size="sm" onClick={() => setShowAddress(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            {t("customers.createCustomerForm.addAddress")}
          </Button>
        )}
      </div>
      {!showAddress && <p className="text-sm text-muted-foreground mb-4">{t("customers.createCustomerForm.noAddress")}</p>}
      {showAddress && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name={`${basePath}.address_line_1`} render={({ field }) => (
              <FormItem><FormLabel>{t("customers.createCustomerForm.addressLine1")} <span className="text-red-500">*</span></FormLabel><FormControl><Input placeholder="e.g., 123 Main St" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name={`${basePath}.address_line_2`} render={({ field }) => (
              <FormItem><FormLabel>{t("customers.createCustomerForm.addressLine2")}</FormLabel><FormControl><Input placeholder="e.g., Suite 100" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <FormField control={form.control} name={`${basePath}.city`} render={({ field }) => (
              <FormItem><FormLabel>{t("customers.createCustomerForm.city")} <span className="text-red-500">*</span></FormLabel><FormControl><Input placeholder="e.g., San Francisco" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name={`${basePath}.state`} render={({ field }) => (
              <FormItem><FormLabel>{t("customers.createCustomerForm.state")}</FormLabel><FormControl><Input placeholder="e.g., California" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name={`${basePath}.postal_code`} render={({ field }) => (
              <FormItem><FormLabel>{t("customers.createCustomerForm.postalCode")}</FormLabel><FormControl><Input placeholder="e.g., 94105" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
          <div className="mt-4">
            <FormField control={form.control} name={`${basePath}.country`} render={({ field }) => (
              <FormItem><FormLabel>{t("customers.createCustomerForm.country")} <span className="text-red-500">*</span></FormLabel><FormControl><Input placeholder="e.g., United States" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
          <div className="mt-4">
            <Button type="button" variant="outline" size="sm" onClick={() => setShowAddress(false)}>
              <Trash2 className="h-4 w-4 mr-2 text-red-500" />
              {t("customers.createCustomerForm.removeAddress")}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

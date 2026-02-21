import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CustomerBasicInfoForm } from "./customer-basic-info-form";
import { CustomerAddressForm } from "./customer-address-form";
import { CustomerContactsForm } from "./customer-contacts-form";

const CUSTOMER_STATUS = {
  LEAD: 'LEAD', PROSPECT: 'PROSPECT', ACTIVE: 'ACTIVE', INACTIVE: 'INACTIVE',
} as const;

interface CustomerFormProps {
  onSubmit?: (values: Record<string, unknown>) => Promise<void> | void;
  initialData?: Record<string, unknown> | null;
  isLoading?: boolean;
  submitButtonText?: string;
  cancelButtonText?: string;
  onCancel?: () => void;
  showCancelButton?: boolean;
}

const filterEmptyFields = (obj: unknown): unknown => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    const filtered = obj.map(filterEmptyFields).filter(i => i !== null && i !== undefined);
    return filtered.length === 0 ? null : filtered;
  }
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (value && typeof value === 'object') {
      const fv = filterEmptyFields(value);
      if (fv && (typeof fv !== 'object' || Object.keys(fv as object).length > 0)) result[key] = fv;
    } else if (typeof value === 'string' && value.trim() !== '') {
      result[key] = value;
    } else if (value !== null && value !== undefined && value !== '') {
      result[key] = value;
    }
  }
  return Object.keys(result).length === 0 ? null : result;
};

export function CustomerForm({
  onSubmit, initialData = null, isLoading = false,
  submitButtonText = "Submit", cancelButtonText = "Cancel",
  onCancel, showCancelButton = true,
}: CustomerFormProps) {
  const { t } = useTranslation();
  const [showPrimaryAddress, setShowPrimaryAddress] = useState(false);

  const addressSchema = z.object({
    address_line_1: z.string().min(1, { message: t("customers.createCustomerForm.addressLine1Required") }),
    address_line_2: z.string().optional(),
    city: z.string().min(1, { message: t("customers.createCustomerForm.cityRequired") }),
    state: z.string().optional(),
    country: z.string().min(1, { message: t("customers.createCustomerForm.countryRequired") }),
    postal_code: z.string().optional(),
  });

  const contactSchema = z.object({
    first_name: z.string().min(1, { message: t("customers.createCustomerForm.firstNameRequired") }),
    last_name: z.string().min(1, { message: t("customers.createCustomerForm.lastNameRequired") }),
    email: z.string().email({ message: t("customers.createCustomerForm.emailRequired") }),
    phone: z.string().optional(),
    designation: z.string().optional(),
    address: addressSchema.optional(),
  });

  const customerFormSchema = z.object({
    name: z.string().min(2, { message: t("customers.createCustomerForm.nameRequired") }),
    primary_email: z.string().email({ message: t("customers.createCustomerForm.primaryEmailRequired") }),
    customer_status: z.enum([CUSTOMER_STATUS.LEAD, CUSTOMER_STATUS.PROSPECT, CUSTOMER_STATUS.ACTIVE, CUSTOMER_STATUS.INACTIVE], { message: t("customers.createCustomerForm.statusRequired") }),
    primary_phone: z.string().optional(),
    primary_address: showPrimaryAddress ? addressSchema : z.any().optional(),
    contacts: z.array(contactSchema).optional(),
  });

  const form = useForm({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: "", primary_email: "", customer_status: CUSTOMER_STATUS.LEAD, primary_phone: "",
      primary_address: { address_line_1: "", address_line_2: "", city: "", state: "", country: "", postal_code: "" },
      contacts: [],
    },
  });

  const handleSubmit = async (values: Record<string, unknown>) => {
    try {
      const filteredValues = filterEmptyFields(values) as Record<string, unknown>;
      if (onSubmit) await onSubmit(filteredValues);
    } catch (e) {
      console.error("Error submitting form:", e);
    }
  };

  useEffect(() => {
    if (initialData) {
      if (initialData.primary_address) setShowPrimaryAddress(true);
      form.reset(initialData as Parameters<typeof form.reset>[0]);
    }
  }, [initialData, form]);

  useEffect(() => {
    form.reset({ ...form.getValues(), ...(showPrimaryAddress ? {} : { primary_address: undefined }) });
  }, [showPrimaryAddress]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit as Parameters<typeof form.handleSubmit>[0])} className="space-y-6">
        <CustomerBasicInfoForm form={form} />
        <Separator />
        <CustomerAddressForm form={form} showAddressState={{ show: showPrimaryAddress, setShow: setShowPrimaryAddress }} />
        <Separator />
        <CustomerContactsForm form={form} />
        <div className="flex justify-end gap-2 pt-4">
          {showCancelButton && (
            <Button type="button" variant="outline" onClick={onCancel}>{cancelButtonText}</Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t("customers.createCustomerForm.addingCustomer")}</> : submitButtonText}
          </Button>
        </div>
      </form>
    </Form>
  );
}

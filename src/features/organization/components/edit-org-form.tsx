import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

interface Organization {
  name?: string;
  website?: string;
  email?: string;
  contact_number?: string;
  industry?: string;
  primary_address?: string;
  billing_address?: string;
  [key: string]: unknown;
}

interface EditOrgFormProps {
  organization?: Organization;
  onSubmit: (values: OrgFormValues) => Promise<void>;
  isLoading?: boolean;
}

type OrgFormValues = {
  name: string;
  website?: string;
  email?: string;
  contact_number?: string;
  industry?: string;
  primary_address?: string;
  billing_address?: string;
};

export const EditOrgForm = ({ organization, onSubmit }: EditOrgFormProps) => {
  const { t } = useTranslation();
  const [isSaving, setIsSaving] = useState(false);

  const formSchema = z.object({
    name: z.string().min(2, { message: t('organization.editOrgForm.validation.nameRequired') }),
    website: z
      .string()
      .optional()
      .refine(
        (val) =>
          !val || val.match(/^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/),
        { message: t('organization.editOrgForm.validation.websiteValid') }
      ),
    email: z
      .string()
      .optional()
      .refine((val) => !val || val.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/), {
        message: t('organization.editOrgForm.validation.emailValid'),
      }),
    contact_number: z
      .string()
      .optional()
      .refine(
        (val) =>
          !val ||
          val.match(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/),
        { message: t('organization.editOrgForm.validation.contactNumberValid') }
      ),
    industry: z.string().optional(),
    primary_address: z.string().optional(),
    billing_address: z.string().optional(),
  });

  const industryOptions = [
    { id: 'tech', name: t('organization.editOrgForm.industries.tech') },
    { id: 'healthcare', name: t('organization.editOrgForm.industries.healthcare') },
    { id: 'finance', name: t('organization.editOrgForm.industries.finance') },
    { id: 'education', name: t('organization.editOrgForm.industries.education') },
    { id: 'retail', name: t('organization.editOrgForm.industries.retail') },
    { id: 'manufacturing', name: t('organization.editOrgForm.industries.manufacturing') },
    { id: 'consulting', name: t('organization.editOrgForm.industries.consulting') },
    { id: 'other', name: t('organization.editOrgForm.industries.other') },
  ];

  const form = useForm<OrgFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: organization?.name ?? '',
      website: organization?.website ?? '',
      email: organization?.email ?? '',
      contact_number: organization?.contact_number ?? '',
      industry: organization?.industry ?? '',
      primary_address: organization?.primary_address ?? '',
      billing_address: organization?.billing_address ?? '',
    },
  });

  const handleSubmit = async (values: OrgFormValues) => {
    setIsSaving(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSaving(false);
    }
  };

  const requiredIndicator = <span className="text-rose-500 ml-1">*</span>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('organization.common.name')}{requiredIndicator}</FormLabel>
                <FormControl>
                  <Input placeholder={t('organization.editOrgForm.namePlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('organization.common.website')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('organization.editOrgForm.websitePlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('organization.common.email')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('organization.editOrgForm.emailPlaceholder')} type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('organization.common.industry')}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('organization.editOrgForm.selectIndustry')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {industryOptions.map((industry) => (
                      <SelectItem key={industry.id} value={industry.id}>
                        {industry.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-6">
          <FormField
            control={form.control}
            name="contact_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('organization.common.contactNumber')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('organization.editOrgForm.contactNumberPlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-6">
          <FormField
            control={form.control}
            name="primary_address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('organization.common.primaryAddress')}</FormLabel>
                <FormControl>
                  <Textarea placeholder={t('organization.editOrgForm.primaryAddressPlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-6">
          <FormField
            control={form.control}
            name="billing_address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('organization.common.billingAddress')}</FormLabel>
                <FormControl>
                  <Textarea placeholder={t('organization.editOrgForm.billingAddressPlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end">
          <Button disabled={isSaving} type="submit">
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isSaving ? t('organization.common.saving') : t('organization.common.save')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

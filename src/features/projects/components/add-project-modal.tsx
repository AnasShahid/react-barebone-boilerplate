import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Loader2, Search, Dot, ChevronsUpDown } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandDialog,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useGetAllCustomersQuery } from "../../customers/services";
import { useGetAllConfigTemplatesQuery } from "../../config-templates/services";
import { useCreateProjectMutation } from "../services";

const PROJECT_TYPE = {
  FIXED_BID: 'fixed_bid',
  TIME_AND_MATERIAL: 'time_and_material',
  PARTNERSHIP: 'partnership',
};

const PAYMENT_FREQUENCY = {
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  HALF_YEARLY: 'half_yearly',
  MILESTONE_BOUND: 'milestone_bound',
};

export function AddProjectModal({ triggerButton, onProjectAdded }) {
  const [open, setOpen] = useState(false);
  const [openCustomerCombobox, setOpenCustomerCombobox] = useState(false);
  const [openTemplateCombobox, setOpenTemplateCombobox] = useState(false);
  const { t } = useTranslation();
  const [searchCustomers, setSearchCustomers] = useState('');

  const [createProject, { isLoading: isLoadingCreateProject }] = useCreateProjectMutation();

  // Fetch customers for the dropdown
  const { data: customersData, isLoading: isLoadingCustomers } = useGetAllCustomersQuery();
  const customers = customersData?.customers || [];

  // Fetch config templates for the dropdown
  const { data: templatesData, isLoading: isLoadingTemplates } = useGetAllConfigTemplatesQuery();
  const configTemplates = templatesData || [];

  // Define project type options
  const projectTypeOptions = [
    { id: PROJECT_TYPE.FIXED_BID, name: t("projects.projectTypes.fixedBid") },
    { id: PROJECT_TYPE.TIME_AND_MATERIAL, name: t("projects.projectTypes.timeAndMaterial") },
    { id: PROJECT_TYPE.PARTNERSHIP, name: t("projects.projectTypes.partnership") },
  ];

  // Define payment frequency options
  const paymentFrequencyOptions = [
    { id: PAYMENT_FREQUENCY.MONTHLY, name: t("projects.paymentFrequencies.monthly") },
    { id: PAYMENT_FREQUENCY.QUARTERLY, name: t("projects.paymentFrequencies.quarterly") },
    { id: PAYMENT_FREQUENCY.HALF_YEARLY, name: t("projects.paymentFrequencies.halfYearly") },
    { id: PAYMENT_FREQUENCY.MILESTONE_BOUND, name: t("projects.paymentFrequencies.milestoneBound") },
  ];

  // Define the project form schema
  const projectFormSchema = z.object({
    name: z.string().min(2, { message: t("projects.createProjectForm.nameRequired") }),
    start_date: z.date({
      required_error: t("projects.createProjectForm.startDateRequired"),
    }),
    customer_id: z.string({
      required_error: t("projects.createProjectForm.customerRequired"),
    }),
    planned_end_date: z.date({
      required_error: t("projects.createProjectForm.plannedEndDateRequired"),
    }),
    project_type: z.enum([
      PROJECT_TYPE.FIXED_BID,
      PROJECT_TYPE.TIME_AND_MATERIAL,
      PROJECT_TYPE.PARTNERSHIP
    ], {
      required_error: t("projects.createProjectForm.projectTypeRequired"),
    }),
    payment_frequency: z.enum([
      PAYMENT_FREQUENCY.MONTHLY,
      PAYMENT_FREQUENCY.QUARTERLY,
      PAYMENT_FREQUENCY.HALF_YEARLY,
      PAYMENT_FREQUENCY.MILESTONE_BOUND
    ], {
      required_error: t("projects.createProjectForm.paymentFrequencyRequired"),
    }),
    config_template_id: z.string({
      required_error: t("projects.createProjectForm.configTemplateRequired"),
    }),
  }).refine(data => data.planned_end_date > data.start_date, {
    message: t("projects.createProjectForm.endDateAfterStartDate"),
    path: ["planned_end_date"],
  });

  // Initialize form with React Hook Form
  const form = useForm({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: "",
      start_date: new Date(),
      customer_id: "",
      planned_end_date: new Date(new Date().setMonth(new Date().getMonth() + 3)),
      project_type: PROJECT_TYPE.FIXED_BID,
      payment_frequency: PAYMENT_FREQUENCY.MONTHLY,
      config_template_id: "",
    },
  });

  // Form submission handler
  const handleSubmit = async (values) => {
    try {
      console.log("Project data:", values);

      await createProject(values).unwrap();

      toast.success(t("projects.createProjectForm.projectAddedSuccess"));

      // Call the onProjectAdded callback if provided
      if (onProjectAdded) {
        onProjectAdded(values);
      }

      // Close the dialog
      setOpen(false);

      // Reset the form
      form.reset();
    } catch (e) {
      console.error("Error adding project:", e);
      toast.error(t("projects.createProjectForm.projectAddedError"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t("projects.createProjectForm.title")}</DialogTitle>
          <DialogDescription>
            {t("projects.createProjectForm.description")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6 py-4"
          >
            {/* Project Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("projects.createProjectForm.projectName")} <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder={t("projects.createProjectForm.projectNamePlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Project Type */}
            <FormField
              control={form.control}
              name="project_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("projects.createProjectForm.projectType")} <span className="text-red-500">*</span></FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("projects.createProjectForm.selectProjectType")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {projectTypeOptions.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Payment Frequency */}
            <FormField
              control={form.control}
              name="payment_frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("projects.createProjectForm.paymentFrequency")} <span className="text-red-500">*</span></FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("projects.createProjectForm.selectPaymentFrequency")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {paymentFrequencyOptions.map((frequency) => (
                        <SelectItem key={frequency.id} value={frequency.id}>
                          {frequency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>

            {/* Customer Dropdown */}
            <FormField
              control={form.control}
              name="customer_id"
              render={({ field }) => (
                <FormItem className="flex flex-col relative">
                  <FormLabel>{t("projects.createProjectForm.customer")} <span className="text-red-500">*</span></FormLabel>

                  <FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOpenCustomerCombobox(true)}
                      className={cn(
                        "justify-between w-full font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? customers.find((customer) => customer.id === field.value)?.name
                        : t("projects.createProjectForm.selectCustomer")}
                      <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>

                  <CommandDialog open={openCustomerCombobox} onOpenChange={setOpenCustomerCombobox}>
                    <CommandInput
                      placeholder={t("projects.createProjectForm.searchCustomers")}
                      value={searchCustomers}
                      onValueChange={setSearchCustomers}
                      autoFocus
                    />
                    <CommandList>
                      <CommandEmpty>{isLoadingCustomers ? t("common.loading") : t("projects.createProjectForm.noCustomersFound")}</CommandEmpty>
                      <CommandGroup>
                        {customers.map((customer) => (
                          <CommandItem
                            keywords={[customer.name, customer.primary_email]}
                            key={customer.id}
                            value={customer.name}
                            onSelect={() => {
                              form.setValue("customer_id", customer.id);
                              setOpenCustomerCombobox(false);
                            }}
                          >
                            <div className="flex flex-col">
                              <div>{customer.name}</div>
                              <div className="text-xs text-muted-foreground">{customer.primary_email}</div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </CommandDialog>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Config Template Dropdown */}
            <FormField
              control={form.control}
              name="config_template_id"
              render={({ field }) => (
                <FormItem className="flex flex-col relative">
                  <FormLabel>{t("projects.createProjectForm.configTemplate")} <span className="text-red-500">*</span></FormLabel>

                  <FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOpenTemplateCombobox(true)}
                      className={cn(
                        "justify-between w-full font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? configTemplates.find((template) => template.id === field.value)?.name
                        : t("projects.createProjectForm.selectConfigTemplate")}
                      <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>

                  <CommandDialog open={openTemplateCombobox} onOpenChange={setOpenTemplateCombobox}>
                    <CommandInput
                      placeholder={t("projects.createProjectForm.searchTemplates")}
                      autoFocus
                    />
                    <CommandList>
                      <CommandEmpty>{isLoadingTemplates ? t("common.loading") : t("projects.createProjectForm.noTemplatesFound")}</CommandEmpty>
                      <CommandGroup>
                        {configTemplates.map((template) => (
                          <CommandItem
                            key={template.id}
                            value={template.name}
                            onSelect={() => {
                              form.setValue("config_template_id", template.id);
                              setOpenTemplateCombobox(false);
                            }}
                            keywords={[template.name, template.description, template.estimation_mode]}
                          >
                            <div className="flex flex-col">
                              <div>{template.name}</div>
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                {template?.estimation_mode} <Dot /> {template?.hours_per_day} hr/day
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </CommandDialog>

                  <FormMessage />
                  {/* <div className="text-right">
                    <Button
                      disabled={form.getValues("config_template_id") === null || form.getValues("config_template_id") === ''}
                      variant="link" 
                      className={cn(
                        "p-0 h-auto text-xs hover:border-transparent",
                        (form.getValues("config_template_id") === null || form.getValues("config_template_id") === '') ? "text-muted-foreground cursor-not-allowed" : ""
                      )} 
                      type="button"
                    >
                      <ChevronsUpDown className="-mr-1" />{t("projects.createProjectForm.advancedOptions")}
                    </Button>
                  </div> */}
                </FormItem>
              )}
            />

            {/* Date Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Start Date */}
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t("projects.createProjectForm.startDate")} <span className="text-red-500">*</span></FormLabel>
                    <Popover modal>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>{t("projects.createProjectForm.pickDate")}</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Planned End Date */}
              <FormField
                control={form.control}
                name="planned_end_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t("projects.createProjectForm.plannedEndDate")} <span className="text-red-500">*</span></FormLabel>
                    <Popover modal>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>{t("projects.createProjectForm.pickDate")}</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          disabled={(date) => date < form.getValues("start_date")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                {t("common.cancel")}
              </Button>
              <Button type="submit">
                {form.formState.isSubmitting || isLoadingCreateProject ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("projects.createProjectForm.creatingProject")}
                  </>
                ) : (
                  t("projects.createProjectForm.createProject")
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

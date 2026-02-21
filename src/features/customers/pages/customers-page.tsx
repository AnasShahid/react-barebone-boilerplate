import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Search, Loader2 } from "lucide-react";
import { useGetAllCustomersQuery, useDeleteCustomerMutation } from "../services";
import { toast } from "sonner";
import { AddCustomerDialog } from "../components/add-customer-dialog";
import { CustomersCards } from "../components/customers-cards";
import { CustomersTable } from "../components/customers-table";
import { LayoutSwitcher } from "../components/layout-switcher";
import { ResourcesPageHeader } from "@/components/resources-page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { SEO } from "@/components/seo";

const CUSTOMER_STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "LEAD", label: "Lead" },
  { value: "PROSPECT", label: "Prospect" },
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
];

interface Customer {
  id: string;
  name?: string;
  customer_status?: string;
  primary_email?: string;
  primary_phone?: string;
  contacts?: unknown[];
  createdAt?: string;
}

export const CustomersPage = () => {
  const { t } = useTranslation();
  const [layout, setLayout] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 12;

  const queryParams = {
    page,
    limit,
    ...(searchQuery ? { search: searchQuery } : {}),
    ...(statusFilter && statusFilter !== "all" ? { status: statusFilter } : {}),
  };

  const { data, isLoading, refetch } = useGetAllCustomersQuery(queryParams);
  const [deleteCustomer] = useDeleteCustomerMutation();

  const customers: Customer[] = (data as { customers?: Customer[] })?.customers ?? [];
  const pagination = (data as { pagination?: { page: number; limit: number; total: number } })?.pagination;

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    setPage(newPage);
  };

  const handleDeleteCustomer = async (customer: Customer) => {
    try {
      await deleteCustomer(customer.id).unwrap();
      toast.success(t("customers.deleteSuccess", "Customer deleted successfully"));
      refetch();
    } catch (error) {
      console.error("Failed to delete customer:", error);
      toast.error(t("customers.deleteError", "Failed to delete customer"));
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  return (
    <>
      <SEO
        title={t("customers.title", "Customers")}
        description={t("customers.description", "Manage your customers")}
      />
      <ResourcesPageHeader
        title={t("customers.title", "Customers")}
        action={
          <div className="flex items-center gap-2">
            <AddCustomerDialog
              triggerButton={
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  {t("customers.addCustomer", "Add Customer")}
                </Button>
              }
              onCustomerAdded={() => refetch()}
            />
          </div>
        }
      />
      <div className="mt-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-1 gap-3 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("customers.searchPlaceholder", "Search customers...")}
                className="pl-8"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <Select value={statusFilter} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {CUSTOMER_STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <LayoutSwitcher layout={layout} setLayout={setLayout} />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : layout === "grid" ? (
          <CustomersCards
            customers={customers}
            isLoading={isLoading}
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            handlePageChange={handlePageChange}
            pagination={pagination}
            onDeleteCustomer={handleDeleteCustomer}
          />
        ) : (
          <CustomersTable
            customers={customers}
            isLoading={isLoading}
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            handlePageChange={handlePageChange}
            pagination={pagination}
          />
        )}
      </div>
    </>
  );
};

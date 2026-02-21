import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import { Frown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  Pagination, PaginationContent, PaginationEllipsis, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface Customer {
  id: string;
  name?: string;
  customer_status?: string;
  primary_email?: string;
  primary_phone?: string;
  contacts?: unknown[];
  createdAt?: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
}

interface CustomersCardsProps {
  customers?: Customer[];
  isLoading?: boolean;
  searchQuery?: string;
  statusFilter?: string;
  handlePageChange: (page: number) => void;
  pagination?: PaginationInfo;
  onDeleteCustomer?: (customer: Customer) => void;
}

export const CustomersCards = ({
  customers = [],
  isLoading = false,
  searchQuery = '',
  statusFilter = '',
  handlePageChange,
  pagination,
  onDeleteCustomer,
}: CustomersCardsProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const renderCards = () => {
    if (!customers || customers.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <Frown className="h-16 w-16 text-slate-300 mb-4" />
          <h3 className="text-xl font-semibold mb-2">{t("customers.customersCards.noCustomersFound")}</h3>
          <p className="text-slate-500 max-w-md">
            {searchQuery || statusFilter
              ? t("customers.customersCards.tryAdjustingSearch")
              : t("customers.customersCards.noCustomersYet")}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((customer) => (
          <Card key={customer.id} className="w-full">
            <CardHeader>
              <CardTitle>
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold tracking-tight">{customer.name || "Unnamed Customer"}</h3>
                  <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${customer.customer_status === "active" ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-800"}`}>
                    {customer.customer_status || "Unknown"}
                  </div>
                </div>
              </CardTitle>
              <CardDescription className="whitespace-nowrap overflow-hidden text-ellipsis max-w-full block">
                {customer.id}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">{t("customers.email", "Email")}</span>
                  <span className="text-sm font-medium">{customer.primary_email || t("customers.noEmailProvided", "Not provided")}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">{t("customers.phone", "Phone")}</span>
                  <span className="text-sm font-medium">{customer.primary_phone || t("customers.noPhoneProvided", "Not provided")}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">{t("customers.contacts", "Contacts")}</span>
                  <span className="text-sm font-medium">
                    {customer.contacts && customer.contacts.length > 0
                      ? customer.contacts.length + ' ' + t("customers.customersCards.contacts")
                      : t("customers.customersCards.noContacts")}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">{t("customers.addedOn", "Added On")}</span>
                  <span className="text-sm font-medium">
                    {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : '-'}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">{t('customers.actions.delete', 'Delete')}</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('customers.deleteConfirm', 'Are you sure you want to delete this customer?')}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t('customers.deleteWarning', 'This action cannot be undone. This will permanently delete the customer {name} and all associated data.', { name: customer?.name })}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('common.cancel', 'Cancel')}</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        if (onDeleteCustomer) {
                          onDeleteCustomer(customer);
                        } else {
                          toast.error(t('customers.deleteNotImplemented', 'Delete functionality not implemented'));
                        }
                      }}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      {t('common.delete', 'Delete')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button onClick={() => navigate(`/customers/${customer.id}`)}>
                {t('customers.actions.view', 'View Customer')}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  const generatePagination = (): (number | string)[] => {
    if (!pagination) return [];
    const currentPage = pagination.page || 1;
    const totalPages = Math.ceil((pagination.total || 0) / (pagination.limit || 1));
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | string)[] = [1];
    if (currentPage > 3) pages.push('ellipsis-start');
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);
    for (let i = startPage; i <= endPage; i++) {
      if (i > 1 && i < totalPages) pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('ellipsis-end');
    if (totalPages > 1) pages.push(totalPages);
    return pages;
  };

  const calculateTotalPages = () => {
    if (!pagination) return 1;
    return Math.ceil((pagination.total || 0) / (pagination.limit || 1));
  };

  return (
    <div className="w-full">
      {isLoading && (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      {!isLoading && renderCards()}
      {!isLoading && customers && customers.length > 0 && pagination && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={!pagination || pagination.page <= 1}
                className={(!pagination || pagination.page <= 1) ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {generatePagination().map((page, idx) => {
              if (page === 'ellipsis-start' || page === 'ellipsis-end') {
                return (
                  <PaginationItem key={`ellipsis-${idx}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={pagination.page === page}
                    onClick={() => handlePageChange(page as number)}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!pagination || pagination.page >= calculateTotalPages()}
                className={(!pagination || pagination.page >= calculateTotalPages()) ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

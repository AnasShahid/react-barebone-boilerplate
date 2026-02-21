import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Search, User2, AlertCircle } from 'lucide-react';
import { useGetAllCustomersQuery } from '@/features/customers/services';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export function SelectCustomerModal({ open, onOpenChange, onSelectCustomer, currentCustomerId }) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState(currentCustomerId);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  
  // Using the getAllCustomers query with search
  const { data, isLoading, error, refetch } = useGetAllCustomersQuery({
    page,
    limit: 30,
    search: debouncedSearch,
  });

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset to first page on new search
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Set selected customer ID when modal opens
  useEffect(() => {
    if (open) {
      setSelectedCustomerId(currentCustomerId);
      refetch(); // Ensure we have fresh data when opening
    }
  }, [open, currentCustomerId, refetch]);

  const handleSelectCustomer = (customer) => {
    setSelectedCustomerId(customer.id);
    onSelectCustomer(customer);
    onOpenChange(false);
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Access the correct data structure from the API response
  const customers = data?.customers || [];
  const pagination = data?.pagination || { total: 0, totalPages: 0 };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center justify-between">
              {t('projects.selectCustomer', 'Select a Customer')}
              <Badge variant="outline" className="text-xs mr-4">
                {t('common.showing', 'Showing')} {customers.length} {t('common.of', 'of')} {pagination.total} {t('customers.customers', 'customers')}
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="flex items-center border rounded-md px-3">
          <Search className="h-4 w-4 text-muted-foreground mr-2" />
          <Input
            className="flex-1 border-0 p-0 shadow-none focus-visible:ring-0"
            placeholder={t('customers.searchCustomers', 'Search customers...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <ScrollArea className="max-h-[300px] overflow-y-auto pr-4">
          {error ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <AlertCircle className="h-10 w-10 text-destructive mb-2" />
              <p className="text-muted-foreground">
                {t('common.error', 'An error occurred while fetching customers')}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{error.toString()}</p>
            </div>
          ) : isLoading ? (
            Array(5)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="flex items-center gap-3 py-2 mb-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-3 w-[150px]" />
                  </div>
                </div>
              ))
          ) : customers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <User2 className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">
                {debouncedSearch
                  ? t('customers.noCustomersFound', 'No customers found')
                  : t('customers.noCustomersAvailable', 'No customers available')}
              </p>
              {debouncedSearch && (
                <p className="text-xs text-muted-foreground mt-1">
                  {t('customers.searchTermUsed', 'Search: "{{term}}"', { term: debouncedSearch })}
                </p>
              )}
            </div>
          ) : (
            <>
              {customers.map((customer) => (
                <div
                  key={customer.id}
                  className={`flex items-center justify-between p-2 rounded-md mb-2 hover:bg-accent cursor-pointer ${
                    selectedCustomerId === customer.id ? 'bg-accent' : ''
                  }`}
                  onClick={() => handleSelectCustomer(customer)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={customer?.logo} alt={customer?.name} />
                      <AvatarFallback>{getInitials(customer?.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground">
                          {customer.primary_email || t("customers.noEmailProvided")}
                        </p>
                        {customer.status && (
                          <Badge variant={customer.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                            {customer.status}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  {selectedCustomerId === customer.id && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
              ))}
            </>
          )}
        </ScrollArea>
      </DialogContent>
      {!isLoading && customers.length > 0 && pagination.totalPages > 1 && (
        <DialogFooter className="sm:justify-start border-t p-2">
          <div className="flex justify-between items-center w-full text-xs">
            <span className="text-muted-foreground">
              {t('common.page', 'Page')} {page} {t('common.of', 'of')} {pagination.totalPages}
            </span>
            <div className="flex gap-1">
              <Badge 
                variant={page > 1 ? "outline" : "secondary"}
                className="cursor-pointer"
                onClick={() => page > 1 && setPage(prev => prev - 1)}
              >
                {t('common.previous', 'Previous')}
              </Badge>
              <Badge 
                variant={page < pagination.totalPages ? "outline" : "secondary"}
                className="cursor-pointer"
                onClick={() => page < pagination.totalPages && setPage(prev => prev + 1)}
              >
                {t('common.next', 'Next')}
              </Badge>
            </div>
          </div>
        </DialogFooter>
      )}
    </Dialog>
  );
}

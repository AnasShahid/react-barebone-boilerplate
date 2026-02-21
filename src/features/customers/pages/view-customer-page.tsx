import { useState } from "react";
import { SEO } from '@/components/seo';
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetCustomerByIdQuery, useUpdateCustomerStatusMutation,
  useDeleteCustomerContactMutation, useDeleteCustomerMutation,
} from "../services";
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Mail, Phone, MapPin, User, Edit, Clock, ArrowLeft, CalendarClock,
  Plus, Frown, CornerUpLeft, Trash, Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { EditCustomerInfoDialog } from "../components/dialogs/edit-customer-info-dialog";
import { EditCustomerAddressDialog } from "../components/dialogs/edit-customer-address-dialog";
import { ManageContactDialog } from "../components/dialogs/manage-contact-dialog";

interface Address {
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
}

interface Contact {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  designation?: string;
  address?: Address;
}

interface StatusHistoryItem {
  id?: string;
  new_status?: string;
  previous_status?: string;
  change_reason?: string;
  createdAt?: string;
}

interface Customer {
  id: string;
  name?: string;
  primary_email?: string;
  primary_phone?: string;
  customer_status?: string;
  primary_address?: Address;
  contacts?: Contact[];
  status_history?: StatusHistoryItem[];
  logo?: string;
  createdAt?: string;
  updatedAt?: string;
}

const STATUS_OPTIONS = ["LEAD", "ACTIVE", "INACTIVE", "PROSPECT"] as const;

const STATUS_COLOR_MAP: Record<string, string> = {
  LEAD: "#a855f7",
  ACTIVE: "#22c55e",
  INACTIVE: "#6b7280",
  PROSPECT: "#3b82f6",
};

const getStatusColorHex = (status?: string) => {
  if (!status) return "#9ca3af";
  return STATUS_COLOR_MAP[status.toUpperCase()] ?? "#9ca3af";
};

const getStatusBadgeVariant = (status?: string): string => {
  if (!status) return "outline";
  const map: Record<string, string> = {
    LEAD: "warning", ACTIVE: "success", INACTIVE: "secondary", PROSPECT: "blue",
  };
  return map[status.toUpperCase()] ?? "outline";
};

export const ViewCustomerPage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: customer, isLoading, refetch } = useGetCustomerByIdQuery(id ?? '');
  const [updateCustomerStatus, { isLoading: isStatusUpdating }] = useUpdateCustomerStatusMutation();
  const [deleteContact, { isLoading: isContactDeleting }] = useDeleteCustomerContactMutation();
  const [deleteCustomer, { isLoading: isDeleting }] = useDeleteCustomerMutation();

  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerDeleteDialogOpen, setCustomerDeleteDialogOpen] = useState(false);

  const typedCustomer = customer as Customer | undefined;

  const formatDate = (dateString?: string) => {
    if (!dateString) return t("common.notAvailable");
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name.split(' ').map(p => p[0]).join('').toUpperCase().substring(0, 2);
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateCustomerStatus({ id: id ?? '', new_status: newStatus, change_reason: `Status changed to ${newStatus}` }).unwrap();
      toast.success(t("customer.statusUpdated"));
      refetch();
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error(t("customer.statusUpdateError"));
    }
  };

  const handleDeleteContact = async () => {
    if (!contactToDelete) return;
    try {
      await deleteContact({ contactId: contactToDelete.id }).unwrap();
      toast.success(t("customers.contact.deleteSuccess"));
      setDeleteDialogOpen(false);
      setContactToDelete(null);
      refetch();
    } catch (error) {
      console.error("Failed to delete contact:", error);
      toast.error(t("customers.contact.deleteError"));
    }
  };

  const handleDeleteCustomer = async () => {
    if (!id) return;
    try {
      await deleteCustomer(id).unwrap();
      toast.success(t("customer.deleteSuccess"));
      setCustomerDeleteDialogOpen(false);
      navigate('/customers');
    } catch (error) {
      console.error("Failed to delete customer:", error);
      toast.error(t("customer.deleteError"));
    }
  };

  const openDeleteDialog = (contact: Contact) => {
    setContactToDelete(contact);
    setDeleteDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <SEO title={t("customer.view.title")} description={t("customer.view.subtitle")} />
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />{t("common.back")}
          </Button>
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1"><Skeleton className="h-48 w-full rounded-lg" /></div>
            <div className="md:col-span-2">
              <Skeleton className="h-12 w-full mb-4 rounded-lg" />
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>
          </div>
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <SEO
        title={(typedCustomer?.name && `Manage ${typedCustomer.name}`) || t("customer.view.title")}
        description={t("customer.view.subtitle")}
      />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 mt-4">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="mr-3">
            <Avatar className="h-16 w-16">
              <AvatarImage src={typedCustomer?.logo} alt={typedCustomer?.name} />
              <AvatarFallback>{getInitials(typedCustomer?.name)}</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">{typedCustomer?.name}</h1>
              {typedCustomer?.customer_status && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-3 pl-3 pr-2 h-9 gap-1 border-2" disabled={isStatusUpdating}>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getStatusColorHex(typedCustomer.customer_status) }} />
                        <span>{typedCustomer.customer_status}</span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[200px]">
                    {STATUS_OPTIONS.map((status) => {
                      const isActive = status === typedCustomer.customer_status;
                      return (
                        <DropdownMenuItem
                          key={status}
                          disabled={isActive || isStatusUpdating}
                          onClick={() => handleStatusChange(status)}
                          className={`flex items-center gap-2 py-2 ${isActive ? "bg-muted" : ""}`}
                        >
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getStatusColorHex(status) }} />
                          <span>{status}</span>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            <div className="flex flex-row gap-3 text-gray-500">
              <span>{typedCustomer?.primary_email || t("customers.noEmailProvided")}</span>
              {' | '}
              <span>{typedCustomer?.primary_phone || t("customers.noPhoneProvided")}</span>
              {' | '}
              <span className="inline-flex flex-row gap-2 items-center">
                <CalendarClock className="h-4 w-4 text-muted-foreground" /> {formatDate(typedCustomer?.createdAt)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="mr-2" onClick={() => navigate('/customers')}>
            <CornerUpLeft className="h-4 w-4" />
          </Button>
          <EditCustomerInfoDialog
            triggerButton={
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />{t("common.edit")}
              </Button>
            }
            customer={typedCustomer}
            onCustomerUpdated={() => refetch()}
          />
          <Button variant="destructive" size="sm" onClick={() => setCustomerDeleteDialogOpen(true)}>
            <Trash className="h-4 w-4 mr-2" />{t("common.delete")}
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        <section className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Card className="md:col-span-1 h-fit">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl">{t("customer.primaryAddress")}</CardTitle>
                  <EditCustomerAddressDialog
                    triggerButton={
                      <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1">
                        <Edit className="h-3 w-3" />
                      </Button>
                    }
                    customer={typedCustomer}
                    onCustomerUpdated={() => refetch()}
                  />
                </CardHeader>
                <CardContent className="space-y-4">
                  {typedCustomer?.primary_address ? (
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 mr-3 text-muted-foreground mt-1" />
                      <div className="flex flex-col">
                        <p>{typedCustomer.primary_address.address_line_1}</p>
                        {typedCustomer.primary_address.address_line_2 && <p>{typedCustomer.primary_address.address_line_2}</p>}
                        <p>{[typedCustomer.primary_address.city, typedCustomer.primary_address.state, typedCustomer.primary_address.postal_code].filter(Boolean).join(", ")}</p>
                        <p>{typedCustomer.primary_address.country}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground flex items-start">
                      <MapPin className="h-4 w-4 mr-3 text-muted-foreground mt-1" /> {t("customer.noAddressProvided")}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="md:col-span-1 h-fit mt-6">
                <CardHeader>
                  <CardTitle className="text-xl">{t("customer.statusHistory")}</CardTitle>
                </CardHeader>
                <CardContent>
                  {typedCustomer?.status_history && typedCustomer.status_history.length > 0 ? (
                    <ScrollArea className="h-[300px]">
                      <div className="relative pl-6 ml-2 border-l border-border space-y-6 py-2">
                        {typedCustomer.status_history.map((item, index) => (
                          <div key={item.id || index} className="relative">
                            <div
                              className="absolute -left-[32px] w-4 h-4 rounded-full border-2 border-background z-10"
                              style={{ backgroundColor: getStatusColorHex(item.new_status) }}
                            />
                            <div>
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                                <div className="flex items-center gap-2">
                                  <Badge variant={getStatusBadgeVariant(item.new_status) as Parameters<typeof Badge>[0]['variant']}>{item.new_status}</Badge>
                                  {item.previous_status && (
                                    <div className="flex items-center text-sm text-muted hover:text-muted-foreground">
                                      <span className="mx-1">from</span>
                                      <Badge variant={getStatusBadgeVariant(item.previous_status) as Parameters<typeof Badge>[0]['variant']} className="opacity-70">{item.previous_status}</Badge>
                                    </div>
                                  )}
                                </div>
                                <span className="text-xs text-muted-foreground">{formatDate(item.createdAt)}</span>
                              </div>
                              {item.change_reason && <p className="text-sm mt-1">{item.change_reason}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-50" />
                      <p className="text-muted-foreground">{t("customer.noStatusHistory")}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-2xl font-semibold">{t("customer.contactsSection")}</h2>
            <ManageContactDialog
              triggerButton={
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />{t("customer.addContact")}
                </Button>
              }
              customerId={typedCustomer?.id}
              onContactSaved={() => refetch()}
            />
          </div>

          {typedCustomer?.contacts && typedCustomer.contacts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {typedCustomer.contacts.map((contact) => (
                <Card key={contact.id} className="h-full">
                  <CardHeader className="pb-2">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>{getInitials(`${contact.first_name} ${contact.last_name}`)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{contact.first_name} {contact.last_name}</CardTitle>
                        <CardDescription className="text-xs">{contact.designation || t("customers.noDesignation")}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="mt-2 space-y-2">
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{contact.email || t("customers.noEmail")}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{contact.phone || t("customers.noPhone")}</span>
                    </div>
                    {contact.address && (
                      <div className="flex items-start text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground mt-1" />
                        <span>{contact.address.city}, {contact.address.country}</span>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <div className="flex justify-end w-full space-x-2">
                      <ManageContactDialog
                        triggerButton={
                          <Button variant="ghost" size="sm">
                            <Edit className="h-3.5 w-3.5 mr-1" />{t("common.edit")}
                          </Button>
                        }
                        customerId={typedCustomer.id}
                        contact={contact}
                        onContactSaved={() => refetch()}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => openDeleteDialog(contact)}
                        disabled={isContactDeleting && contactToDelete?.id === contact.id}
                      >
                        {isContactDeleting && contactToDelete?.id === contact.id ? (
                          <><Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />{t("common.deleting")}</>
                        ) : (
                          <><Trash className="h-3.5 w-3.5 mr-1" />{t("common.delete")}</>
                        )}
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Frown className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">{t("customer.noContacts")}</h3>
                <p className="text-muted-foreground mb-4">{t("customer.noContactsDescription")}</p>
                <ManageContactDialog
                  triggerButton={
                    <Button>
                      <User className="h-4 w-4 mr-2" />{t("customer.addFirstContact")}
                    </Button>
                  }
                  customerId={typedCustomer?.id}
                  onContactSaved={() => refetch()}
                />
              </CardContent>
            </Card>
          )}
        </section>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("customers.contact.deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("customers.contact.deleteDescription")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("customers.contact.cancelDelete")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteContact} className="bg-red-500 hover:bg-red-600" disabled={isContactDeleting}>
              {isContactDeleting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t("common.deleting")}</> : t("customers.contact.confirmDelete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={customerDeleteDialogOpen} onOpenChange={setCustomerDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("customer.deleteCustomer")}</AlertDialogTitle>
            <AlertDialogDescription>{t("customer.deleteCustomerConfirmation")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("customer.cancelDelete")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCustomer} className="bg-red-500 hover:bg-red-600" disabled={isDeleting}>
              {isDeleting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t("common.deleting")}</> : t("customer.confirmDelete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

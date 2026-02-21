import { useState } from "react";
import {
  flexRender, getCoreRowModel, getPaginationRowModel,
  getSortedRowModel, useReactTable,
} from "@tanstack/react-table";
import type { ColumnDef, SortingState, RowSelectionState } from "@tanstack/react-table";
import {
  Mail, Phone, User, Frown, ChevronDown, ChevronUp, Eye, Trash2, MoreHorizontal
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface Customer {
  id: string;
  name?: string;
  primary_email?: string;
  primary_phone?: string;
  contacts?: unknown[];
  customer_status?: string;
  createdAt?: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
}

interface CustomersTableProps {
  customers?: Customer[];
  isLoading?: boolean;
  searchQuery?: string;
  statusFilter?: string;
  handlePageChange: (page: number) => void;
  pagination?: PaginationInfo;
}

export const CustomersTable = ({
  customers, isLoading, searchQuery, statusFilter, handlePageChange, pagination,
}: CustomersTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const navigate = useNavigate();
  const { t } = useTranslation();

  const columns: ColumnDef<Customer>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          {t("customers.customersTable.name")}
          {column.getIsSorted() === "asc" ? <ChevronUp className="ml-2 h-4 w-4" /> : column.getIsSorted() === "desc" ? <ChevronDown className="ml-2 h-4 w-4" /> : null}
        </div>
      ),
      cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
    },
    {
      accessorKey: "primary_email",
      header: t("customers.customersTable.email"),
      cell: ({ row }) => (
        <div className="flex items-center">
          <Mail className="h-4 w-4 mr-2 text-slate-500" />
          <span>{row.original.primary_email || t("customers.noEmailProvided")}</span>
        </div>
      ),
    },
    {
      accessorKey: "primary_phone",
      header: t("customers.customersTable.phone"),
      cell: ({ row }) => (
        <div className="flex items-center">
          <Phone className="h-4 w-4 mr-2 text-slate-500" />
          <span>{row.original.primary_phone || t("customers.noPhoneProvided")}</span>
        </div>
      ),
    },
    {
      accessorKey: "contacts",
      header: t("customers.customersTable.contactPerson"),
      cell: ({ row }) => (
        <div className="flex items-center">
          <User className="h-4 w-4 mr-2 text-slate-500" />
          <span>{row.original.contacts && row.original.contacts.length > 0 ? row.original.contacts.length + ' ' + t("customers.customersCards.contacts") : t("customers.customersCards.noContacts")}</span>
        </div>
      ),
    },
    {
      accessorKey: "customer_status",
      header: t("customers.customersTable.status"),
      cell: ({ row }) => {
        const status = row.original.customer_status;
        return (
          <Badge variant={status === "active" ? "success" : status === "inactive" ? "secondary" : "outline"}>
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          {t("customers.customersTable.createdAt")}
          {column.getIsSorted() === "asc" ? <ChevronUp className="ml-2 h-4 w-4" /> : column.getIsSorted() === "desc" ? <ChevronDown className="ml-2 h-4 w-4" /> : null}
        </div>
      ),
      cell: ({ row }) => row.original.createdAt ? new Date(row.original.createdAt).toLocaleDateString() : '-',
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const customer = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">{t("customers.customersTable.openMenu")}</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer flex items-center" onClick={() => navigate(`/customers/${customer.id}`)}>
                <Eye className="mr-2 h-4 w-4" />
                <span>{t("customers.customersTable.viewCustomer")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer flex items-center text-destructive focus:text-destructive" onClick={() => console.log("Delete customer", customer.id)}>
                <Trash2 className="mr-2 h-4 w-4" />
                <span>{t("customers.customersTable.deleteCustomer")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: customers || [],
    columns,
    state: { sorting, rowSelection },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: pagination ? Math.ceil(pagination.total / pagination.limit) : 0,
  });

  const calculateTotalPages = () => {
    if (!pagination) return 1;
    return Math.ceil((pagination.total || 0) / (pagination.limit || 1));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-slate-200 rounded-full mb-4"></div>
          <div className="h-4 bg-slate-200 rounded w-32 mb-2"></div>
          <div className="h-3 bg-slate-200 rounded w-24"></div>
        </div>
      </div>
    );
  }

  if (!customers || customers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <Frown className="h-16 w-16 text-slate-300 mb-4" />
        <h3 className="text-xl font-semibold mb-2">{t("customers.customersCards.noCustomersFound")}</h3>
        <p className="text-slate-500 max-w-md">
          {searchQuery || statusFilter ? t("customers.customersCards.tryAdjustingSearch") : t("customers.customersCards.noCustomersYet")}
        </p>
      </div>
    );
  }

  const selectedRowCount = Object.keys(rowSelection).length;
  const totalRowCount = customers.length;

  return (
    <div className="w-full space-y-6 mt-6">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-slate-500">
          {selectedRowCount} {t("customers.customersTable.outOf")} {totalRowCount} {totalRowCount !== 1 ? t("customers.customersTable.rows") : t("customers.customersTable.row")} {t("customers.customersTable.selected")}
        </div>
        {pagination && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page <= 1} className={pagination.page <= 1 ? "opacity-50" : ""}>
              {t("customers.customersTable.previous")}
            </Button>
            <span className="text-sm text-slate-500">
              {t("customers.customersTable.page")} {pagination.page} {t("customers.customersTable.of")} {calculateTotalPages()}
            </span>
            <Button variant="outline" size="sm" onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page >= calculateTotalPages()} className={pagination.page >= calculateTotalPages() ? "opacity-50" : ""}>
              {t("customers.customersTable.next")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

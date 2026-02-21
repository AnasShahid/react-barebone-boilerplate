"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

export function DataTable({
  columns,
  data,
  loading = false,
  emptyMessage = "No results.",
  pagination = { enabled: true, pageSize: 10 },
  sorting = { enabled: true },
  filtering = { enabled: true },
  selection = { enabled: false },
  onRowClick,
  onSelectionChange,
  className = "",
  ...props
}) {
  const [sortingState, setSorting] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState([])
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data: data || [],
    columns,
    onSortingChange: sorting.enabled ? setSorting : undefined,
    onColumnFiltersChange: filtering.enabled ? setColumnFilters : undefined,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: pagination.enabled ? getPaginationRowModel() : undefined,
    getSortedRowModel: sorting.enabled ? getSortedRowModel() : undefined,
    getFilteredRowModel: filtering.enabled ? getFilteredRowModel() : undefined,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: selection.enabled ? setRowSelection : undefined,
    state: {
      sorting: sortingState,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: pagination.enabled ? {
        pageSize: pagination.pageSize || 10,
      } : undefined,
    },
  })

  // Handle selection change callback
  React.useEffect(() => {
    if (selection.enabled && onSelectionChange) {
      const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original)
      onSelectionChange(selectedRows)
    }
  }, [rowSelection, onSelectionChange, selection.enabled, table])

  if (loading) {
    return (
      <div className={`space-y-3 ${className}`}>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`} {...props}>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => onRowClick?.(row.original)}
                  className={onRowClick ? "cursor-pointer" : ""}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel }

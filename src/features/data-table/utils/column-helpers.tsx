import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';

interface ColumnOptions {
  sortable?: boolean;
  hideable?: boolean;
  [key: string]: unknown;
}

interface ActionItem<TData> {
  label: string;
  onClick: (row: TData) => void;
  disabled?: (row: TData) => boolean;
}

interface StatusConfig {
  variant: string;
  label: string;
}

type StatusMap = Record<string, StatusConfig>;

export function createTextColumn(key: string, header: string, options: ColumnOptions = {}) {
  return {
    accessorKey: key,
    header: ({ column }: { column: unknown }) => (
      <DataTableColumnHeader column={column} title={header} />
    ),
    cell: ({ row }: { row: { getValue: (k: string) => unknown } }) => {
      const value = row.getValue(key);
      return <div className="truncate">{(value as string) || '-'}</div>;
    },
    enableSorting: options.sortable !== false,
    enableHiding: options.hideable !== false,
    ...options,
  };
}

export function createDateColumn(
  key: string,
  header: string,
  dateFormat = 'MMM dd, yyyy',
  options: ColumnOptions = {}
) {
  return {
    accessorKey: key,
    header: ({ column }: { column: unknown }) => (
      <DataTableColumnHeader column={column} title={header} />
    ),
    cell: ({ row }: { row: { getValue: (k: string) => unknown } }) => {
      const date = row.getValue(key);
      if (!date) return <div>-</div>;
      try {
        const formattedDate = format(new Date(date as string), dateFormat);
        return <div>{formattedDate}</div>;
      } catch {
        return <div>Invalid date</div>;
      }
    },
    enableSorting: options.sortable !== false,
    enableHiding: options.hideable !== false,
    ...options,
  };
}

export function createStatusColumn(
  key: string,
  header: string,
  statusMap: StatusMap = {},
  options: ColumnOptions = {}
) {
  const defaultStatusMap: StatusMap = {
    active: { variant: 'default', label: 'Active' },
    inactive: { variant: 'secondary', label: 'Inactive' },
    pending: { variant: 'outline', label: 'Pending' },
    completed: { variant: 'default', label: 'Completed' },
    cancelled: { variant: 'destructive', label: 'Cancelled' },
  };

  const finalStatusMap: StatusMap = { ...defaultStatusMap, ...statusMap };

  return {
    accessorKey: key,
    header: ({ column }: { column: unknown }) => (
      <DataTableColumnHeader column={column} title={header} />
    ),
    cell: ({ row }: { row: { getValue: (k: string) => unknown } }) => {
      const status = row.getValue(key) as string;
      const statusConfig = finalStatusMap[status] ?? { variant: 'outline', label: status };
      return <Badge variant={statusConfig.variant as 'default' | 'secondary' | 'outline' | 'destructive'}>{statusConfig.label}</Badge>;
    },
    filterFn: (row: { getValue: (k: string) => unknown }, id: string, value: string[]) => {
      return value.includes(row.getValue(id) as string);
    },
    enableSorting: options.sortable !== false,
    enableHiding: options.hideable !== false,
    ...options,
  };
}

export function createActionsColumn<TData>(actions: ActionItem<TData>[] = [], options: ColumnOptions = {}) { // TData used in ActionItem
  return {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }: { row: { original: TData } }) => {
      if (!actions.length) return null;
      return (
        <div className="flex items-center gap-2">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                action.onClick(row.original);
              }}
              className="text-sm text-muted-foreground hover:text-foreground"
              disabled={action.disabled?.(row.original)}
            >
              {action.label}
            </button>
          ))}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
    ...options,
  };
}

export function createNumericColumn(
  key: string,
  header: string,
  formatter: (value: unknown) => unknown = (value) => value,
  options: ColumnOptions = {}
) {
  return {
    accessorKey: key,
    header: ({ column }: { column: unknown }) => (
      <DataTableColumnHeader column={column} title={header} />
    ),
    cell: ({ row }: { row: { getValue: (k: string) => unknown } }) => {
      const value = row.getValue(key);
      if (value === null || value === undefined) return <div>-</div>;
      return <div className="text-right">{formatter(value) as string}</div>;
    },
    enableSorting: options.sortable !== false,
    enableHiding: options.hideable !== false,
    ...options,
  };
}

export function createBooleanColumn(key: string, header: string, options: ColumnOptions = {}) {
  return {
    accessorKey: key,
    header: ({ column }: { column: unknown }) => (
      <DataTableColumnHeader column={column} title={header} />
    ),
    cell: ({ row }: { row: { getValue: (k: string) => unknown } }) => {
      const value = row.getValue(key) as boolean;
      return <Badge variant={value ? 'default' : 'secondary'}>{value ? 'Yes' : 'No'}</Badge>;
    },
    filterFn: (row: { getValue: (k: string) => unknown }, id: string, value: string[]) => {
      const rowValue = row.getValue(id) as boolean;
      return value.includes(rowValue ? 'true' : 'false');
    },
    enableSorting: options.sortable !== false,
    enableHiding: options.hideable !== false,
    ...options,
  };
}

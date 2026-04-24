import * as React from "react";

import { cn } from "@/lib/utils";

export type DataTableColumn<T> = {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
};

export type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowKey: (row: T, index: number) => React.Key;
  emptyMessage?: string;
  className?: string;
};

export function DataTable<T>({
  columns,
  data,
  getRowKey,
  emptyMessage = "No records available.",
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn("overflow-x-auto border border-border bg-card", className)}>
      <table className="w-full min-w-[720px] border-collapse text-left">
        <thead className="bg-surface-container">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  "border-b border-border px-4 py-3 text-label-caps text-muted-foreground",
                  column.className,
                )}
                scope="col"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr
                key={getRowKey(row, rowIndex)}
                className="border-b border-border last:border-b-0 hover:bg-surface-container-low"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn("px-4 py-4 text-sm text-foreground", column.className)}
                  >
                    {column.cell(row)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                className="px-4 py-8 text-center text-sm text-muted-foreground"
                colSpan={columns.length}
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

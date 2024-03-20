import { ColumnDef, ColumnFiltersState, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table';
import { Search } from 'lucide-react'
import React from 'react'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function SearchBar<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters
    }
  });

  return (
    <div className="flex items-center gap-x-2 max-w-sm rounded-md border leading-none border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300">
        <Search size={18} className="text-slate-700 inline"/>
        <input
          placeholder="Search class ID"
          value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("id")?.setFilterValue(event.target.value)
          }
          className="w-full h-full focus-visible:ring-0 focus-visible:outline-none px-2 py-0.5 focus-visible:border-b"
        />
      </div>
  )
}
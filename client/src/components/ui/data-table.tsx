import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { Search, CirclePlus, FilePlus2, Filter, Check } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./button";
import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { utils, writeFileXLSX } from "xlsx";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Command, CommandGroup } from "./command";
import { cn } from "@/lib/utils";
import { useFetch } from "@/hooks/fetcher";
import { MajorsType } from "@/pages/admin/data_jurusan/columns";
import clsx from "clsx";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  saveLabel: string;
  isLoading: boolean;
}

interface FilterType {
  id: string;
  value: string[];
}

interface FilterActiveKeyType {
  shorten: string[],
  grade: string[]
}

const grades = [
  "X",
  "XI",
  "XII"
]

export function DataTable<TData, TValue>({
  columns,
  data,
  saveLabel,
  isLoading,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnGlobalFilters, setColumnGlobalFilters] = React.useState("");
  const [columnFilters, setColumnFilters] = React.useState<FilterType[]>([]);
  const tableRef = useRef(null);

  const { data: majors } = useFetch<MajorsType[]>(
    "http://localhost:8800/backend/majors"
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter: columnGlobalFilters,
      columnFilters,
    },
  });

  const exportToSheet = () => {
    const wb = utils.table_to_book(tableRef.current);
    writeFileXLSX(wb, saveLabel.toLowerCase() + "_data.xlsx");
  };

  const [search, setSearch] = React.useState<string>("");

  const [activeFilters, setActiveFilters] = React.useState<FilterActiveKeyType>({
    shorten: [],
    grade: [],
  });

  // Function to toggle filter
  const toggleFilter = (type: keyof FilterActiveKeyType, filter: string) => {
    setActiveFilters((prev) =>
      ({...prev,
      [type] : prev[type].includes(filter)
        ? prev[type].filter((f) => f !== filter)
        : [...prev[type], filter]})
    );
  };

  const searchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  React.useEffect(() => {
    console.log(columnFilters)
  }, [columnFilters])

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex bg-white items-center gap-x-2 max-w-sm rounded-md border leading-none border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300">
          <Search size={18} className="text-primary inline" />
          <input
            placeholder="Search..."
            value={columnGlobalFilters}
            onChange={(event) => setColumnGlobalFilters(event.target.value)}
            className="w-full h-full focus-visible:ring-0 focus-visible:outline-none px-2 py-0.5 border-b border-transparent focus-visible:border-b-slate-200"
          />
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant={"outline"}
            className="flex items-center gap-2 bg-transparent"
            onClick={exportToSheet}
          >
            <FilePlus2 size={18} />
            Export To Sheet
          </Button>
          <Link to="save">
            <Button className="flex items-center gap-2">
              <CirclePlus size={18} />
              Add New {saveLabel}
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4">
        {table
          .getHeaderGroups()
          .some((headerGroup) =>
            headerGroup.headers.some(
              (header) => header.id === "shorten"
            )
          ) && (
          <Popover onOpenChange={() => setSearch("")}>
            <PopoverTrigger asChild>
              <Button
                size={"sm"}
                variant={"outline"}
                className="border-slate-900/10 shadow-none flex items-center gap-2 bg-transparent"
              >
                <div
                  className={clsx(
                    "flex items-center gap-2 border-slate-900/10",
                    activeFilters["shorten"].length > 0 && "border-r pr-2"
                  )}
                >
                  <Filter size={16} /> Major
                </div>
                <div className="flex items-center gap-2 ">
                  {activeFilters["shorten"].length > 2 ? (
                    <h1>{activeFilters["shorten"].length} selected</h1>
                  ) : (
                    <>
                      {activeFilters["shorten"].map((active, index) => (
                        <h1 key={index}>{active}</h1>
                      ))}
                    </>
                  )}
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="overflow-hidden p-0 !w-fit max-w-[15rem] min-w-full flex-nowrap whitespace-nowrap"
            >
              <Command>
                <div className="flex items-center gap-x-2 border-b leading-none border-slate-200 bg-transparent px-3 py-1.5 transition-colors placeholder:text-slate-500 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300">
                  <Search
                    size={16}
                    className="text-primary inline min-h-4 min-w-4"
                  />
                  <input
                    placeholder="Search major..."
                    value={search}
                    onChange={searchHandler}
                    className="h-full placeholder:text-sm focus-visible:ring-0 focus-visible:outline-none px-2 py-1"
                  />
                </div>
                <CommandGroup>
                  <div className="overflow-y-auto max-h-[300px]">
                    {majors
                      .filter((filtered) =>
                        filtered.major_name
                          .toLowerCase()
                          .includes(search.toLowerCase())
                      )
                      .map((major, index) => (
                        <div
                          key={index}
                          className="flex hover:bg-primary/[0.08] cursor-pointer items-center px-2 py-1.5 text-xs gap-2 indent-0"
                          onClick={() => {
                            toggleFilter("shorten", major.shorten);
                            setColumnFilters((prev) => {
                              const majorss = prev.find(
                                (f) => f.id === "shorten"
                              )?.value as string[];
                              if (!majorss) {
                                return [
                                  ...prev,
                                  { id: "shorten", value: [major.shorten] },
                                ];
                              }
                              return prev.map((f) =>
                                f.id === "shorten"
                                  ? {
                                      ...f,
                                      value: activeFilters["shorten"].includes(
                                        major.shorten
                                      )
                                        ? majorss.filter(
                                            (filter) => filter !== major.shorten
                                          )
                                        : [...majorss, major.shorten],
                                    }
                                  : f
                              );
                            });
                          }}
                        >
                          <Check
                            className={cn(
                              "max-h-4 max-w-4 text-primary basis-1/6",
                              activeFilters["shorten"].includes(major.shorten)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          <h1 className="basis-5/6 leading-tight">
                            {major.major_name}
                          </h1>
                        </div>
                      ))}
                  </div>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        )}
        {table
          .getHeaderGroups()
          .some((headerGroup) =>
            headerGroup.headers.some(
              (header) => header.id === "class"
            )
          ) && (
          <Popover onOpenChange={() => setSearch("")}>
            <PopoverTrigger asChild>
              <Button
                size={"sm"}
                variant={"outline"}
                className="border-slate-900/10 shadow-none flex items-center gap-2 bg-transparent"
              >
                <div
                  className={clsx(
                    "flex items-center gap-2 border-slate-900/10",
                    activeFilters["shorten"].length > 0 && "border-r pr-2"
                  )}
                >
                  <Filter size={16} /> Major
                </div>
                <div className="flex items-center gap-2 ">
                  {activeFilters["shorten"].length > 2 ? (
                    <h1>{activeFilters["shorten"].length} selected</h1>
                  ) : (
                    <>
                      {activeFilters["shorten"].map((active, index) => (
                        <h1 key={index}>{active}</h1>
                      ))}
                    </>
                  )}
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="overflow-hidden p-0 !w-fit max-w-[15rem] min-w-full flex-nowrap whitespace-nowrap"
            >
              <Command>
                <div className="flex items-center gap-x-2 border-b leading-none border-slate-200 bg-transparent px-3 py-1.5 transition-colors placeholder:text-slate-500 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300">
                  <Search
                    size={16}
                    className="text-primary inline min-h-4 min-w-4"
                  />
                  <input
                    placeholder="Search major..."
                    value={search}
                    onChange={searchHandler}
                    className="h-full placeholder:text-sm focus-visible:ring-0 focus-visible:outline-none px-2 py-1"
                  />
                </div>
                <CommandGroup>
                  <div className="overflow-y-auto max-h-[300px]">
                    {majors
                      .filter((filtered) =>
                        filtered.major_name
                          .toLowerCase()
                          .includes(search.toLowerCase())
                      )
                      .map((major, index) => (
                        <div
                          key={index}
                          className="flex hover:bg-primary/[0.08] cursor-pointer items-center px-2 py-1.5 text-xs gap-2 indent-0"
                          onClick={() => {
                            toggleFilter("shorten", major.shorten);
                            setColumnFilters((prev) => {
                              const majorss = prev.find(
                                (f) => f.id === "class"
                              )?.value as string[];
                              if (!majorss) {
                                return [
                                  ...prev,
                                  { id: "class", value: [major.shorten] },
                                ];
                              }
                              return prev.map((f) =>
                                f.id === "class"
                                  ? {
                                      ...f,
                                      value: activeFilters["shorten"].includes(
                                        major.shorten
                                      )
                                        ? majorss.filter(
                                            (filter) => filter !== major.shorten
                                          )
                                        : [...majorss, major.shorten],
                                    }
                                  : f
                              );
                            });
                          }}
                        >
                          <Check
                            className={cn(
                              "max-h-4 max-w-4 text-primary basis-1/6",
                              activeFilters["shorten"].includes(major.shorten)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          <h1 className="basis-5/6 leading-tight">
                            {major.major_name}
                          </h1>
                        </div>
                      ))}
                  </div>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        )}
        {table
          .getHeaderGroups()
          .some((headerGroup) =>
            headerGroup.headers.some(
              (header) => header.id === "grade"
            )
          ) && (
          <Popover onOpenChange={() => setSearch("")}>
            <PopoverTrigger asChild>
              <Button
                size={"sm"}
                variant={"outline"}
                className="border-slate-900/10 shadow-none flex items-center gap-2 bg-transparent"
              >
                <div
                  className={clsx(
                    "flex items-center gap-2 border-slate-900/10",
                    activeFilters["grade"].length > 0 && "border-r pr-2"
                  )}
                >
                  <Filter size={16} /> Grade
                </div>
                <div className="flex items-center gap-2 ">
                  {activeFilters["grade"].length > 2 ? (
                    <h1>{activeFilters["grade"].length} selected</h1>
                  ) : (
                    <>
                      {activeFilters["grade"].map((active, index) => (
                        <h1 key={index}>{active}</h1>
                      ))}
                    </>
                  )}
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="overflow-hidden p-0 !w-fit max-w-[7rem] min-w-full flex-nowrap whitespace-nowrap"
            >
              <div className="overflow-y-auto max-h-[300px] w-full PopoverContent">
                {grades.map((grade, index) => (
                  <div
                    key={index}
                    className="flex hover:bg-primary/[0.08] cursor-pointer items-center px-2 py-1.5 text-xs gap-2 indent-0"
                    onClick={() => {
                      toggleFilter("grade", grade);
                      setColumnFilters((prev) => {
                        const gradess = prev.find((f) => f.id === "grade")
                          ?.value as string[];
                        if (!gradess) {
                          return [...prev, { id: "grade", value: [grade] }];
                        }
                        return prev.map((f) =>
                          f.id === "grade"
                            ? {
                                ...f,
                                value: activeFilters["grade"].includes(grade)
                                  ? gradess.filter((filter) => filter !== grade)
                                  : [...gradess, grade],
                              }
                            : f
                        );
                      });
                    }}
                  >
                    <Check
                      className={cn(
                        "max-h-4 max-w-4 min-h-4 min-w-4 text-primary basis-1/6",
                        activeFilters["grade"].includes(grade)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    <h1 className="basis-5/6 leading-tight">{grade}</h1>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
        {table
          .getHeaderGroups()
          .some((headerGroup) =>
            headerGroup.headers.some(
              (header) => header.id === "class"
            )
          ) && (
          <Popover onOpenChange={() => setSearch("")}>
            <PopoverTrigger asChild>
              <Button
                size={"sm"}
                variant={"outline"}
                className="border-slate-900/10 shadow-none flex items-center gap-2 bg-transparent"
              >
                <div
                  className={clsx(
                    "flex items-center gap-2 border-slate-900/10",
                    activeFilters["grade"].length > 0 && "border-r pr-2"
                  )}
                >
                  <Filter size={16} /> Grade
                </div>
                <div className="flex items-center gap-2 ">
                  {activeFilters["grade"].length > 2 ? (
                    <h1>{activeFilters["grade"].length} selected</h1>
                  ) : (
                    <>
                      {activeFilters["grade"].map((active, index) => (
                        <h1 key={index}>{active}</h1>
                      ))}
                    </>
                  )}
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="overflow-hidden p-0 !w-fit max-w-[7rem] min-w-full flex-nowrap whitespace-nowrap"
            >
              <div className="overflow-y-auto max-h-[300px] w-full PopoverContent">
                {grades.map((grade, index) => (
                  <div
                    key={index}
                    className="flex hover:bg-primary/[0.08] cursor-pointer items-center px-2 py-1.5 text-xs gap-2 indent-0"
                    onClick={() => {
                      toggleFilter("grade", grade);
                      setColumnFilters((prev) => {
                        const gradess = prev.find((f) => f.id === "class")
                          ?.value as string[];
                        if (!gradess) {
                          return [...prev, { id: "class", value: [grade] }];
                        }
                        return prev.map((f) =>
                          f.id === "class"
                            ? {
                                ...f,
                                value: activeFilters["grade"].includes(grade)
                                  ? gradess.filter((filter) => filter !== grade)
                                  : [...gradess, grade],
                              }
                            : f
                        );
                      });
                    }}
                  >
                    <Check
                      className={cn(
                        "max-h-4 max-w-4 min-h-4 min-w-4 text-primary basis-1/6",
                        activeFilters["grade"].includes(grade)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    <h1 className="basis-5/6 leading-tight">{grade}</h1>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
      <div className="flex flex-col justify-between gap-8 py-4 h-full overflow-y-auto">
        <div className="rounded-md border overflow-y-auto">
          <Table ref={tableRef} className="h-full relative">
            <TableHeader className="sticky top-0 ">
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
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 relative">
                    <div className="pixel-spinner mx-auto my-12">
                      <div className="pixel-spinner-inner"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
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
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <DoubleArrowLeftIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <DoubleArrowRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

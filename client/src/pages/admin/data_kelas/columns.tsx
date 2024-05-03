import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";

export type ClassesType = {
  class_id: string;
  grade: "X" | "XI" | "XII";
  identifier: string;
  waliKelas?: string;
  teacher_name?: string;
  major_id: string;
  major_name: string;
  shorten: string;
};

export const columns: ColumnDef<ClassesType>[] = [
  {
    accessorKey: "class_id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Class ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "grade",
    accessorKey: "grade",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Grade
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    enableColumnFilter: true,
    filterFn: (row, columnId, filterGrades) => {
      if (filterGrades.length === 0) return true;
      const grade = row.getValue(columnId);
      return filterGrades.includes(grade);
    },
  },
  {
    accessorKey: "shorten",
    header: "Major",
    enableGlobalFilter: true,
    enableColumnFilter: true,
    filterFn: (row, columnId, filterMajors) => {
      if (filterMajors.length === 0) return true;
      const major = row.getValue(columnId);
      return filterMajors.includes(major);
    },
  },
  {
    accessorKey: "identifier",
    header: "Class",
    enableGlobalFilter: false,
  },
  {
    accessorKey: "teacher_name",
    id: "homeroom",
    header: "Wali Kelas",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const classes = row.original;

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                <Link to={"/classes/" + classes.class_id}>View</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to={"/classes/?delete=" + classes.class_id}>Delete</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];

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
    enableGlobalFilter: false,
  },
  {
    accessorKey: "identifier",
    header: "Class",
    enableGlobalFilter: false,
  },
  {
    accessorKey: "major_name",
    header: "Major",
    enableGlobalFilter: false,
  },
  {
    accessorKey: "waliKelas",
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
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(classes.class_id)}
              >
                Copy class ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to={"/classes/" + classes.class_id}>
                  View Class Detail
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to={"/classes/?delete=" + classes.class_id}>
                  Delete Class
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];

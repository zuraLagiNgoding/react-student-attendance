import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

export type ClassesType = {
  id: string;
  grade: "X" | "XI" | "XII";
  major: string;
  class: string;
  waliKelas?: string;
};

export const columns: ColumnDef<ClassesType>[] = [
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
      )
    },
  },
  {
    accessorKey: "major",
    header: "Major",
  },
  {
    accessorKey: "class",
    header: "Class",
  },
  {
    accessorKey: "waliKelas",
    header: "Wali Kelas",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const classes = row.original
 
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
              onClick={() => navigator.clipboard.writeText(classes.id)}
            >
              Copy class ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <SheetTrigger>
                View Class Detail
              </SheetTrigger>            
            </DropdownMenuItem>                      
          </DropdownMenuContent>
        </DropdownMenu>
        </>
      )
    },
  },
];

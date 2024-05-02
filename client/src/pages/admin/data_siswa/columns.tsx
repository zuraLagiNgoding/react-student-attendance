import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";

export type StudentsType = {
  nisn: string;
  student_name: string;
  grade: string;
  shorten: string;
  identifier: string;
  address: string;
  gender: string;
  phoneNumber: string;
  email: string;
};

export const columns: ColumnDef<StudentsType>[] = [
  {
    accessorKey: "nisn",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          NISN
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const student = row.original.nisn;

      return (
        <Link className="text-primary" to={"/students/" + student}>
          {student}
        </Link>
      );
    },
  },
  {
    accessorKey: "student_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Student Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "class",
    header: "Class",
    cell: ({ row }) => {
      const schedules = row.original;

      return (
        <>
          {schedules.grade} {schedules.shorten} {schedules.identifier}
        </>
      );
    },
    enableColumnFilter: true,
    filterFn: (rows, _, filterValue) => {
      if (filterValue.length === 0) return true;

      const row = rows.original
      const className = `${row.grade} ${row.shorten} ${row.identifier}`;

      const grade:string[] = []
      const major:string[] = []

      filterValue.forEach((item:string) => {
        if (item.startsWith("X")) {
          grade.push(item)
        } else {
          major.push(item)
        }
      });

      const combinedItems:string[] = [];

      if (grade.length > 0 && major.length > 0) {
        grade.forEach(gradeItem => {
          major.forEach(majorItem => {
            combinedItems.push(`${gradeItem} ${majorItem}`);
          });
        });    
      }else if(grade.length > 0 && major.length == 0){
        grade.forEach(item => {
          combinedItems.push(item)
        })
      }else if(grade.length == 0 && major.length > 0){
        major.forEach(item => {
          combinedItems.push(item)
        })
      }
    return combinedItems.some((f:string) => className.includes(f))
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const students = row.original;

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
                <Link to={"/students/" + students.nisn}>View</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to={"/students/" + students.nisn}>Delete</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];

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

export type SchedulesType = {
  classroom_id: string;
  classroom_name: string;
  schedule_id: string;
  day: 'SUNDAY' | 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY';
  start: string;
  end: string;
  subject_name: string;
  subject_code: string;
  teacher_name: string;
  grade: string;
  shorten: string;
  identifier: string;
};

export const columns: ColumnDef<SchedulesType>[] = [
  {
    accessorKey: "schedule_id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Schedule ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "classroom_id",
    header: "Room",
    cell: ({ row }) => {
      const schedules = row.original;

      return (
        <>
          {schedules.classroom_name}
        </>
      );
    },
  },
  {
    accessorKey: "day",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Day
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "timestamps",
    header: "Timestamps",
    cell: ({ row }) => {
      const schedules = row.original;

      return (
        <>
          {schedules.start} - {schedules.end}
        </>
      );
    },
  },
  {
    accessorKey: "subject_name",
    header: "Subject",
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
  },
  {
    accessorKey: "teacher_name",
    header: "Teacher",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const schedules = row.original;

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
              <DropdownMenuItem>
                <Link to={"/schedules/" + schedules.schedule_id}>View</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to={"/schedules/?delete=" + schedules.schedule_id}>
                  Delete
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];

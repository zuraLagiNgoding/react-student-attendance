import { ColumnDef } from "@tanstack/react-table";

export type ClassesType = {
  id: string;
  grade: "X" | "XI" | "XII";
  major: string;
  waliKelas?: string;
};

export const columns: ColumnDef<ClassesType>[] = [
  {
    accessorKey: "id",
    header: "Class ID",
  },
  {
    accessorKey: "grade",
    header: "Grade",
  },
  {
    accessorKey: "major",
    header: "Major",
  },
  {
    accessorKey: "waliKelas",
    header: "Wali Kelas",
  },
];

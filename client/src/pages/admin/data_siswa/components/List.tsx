import React, { Dispatch, SetStateAction } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { Command, CommandGroup } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { StudentType } from "../DataSiswa";

type ListTypes = {
  students: StudentType[];
  setStudent: Dispatch<SetStateAction<StudentType | undefined>>
}

const majors = [
  {
    value: "geomatika",
    label: "Geomatika",
  },
  {
    value: "dpib",
    label: "Desain Permodelan Industri Bangunan",
  },
  {
    value: "tkdp",
    label: "Teknik Konstruksi dan Pembangunan",
  },
  {
    value: "tpg",
    label: "Teknik Perawatan Gedung",
  },
  {
    value: "titl",
    label: "Teknik Instalasi Tenaga Listrik",
  },
  {
    value: "toi",
    label: "Teknik Otomasi Industri",
  },
  {
    value: "m",
    label: "Teknik Permesinan",
  },
  {
    value: "tmi",
    label: "Teknik Mesin Industri",
  },
  {
    value: "dgm",
    label: "Desain Gambar Mesin",
  },
  {
    value: "rpl",
    label: "Rekayasa Perangkat Lunak",
  },
];

const List = ({setStudent, students} : ListTypes) => {
  const [open, setOpen] = React.useState(false);
  const [select, setSelect] = React.useState<number>();
  const [search, setSearch] = React.useState<string>("");
  const [selectedMajor, setSelectedMajor] = React.useState<string>("");

  const searchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  return (
    <Card className="basis-2/6 whitespace-nowrap">
      <CardHeader className="pb-2 flex flex-row justify-between items-center">
        <CardTitle>Student List</CardTitle>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between "
            >
              <p className="whitespace-nowrap overflow-hidden text-ellipsis">
                {selectedMajor
                  ? majors.find((major) => major.value === selectedMajor)?.label
                  : "Major"}
              </p>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] overflow-hidden p-0">
            <Command>
              <div className="flex items-center gap-x-2 max-w-sm border-b leading-none border-slate-200 bg-transparent px-3 py-1.5 text-sm transition-colors placeholder:text-slate-500 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300">
                <Search size={16} className="text-primary inline" />
                <input
                  placeholder="Search major..."
                  value={search}
                  onChange={searchHandler}
                  className="w-full h-full placeholder:text-xs focus-visible:ring-0 focus-visible:outline-none px-2 py-0.5"
                />
              </div>
              <CommandGroup>
                <div className="overflow-y-auto max-h-[300px]">
                  {majors
                    .filter((filtered) =>
                      filtered.label
                        .toLowerCase()
                        .includes(search.toLowerCase())
                    )
                    .map((major) => (
                      <div
                        className="flex hover:bg-primary/[0.08] cursor-pointer items-center px-2 py-1.5 text-sm gap-2 indent-0"
                        onClick={() => {
                          setSelectedMajor(
                            selectedMajor == major.value ? "" : major.value
                          );
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "max-h-4 max-w-4 text-primary basis-1/6",
                            selectedMajor === major.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        <h1 className="basis-5/6 leading-tight">
                          {major.label}
                        </h1>
                      </div>
                    ))}
                </div>
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </CardHeader>
      <CardContent className="overflow-auto max-h-[80%]">
        <div className="flex items-center gap-x-2 max-w-full rounded-md border leading-none border-slate-200 bg-transparent px-2 py-1.5 m-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300">
          <Search size={16} className="text-primary inline" />
          <input
            placeholder="Search by Name or NISN"
            value={search}
            onChange={searchHandler}
            className="w-full h-full placeholder:text-xs focus-visible:ring-0 focus-visible:outline-none px-2 py-0.5 focus-visible:border-b"
          />
        </div>
        {students
          .filter(
            (filtered) =>
              filtered.student_name.toLowerCase().includes(search.toLowerCase()) ||
              filtered.nisn.includes(search)
          )
          .map((student, index) => (
            <div
              onClick={() => {
                setSelect(index);
                setStudent(student);
              }}
              className="flex gap-3 items-center cursor-pointer hover:bg-primary/[0.08] rounded-md px-4 py-2"
            >
              <Checkbox
                onCheckedChange={() => {
                  setSelect(index);
                  setStudent(student);
                }}
                checked={select == index}
              />
              <div className="flex flex-col ">
                <h1 className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                  {student.student_name}
                </h1>
                <p className="text-xs font-light">{student.nisn}</p>
              </div>
              {student.class_id && (
                <Badge className="ml-auto">
                  {student.grade} {student.shorten} {student.identifier}
                </Badge>
              )}
            </div>
          ))}
      </CardContent>
      <CardFooter className="flex justify-between"></CardFooter>
    </Card>
  );
};

export default List;

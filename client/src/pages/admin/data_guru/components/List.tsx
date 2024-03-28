import React, { Dispatch, SetStateAction } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { TeacherType } from "../DataGuru";
import { ScrollArea } from "@/components/ui/scroll-area";

type ListTypes = {
  teachers: TeacherType[];
  setTeacher: Dispatch<SetStateAction<TeacherType | undefined>>;

  select: number | undefined;
  setSelect: Dispatch<SetStateAction<number | undefined>>;
};

const List = ({ setTeacher, teachers, setSelect, select }: ListTypes) => {
  const [search, setSearch] = React.useState<string>("");

  const searchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  return (
    <Card className="basis-2/6">
      <CardHeader className="pb-2 flex flex-row justify-between items-center">
        <CardTitle>Teacher List</CardTitle>
      </CardHeader>
      <CardContent className="h-fit">
        <div className="flex items-center gap-x-2 max-w-full rounded-md border leading-none border-slate-200 bg-transparent px-2 py-1.5 m-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300">
          <Search size={16} className="text-primary inline" />
          <input
            placeholder="Search by Name or NISN"
            value={search}
            onChange={searchHandler}
            className="w-full h-full placeholder:text-xs focus-visible:ring-0 focus-visible:outline-none px-2 py-0.5 focus-visible:border-b"
          />
        </div>
        <ScrollArea className="h-[calc(100vh-22.5rem)]">
          {teachers
            .filter((filtered) => 
              filtered.teacher_name
              .toLowerCase()
              .includes(search.toLowerCase()) ||
              filtered.nip.includes(search)
            )
            .map((teacher, index) => (
              <div
                onClick={() => {
                  setSelect(index);
                  setTeacher(teacher);
                }}
                className="flex gap-3 items-center cursor-pointer hover:bg-primary/[0.08] rounded-md px-4 py-2"
              >
                <Checkbox
                  onCheckedChange={() => {
                    setSelect(index);
                    setTeacher(teacher);
                  }}
                  checked={select == index}
                />
                <div className="flex flex-col ">
                  <h1 className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                    {teacher.teacher_name}
                  </h1>
                  <p className="text-xs font-light">{teacher.nip}</p>
                </div>
              </div>
            ))}
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-between"></CardFooter>
    </Card>
  );
};

export default List;

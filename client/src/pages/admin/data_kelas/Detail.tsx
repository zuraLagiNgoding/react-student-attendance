import React, { Dispatch, SetStateAction } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../../../components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ClassesType } from "./columns";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Check, CheckCircle2, ChevronsUpDown, CircleX, Eye, Search, SquarePen } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClassSchema } from "@/schemas/class-schemas";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Command, CommandGroup } from "@/components/ui/command";
import { MajorsType } from "../data_jurusan/columns";
import { useFetch } from "@/hooks/fetcher";
import { TeachersType } from "../data_guru/columns";

interface DetailProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const DetailKelas = ({ setIsOpen, isOpen }: DetailProps) => {
  const [data, setData] = React.useState<ClassesType>();
  const [isEdit, setIsEdit] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const classId = location.pathname.split("/")[2];

  const { data: majors } = useFetch<MajorsType[]>(
    "http://localhost:8800/backend/majors"
  );

  const { data: teachers } = useFetch<TeachersType[]>(
    "http://localhost:8800/backend/teachers"
  );

  const form = useForm<z.infer<typeof ClassSchema>>({
    resolver: zodResolver(ClassSchema),
    defaultValues: {
      class_id: "",
      grade: "",
      identifier: "",
      waliKelas: "",
      major_id: ""
    },
  });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8800/backend/classes/${classId}`
        );
        setData(res.data[0]);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [classId, data]);

  const onSubmit = async (values: z.infer<typeof ClassSchema>) => {
    try {
      await axios.put(`http://localhost:8800/backend/classes/` + classId, {
        grade: values.grade,
        major_id: majors.find((major) => major.major_name == values.major_id)
          ?.major_id,
        identifier: values.identifier,
        waliKelas: teachers.find(
          (teacher) => teacher.teacher_name === values.waliKelas
        )?.nip,
      });
      toast("Data kelas telah di update.", {
        icon: <CheckCircle2 size={18} className="text-primary" />,
      });
    } catch (error) {
      toast("Terjadi kesalahan.", {
        icon: <CircleX size={18} className="text-red-500" />,
      });
    }
  };

  const [search, setSearch] = React.useState<string>("");
  const [teacherSearch, setTeacherSearch] = React.useState<string>("");

  const searchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const teacherSearchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTeacherSearch(event.target.value);
  };

  return (
    <Sheet
      defaultOpen
      onOpenChange={() => {
        navigate(-1);
        setIsEdit(!isEdit);
        setIsOpen(!isOpen);
      }}
    >
      <SheetContent>
        <SheetHeader>
          <div className="flex items-center gap-2">
            <SheetTitle>Class Detail</SheetTitle>
            {isEdit ? (
              <Eye
                className="cursor-pointer text-primary"
                size={16}
                onClick={() => {
                  setIsEdit(false);
                }}
              />
            ) : (
              <SquarePen
                className="cursor-pointer text-primary"
                size={16}
                onClick={() => {
                  setIsEdit(true);
                  form.reset({
                    class_id: data?.class_id,
                    grade: data?.grade,
                    identifier: data?.identifier,
                    waliKelas: data?.waliKelas,
                    major_id: data?.major_name,
                  });
                }}
              />
            )}
          </div>
          <SheetDescription>
            {data?.grade} {data?.shorten} {data?.identifier}
          </SheetDescription>
        </SheetHeader>
        {isEdit ? (
          <>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-4 py-4"
              >
                <FormField
                  control={form.control}
                  name="class_id"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel>Class ID</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled
                          className="col-span-3 !m-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="grade"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel>Grade</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="col-span-3 !m-0">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="X">X</SelectItem>
                          <SelectItem value="XI">XI</SelectItem>
                          <SelectItem value="XII">XII</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="major_id"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel>Major</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild className="col-span-3 !m-0">
                          <FormControl className="w-full">
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "justify-between w-full",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? majors.find(
                                    (major) => major.major_name === field.value
                                  )?.major_name
                                : "Select Major"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="overflow-hidden p-0">
                          <Command>
                            <div className="flex items-center gap-x-2 border-b leading-none border-slate-200 bg-transparent px-3 py-1.5 transition-colors placeholder:text-slate-500 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300">
                              <Search
                                size={16}
                                className="text-primary inline"
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
                                  .map((major) => (
                                    <div
                                      className="flex hover:bg-primary/[0.08] cursor-pointer items-center px-2 py-1.5 text-sm gap-2 indent-0"
                                      onClick={() => {
                                        form.setValue(
                                          "major_id",
                                          major.major_name
                                        );
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "max-h-4 max-w-4 text-primary basis-1/6",
                                          field.value === major.major_name
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="identifier"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel>Class Identifier</FormLabel>
                      <FormControl>
                        <Input {...field} className="col-span-3 !m-0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="waliKelas"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel>Teacher</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild className="col-span-3 !m-0">
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "justify-between w-full",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? teachers.find(
                                    (item) => item.teacher_name === field.value
                                  )?.teacher_name
                                : "Select Teacher"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="overflow-hidden p-0">
                          <Command>
                            <div className="flex items-center gap-x-2 border-b leading-none border-slate-200 bg-transparent px-3 py-1.5 transition-colors placeholder:text-slate-500 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300">
                              <Search
                                size={16}
                                className="text-primary inline"
                              />
                              <input
                                placeholder="Search teacher..."
                                value={teacherSearch}
                                onChange={teacherSearchHandler}
                                onBlur={() => setTeacherSearch("")}
                                className="h-full placeholder:text-sm focus-visible:ring-0 focus-visible:outline-none px-2 py-1"
                              />
                            </div>
                            <CommandGroup>
                              <div className="overflow-y-auto max-h-[300px]">
                                {teachers
                                  .filter((filtered) =>
                                    filtered.teacher_name
                                      .toLowerCase()
                                      .includes(teacherSearch.toLowerCase())
                                  )
                                  .map((item) => (
                                    <div
                                      key={item.nip}
                                      className="flex hover:bg-primary/[0.08] cursor-pointer items-center px-2 py-1.5 text-sm gap-2 indent-0"
                                      onClick={() => {
                                        form.setValue(
                                          "waliKelas",
                                          item.teacher_name
                                        );
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "max-h-4 max-w-4 text-primary basis-1/6",
                                          field.value === item.teacher_name
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      <h1 className="basis-5/6 leading-tight">
                                        {item.teacher_name}
                                      </h1>
                                    </div>
                                  ))}
                              </div>
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <SheetFooter>
                  <SheetClose asChild>
                    <Button type="submit">Save changes</Button>
                  </SheetClose>
                </SheetFooter>
              </form>
            </Form>
          </>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="id">Class ID</Label>
              <Input
                id="id"
                value={data?.major_id}
                disabled
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="major_name">Class</Label>
              <Input
                id="major_name"
                value={
                  data?.grade + " " + data?.shorten + " " + data?.identifier
                }
                disabled
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="major_name">Major</Label>
              <Input
                id="major_name"
                value={data?.major_name}
                disabled
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="major_name">Wali Kelas</Label>
              <Input
                id="major_name"
                value={data?.waliKelas}
                disabled
                className="col-span-3"
              />
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default DetailKelas;

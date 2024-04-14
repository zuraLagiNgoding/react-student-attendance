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
// import { Label } from '@/components/ui/label';
// import { Input } from '@/components/ui/input';
import { StudentsType } from "./columns";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, ChevronsUpDown, Eye, Search, SquarePen } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { StudentSchema } from "@/schemas/student-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetch } from "@/hooks/fetcher";
import { ClassesType } from "../data_kelas/columns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Command, CommandGroup } from "@/components/ui/command";

interface DetailProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const DetailSiswa = ({isOpen, setIsOpen}: DetailProps) => {
  const [data, setData] = React.useState<StudentsType>();
  const [isEdit, setIsEdit] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation().pathname.split("/");
  const studentId = location[location.length - 1];

  const { data: classes } = useFetch<ClassesType[]>(
    "http://localhost:8800/backend/classes"
  );

  const form = useForm<z.infer<typeof StudentSchema>>({
    resolver: zodResolver(StudentSchema),
    defaultValues: {
      nisn: "",
      student_name: "",
      address: "",
      phoneNumber: "",
      email: "",
    },
  });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8800/backend/students/${studentId}`
        );
        setData(res.data[0]);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [studentId, data]);

  const onSubmit = async (values: z.infer<typeof StudentSchema>) => {
    try {
      await axios.put(`http://localhost:8800/backend/students/` + studentId, {
        nisn: values.nisn,
        name: values.student_name,
        gender: values.gender,
        address: values.address,
        class_id: classes.find(
          (item) =>
            `${item.grade} ${item.shorten} ${item.identifier}` ===
            values.class_id
        )?.class_id,
        phoneNumber: values.phoneNumber,
        email: values.email,
      });
      console.log(values);
      navigate("/students");
    } catch (error) {
      console.log(error);
    }
  };

  const [search, setSearch] = React.useState<string>("");

  const searchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
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
            <SheetTitle>Student Detail</SheetTitle>
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
                    nisn: data?.nisn,
                    student_name: data?.student_name,
                    address: data?.address,
                    gender: data?.gender,
                    class_id: data?.grade + " " + data?.shorten + " " + data?.identifier,
                    phoneNumber: data?.phoneNumber,
                    email: data?.email,
                  });
                }}
              />
            )}
          </div>
          <SheetDescription>{data?.student_name}</SheetDescription>
        </SheetHeader>
        {isEdit ? (
          <>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-4 py-4"
              >
                <div className="flex w-full items-center justify-center">
                  <Avatar className="w-[50%] h-auto">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>
                <FormField
                  control={form.control}
                  name="nisn"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel>NISN</FormLabel>
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
                  name="class_id"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel>Class</FormLabel>
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
                                ? classes.find(
                                    (item) =>
                                      `${item.grade} ${item.shorten} ${item.identifier}` ===
                                      field.value
                                  )?.grade +
                                  " " +
                                  classes.find(
                                    (item) =>
                                      `${item.grade} ${item.shorten} ${item.identifier}` ===
                                      field.value
                                  )?.shorten +
                                  " " +
                                  classes.find(
                                    (item) =>
                                      `${item.grade} ${item.shorten} ${item.identifier}` ===
                                      field.value
                                  )?.identifier
                                : "Select Class"}
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
                                placeholder="Search class..."
                                value={search}
                                onChange={searchHandler}
                                className="h-full placeholder:text-sm focus-visible:ring-0 focus-visible:outline-none px-2 py-1"
                              />
                            </div>
                            <CommandGroup>
                              <div className="overflow-y-auto max-h-[300px]">
                                {classes
                                  .filter(
                                    (filtered) =>
                                      filtered.grade
                                        .toLowerCase()
                                        .includes(search.toLowerCase()) ||
                                      filtered.major_name
                                        .toLowerCase()
                                        .includes(search.toLowerCase()) ||
                                      filtered.shorten
                                        .toLowerCase()
                                        .includes(search.toLowerCase()) ||
                                      filtered.identifier
                                        .toLowerCase()
                                        .includes(search.toLowerCase())
                                  )
                                  .map((item) => (
                                    <div
                                      className="flex hover:bg-primary/[0.08] cursor-pointer items-center px-2 py-1.5 text-sm gap-2 indent-0"
                                      onClick={() => {
                                        form.setValue(
                                          "class_id",
                                          `${item.grade} ${item.shorten} ${item.identifier}`
                                        );
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "max-h-4 max-w-4 text-primary basis-1/6",
                                          field.value ===
                                            `${item.grade} ${item.shorten} ${item.identifier}`
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      <h1 className="basis-5/6 leading-tight">
                                        {item.grade} {item.shorten}{" "}
                                        {item.identifier}
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
                  name="student_name"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} className="col-span-3 !m-0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input {...field} className="col-span-3 !m-0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
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
                            <SelectItem value="LK">Male</SelectItem>
                            <SelectItem value="PR">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <h1 className="2xl:text-xs text-[12px] font-light">Contact</h1>
                <hr />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} className="col-span-3 !m-0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} className="col-span-3 !m-0" />
                      </FormControl>
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
            <div className="flex w-full items-center justify-center">
              <Avatar className="w-[50%] h-auto">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="id">NISN</Label>
              <Input
                id="id"
                value={data?.nisn}
                disabled
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="siswa">Student Name</Label>
              <Input
                id="siswa"
                value={data?.student_name}
                disabled
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={data?.address}
                disabled
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="gender">Gender</Label>
              <Input
                id="gender"
                value={data?.gender}
                disabled
                className="col-span-3"
              />
            </div>
            <h1 className="2xl:text-xs text-[12px] font-light">Contact</h1>
            <hr />
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={data?.phoneNumber}
                disabled
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={data?.email}
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

export default DetailSiswa;

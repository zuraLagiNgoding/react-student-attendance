import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useFetch } from "@/hooks/fetcher";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Command, CommandGroup } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { StudentSchema } from "@/schemas/student-schemas";
import { ClassesType } from "../data_kelas/columns";
import { Textarea } from "@/components/ui/textarea";

const Save = () => {
  const navigate = useNavigate();

  const { data: classes } = useFetch<ClassesType[]>(
    "http://localhost:8800/backend/classes"
  );

  const form = useForm<z.infer<typeof StudentSchema>>({
    resolver: zodResolver(StudentSchema),
    defaultValues: {
      nisn: "",
      student_name: "",
      address: "",
      class_id: "",
      phoneNumber: "",
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof StudentSchema>) => {
    try {
      await axios.post(`http://localhost:8800/backend/students/`, {
        nisn: values.nisn,
        student_name: values.student_name,
        gender: values.gender,
        address: values.address,
        class_id:
          classes.find(
            (item) =>
              `${item.grade} ${item.shorten} ${item.identifier}` === values.class_id
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
    <div className="flex flex-col gap-6 overflow-y-hidden flex-nowrap whitespace-nowrap">
      <h1 className="text-3xl font-bold leading-none text-neutral-900">
        Save New Student Data
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="py-8">
            <CardContent className="space-y-2 overflow-y-auto">
              <FormField
                control={form.control}
                name="nisn"
                render={({ field }) => (
                  <FormItem className="grid w-full max-w-sm items-center gap-1.5">
                    <FormLabel>NISN</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        maxLength={10}
                        onKeyDown={(e) => {
                          if (
                            !/^[0-9]$/.test(e.key) &&
                            e.keyCode !== 8 &&
                            e.keyCode !== 13
                          ) {
                            e.preventDefault();
                          }
                        }}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="student_name"
                render={({ field }) => (
                  <FormItem className="grid w-full max-w-sm items-center gap-1.5">
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="grid w-full max-w-sm items-center gap-1.5">
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="LK">Male</SelectItem>
                        <SelectItem value="PR">Female</SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="grid w-full max-w-sm items-center gap-1.5">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="resize-none" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="class_id"
                render={({ field }) => (
                  <FormItem className="grid max-w-sm items-center gap-1.5">
                    <FormLabel>Class</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
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
                            <Search size={16} className="text-primary inline" />
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
                                      {item.grade} {item.shorten} {item.identifier}
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
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem className="grid w-full max-w-sm items-center gap-1.5">
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grid w-full max-w-sm items-center gap-1.5">
                    <FormLabel className="flex gap-2">
                      Email Address
                      <span className="text-xs text-slate-500 dark:text-slate-400 w-fit">
                        *Optional
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit">Submit</Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default Save;

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
import { zodResolver } from "@hookform/resolvers/zod";
import { ScheduleSchema } from "@/schemas/schedule-schemas";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import dayjs from "dayjs";
import { Check, ChevronsUpDown, Clock9, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { TimePicker } from "@/components/ui/time-picker";
import { ClassesType } from "../data_kelas/columns";
import { TeacherType } from "../data_guru/DataGuru";
import { useFetch } from "@/hooks/fetcher";
import { SubjectsType } from "../data_mapel/columns";
import { Command, CommandGroup } from "@/components/ui/command";

const Save = () => {
  const { data: classes } = useFetch<ClassesType[]>(
    "http://localhost:8800/backend/classes"
  );

  const { data: teachers } = useFetch<TeacherType[]>(
    "http://localhost:8800/backend/teachers"
  );

  const { data: subjects } = useFetch<SubjectsType[]>(
    "http://localhost:8800/backend/subjects"
  );

  const navigate = useNavigate();
  // const [input, setInput] = React.useState("");
  const [generatedId, setGeneratedId] = React.useState("");
  const [dateStart, setDateStart] = React.useState<Date | undefined>(
    dayjs().startOf("day").toDate()
  );
  const [dateEnd, setDateEnd] = React.useState<Date | undefined>(
    dayjs().startOf("day").toDate()
  );

  const form = useForm<z.infer<typeof ScheduleSchema>>({
    resolver: zodResolver(ScheduleSchema),
    defaultValues: {
      schedule_id: "",
      timestamps: "",
      subject_id: "",
      teacher_id: "",
      class_id: "",
    },
  });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8800/backend/schedules/lastId"
        );
        setGeneratedId(
          parseInt(res.data[0].next_id).toString().padStart(3, "0")
        );
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [generatedId]);

  React.useEffect(() => {
    // Generate Kode Mapel
    // const schedule_code = input
    //   .split(" ")
    //   .map((word) => word.charAt(0))
    //   .join("");
    const start = dayjs(dateStart).format("HH:mm");
    const end = dayjs(dateEnd).format("HH:mm");

    form.reset({
      schedule_id: generatedId,
      timestamps: start + "-" + end,
      subject_id: "",
      teacher_id: "",
      class_id: "",
    });
  }, [form, generatedId, dateStart, dateEnd]);

  const onSubmit = async (values: z.infer<typeof ScheduleSchema>) => {
    try {
      await axios.post(`http://localhost:8800/backend/schedules/`, {
        id: values.schedule_id,
        day: values.day,
        start: values.timestamps.split("-")[0],
        end: values.timestamps.split("-")[1],
        teacher_id: teachers.find(teacher => teacher.teacher_name === values.teacher_id)?.nip,
        subject_id: subjects.find(subject => subject.subject_code === values.subject_id)?.subject_id,
        class_id:  classes.find(
            (item) =>
              `${item.grade} ${item.shorten} ${item.identifier}` === values.class_id
          )?.class_id,
      });
      navigate("/schedules");
    } catch (error) {
      console.log(error);
    }
  };

  // const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setInput(event.target.value);
  // };

  const [search, setSearch] = React.useState<string>("");

  const searchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  return (
    <div className="flex flex-col gap-6 overflow-y-hidden flex-nowrap whitespace-nowrap">
      <h1 className="text-3xl font-bold leading-none text-neutral-900">
        Save New Schedule Data
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="py-8">
            <CardContent className="space-y-2">
              <FormField
                control={form.control}
                name="schedule_id"
                render={({ field }) => (
                  <FormItem className="grid w-full max-w-sm items-center gap-1.5">
                    <FormLabel>Schedule ID</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="day"
                render={({ field }) => (
                  <FormItem className="grid w-full max-w-sm items-center gap-1.5">
                    <FormLabel>Day</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue/>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Monday">Monday</SelectItem>
                        <SelectItem value="Tuesday">Tuesday</SelectItem>
                        <SelectItem value="Wednesday">Wednesday</SelectItem>
                        <SelectItem value="Thursday">Thursday</SelectItem>
                        <SelectItem value="Friday">Friday</SelectItem>
                        <SelectItem value="Saturday">Saturday</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="timestamps"
                render={({ field }) => (
                  <FormItem className="grid w-full max-w-sm items-center gap-1.5">
                    <FormLabel>Timestamps</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl className="w-full">
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? field.value : null}
                            <Clock9 className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="overflow-hidden">
                        <div className="flex items-center justify-between w-full">
                          <TimePicker date={dateStart} setDate={setDateStart} />
                          <span className="">-</span>
                          <TimePicker date={dateEnd} setDate={setDateEnd} />
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subject_id"
                render={({ field }) => (
                  <FormItem className="grid w-full max-w-sm items-center gap-1.5">
                    <FormLabel>Subject</FormLabel>
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
                              ? subjects.find(
                                  (item) => item.subject_code === field.value
                                )?.subject_name
                              : "Select Subject"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="overflow-hidden p-0">
                        <Command>
                          <div className="flex items-center gap-x-2 border-b leading-none border-slate-200 bg-transparent px-3 py-1.5 transition-colors placeholder:text-slate-500 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300">
                            <Search size={16} className="text-primary inline" />
                            <input
                              placeholder="Search subject..."
                              value={search}
                              onChange={searchHandler}
                              onBlur={() => setSearch("")}
                              className="h-full placeholder:text-sm focus-visible:ring-0 focus-visible:outline-none px-2 py-1"
                            />
                          </div>
                          <CommandGroup>
                            <div className="overflow-y-auto max-h-[300px]">
                              {subjects
                                .filter(
                                  (filtered) =>
                                    filtered.subject_code
                                      .toLowerCase()
                                      .includes(search.toLowerCase()) ||
                                    filtered.subject_name
                                      .toLowerCase()
                                      .includes(search.toLowerCase())
                                )
                                .map((item) => (
                                  <div
                                    key={item.subject_id}
                                    className="flex hover:bg-primary/[0.08] cursor-pointer items-center px-2 py-1.5 text-sm gap-2 indent-0"
                                    onClick={() => {
                                      form.setValue(
                                        "subject_id",
                                        item.subject_code
                                      );
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "max-h-4 max-w-4 text-primary basis-1/6",
                                        field.value === item.subject_code
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    <h1 className="basis-5/6 leading-tight">
                                      {item.subject_code}
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
                name="class_id"
                render={({ field }) => (
                  <FormItem className="grid w-full max-w-sm items-center gap-1.5">
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
                              onBlur={() => setSearch("")}
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
                                    key={item.class_id}
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
                name="teacher_id"
                render={({ field }) => (
                  <FormItem className="grid w-full max-w-sm items-center gap-1.5">
                    <FormLabel>Teacher</FormLabel>
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
                              ? teachers.find(
                                  (item) => item.teacher_name === field.value
                                )?.teacher_name
                              : "Select Subject"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="overflow-hidden p-0">
                        <Command>
                          <div className="flex items-center gap-x-2 border-b leading-none border-slate-200 bg-transparent px-3 py-1.5 transition-colors placeholder:text-slate-500 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300">
                            <Search size={16} className="text-primary inline" />
                            <input
                              placeholder="Search subject..."
                              value={search}
                              onChange={searchHandler}
                              onBlur={() => setSearch("")}
                              className="h-full placeholder:text-sm focus-visible:ring-0 focus-visible:outline-none px-2 py-1"
                            />
                          </div>
                          <CommandGroup>
                            <div className="overflow-y-auto max-h-[300px]">
                              {teachers
                                .filter((filtered) =>
                                  filtered.teacher_name
                                    .toLowerCase()
                                    .includes(search.toLowerCase())
                                )
                                .map((item) => (
                                  <div
                                    key={item.nip}
                                    className="flex hover:bg-primary/[0.08] cursor-pointer items-center px-2 py-1.5 text-sm gap-2 indent-0"
                                    onClick={() => {
                                      form.setValue(
                                        "teacher_id",
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

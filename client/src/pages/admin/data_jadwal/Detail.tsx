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
import { SchedulesType } from "./columns";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Check, CheckCircle2, ChevronsUpDown, CircleX, Clock9, Eye, Search, SquarePen } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ScheduleSchema } from "@/schemas/schedule-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useFetch } from "@/hooks/fetcher";
import { ClassesType } from "../data_kelas/columns";
import { TeachersType } from "../data_guru/columns";
import { SubjectsType } from "../data_mapel/columns";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { TimePicker } from "@/components/ui/time-picker";
import { Command, CommandGroup } from "@/components/ui/command";
import { ClassRoomsType } from "../data_ruang/columns";

interface DetailProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const DetailJadwal = ({ isOpen, setIsOpen }: DetailProps) => {
  const { data: classes } = useFetch<ClassesType[]>(
    "http://localhost:8800/backend/classes"
  );

  const { data: classrooms } = useFetch<ClassRoomsType[]>(
    "http://localhost:8800/backend/classrooms"
  );

  const { data: teachers } = useFetch<TeachersType[]>(
    "http://localhost:8800/backend/teachers"
  );

  const { data: subjects } = useFetch<SubjectsType[]>(
    "http://localhost:8800/backend/subjects"
  );

  const [isEdit, setIsEdit] = React.useState(false);
  const [data, setData] = React.useState<SchedulesType>();
  const navigate = useNavigate();
  const location = useLocation().pathname.split("/");
  const scheduleId = location[location.length - 1];
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
      day: "",
      timestamps: "",
      subject_id: "",
      teacher_id: "",
    },
  });

  React.useEffect(() => {
    const start = dayjs(dateStart).format("HH:mm");
    const end = dayjs(dateEnd).format("HH:mm");

    form.reset({
      timestamps: start + "-" + end,
    });
  }, [form, dateStart, dateEnd]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8800/backend/schedules/${scheduleId}`
        );
        setData(res.data[0]);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [scheduleId, data]);

  const onSubmit = async (values: z.infer<typeof ScheduleSchema>) => {
    try {
      await axios.put(`http://localhost:8800/backend/schedules/` + scheduleId, {
        day: values.day,
        start: values.timestamps.split("-")[0],
        end: values.timestamps.split("-")[1],
        classroom_id: classrooms.find(
          (classroom) => classroom.classroom_name === values.classroom_id
        )?.classroom_id,
        teacher_id: teachers.find(
          (teacher) => teacher.teacher_name === values.teacher_id
        )?.nip,
        subject_id: subjects.find(
          (subject) => subject.subject_code === values.subject_id
        )?.subject_id,
        class_id: classes.find(
          (item) =>
            `${item.grade} ${item.shorten} ${item.identifier}` ===
            values.class_id
        )?.class_id,
      });
      console.log(values)
      toast("Data jadwal telah di update.", {
        icon: <CheckCircle2 size={18} className="text-primary" />,
      });
    } catch (error) {
      toast("Terjadi kesalahan.", {
        icon: <CircleX size={18} className="text-red-500" />,
      });
    }
  };

  const [subjectSearch, setSubjectSearch] = React.useState<string>("");
  const [classSearch, setClassSearch] = React.useState<string>("");
  const [classroomSearch, setClassroomSearch] = React.useState<string>("");
  const [teacherSearch, setTeacherSearch] = React.useState<string>("");

  const subjectSearchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubjectSearch(event.target.value);
  };

  const classroomSearchHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setClassroomSearch(event.target.value);
  };

  const classSearchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setClassSearch(event.target.value);
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
            <SheetTitle>Schedule Detail</SheetTitle>
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
                    schedule_id: data?.schedule_id,
                    day: data?.day,
                    subject_id: data?.subject_code,
                    class_id:
                      data?.grade +
                      " " +
                      data?.shorten +
                      " " +
                      data?.identifier,
                    teacher_id: data?.teacher_name,
                  });
                  const startTime = data?.start;
                  if (startTime) {
                    const [hours, minutes] = startTime.split(":").map(Number);
                    const newDate = dayjs()
                      .startOf("day")
                      .add(hours, "hour")
                      .add(minutes, "minute")
                      .toDate();
                    setDateStart(newDate);
                  }
                  const endTime = data?.end;
                  if (endTime) {
                    const [hours, minutes] = endTime.split(":").map(Number);
                    const newDate = dayjs()
                      .startOf("day")
                      .add(hours, "hour")
                      .add(minutes, "minute")
                      .toDate();
                    setDateEnd(newDate);
                  }
                }}
              />
            )}
          </div>
          <SheetDescription>{data?.subject_name}</SheetDescription>
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
                  name="schedule_id"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel>Schedule ID</FormLabel>
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
                  name="day"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel>Day</FormLabel>
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
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel>Timestamps</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild className="col-span-3 !m-0">
                          <FormControl>
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
                            <TimePicker
                              date={dateStart}
                              setDate={setDateStart}
                            />
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
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel>Subject</FormLabel>
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
                              <Search
                                size={16}
                                className="text-primary inline"
                              />
                              <input
                                placeholder="Search subject..."
                                value={subjectSearch}
                                onChange={subjectSearchHandler}
                                onBlur={() => setSubjectSearch("")}
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
                                        .includes(subjectSearch.toLowerCase()) ||
                                      filtered.subject_name
                                        .toLowerCase()
                                        .includes(subjectSearch.toLowerCase())
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
                                value={classSearch}
                                onChange={classSearchHandler}
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
                                        .includes(classSearch.toLowerCase()) ||
                                      filtered.major_name
                                        .toLowerCase()
                                        .includes(classSearch.toLowerCase()) ||
                                      filtered.shorten
                                        .toLowerCase()
                                        .includes(classSearch.toLowerCase()) ||
                                      filtered.identifier
                                        .toLowerCase()
                                        .includes(classSearch.toLowerCase())
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
                  name="classroom_id"
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
                                ? classrooms.find(
                                    (item) => item.classroom_name === field.value
                                  )?.classroom_name
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
                                value={classroomSearch}
                                onChange={classroomSearchHandler}
                                onBlur={() => setClassroomSearch("")}
                                className="h-full placeholder:text-sm focus-visible:ring-0 focus-visible:outline-none px-2 py-1"
                              />
                            </div>
                            <CommandGroup>
                              <div className="overflow-y-auto max-h-[300px]">
                                {classrooms
                                  .filter((filtered) =>
                                    filtered.classroom_name
                                      .toLowerCase()
                                      .includes(classroomSearch.toLowerCase())
                                  )
                                  .map((item) => (
                                    <div
                                      key={item.classroom_id}
                                      className="flex hover:bg-primary/[0.08] cursor-pointer items-center px-2 py-1.5 text-sm gap-2 indent-0"
                                      onClick={() => {
                                        form.setValue(
                                          "classroom_id",
                                          item.classroom_name
                                        );
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "max-h-4 max-w-4 text-primary basis-1/6",
                                          field.value === item.classroom_name
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      <h1 className="basis-5/6 leading-tight">
                                        {item.classroom_name}
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
              <Label htmlFor="id">Schedule ID</Label>
              <Input
                id="id"
                value={data?.schedule_id}
                disabled
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={data?.subject_name}
                disabled
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="class">Class</Label>
              <Input
                id="class"
                value={data?.grade + " " + data?.shorten + " " + data?.identifier}
                disabled
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="schedule">Schedule</Label>
              <Input
                id="schedule"
                value={data?.day + ", " + data?.start + "-" + data?.end}
                disabled
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="room">Room</Label>
              <Input
                id="room"
                value={data?.classroom_name}
                disabled
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="teacher">Teacher</Label>
              <Input
                id="teacher"
                value={data?.teacher_name}
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

export default DetailJadwal;

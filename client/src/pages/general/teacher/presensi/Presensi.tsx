import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useFetch } from "@/hooks/fetcher";
import { AttendanceSchema } from "@/schemas/attendance-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { PopoverClose } from '@radix-ui/react-popover';
import { toast } from "sonner";
import { CircleX } from "lucide-react";

type StudentAttendanceType = {
  nisn: string;
  student_name: string;
};

const statuses = [ "Hadir", "Izin", "Sakit", "Alfa" ];

const Presensi = () => {
  const [generatedId, setGeneratedId] = React.useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const scheduleId = location.pathname.split("/")[location.pathname.split("/").length - 1];
  const { data } = useFetch<StudentAttendanceType[]>(
    "http://localhost:8800/backend/attendances/getToAttend/" + scheduleId
  );

  const form = useForm<z.infer<typeof AttendanceSchema>>({
    resolver: zodResolver(AttendanceSchema),
    defaultValues: {
      attendance_list_id: "",
      attendance: [
        {
          attendance_id: "",
          status: "Hadir",
          student_id: "",
          description: "",
        },
      ],
    },
  });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8800/backend/attendances/lastId/" + scheduleId
        );
        setGeneratedId(res.data[0].next_id);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [generatedId, scheduleId]);

  React.useEffect(() => {
    form.reset({
      attendance_list_id: "-",
      attendance: data.map((student) => ({
        attendance_id: student.nisn + "-" + generatedId.toString(),
        status: "",
        student_id: student.student_name,
        description: "",
      })),
    });
  }, [form, data, generatedId]);

  const onSubmit = async (values: z.infer<typeof AttendanceSchema>) => {
    try {
      await axios.post("http://localhost:8800/backend/attendances/", {
        attendance_list_id: generatedId,
        schedule_id: scheduleId,
        attendance: values.attendance.map((attendance) => ({
          attendance_id: attendance.attendance_id,
          student_id: data.find(student => student.student_name === attendance.student_id)?.nisn,
          status: attendance.status,
          description: attendance.description
        })),
      });
      navigate("/attendance");
    } catch (error) {
      if (error instanceof AxiosError) { 
        if (error.response && error.response.status === 409) {
          toast("Already took attendance today", {
            icon: <CircleX size={18} className="text-red-500" />,
          });
        } else {
          toast(error.message, {
            icon: <CircleX size={18} className="text-red-500" />,
          });
        }
      }
    }
  };

  return (
    <div className="flex flex-col h-full gap-6 overflow-y-hidden flex-nowrap whitespace-nowrap">
      <h1 className="sm:text-3xl text-2xl font-bold leading-none text-neutral-900">
        Presensi
      </h1>
      <Form {...form}>
        <form
          className="flex flex-col overflow-y-hidden"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col justify-between gap-8 py-4 h-full overflow-y-auto">
            <div className="rounded-md border overflow-y-auto">
              <Table className="h-full relative sm:text-sm text-xs">
                <TableHeader className="sticky top-0 bg-white z-10">
                  <TableRow>
                    <TableHead className="sm:w-10 w-8">
                      <Checkbox />
                    </TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data
                    .sort((a, b) =>
                      a.student_name.localeCompare(b.student_name)
                    )
                    .map((student, index) => (
                      <TableRow key={student.nisn}>
                        <TableCell>
                          <Checkbox />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`attendance.${index}.student_id`}
                            render={({ field }) => (
                              <FormItem className="grid w-full max-w-sm items-center gap-1.5">
                                <Input
                                  {...field}
                                  className="border-0 text-xs disabled:opacity-100"
                                  disabled
                                  value={student.student_name}
                                />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <FormField
                            control={form.control}
                            name={`attendance.${index}.status`}
                            render={({ field }) => (
                              <FormItem className="">
                                <Popover>
                                  <FormControl>
                                    <PopoverTrigger>
                                      <Badge className="w-[100px] flex justify-center">
                                        {field.value
                                          ? field.value
                                          : "Select Status"}
                                      </Badge>
                                    </PopoverTrigger>
                                  </FormControl>
                                  <PopoverContent className="overflow-hidden p-0">
                                    <ul className="text-center">
                                      {statuses.map((status) => (
                                        <li
                                          key={status}
                                          className="py-0.5 px-2 border-b"
                                          onClick={() => {
                                            form.setValue(
                                              `attendance.${index}.status`,
                                              status
                                            );
                                          }}
                                        >
                                          <PopoverClose>
                                            {status}
                                          </PopoverClose>
                                        </li>
                                      ))}
                                    </ul>
                                  </PopoverContent>
                                </Popover>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-end gap-4">
              <Button disabled={data.length === 0} type="submit">Done</Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Presensi;

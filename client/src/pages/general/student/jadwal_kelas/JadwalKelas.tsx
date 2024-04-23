import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useFetch } from '@/hooks/fetcher';
import { cn } from '@/lib/utils';
import { ApplyAbsenceSchema } from '@/schemas/messages-schemas';
import { useSocketStore } from '@/store/useSocketStore';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { format } from 'date-fns';
import { CalendarIcon, MailPlus } from 'lucide-react';
import React from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
]

interface StudentSchedulesType {
  classroom_id: string;
  classroom_name: string;
  day: string;
  start: string;
  end: string;
  subject_id: string;
  subject_name: string;
  teacher_name: string;
}

interface StudentClassesType {
  class_id: string;
  grade: string;
  identifier: string;
  waliKelas: string;
  major_id: string;
  shorten: string;
  major_name: string;
  uid: number;
  teacher_name: string;
}


const JadwalKelas = () => {
  const { socket } = useSocketStore();
  const { data:schedules } = useFetch<StudentSchedulesType[]>("http://localhost:8800/backend/schedules/student")
  const { data:classes } = useFetch<StudentClassesType[]>("http://localhost:8800/backend/classes/student")
  const studentClass = classes[0];
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof ApplyAbsenceSchema>>({
    resolver: zodResolver(ApplyAbsenceSchema),
    defaultValues: {
      message: "",
      type: "",
      date: {
        from: new Date(),
        to: new Date()
      },
    },
  });

  const onSubmit = async (values: z.infer<typeof ApplyAbsenceSchema>) => {
    try {
      await axios.post(`http://localhost:8800/backend/messages/absence`, {
        subject: "Absence request : " +values.type,
        message: values.message,
        start: values.date.from.toISOString().substring(0, 10),
        end: values.date.to?.toISOString().substring(0, 10),
        receiver_id: studentClass.uid
      }, { withCredentials: true });
      if (socket) {
        socket.emit("sendNotification", {
          receiverId: studentClass.uid,
        });
      }
      navigate(0);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col h-full gap-6 overflow-y-hidden flex-nowrap whitespace-nowrap">
      <h1 className="sm:text-3xl text-2xl font-bold leading-none text-neutral-900">
        Class Detail
      </h1>
      <div className="flex flex-col overflow-y-hidden">
        <div className="flex flex-col justify-between gap-3 py-4 h-full overflow-y-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-semibold text-neutral-800">Schedule</h1>
            <Dialog>
              <DialogTrigger>
                <Button className="flex items-center gap-2">
                  Apply Absence
                  <MailPlus size={16} />
                </Button>
              </DialogTrigger>
              <DialogContent className="min-w-[650px]">
                <DialogHeader>
                  <DialogTitle>Apply Absence</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="space-y-5">
                      <div className="grid grid-cols-2 gap-x-4">
                        <FormField
                          control={form.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Absence Type</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select absence type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Sakit">Sakit</SelectItem>
                                  <SelectItem value="Izin">Izin</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date</FormLabel>
                              <FormControl>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        id="date"
                                        variant={"outline"}
                                        className={cn(
                                          "w-full justify-start text-left font-normal",
                                          !field.value.from &&
                                            "text-muted-foreground"
                                        )}
                                      >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {field.value.from ? (
                                          field.value.to ? (
                                            <>
                                              {format(
                                                field.value.from,
                                                "LLL dd, y"
                                              )}{" "}
                                              -{" "}
                                              {format(
                                                field.value.to,
                                                "LLL dd, y"
                                              )}
                                            </>
                                          ) : (
                                            format(
                                              field.value.from,
                                              "LLL dd, y"
                                            )
                                          )
                                        ) : (
                                          <span>Pick a date</span>
                                        )}
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="min-w-max p-0"
                                    align="center"
                                  >
                                    <Calendar
                                      initialFocus
                                      mode="range"
                                      selected={{
                                        from: field.value.from!,
                                        to: field.value.to,
                                      }}
                                      onSelect={field.onChange}
                                      numberOfMonths={2}
                                    />
                                  </PopoverContent>
                                </Popover>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Message" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-x-4">
                        <DialogClose>
                          <Button
                            className="w-full"
                            type="button"
                            variant="outline"
                          >
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button type="submit">Submit</Button>
                      </div>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="rounded-md border overflow-y-auto">
            <Table className="h-full relative sm:text-sm text-xs">
              <TableHeader className="sticky top-0 bg-white z-10">
                <TableRow>
                  <TableHead />
                  <TableHead>Schedule</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Room</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {days.map((day) => {
                  const filteredData = schedules.filter(
                    (filtered) => filtered.day === day
                  );
                  return (
                    <>
                      <TableRow className="group border-t-2">
                        <TableCell
                          rowSpan={
                            filteredData.length > 0 ? filteredData.length : 1
                          }
                          className=""
                        >
                          {day}
                        </TableCell>
                        {filteredData.length > 0 && (
                          <>
                            <TableCell className="group-hover:underline">
                              {filteredData[0].start +
                                " - " +
                                filteredData[0].end}
                            </TableCell>
                            <TableCell className="text-ellipsis">
                              {filteredData[0].subject_name}
                            </TableCell>
                            <TableCell>
                              {filteredData[0].teacher_name}
                            </TableCell>
                            <TableCell>
                              {filteredData[0].classroom_name}
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                      {filteredData.length > 0 &&
                        filteredData.slice(1).map((item) => (
                          <TableRow className="group">
                            <TableCell className="group-hover:underline">
                              {item.start + " - " + item.end}
                            </TableCell>
                            <TableCell className="text-ellipsis">
                              {item.subject_name}
                            </TableCell>
                            <TableCell>{item.teacher_name}</TableCell>
                            <TableCell>{item.classroom_name}</TableCell>
                          </TableRow>
                        ))}
                    </>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JadwalKelas
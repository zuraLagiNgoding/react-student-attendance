import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Circle, Sun } from "lucide-react";
import student from "@/assets/student.svg";
// import student1 from "@/assets/student1.svg";
// import professor from "@/assets/professor.svg";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  TooltipProps,
} from "recharts";
import React from "react";
import { useFetch } from "@/hooks/fetcher";
import dayjs from "dayjs";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { ScheduleType } from "./jadwal_mengajar/JadwalMengajar";
import ScheduleCard from "./jadwal_mengajar/components/ScheduleCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificationType } from "@/Layout";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";

interface RecapsType {
  nisn: string;
  student_name: string;
  attendance: {
    created_at: string;
    status: string;
    subject_name: string;
    day: string;
  }[];
}

interface UserType {
  nip: string;
  teacher_name: string;
  email: string;
}

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active)
    return (
      <div className="rounded-md bg-white shadow-2xl py-2 px-4">
        <h1 className="font-medium">{label}</h1>
        <p className="text-sm font-light">
          {payload && payload[0].value} Students
        </p>
      </div>
    );
};

const Information = () => {
  const { data: recap } = useFetch<RecapsType[]>(
    "http://localhost:8800/backend/attendances/recaps"
  );
  const { data: schedules } = useFetch<ScheduleType[]>(
    "http://localhost:8800/backend/schedules/teacher"
  );
  const { data: messages, reFetch } = useFetch<NotificationType[]>(
    `http://localhost:8800/backend/messages/all`
  );

  const timeAgo = (date: Date | undefined): string => {
    if (!date) {
      return "";
    }

    const now = new Date();
    const differenceInMs = now.getTime() - date.getTime();
    const differenceInMinutes = Math.round(differenceInMs / (1000 * 60));
    const differenceInHours = Math.round(differenceInMinutes / 60);

    if (differenceInMinutes <= 1) {
      return "Just now";
    } else if (differenceInMinutes < 60) {
      return `${differenceInMinutes} minute${
        differenceInMinutes !== 1 ? "s" : ""
      } ago`;
    } else if (differenceInHours < 24) {
      return `${differenceInHours} hour${
        differenceInHours !== 1 ? "s" : ""
      } ago`;
    } else {
      const differenceInDays = Math.round(
        differenceInHours / 24);
      return `${differenceInDays} day${differenceInDays !== 1 ? "s" : ""} ago`;
    }
  };

  const [totalAbsence, setTotalAbsence] = React.useState(0);

  React.useEffect(() => {
    const calculateTotalAbsence = () => {
      let totalAbsence = 0;
      recap.forEach((student) => {
        student.attendance.forEach((attendance) => {
          if (
            attendance.status !== "Hadir" &&
            dayjs().isSame(attendance.created_at, "date")
          ) {
            totalAbsence++;
          }
        });
      });
      setTotalAbsence(totalAbsence);
    };
    calculateTotalAbsence();
  }, [recap]);

  return (
    <>
      <div className="flex flex-col gap-4 w-full">
        <h1 className="text-xl font-semibold">Inbox</h1>
        <div className="flex h-fit max-h-full max-w-full shrink-0 flex-col gap-4">
          <Card>
            <CardContent className="px-0 min-h-[10rem] flex items-center justify-center text-slate-800/50">
              {messages ? (
                <ScrollArea className="flex flex-col p-3 h-full">
                  {messages.slice(0,3).map((message) => (
                    <Card
                      className="flex mb-3 hover:bg-slate-100 cursor-pointer overflow-hidden shadow-lg"
                      // onClick={() => {
                      //   if (message.message_read === "0") {
                      //     if (socket) {
                      //       socket.emit("readMessage", {
                      //         messageId: message.message_id,
                      //       });
                      //       navigate("/inbox/" + message.message_id);
                      //     }
                      //   } else {
                      //     navigate("/inbox/" + message.message_id);
                      //   }
                      // }}
                    >
                      <div className="flex basis-1/12 items-center justify-center shrink-0">
                        <Circle
                          className={clsx(
                            "fill-current text-sky-500",
                            message.message_read === "0" ? "block" : "hidden"
                          )}
                          size={10}
                        />
                      </div>
                      <div className="flex basis-11/12 flex-col w-full gap-1 overflow-hidden">
                        <CardHeader className="flex-row justify-between w-full pl-0 pb-0 pt-3.5">
                          <div className="flex flex-col w-[calc(100%-80px)] lg:gap-2 gap-1">
                            <h1 className="lg:text-base text-sm text-ellipsis lg:max-w-[90%] max-w-[85%] overflow-hidden">
                              {message.student_name && message.student_name}
                              {message.teacher_name && message.teacher_name}
                            </h1>
                            <h1 className="font-normal lg:text-sm text-xs">
                              {message.subject}
                            </h1>
                          </div>
                          <h1 className="text-xs">
                            {timeAgo(new Date(message.send_at))}
                          </h1>
                        </CardHeader>
                        <CardContent className="p-0 pr-3 pb-3.5">
                          <h1 className="font-light lg:text-sm text-xs text-neutral-400 line-clamp-2 text-wrap">
                            {message.message}
                          </h1>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </ScrollArea>
              ) : (
                "Your inbox is currently empty."
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="grid lg:grid-cols-1 md:grid-cols-2 grid-cols-1 sm:gap-6 gap-3">
        <Card className="overflow-hidden bg-slate-800 text-white">
          <CardHeader>
            <CardTitle>Absence Today</CardTitle>
          </CardHeader>
          <CardContent className="flex relative justify-between">
            <h1 className="sm:text-3xl text-xl font-semibold leading-none text-primary">
              {totalAbsence}
            </h1>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col gap-4 w-full">
        <h1 className="text-xl font-semibold">Today Schedule</h1>
        <div className="flex h-fit max-h-full max-w-full shrink-0 flex-col gap-4">
          {schedules
            .filter(
              (filter) =>
                filter.day == dayjs().format("dddd") &&
                dayjs().isBefore(dayjs().format("YYYY-MM-DD") + filter.end)
            )
            .map((schedule) => (
              <ScheduleCard schedule={schedule} key={schedule.schedule_id} />
            ))}
        </div>
      </div>
    </>
  );
};

const Overview = () => {
  const { data: users } = useFetch<UserType[]>(
    "http://localhost:8800/backend/users"
  );
  const user = users[0];

  const { data: recap } = useFetch<RecapsType[]>(
    "http://localhost:8800/backend/attendances/recaps"
  );

  const [attendanceCounts, setAttendanceCounts] = React.useState<
    {
      name: string;
      values: number;
    }[]
  >([]);

  React.useEffect(() => {
    const calculateAttendanceCounts = () => {
      const attendanceCounts = monthNames.map((monthName, index) => {
        const month = index;
        const days = new Date(dayjs().year(), month + 1, 0).getDate();
        let hadirCount = 0;

        for (let dayIndex = 0; dayIndex < days; dayIndex++) {
          const attendancesForDay = recap.reduce((acc, studentRecap) => {
            const attendances = studentRecap.attendance.filter((att) => {
              const date = dayjs(att.created_at);
              return (
                date.get("date") === dayIndex + 1 &&
                date.get("month") === month &&
                date.get("year") === dayjs().year()
              );
            });
            if (attendances.length > 0) {
              if (attendances.every((att) => att.status === "Hadir")) {
                acc++;
              } else if (
                attendances.some((att) => att.status === "Hadir") &&
                attendances.some(
                  (att) => att.status === "Sakit" || att.status === "Izin"
                )
              ) {
                acc++;
              } else if (
                attendances.some((att) => att.status === "Izin") &&
                attendances.some((att) => att.status === "Hadir")
              ) {
                acc++;
              }
            }
            return acc;
          }, 0);
          hadirCount += attendancesForDay;
        }

        return { name: monthName, values: hadirCount };
      });
      setAttendanceCounts(attendanceCounts);
    };
    calculateAttendanceCounts();
  }, [recap]);

  return (
    <div className="flex flex-col h-full gap-6 overflow-y-hidden flex-nowrap whitespace-nowrap overflow-x-hidden">
      <h1 className="text-3xl font-bold leading-none text-neutral-900">
        Overview
      </h1>
      <div className="flex h-full w-full gap-6 md:overflow-y-hidden overflow-y-auto">
        <div className="lg:basis-4/6 basis-full flex flex-col gap-6">
          <div className="flex relative shrink-0 border overflow-hidden justify-between border-slate-200 bg-white text-slate-950 shadow dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 w-full sm:h-40 h-28 rounded-md">
            <div className="absolute xl:block hidden right-[-3.5rem]">
              <img
                src={student}
                alt="student"
                className="min-w-[22rem] translate-y-[-2rem]"
              />
            </div>
            <div className="sm:p-8 p-6 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Sun className="text-orange-400" size={32} />
                <h1 className="sm:text-2xl text-lg font-semibold leading-none text-neutral-900">
                  Welcome, {user?.teacher_name}!
                </h1>
              </div>
            </div>
          </div>
          <div className="lg:hidden flex flex-col gap-8">
            <Information />
          </div>
          <div className="w-full h-full sm:flex hidden">
            <Card className="w-full sm:h-full h-fit">
              <CardHeader>
                <CardTitle>Attendance Overview</CardTitle>
              </CardHeader>
              <CardContent className="flex sm:h-full h-fit w-full items-center sm:p-6 px-0">
                <ResponsiveContainer width={"100%"} height={"75%"}>
                  <BarChart data={attendanceCounts}>
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      stroke="#0EB87A"
                      fontSize={12}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      stroke="#0EB87A"
                      fontSize={12}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <CartesianGrid opacity={0.45} vertical={false} />
                    <Bar
                      dataKey="values"
                      fill="#0EB87A"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
        <ScrollArea className="lg:flex lg:basis-2/6 basis-0 hidden">
          <div className="flex flex-col gap-6">
            <Information />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Overview;

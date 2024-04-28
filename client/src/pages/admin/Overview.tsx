import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Check, Sun } from "lucide-react";
import student from "@/assets/student.svg";
import student1 from "@/assets/student1.svg";
import professor from "@/assets/professor.svg";
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
import { StudentsType } from "./data_siswa/columns";
import { TeachersType } from "./data_guru/columns";
import dayjs from "dayjs";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

// const dummy = [
//   {
//     name: "Jan",
//     attendances: 624,
//     absences: 973,
//   },
//   {
//     name: "Feb",
//     attendances: 802,
//     absences: 609,
//   },
//   {
//     name: "Mar",
//     attendances: 768,
//     absences: 1015,
//   },
//   {
//     name: "Apr",
//     attendances: 862,
//     absences: 627,
//   },
//   {
//     name: "May",
//     attendances: 873,
//     absences: 917,
//   },
//   {
//     name: "Jun",
//     attendances: 1143,
//     absences: 1175,
//   },
//   {
//     name: "Jul",
//     attendances: 834,
//     absences: 1124,
//   },
//   {
//     name: "Aug",
//     attendances: 946,
//     absences: 975,
//   },
//   {
//     name: "Sep",
//     attendances: 797,
//     absences: 556,
//   },
//   {
//     name: "Oct",
//     attendances: 961,
//     absences: 731,
//   },
//   {
//     name: "Nov",
//     attendances: 508,
//     absences: 977,
//   },
//   {
//     name: "Dec",
//     attendances: 735,
//     absences: 737,
//   },
// ];


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
      <div className="rounded-md bg-white shadow-2xl py-4 px-6">
        <h1 className="font-medium">{label}</h1>
        <p className="text-sm font-light">
          <span className="text-tertiary">{payload && payload[0].value}</span>{" "}
          Attendances
        </p>
        <p className="text-sm font-light">
          <span className="text-tertiary">{payload && payload[1].value}</span>{" "}
          Absences
        </p>
      </div>
    );
};

const Overview = () => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1999 }, (_, index) =>
    (currentYear - index).toString()
  );
  const [year, setYear] = React.useState(
    parseInt(dayjs(new Date()).format("YYYY"))
  );

  const { data: recap } = useFetch<RecapsType[]>(
    "http://localhost:8800/backend/attendances/recaps"
  );
  const { data: students } = useFetch<StudentsType[]>(
    "http://localhost:8800/backend/students"
  );
  const { data: teachers } = useFetch<TeachersType[]>(
    "http://localhost:8800/backend/teachers"
  );
  const [totalAbsence, setTotalAbsence] = React.useState(0);
  const [totalAttendances, setTotalAttendances] = React.useState(0);
  const [attendanceCounts, setAttendanceCounts] = React.useState<
    {
      name: string;
      attendances: number;
      absences: number;
    }[]
  >([]);

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

  React.useEffect(() => {
    const calculateAttendanceCounts = () => {
      let totalAllHadir = 0;
      const attendanceCounts = monthNames.map((monthName, index) => {
        const month = index;
        const days = new Date(year, month + 1, 0).getDate();
        let hadirCount = 0;
        let absenCount = 0;

        for (let dayIndex = 0; dayIndex < days; dayIndex++) {
          const attendancesForDay = recap.reduce((acc, studentRecap) => {
            const attendances = studentRecap.attendance.filter((att) => {
              const date = dayjs(att.created_at);
              return (
                date.get("date") === dayIndex + 1 &&
                date.get("month") === month &&
                date.get("year") === year
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
          totalAllHadir += attendancesForDay;
        }

        for (let dayIndex = 0; dayIndex < days; dayIndex++) {
          const absencesForDay = recap.reduce((acc, studentRecap) => {
            const absences = studentRecap.attendance.filter((att) => {
              const date = dayjs(att.created_at);
              return (
                date.get("date") === dayIndex + 1 &&
                date.get("month") === month &&
                date.get("year") === year
              );
            });
            if (absences.length > 0) {
              if (
                absences.every(
                  (att) =>
                    att.status === "Izin" ||
                    att.status === "Sakit" ||
                    att.status === "Alfa"
                )
              ) {
                acc++;
              } else if (
                absences.some((att) => att.status === "Izin") &&
                absences.some((att) => att.status === "Sakit") &&
                absences.some((att) => att.status === "Alfa")
              ) {
                acc++;
              }
            }
            return acc;
          }, 0);
          absenCount += absencesForDay;
        }

        return {
          name: monthName,
          attendances: hadirCount,
          absences: absenCount,
        };
      });
      setTotalAttendances(totalAllHadir);
      setAttendanceCounts(attendanceCounts);
    };
    calculateAttendanceCounts();
  }, [recap, year]);

  return (
    <div className="flex flex-col h-full gap-6 overflow-y-hidden flex-nowrap whitespace-nowrap">
      <h1 className="text-3xl font-bold leading-none text-neutral-900">
        Overview
      </h1>
      <div className="flex h-full gap-6 overflow-y-hidden">
        <div className="basis-4/6 flex flex-col gap-6">
          <div className="flex relative shrink-0 border overflow-hidden justify-between border-slate-200 bg-white text-slate-950 shadow dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 w-full h-40 rounded-md">
            <div className="absolute lg:block hidden right-[-3.5rem]">
              <img
                src={student}
                alt="student"
                className="min-w-[22rem] translate-y-[-2rem]"
              />
            </div>
            <div className="p-8 flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <Sun className="text-orange-400" size={32} />
                <div className="flex flex-col gap-2">
                  <h1 className="text-2xl font-semibold leading-none text-neutral-900">
                    Welcome, <span className="font-bold">Admin!</span>
                  </h1>
                  <p className="text-sm text-slate-500">
                    Here, you can manage various aspects of the application.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full h-full">
            <Card className="w-full h-full">
              <CardHeader>
                <CardTitle className="text-2xl">Attendance Overview</CardTitle>
                <div className="flex w-full items-center justify-between">
                  <h1 className=" text-primary/70">
                    <span className="font-semibold">{totalAttendances}</span>{" "}
                    attendances
                  </h1>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        size={"sm"}
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "justify-between gap-3 w-[6rem] bg-transparent",
                          !year && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="h-4 w-4 shrink-0 opacity-50" />
                        {year}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="overflow-hidden p-0">
                      <div className="overflow-y-auto max-h-[15rem]">
                        {years.map((item) => (
                          <div
                            className="flex hover:bg-primary/[0.08] cursor-pointer items-center px-2 py-1.5 text-sm gap-2 indent-0"
                            onClick={() => {
                              setYear(parseInt(item));
                            }}
                          >
                            <Check
                              className={cn(
                                "max-h-4 max-w-4 text-primary basis-2/6",
                                year === parseInt(item)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            <h1 className="basis-4/6 leading-tight">{item}</h1>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </CardHeader>
              <CardContent className="flex h-[90%] w-full items-center">
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
                      dataKey="attendances"
                      fill="#0EB87A"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="absences"
                      fill="#347FC4"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="basis-2/6 flex flex-col gap-6">
          <Card className="overflow-hidden bg-secondary/10">
            <CardHeader>
              <CardTitle>Total Students</CardTitle>
            </CardHeader>
            <CardContent className="flex relative justify-between">
              <div className="absolute lg:block hidden right-[-2rem]">
                <img
                  src={student1}
                  alt="student1"
                  className="min-w-[12rem] translate-y-[-4rem]"
                />
              </div>
              <h1 className="text-3xl font-semibold leading-none text-primary">
                {students.length}
              </h1>
            </CardContent>
          </Card>
          <Card className="overflow-hidden bg-secondary/10">
            <CardHeader>
              <CardTitle>Total Teachers</CardTitle>
            </CardHeader>
            <CardContent className="flex relative justify-between">
              <div className="absolute lg:block hidden right-[-2rem]">
                <img
                  src={professor}
                  alt="professor"
                  className="min-w-[12rem] translate-y-[-4rem]"
                />
              </div>
              <h1 className="text-3xl font-semibold leading-none text-primary">
                {teachers.length}
              </h1>
            </CardContent>
          </Card>
          <Card className="overflow-hidden bg-slate-800 text-white">
            <CardHeader>
              <CardTitle>Absence Today</CardTitle>
            </CardHeader>
            <CardContent className="flex relative justify-between">
              <h1 className="text-3xl font-semibold leading-none text-primary">
                {totalAbsence}
              </h1>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Overview;

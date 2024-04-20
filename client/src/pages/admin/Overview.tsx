import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card";
import { Sun } from "lucide-react";
import student from "@/assets/student.svg"
import student1 from "@/assets/student1.svg"
import professor from "@/assets/professor.svg"
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
import React from 'react'
import { useFetch } from "@/hooks/fetcher";
import { StudentsType } from "./data_siswa/columns";
import { TeachersType } from "./data_guru/columns";
import dayjs from "dayjs";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

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
        <p className="text-sm font-light">{payload && payload[0].value} Students</p>
      </div>
    );
};

const Overview = () => {
  const { data:recap } = useFetch<RecapsType[]>("http://localhost:8800/backend/attendances/recaps");
  const { data:students } = useFetch<StudentsType[]>("http://localhost:8800/backend/students");
  const { data:teachers } = useFetch<TeachersType[]>("http://localhost:8800/backend/teachers");
  const [ totalAbsence, setTotalAbsence ] = React.useState(0);
  const [attendanceCounts, setAttendanceCounts] = React.useState<{
    name: string;
    values: number;
  }[]>([]);

  React.useEffect(() => {
    const calculateTotalAbsence = () => {
      let totalAbsence = 0;
      recap.forEach((student) => {
        student.attendance.forEach((attendance) => {
          if (
            attendance.status !== "Hadir" &&
            dayjs().isSame(attendance.created_at, 'date')
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
                attendances.some(
                  (att) => att.status === "Hadir"
                )
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

  console.log(attendanceCounts)

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
              <div className="flex items-center gap-2">
                <Sun className="text-orange-400" size={32} />
                <h1 className="text-2xl font-semibold leading-none text-neutral-900">
                  Welcome, Admin!
                </h1>
              </div>
            </div>
          </div>
          <div className="flex w-full h-full">
            <Card className="w-full h-full">
              <CardHeader>
                <CardTitle>Attendance overview</CardTitle>
              </CardHeader>
              <CardContent className="flex h-full w-full items-center">
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
                    <Tooltip content={<CustomTooltip/>}/>
                    <CartesianGrid opacity={0.45} vertical={false}/>
                    <Bar dataKey="values" fill="#0EB87A" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="basis-2/6 flex flex-col gap-6">
          <Card className="overflow-hidden">
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
          <Card className="overflow-hidden">
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
}

export default Overview
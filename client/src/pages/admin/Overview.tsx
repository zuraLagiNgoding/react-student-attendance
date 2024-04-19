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
} from "recharts";
import React from 'react'
import { useFetch } from "@/hooks/fetcher";
import { StudentsType } from "./data_siswa/columns";
import { TeachersType } from "./data_guru/columns";

const data = [
  {
    name: "Jan",
    value: 4000,
  },
  {
    name: "Feb",
    value: 3000,
  },
  {
    name: "Mar",
    value: 2500,
  },
  {
    name: "Apr",
    value: 4000,
  },
  {
    name: "May",
    value: 3500,
  },
  {
    name: "Jun",
    value: 4000,
  },
  {
    name: "Jul",
    value: 2000,
  },
  {
    name: "Aug",
    value: 1500,
  },
  {
    name: "Sep",
    value: 1000,
  },
  {
    name: "Oct",
    value: 2000,
  },
  {
    name: "Nov",
    value: 2500,
  },
  {
    name: "Des",
    value: 4000,
  },
];

const Overview = () => {

  const { data:students } = useFetch<StudentsType[]>("http://localhost:8800/backend/students");
  const { data:teachers } = useFetch<TeachersType[]>("http://localhost:8800/backend/teachers");

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
                  <BarChart data={data}>
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
                    <Bar dataKey="value" fill="#0EB87A" radius={[4, 4, 0, 0]} />
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
                {teachers.length}
              </h1>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Overview
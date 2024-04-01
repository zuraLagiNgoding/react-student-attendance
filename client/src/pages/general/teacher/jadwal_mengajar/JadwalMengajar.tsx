import { useFetch } from "@/hooks/fetcher";
import React from "react";
import Card from "./components/ScheduleCard";
import dayjs from "dayjs";

export interface ScheduleType {
  schedule_id: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
  start: string;
  end: string;
  subject_id: string;
  teacher_id: string;
  class_id: string;
  subject_name: string;
  teacher_name: string;
  class_name: string;
}

const JadwalMengajar = () => {
  const { data } = useFetch<ScheduleType[]>(
    "http://localhost:8800/backend/schedules/teacher"
  );

  return (
    <div className="flex flex-col h-full gap-6 overflow-y-hidden flex-nowrap whitespace-nowrap">
      <h1 className="text-3xl font-bold leading-none text-neutral-900">
        List of Schedules
      </h1>
      <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-6 overflow-y-auto">
        <div className="flex flex-col gap-4 w-full">
          <h1 className="text-xl font-semibold">Today</h1>
          <div className="flex h-fit max-h-full max-w-[350px] shrink-0 flex-col gap-4">
            {data
              .filter((filter) => filter.day == dayjs().format("dddd"))
              .map((schedule) => (
                <Card schedule={schedule} key={schedule.schedule_id} />
              ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 w-full">
          <h1 className="text-xl font-semibold">Tomorrow</h1>
          <div className="flex h-fit max-h-full max-w-[350px] shrink-0 flex-col gap-4">
            {data
              .filter(
                (filter) => filter.day == dayjs().add(1, "day").format("dddd")
              )
              .map((schedule) => (
                <Card schedule={schedule} key={schedule.schedule_id} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JadwalMengajar;

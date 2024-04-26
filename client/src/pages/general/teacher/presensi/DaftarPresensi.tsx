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
  created_at: Date;
  status: string;
}

const DaftarPresensi = () => {
  const { data } = useFetch<ScheduleType[]>(
    "http://localhost:8800/backend/schedules/teacher"
  );
  const { data:filledData } = useFetch<ScheduleType[]>(
    "http://localhost:8800/backend/schedules/teacher/filled"
  );

  return (
    <div className="flex flex-col h-full gap-6 overflow-y-hidden flex-nowrap whitespace-nowrap">
      <h1 className="sm:text-3xl text-2xl font-bold leading-none text-neutral-900">
        List of Attendee
      </h1>
      <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-6 overflow-y-auto">
        <div className="flex flex-col gap-4 w-full">
          <h1 className="text-xl font-semibold">Due</h1>
          <div className="flex h-fit max-h-full overflow-auto flex-col gap-4">
            {data
              .filter(
                (schedule) =>
                  schedule.day === dayjs().format("dddd") &&
                  dayjs().isAfter(
                    dayjs().format("YYYY-MM-DD" + schedule.start)
                  ) &&
                  dayjs().isBefore(
                    dayjs().format("YYYY-MM-DD" + schedule.end)
                  ) &&
                  dayjs().isSame(schedule.created_at, "date") &&
                  !filledData.some(
                    (item) =>
                      dayjs(item.created_at).isSame(
                        dayjs(schedule.created_at),
                        "date"
                      ) &&
                      item.status === "done" &&
                      item.schedule_id === schedule.schedule_id
                  )
              )
              .map((schedule) => (
                <Card schedule={schedule} key={schedule.schedule_id} />
              ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 w-full">
          <h1 className="text-xl font-semibold">Filled In</h1>
          <div className="flex h-fit max-h-full overflow-auto flex-col gap-4">
            {filledData
              .filter((filter) => dayjs().isSame(filter.created_at, "date") && filter.day === dayjs().format("dddd"))
              .map((schedule) => (
                <Card schedule={schedule} key={schedule.schedule_id} />
              ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 w-full">
          <h1 className="text-xl font-semibold">Empty</h1>
          <div className="flex h-fit max-h-full overflow-auto flex-col gap-4">
            {data
              .filter(
                (schedule) =>
                  schedule.day === dayjs().format("dddd") &&
                  dayjs().isAfter(
                    dayjs().format("YYYY-MM-DD" + schedule.end)
                  ) &&
                  dayjs().isSame(schedule.created_at, "date") &&
                  !filledData.some(
                    (item) =>
                      dayjs(item.created_at).isSame(
                        dayjs(schedule.created_at),
                        "date"
                      ) &&
                      item.status === "done" &&
                      item.schedule_id === schedule.schedule_id
                  )
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

export default DaftarPresensi;

import { Card, CardContent } from "@/components/ui/card";
import { Sun } from "lucide-react";
import student from "@/assets/student.svg";
// import student1 from "@/assets/student1.svg";
// import professor from "@/assets/professor.svg";
import React from "react";
import { useFetch } from "@/hooks/fetcher";
import dayjs from "dayjs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ScheduleType } from "../teacher/jadwal_mengajar/JadwalMengajar";
import ScheduleCard from "../teacher/jadwal_mengajar/components/ScheduleCard";


interface UserType {
  nip: string;
  student_name: string;
  email: string;
}

const Information = () => {
  const { data: schedules } = useFetch<ScheduleType[]>(
    "http://localhost:8800/backend/schedules/teacher"
  );

  return (
    <>
      <div className="flex flex-col gap-4 w-full">
        <h1 className="text-xl font-semibold">Inbox</h1>
        <div className="flex h-fit max-h-full max-w-full shrink-0 flex-col gap-4">
          <Card>
            <CardContent className="min-h-[10rem] flex items-center justify-center text-slate-800/50">
              Your inbox is currently empty.
            </CardContent>
          </Card>
        </div>
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

  React.useEffect(() => {
    console.log(users)
  }, [users])
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
                  Welcome, {user?.student_name}!
                </h1>
              </div>
            </div>
          </div>
          <div className="lg:hidden flex flex-col gap-8">
            <Information />
          </div>
        </div>
        <ScrollArea className="lg:flex hidden lg:basis-2/6 basis-0">
          <div className="flex flex-col gap-6">
            <Information />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Overview;

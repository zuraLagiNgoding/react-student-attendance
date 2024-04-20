import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { ScheduleType } from "../JadwalMengajar";
import { Button } from "@/components/ui/button";
import { Clock9 } from "lucide-react";
import dayjs from "dayjs";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { useFetch } from "@/hooks/fetcher";

interface CardProps {
  schedule: ScheduleType;
  mute?: boolean;
}

const ScheduleCard = ({ schedule, mute }: CardProps) => {

  const { data: filledData } = useFetch<ScheduleType[]>(
    "http://localhost:8800/backend/schedules/teacher/filled"
  );

  return (
    <Card
      className={clsx(
        "relative min-h-[160px] sm:max-h-[160px] max-h-[180px] overflow-hidden",
        schedule.day == dayjs().format("dddd") &&
          dayjs().isAfter(dayjs().format("YYYY-MM-DD") + schedule.start) &&
          dayjs().isBefore(dayjs().format("YYYY-MM-DD") + schedule.end)
          ? "alert"
          : "",
        mute && "opacity-65"
      )}
    >
      <CardHeader className="flex flex-row justify-between">
        <div className="flex flex-col w-full gap-2 max-w-[80%] ">
          <CardTitle className="sm:text-base text-sm sm:text-ellipsis sm:text-nowrap text-wrap overflow-hidden">
            {schedule.subject_name}
          </CardTitle>
          <div className="flex items-center gap-2">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Ruang 31
            </p>
            <Badge className="line-clamp-1 flex w-fit">
              {schedule.class_name}
            </Badge>
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <p className="text-xs text-muted-foreground/60">{schedule.day}</p>
        </div>
      </CardHeader>

      <CardContent className="flex sm:flex-row flex-col items-center sm:justify-between gap-y-2">
        <Badge variant={"outline"}>
          {schedule.start} - {schedule.end}
        </Badge>
        {schedule.day == dayjs().format("dddd") &&
        dayjs().isAfter(dayjs().format("YYYY-MM-DD") + schedule.start) &&
        dayjs().isBefore(dayjs().format("YYYY-MM-DD") + schedule.end) &&
        !filledData.some(
          (item) =>
            dayjs(item.created_at).isSame(dayjs(schedule.created_at), "date") &&
            item.status === "done" &&
            item.schedule_id === schedule.schedule_id
        ) ? (
          <Link to="/attendance">
            <Button size={"sm"} className="flex items-center gap-2">
              <Clock9 size={16} />
              Awaiting Attendance
            </Button>
          </Link>
        ) : (
          <></>
        )}
      </CardContent>
    </Card>
  );
};

export default ScheduleCard;

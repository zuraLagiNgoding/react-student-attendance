import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { ScheduleType } from "../DaftarPresensi";
import { Button } from "@/components/ui/button";
import { Eye, NotebookPen } from "lucide-react";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

interface CardProps {
  schedule: ScheduleType;
}

const ScheduleCard = ({ schedule }: CardProps) => {
  return (
    <Card className="min-h-[160px] sm:max-h-[160px] min-w-[260px] max-h-[180px] overflow-hidden">
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
        schedule.status !== "done" ? (
          <Link to={"/attendance/" + schedule.schedule_id}>
            <Button size={"sm"} className="flex items-center gap-2">
              <NotebookPen size={16} />
              Start Attendance
            </Button>
          </Link>
        ) : (
          <>
            {schedule.status === "done" ? (
              <Link to={"/attendance/" + schedule.schedule_id + "?view=1"}>
                <Button
                  size={"sm"}
                  className="bg-sky-500 hover:bg-sky-500/80 flex items-center gap-2"
                >
                  <Eye size={16} />
                  View
                </Button>
              </Link>
            ) : (
              <>
                {dayjs().isAfter(dayjs().format("YYYY-MM-DD") + schedule.end) &&
                schedule.status !== "done" ? (
                  <Link to={"/attendance/" + schedule.schedule_id}>
                    <Button
                      size={"sm"}
                      className="bg-yellow-500 hover:bg-yellow-500/80 flex items-center gap-2"
                    >
                      <NotebookPen size={16} />
                      Fill Attendance
                    </Button>
                  </Link>
                ) : null}
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ScheduleCard;

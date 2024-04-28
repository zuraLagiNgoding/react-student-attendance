import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFetch } from "@/hooks/fetcher";
import dayjs from "dayjs";
import { Circle } from "lucide-react";
import React from "react";
import { useLocation, useSearchParams } from "react-router-dom";

type RecapType = {
  nisn: string;
  student_name: string;
  attendance: [
    {
      created_at: Date;
      status: string;
      subject_name: string;
      day: string;
    }
  ];
};

type SubjectType = {
  day: string;
  subjects: [
    {
      subject_code: string;
      subject_name: string;
    }
  ];
};

const Recap = () => {
  const [searchParams] = useSearchParams();
  const month = searchParams.get("month");
  const year = searchParams.get("year");
  const location = useLocation().pathname.split("/");
  const classId = location[location.length - 2];
  const [day, setDay] = React.useState(-1);
  const [days, setDays] = React.useState(0);
  const { data } = useFetch<RecapType[]>(
    "http://localhost:8800/backend/attendances/recap/" + classId
  );
  const { data: subjects } = useFetch<SubjectType[]>(
    "http://localhost:8800/backend/attendances/recap/subjects/" + classId
  );
  const [total, setTotal] = React.useState<number[]>([]);
  const [collapse, setCollapse] = React.useState<number | undefined>();

  React.useEffect(() => {
    const totalHadir = [...Array(days)].map((_, dayIndex) => {
      return data.reduce((dayTotal, recap) => {
        const attendancesForDay = recap.attendance.filter(
          (att) =>
            dayjs(att.created_at).date() === dayIndex + 1 &&
            dayjs(att.created_at).format("YYYY") === year &&
              dayjs(att.created_at).format("YYYY") === year &&
            dayjs(att.created_at).format("M") ===
              (parseInt(month as string) + 1).toString()
        );
        if (attendancesForDay.length > 0)
          if (
            attendancesForDay[0].status === "Hadir" &&
            attendancesForDay.every((att) => att.status === "Hadir")
          ) {
            return dayTotal + 1;
          } else if (
            attendancesForDay[0].status === "Hadir" &&
            attendancesForDay.some(
              (att) => att.status === "Sakit" || att.status === "Izin"
            )
          ) {
            return dayTotal + 1;
          } else if (
            attendancesForDay[0].status === "Izin" &&
            attendancesForDay.some(
              (att) => att.status === "Hadir"
            )
          ) {
            return dayTotal + 1;
          }
        return dayTotal;
      }, 0);
    });

    setTotal(totalHadir);
  }, [data, month, days, year]);

  React.useEffect(() => {
    const daysInMonth = new Date(
      parseInt(year as string),
      parseInt(month as string) + 1,
      0
    ).getDate();
    setDays(daysInMonth);
  }, [month, year]);

  return (
    <div className="flex flex-col h-full gap-6 overflow-y-hidden flex-nowrap whitespace-nowrap">
      <h1 className="sm:text-3xl text-2xl font-bold leading-none text-neutral-900">
        Recap
      </h1>
      <div className="flex flex-col h-full w-full overflow-hidden">
        <div className="flex flex-col gap-4 py-4 h-full w-full overflow-auto">
          <TableCaption className="flex items-center justify-center gap-4">
            <div className="flex items-center justify-center gap-2">
              <Circle className="fill-current text-primary" size={12} />
              Hadir
            </div>
            <div className="flex items-center justify-center gap-2">
              <Circle className="fill-current text-sky-500" size={12} />
              Izin
            </div>
            <div className="flex items-center justify-center gap-2">
              <Circle className="fill-current text-red-500" size={12} />
              Sakit
            </div>
            <div className="flex items-center justify-center gap-2">
              <Circle className="fill-current text-neutral-500" size={12} />
              Alfa
            </div>
          </TableCaption>
          <div className="rounded-md border overflow-y-auto overflow-x-auto">
            <Table className="h-full relative sm:text-sm text-xs">
              <TableHeader className="sticky top-0 bg-white z-10">
                <TableRow>
                  <TableHead>NISN</TableHead>
                  <TableHead>Student Name</TableHead>
                  {[...Array(days)].map((item, index) => (
                    <TableHead className="text-center" key={item}>
                      {index + 1}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data
                  .filter((filter) =>
                    filter.attendance.find(
                      (att) =>
                          dayjs(att.created_at).format("YYYY") === year &&
                        dayjs(att.created_at).format("M") ==
                        (parseInt(month as string) + 1).toString()
                    )
                  )
                  .map((recap, index) => (
                    <Collapsible
                      asChild
                      key={recap.nisn}
                      open={collapse == index}
                      onOpenChange={() => setCollapse(undefined)}
                    >
                      <>
                        <TableRow key={recap.nisn} className="relative bg-white">
                          <TableCell>{recap.nisn}</TableCell>
                          <TableCell className="sticky left-0 bg-white/80">
                            {recap.student_name}
                          </TableCell>
                          {[...Array(days)].map((_, dayIndex) => {
                            let status;
                            const attendancesForDay = recap.attendance.filter(
                              (att) =>                                
                                dayjs(att.created_at).date() === dayIndex + 1
                            );
                            if (attendancesForDay.length > 0) {
                              const firstStatus = attendancesForDay[0].status;
                              const otherStatuses = attendancesForDay
                                .slice(1)
                                .map((att) => att.status);
                              if (
                                firstStatus === "Hadir" &&
                                otherStatuses.every((s) => s === "Hadir")
                              ) {
                                status = "p";
                              } else if (
                                firstStatus === "Hadir" &&
                                otherStatuses.some((s) => s === "Sakit")
                              ) {
                                status = (
                                  <Circle
                                    className="fill-current text-red-500"
                                    size={12}
                                  />
                                );
                              } else if (
                                firstStatus === "Hadir" &&
                                otherStatuses.some((s) => s === "Izin")
                              ) {
                                status = (
                                  <Circle
                                    className="fill-current text-sky-500"
                                    size={12}
                                  />
                                );
                              } else if (
                                firstStatus === "Sakit" &&
                                otherStatuses.every((s) => s === "Sakit")
                              ) {
                                status = (
                                  <Circle
                                    className="fill-current text-red-500"
                                    size={12}
                                  />
                                );
                              } else if (
                                firstStatus === "Izin" &&
                                otherStatuses.every((s) => s === "Izin")
                              ) {
                                status = (
                                  <Circle
                                    className="fill-current text-sky-500"
                                    size={12}
                                  />
                                );
                              } else if (
                                firstStatus === "Izin" &&
                                otherStatuses.some((s) => s === "Hadir")
                              ) {
                                status = "p";
                              } else {
                                status = (
                                  <Circle
                                    className="fill-current text-neutral-500"
                                    size={12}
                                  />
                                );
                              }
                            }
                            return (
                              <TableCell key={dayIndex} >
                                <div
                                  className="flex w-full items-center justify-center cursor-pointer transition-all hover:opacity-75"
                                  onClick={() => {
                                    setCollapse(
                                      collapse === index && day === dayIndex + 1
                                        ? -1
                                        : index
                                    );
                                    setDay(dayIndex + 1);
                                  }}
                                >
                                  {status === "p" ? (
                                    <Circle
                                      className="fill-current text-primary"
                                      size={12}
                                    />
                                  ) : (
                                    status
                                  )}
                                </div>
                              </TableCell>
                            );
                          })}
                        </TableRow>
                        <CollapsibleContent asChild className="transition-all">
                          <>
                            {subjects
                              .filter(
                                (filter) =>
                                  filter.day ==
                                  dayjs(
                                    new Date(
                                      parseInt(dayjs().format("YYYY")),
                                      parseInt(month as string),
                                      day
                                    )
                                  ).format("dddd")
                              )
                              .map((day) => (
                                <>
                                  {day.subjects.map((subject) => (
                                    <TableRow
                                      className="bg-primary/5 hover:bg-primary/[0.04] group relative"
                                      key={subject.subject_name}
                                    >
                                      <TableCell
                                        colSpan={2}
                                        className="font-medium group-hover:underline "
                                      >
                                        {subject.subject_name}
                                      </TableCell>
                                      {[...Array(days)].map((_, dayIndex) => {
                                        const attendancesForDay =
                                          recap.attendance.filter(
                                            (att) =>
                                              dayjs(att.created_at).date() ===
                                                dayIndex + 1 &&
                                              att.subject_name ===
                                                subject.subject_name
                                          );
                                        let status; // Default status is Presence
                                        if (attendancesForDay.length > 0) {
                                          if (
                                            attendancesForDay[0].status ===
                                            "Hadir"
                                          ) {
                                            status = "p";
                                          } else if (
                                            attendancesForDay[0].status ===
                                            "Sakit"
                                          ) {
                                            status = (
                                              <Circle
                                                className="fill-current text-red-500"
                                                size={12}
                                              />
                                            );
                                          } else if (
                                            attendancesForDay[0].status ===
                                            "Izin"
                                          ) {
                                            status = (
                                              <Circle
                                                className="fill-current text-sky-500"
                                                size={12}
                                              />
                                            );
                                          } else {
                                            status = (
                                              <Circle
                                                className="fill-current text-neutral-500"
                                                size={12}
                                              />
                                            );
                                          }
                                        }
                                        return (
                                          <TableCell key={dayIndex}>
                                            <div
                                              className="flex w-full items-center justify-center"
                                              onClick={() => {
                                                setDay(dayIndex + 1);
                                              }}
                                            >
                                              {status === "p" ? (
                                                <Circle
                                                  className="fill-current text-primary"
                                                  size={12}
                                                />
                                              ) : (
                                                status
                                              )}
                                            </div>
                                          </TableCell>
                                        );
                                      })}
                                    </TableRow>
                                  ))}
                                </>
                              ))}
                          </>
                        </CollapsibleContent>
                      </>
                    </Collapsible>
                  ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={2}></TableCell>
                  {[...Array(days)].map((_, dayIndex) => {
                    const totalHadir = data.reduce((total, recap) => {
                      const attendancesForDay = recap.attendance.filter(
                        (att) =>
                          dayjs(att.created_at).date() === dayIndex + 1 &&
                          dayjs(att.created_at).format("YYYY") === year &&
                          dayjs(att.created_at).format("M") ==
                            (parseInt(month as string) + 1).toString()
                      );
                      if (attendancesForDay.length > 0) {
                        const firstStatus = attendancesForDay[0].status;
                        const otherStatuses = attendancesForDay
                          .slice(1)
                          .map((att) => att.status);
                        if (
                          firstStatus === "Hadir" &&
                          otherStatuses.every((s) => s === "Hadir")
                        ) {
                          return total + 1;
                        } else if (
                          firstStatus === "Hadir" &&
                          otherStatuses.some((s) => s === "Sakit")
                        ) {
                          return total;
                        } else if (
                          firstStatus === "Hadir" &&
                          otherStatuses.some((s) => s === "Izin")
                        ) {
                          return total;
                        } else if (
                          firstStatus === "Sakit" &&
                          otherStatuses.every((s) => s === "Sakit")
                        ) {
                          return total;
                        } else if (
                          firstStatus === "Izin" &&
                          otherStatuses.every((s) => s === "Izin")
                        ) {
                          return total;
                        } else if (
                          firstStatus === "Izin" &&
                          otherStatuses.some((s) => s === "Hadir")
                        ) {
                          return total + 1;
                        } else {
                          return total;
                        }
                      }
                      return total;
                    }, 0);
                    return (
                      <TableCell className="text-center" key={dayIndex}>
                        {totalHadir}
                      </TableCell>
                    );
                  })}
                  <TableCell>
                    {total.reduce((t, c) => {
                      return t + c;
                    }, 0)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recap;

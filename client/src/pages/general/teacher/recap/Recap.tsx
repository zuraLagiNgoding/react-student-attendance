import { Button } from "@/components/ui/button";
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
import { AuthContext } from "@/context/authContext";
import { useFetch } from "@/hooks/fetcher";
import { ClassesType } from "@/pages/admin/data_kelas/columns";
import clsx from "clsx";
import dayjs from "dayjs";
import { CheckCircle2, Circle, FilePlus2 } from "lucide-react";
import React, { useContext, useRef } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { utils, writeFileXLSX } from "xlsx";

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
      schedule_id: string;
      uid: string;
    }
  ];
};

type ListType = {
  attendance_list_id: string;
  schedule_id: string;
  status: string;
  created_at: Date;
};

const Recap = () => {
  const [searchParams] = useSearchParams();
  const month = parseInt(searchParams.get("month") as string);
  const year = searchParams.get("year");
  const location = useLocation().pathname.split("/");
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  // const navigate = useNavigate();

  const classId = location[location.length - 2];
  const [day, setDay] = React.useState(-1);
  const [days, setDays] = React.useState(0);
  const tableRef = useRef(null);
  const { data } = useFetch<RecapType[]>(
    "http://localhost:8800/backend/attendances/recap/" + classId
  );

  const { data: list } = useFetch<ListType[]>(
    `http://localhost:8800/backend/attendances/checkList/${classId}/${currentUser?.id}`
  );

  const { data: subjects } = useFetch<SubjectType[]>(
    "http://localhost:8800/backend/attendances/recap/subjects/" + classId
  );

  const { data: classes } = useFetch<ClassesType[]>(
    "http://localhost:8800/backend/classes/" + classId
  );

  const [total, setTotal] = React.useState<number[]>([]);
  const [collapse, setCollapse] = React.useState<number | undefined>();
  const [collapseDay, setCollapseDay] = React.useState<boolean>(false);

  React.useEffect(() => {
    const totalHadir = [...Array(days)].map((_, dayIndex) => {
      return data.reduce((dayTotal, recap) => {
        const attendancesForDay = recap.attendance.filter(
          (att) =>
            dayjs(att.created_at).date() === dayIndex + 1 &&
            dayjs(att.created_at).format("YYYY") === year &&
            dayjs(att.created_at).format("YYYY") === year &&
            dayjs(att.created_at).format("M") === (month + 1).toString()
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
            attendancesForDay.some((att) => att.status === "Hadir")
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
      month + 1,
      0
    ).getDate();
    setDays(daysInMonth);
  }, [month, year]);

  const exportToSheet = () => {
    const wb = utils.table_to_book(tableRef.current);
    const ws = wb.Sheets[wb.SheetNames[0]];

    const widths = [
      { wpx: 80, level: 3 },
      { wpx: 200, level: 3 },
      ...[...Array(days)].map(() => ({ wpx: 20 })),
    ];

    ws["!cols"] = widths;

    writeFileXLSX(
      wb,
      ((((classes[0].grade.toLowerCase() +
        classes[0].shorten.toLowerCase() +
        classes[0].identifier.toLowerCase() +
        year) as string) + month) as string) + "_recap.xlsx"
    );
  };

  const isAvailable = (day: number) => {
    const filter = list.filter(
      (f) =>
        parseInt(dayjs(f.created_at).format("D")) === day &&
        dayjs(f.created_at).format("YYYY") === year &&
        parseInt(dayjs(f.created_at).format("M")) === month + 1
    );

    if (currentUser?.role !== "ADMIN" && currentUser?.role !== "STAFF") {
      if (month + 1 < parseInt(dayjs().format("M"))) {
        if (filter !== undefined) {
          if (filter.every(e => parseInt(dayjs(e.created_at).format("D")) !== day)) {
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      } else {
        if (day < parseInt(dayjs().format("D"))) {
          return true;
        }
      }
    } else {
      return false;
    }
  };

  return (
    <div className="flex flex-col h-full gap-6 overflow-y-hidden flex-nowrap whitespace-nowrap">
      <h1 className="sm:text-3xl text-2xl font-bold leading-none text-neutral-900">
        Recap
      </h1>
      <div className="flex flex-col h-full w-full overflow-hidden">
        <div className="flex flex-col gap-4 py-4 h-full w-full overflow-auto">
          <div className="flex w-full items-center justify-between">
            <div className="flex gap-4 items-center">
              <h1 className="text-lg font-medium">
                {classes[0]?.grade} {classes[0]?.shorten}{" "}
                {classes[0]?.identifier}
              </h1>
              {/* <Badge className="gap-2">
                <AlertCircle
                  className="fill-orange-300 text-secondary"
                  size={20}
                />
                There's an empty attendance!
              </Badge> */}
            </div>
            <Button className="flex items-center gap-2" onClick={exportToSheet}>
              <FilePlus2 size={18} />
              Export To Sheet
            </Button>
          </div>
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
            <Table
              ref={tableRef}
              className="h-full relative sm:text-sm text-xs bg-white"
            >
              <TableHeader className="sticky top-0 bg-white z-10">
                <TableRow>
                  <TableHead>NISN</TableHead>
                  <TableHead>Student Name</TableHead>
                  {[...Array(days)].map((item, index) => (
                    <TableHead
                      className="text-center cursor-pointer hover:bg-secondary/5 rounded-lg"
                      key={item}
                      onClick={() => {
                        setCollapseDay(!collapseDay);
                        setCollapse(-1);
                        setDay(index + 1);
                      }}
                    >
                      <div className="relative group ">
                        {index + 1}
                        <div
                          className={clsx(
                            "absolute bg-orange-300 h-1.5 sm:h-2 w-1.5 sm:w-2 top-0 right-0 hidden rounded-full",
                            isAvailable(index + 1) && "!block"
                          )}
                        />
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <Collapsible
                  asChild
                  open={collapseDay}
                  onOpenChange={() => setCollapseDay(!collapseDay)}
                >
                  <CollapsibleContent asChild>
                    <>
                      {subjects
                        .filter(
                          (filter) =>
                            filter.day ==
                            dayjs(
                              new Date(
                                parseInt(dayjs().format("YYYY")),
                                month,
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
                                  className="font-medium group-hover:underline"
                                >
                                  {subject.subject_name}
                                </TableCell>
                                {[...Array(days)].map((_, dayIndex) => {
                                  const attendancesForDay: RecapType["attendance"] =
                                    [{}] as RecapType["attendance"];

                                  data.forEach((student) => {
                                    student.attendance
                                      .filter(
                                        (att) =>
                                          dayjs(att.created_at).month() ===
                                            month &&
                                          dayjs(att.created_at).date() ===
                                            dayIndex + 1 &&
                                          att.subject_name ===
                                            subject.subject_name
                                      )
                                      .forEach((attendance) => {
                                        if (attendancesForDay) {
                                          attendancesForDay.push(attendance);
                                        }
                                      });
                                  });

                                  let status;
                                  if (
                                    attendancesForDay.some((s) => s.created_at)
                                  ) {
                                    status = (
                                      <CheckCircle2
                                        className="text-primary"
                                        size={14}
                                      />
                                    );
                                  } else if (
                                    dayjs()
                                      .month(month)
                                      .date(dayIndex + 1)
                                      .format("dddd") === day.day
                                  ) {
                                    status = (
                                      <Circle
                                        onClick={() => {
                                          currentUser?.id === subject.uid
                                            ? navigate(
                                                "/attendance/" +
                                                  subject.schedule_id,
                                                {
                                                  state: {
                                                    year: year,
                                                    month: month,
                                                    day: dayIndex + 1,
                                                  },
                                                }
                                              )
                                            : toast.error(
                                                "You cannot take this attendance"
                                              );
                                        }}
                                        className="fill-current text-neutral-200 cursor-pointer"
                                        size={12}
                                      />
                                    );
                                  }
                                  return (
                                    <TableCell key={dayIndex}>
                                      <div className="flex w-full items-center justify-center">
                                        {status}
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
                </Collapsible>
                {data
                  .filter((filter) =>
                    filter.attendance.find(
                      (att) =>
                        dayjs(att.created_at).year() ===
                          parseInt(year as string) &&
                        dayjs(att.created_at).month() == month
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
                        <TableRow
                          key={recap.nisn}
                          className="relative bg-white"
                        >
                          <TableCell>{recap.nisn}</TableCell>
                          <TableCell className="sticky left-0 bg-white/80">
                            {recap.student_name}
                          </TableCell>
                          {[...Array(days)].map((_, dayIndex) => {
                            let status;
                            const attendancesForDay = recap.attendance.filter(
                              (att) =>
                                dayjs(att.created_at).month() === month &&
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
                            } else {
                              status = (
                                <Circle
                                  className="fill-current text-neutral-200"
                                  size={12}
                                />
                              );
                            }
                            return (
                              <TableCell key={dayIndex}>
                                <div
                                  className={clsx(
                                    "flex w-full items-center justify-center transition-all hover:opacity-75",
                                    attendancesForDay.length > 0 &&
                                      "cursor-pointer"
                                  )}
                                  onClick={() => {
                                    setCollapse(
                                      collapse === index && day === dayIndex + 1
                                        ? -1
                                        : index
                                    );
                                    setCollapseDay(false);
                                    setDay(dayIndex + 1);
                                  }}
                                >
                                  {status === "p" ? (
                                    <>
                                      <span className="sr-only">✓</span>
                                      <Circle
                                        className="fill-current text-primary"
                                        size={12}
                                      />
                                    </>
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
                                      month,
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
                                              dayjs()
                                                .month(month)
                                                .date(dayIndex + 1)
                                                .format("dddd") === day.day &&
                                              dayjs(att.created_at).month() ===
                                                month &&
                                              dayjs(att.created_at).date() ===
                                                dayIndex + 1 &&
                                              att.subject_name ===
                                                subject.subject_name
                                          );
                                        let status;
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
                            (month + 1).toString()
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

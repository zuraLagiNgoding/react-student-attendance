import { useFetch } from "@/hooks/fetcher";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ClassesType } from "@/pages/admin/data_kelas/columns";
import { Link } from "react-router-dom";
import React from "react";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar, Check, Filter } from "lucide-react";
import { MajorsType } from "@/pages/admin/data_jurusan/columns";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "Desember",
];


const DaftarRecap = () => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1999 }, (_, index) =>
    (currentYear - index).toString()
  );

  const [year, setYear] = React.useState(dayjs(new Date()).format("YYYY"));
  const [majorFilter, setMajorFilter] = React.useState("");
  const { data: classes } = useFetch<ClassesType[]>(
    "http://localhost:8800/backend/classes"
  );
  const { data: majors } = useFetch<MajorsType[]>(
    "http://localhost:8800/backend/majors"
  );

  return (
    <div className="flex flex-col h-full gap-6 overflow-y-hidden flex-nowrap whitespace-nowrap">
      <div className="flex flex-col gap-2">
        <h1 className="sm:text-3xl text-2xl font-bold leading-none text-neutral-900">
          Attendances Recap
        </h1>
        <p className="text-sm text-slate-500">
          View and manage attendance records for students in this section.
        </p>
      </div>
      <div className="flex gap-4 flex-col overflow-hidden bg-white border p-6 rounded-md">
        <div className="flex items-center gap-2 w-full">
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
                      setYear(item);
                    }}
                  >
                    <Check
                      className={cn(
                        "max-h-4 max-w-4 text-primary basis-2/6",
                        year === item ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <h1 className="basis-4/6 leading-tight">{item}</h1>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                size={"sm"}
                variant="outline"
                role="combobox"
                className={cn(
                  "justify-between gap-3 w-[8rem] bg-transparent",
                  !majorFilter && "text-muted-foreground"
                )}
              >
                <Filter className="h-4 w-4 shrink-0 opacity-50" />
                {majorFilter ? majorFilter : "All Major"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="overflow-hidden p-0">
              <div className="overflow-y-auto max-h-[15rem]">
                <div
                  className="flex hover:bg-primary/[0.08] cursor-pointer items-center px-2 py-1.5 text-sm gap-2 indent-0"
                  onClick={() => {
                    setMajorFilter("");
                  }}
                >
                  <Check
                    className={cn(
                      "max-h-4 max-w-4 text-primary basis-2/6",
                      majorFilter === "" ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <h1 className="basis-4/6 leading-tight">All</h1>
                </div>
                {majors.map((major) => (
                  <div
                    className="flex hover:bg-primary/[0.08] cursor-pointer items-center px-2 py-1.5 text-sm gap-2 indent-0"
                    onClick={() => {
                      if (major.shorten !== majorFilter) {
                        setMajorFilter(major.shorten);
                      } else {
                        setMajorFilter("");
                      }
                    }}
                  >
                    <Check
                      className={cn(
                        "max-h-4 max-w-4 text-primary basis-2/6",
                        majorFilter === major.shorten
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    <h1 className="basis-4/6 leading-tight">{major.shorten}</h1>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-col h-full overflow-y-auto">
          {classes
            .filter((filter) => filter.shorten.includes(majorFilter))
            .map((item) => (
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    {item.grade} {item.shorten} {item.identifier}
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul>
                      {months.map((month, index) => (
                        <Link
                          to={
                            item.class_id + "/?year=" + year + "&month=" + index
                          }
                        >
                          <li className="px-2 py-1 w-full hover:bg-primary/[0.08] cursor-pointer">
                            {month}
                          </li>
                        </Link>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
        </div>
      </div>
    </div>
  );
};

export default DaftarRecap;

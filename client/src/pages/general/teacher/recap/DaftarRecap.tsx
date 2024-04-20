import { useFetch } from "@/hooks/fetcher";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ClassesType } from "@/pages/admin/data_kelas/columns";
import { Link } from "react-router-dom";

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
  "Desember"
];

const DaftarRecap = () => {
  const { data: classes } = useFetch<ClassesType[]>(
    "http://localhost:8800/backend/classes"
  );

  return (
    <div className="flex flex-col h-full gap-6 overflow-y-hidden flex-nowrap whitespace-nowrap">
      <h1 className="sm:text-3xl text-2xl font-bold leading-none text-neutral-900">
        List of Attendances Recap
      </h1>
      <div className="flex flex-col h-full overflow-y-hidden">
        {classes.map((item) => (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                {item.grade} {item.shorten} {item.identifier}
              </AccordionTrigger>
              <AccordionContent>
                <ul>
                  {months.map((month, index) => (
                    <Link to={item.class_id + "/?month=" + index}>
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
  );
};

export default DaftarRecap;

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFetch } from "@/hooks/fetcher";
import { MoreHorizontal } from "lucide-react";
import React from "react";
import { useLocation } from "react-router-dom";

type StudentAttendanceType = {
  nisn: string;
  student_name: string;
};

const Presensi = () => {
  const location = useLocation();
  const scheduleId =
    location.pathname.split("/")[location.pathname.split("/").length - 1];
  const { data } = useFetch<StudentAttendanceType[]>(
    "http://localhost:8800/backend/attendances/getToAttend/" + scheduleId
  );

  return (
    <div className="flex flex-col h-full gap-6 overflow-y-hidden flex-nowrap whitespace-nowrap">
      <h1 className="text-3xl font-bold leading-none text-neutral-900">
        Report Data Jurusan
      </h1>
      <div className="flex flex-col overflow-y-hidden">
        <Table className="h-full relative sm:text-sm text-xs">
          <TableHeader className="sticky top-0 bg-white">
            <TableRow>
              <TableHead className="sm:w-10 w-8">
                <Checkbox />
              </TableHead>
              <TableHead>Student Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((student, index) => (
              <TableRow>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell>{student.student_name}</TableCell>
                <TableCell>
                  <Badge>
                    Hadir
                  </Badge>
                </TableCell>
                <TableCell>
                  <MoreHorizontal/>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* {detail ? <DetailKelas /> : null}
        {query.includes("?delete") ? (
          <Dialog defaultOpen onOpenChange={() => navigate("/majors")}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Delete major</DialogTitle>
                <DialogDescription>
                  You are about to delete this major
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button onClick={handleDelete} type="submit">
                    Ok
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : null} */}
      </div>
    </div>
  );
};

export default Presensi;

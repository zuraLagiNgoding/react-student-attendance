import React from "react";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { useFetch } from "@/hooks/fetcher";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import axios from "axios";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import DetailSiswa from "./Detail";
// import { Button } from '@/components/ui/button'

export interface StudentType {
  nisn: string;
  student_name: string;
  class_id: string;
  grade: "X" | "XI" | "XII";
  identifier: string;
  gender: string;
  address: string;
  phoneNumber: string;
  email: string;

  major_name: string;
  shorten: string;
}

const DataSiswa = ({ detail = false }: { detail?: boolean }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const { data, reFetch, loading } = useFetch<StudentType[]>(
    "http://localhost:8800/backend/students"
  );

  React.useEffect(() => {
    reFetch();
  }, [isOpen]);

  const navigate = useNavigate();
  const query = useLocation().search;

  const handleDelete = async () => {
    try {
      await axios.delete("http://localhost:8800/backend/students/" + query);
      reFetch();
      navigate("/students");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex flex-col h-full gap-6 overflow-y-hidden flex-nowrap whitespace-nowrap">
        <h1 className="text-3xl font-bold leading-none text-neutral-900">
          Report Data Siswa
        </h1>
        <div className="flex flex-col h-full overflow-y-hidden">
          <DataTable
            isLoading={loading}
            columns={columns}
            data={data}
            saveLabel="Schedule"
          />
          {detail ? <DetailSiswa isOpen={isOpen} setIsOpen={setIsOpen}/> : null}
          {query.includes("?delete") ? (
            <Dialog defaultOpen onOpenChange={() => navigate("/schedules")}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Delete schedule</DialogTitle>
                  <DialogDescription>
                    You are about to delete this schedule
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
          ) : null}
        </div>
      </div>
    </>
  );
};

export default DataSiswa;

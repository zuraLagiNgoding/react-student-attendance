import { DataTable } from "@/components/ui/data-table";
import { MajorsType, columns } from "./columns";
import axios from "axios";
import React from "react";
import DetailKelas from "./Detail";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";

const DataKelas = ({ detail = false }: { detail?: boolean }) => {
  const [data, setData] = React.useState<MajorsType[]>([]);
  const navigate = useNavigate();
  const query = useLocation().search;

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8800/backend/majors");
        setData(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [data]);

  // React.useEffect(() => {
  //   console.log(isDelete)
  // })

  const handleDelete = async () => {
    try {
      await axios.delete("http://localhost:8800/backend/majors" + query);
      navigate("/majors");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col gap-6 overflow-y-hidden flex-nowrap whitespace-nowrap">
      <h1 className="text-3xl font-bold leading-none text-neutral-900">
        Report Data Jurusan
      </h1>
      <div className="flex flex-col overflow-y-hidden">
        <DataTable columns={columns} data={data} saveLabel="Major" />
        {detail ? <DetailKelas /> : null}
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
        ) : null}
      </div>
    </div>
  );
};

export default DataKelas;
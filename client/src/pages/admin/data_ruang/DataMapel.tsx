import { DataTable } from "@/components/ui/data-table";
import { ClassRoomsType, columns } from "./columns";
import axios from "axios";
import React from "react";
import DetailRuang from "./Detail";
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
import { useFetch } from "@/hooks/fetcher";

const DataRuang = ({ detail = false }: { detail?: boolean }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { data, loading, reFetch } = useFetch<ClassRoomsType[]>("http://localhost:8800/backend/classrooms");
  const navigate = useNavigate();
  const query = useLocation().search;

  React.useEffect(() => {
    reFetch();
  }, [isOpen]);

  const handleDelete = async () => {
    try {
      await axios.delete("http://localhost:8800/backend/classrooms" + query);
      reFetch()
      navigate("/classrooms");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col h-full gap-6 overflow-y-hidden flex-nowrap whitespace-nowrap">
      <h1 className="text-3xl font-bold leading-none text-neutral-900">
        Report Data Ruang Ajar
      </h1>
      <div className="flex flex-col h-full overflow-y-hidden">
        <DataTable isLoading={loading} columns={columns} data={data} saveLabel="Classroom" />
        {detail ? <DetailRuang isOpen={isOpen} setIsOpen={setIsOpen} /> : null}
        {query.includes("?delete") ? (
          <Dialog defaultOpen onOpenChange={() => navigate("/classrooms")}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Delete classroom</DialogTitle>
                <DialogDescription>
                  You are about to delete this classroom
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

export default DataRuang;

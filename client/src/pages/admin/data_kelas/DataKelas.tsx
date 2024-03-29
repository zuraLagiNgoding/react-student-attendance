import { DataTable } from "@/components/ui/data-table";
import { ClassesType, columns } from "./columns";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import DetailKelas from "./Detail";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/hooks/fetcher";

const DataKelas = ({ detail = false }: { detail?: boolean }) => {
  const { data, loading, reFetch } = useFetch<ClassesType[]>(
    "http://localhost:8800/backend/classes"
  );
  const navigate = useNavigate();
  const query = useLocation().search;

  const handleDelete = async () => {
    try {
      await axios.delete("http://localhost:8800/backend/classes" + query);
      reFetch()
      navigate("/classes");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col h-full gap-6 overflow-y-hidden flex-nowrap whitespace-nowrap">
      <h1 className="text-3xl font-bold leading-none text-neutral-900">
        Report Data Kelas
      </h1>
      <div className="flex flex-col overflow-y-hidden">
        <DataTable
          isLoading={loading}
          columns={columns}
          data={data}
          saveLabel="Class"
        />
        {detail ? <DetailKelas /> : null}
        {query.includes("?delete") ? (
          <Dialog defaultOpen onOpenChange={() => navigate("/classes")}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Delete class</DialogTitle>
                <DialogDescription>
                  You are about to delete this class
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

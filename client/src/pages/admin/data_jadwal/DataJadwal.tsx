import { DataTable } from "@/components/ui/data-table";
import { SchedulesType, columns } from "./columns";
import axios from "axios";
import DetailJadwal from "./Detail";
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

const DataJadwal = ({ detail = false }: { detail?: boolean }) => {
  const { data, loading, reFetch } = useFetch<SchedulesType[]>("http://localhost:8800/backend/schedules");
  const navigate = useNavigate();
  const query = useLocation().search;

  const handleDelete = async () => {
    try {
      await axios.delete("http://localhost:8800/backend/schedules" + query);
      reFetch()
      navigate("/schedules");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col h-full gap-6 overflow-y-hidden flex-nowrap whitespace-nowrap">
      <h1 className="text-3xl font-bold leading-none text-neutral-900">
        Report Data Jadwal Pelajaran
      </h1>
      <div className="flex flex-col h-full overflow-y-hidden">
        <DataTable isLoading={loading} columns={columns} data={data} saveLabel="Schedule" />
        {detail ? <DetailJadwal /> : null}
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
  );
};

export default DataJadwal;

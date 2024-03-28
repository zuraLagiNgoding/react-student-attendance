import { DataTable } from "@/components/ui/data-table";
import { SubjectsType, columns } from "./columns";
import axios from "axios";
import React from "react";
import DetailMapel from "./Detail";
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

const DataMapel = ({ detail = false }: { detail?: boolean }) => {
  const { data, loading, reFetch } = useFetch<SubjectsType[]>("http://localhost:8800/backend/subjects");
  const navigate = useNavigate();
  const query = useLocation().search;

  const handleDelete = async () => {
    try {
      await axios.delete("http://localhost:8800/backend/subjects" + query);
      reFetch()
      navigate("/subjects");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col gap-6 overflow-y-hidden flex-nowrap whitespace-nowrap">
      <h1 className="text-3xl font-bold leading-none text-neutral-900">
        Report Data Jurusan
      </h1>
      <div className="flex flex-col h-full overflow-y-hidden">
        <DataTable isLoading={loading} columns={columns} data={data} saveLabel="Subject" />
        {detail ? <DetailMapel /> : null}
        {query.includes("?delete") ? (
          <Dialog defaultOpen onOpenChange={() => navigate("/subjects")}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Delete subject</DialogTitle>
                <DialogDescription>
                  You are about to delete this subject
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

export default DataMapel;

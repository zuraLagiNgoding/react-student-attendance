import React from "react";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { useFetch } from "@/hooks/fetcher";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import axios from "axios";
import { TeachersType, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import DetailGuru from "./Detail";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Button } from '@/components/ui/button'

const DataGuru = ({ detail = false }: { detail?: boolean }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { data:teacher, reFetch, loading } = useFetch<TeachersType[]>(
    "http://localhost:8800/backend/teachers"
  );
  const { data:staff } = useFetch<TeachersType[]>(
    "http://localhost:8800/backend/teachers/staff"
  );

  const [tab, setTab] = React.useState("teacher");

  const onTabChange = (value:string) => {
    setTab(value);
  };

  const navigate = useNavigate();
  const query = useLocation().search;

  const handleDelete = async () => {
    try {
      await axios.delete("http://localhost:8800/backend/teachers/" + query);
      reFetch();
      navigate("/teachers");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex flex-col h-full gap-6 overflow-y-hidden flex-nowrap whitespace-nowrap">
        <h1 className="text-3xl font-bold leading-none text-neutral-900">
          Report Data Guru
        </h1>
        <Tabs defaultValue="teacher" className="overflow-y-hidden h-full pb-11 space-y-4" onValueChange={onTabChange}>
          <TabsList className="grid lg:w-5/12 sm:w-6/12 grid-cols-3">
            <TabsTrigger value="teacher">Teacher</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
          </TabsList>
          <div
            className="flex flex-col h-full overflow-y-hidden"
          >
            <DataTable
              isLoading={loading}
              columns={columns}
              data={tab === "teacher" ? teacher : staff}
              saveLabel="Teacher"
            />
            {detail ? (
              <DetailGuru isOpen={isOpen} setIsOpen={setIsOpen} />
            ) : null}
            {query.includes("?delete") ? (
              <Dialog defaultOpen onOpenChange={() => navigate("/teachers")}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Delete teacher data</DialogTitle>
                    <DialogDescription>
                      You are about to delete this teacher
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
        </Tabs>
      </div>
    </>
  );
};

export default DataGuru;

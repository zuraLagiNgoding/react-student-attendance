import { DataTable } from "@/components/ui/data-table";
import { ClassesType, columns } from "./columns";
import axios from "axios";
import React from "react";
import DetailKelas from "./DetailKelas";

const DataKelas = ({ detail = false }: { detail?: boolean }) => {
  const [data, setData] = React.useState<ClassesType[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8800/backend/classes");
        setData(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-6 overflow-y-hidden flex-nowrap whitespace-nowrap">
      <h1 className="text-3xl font-bold leading-none text-neutral-900">
        Report Data Kelas
      </h1>
      <div className="flex flex-col overflow-y-hidden">
        <DataTable columns={columns} data={data} />
        {detail ? <DetailKelas /> : null}
      </div>
    </div>
  );
};

export default DataKelas;

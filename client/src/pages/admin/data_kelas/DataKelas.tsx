import { DataTable } from '@/components/ui/data-table';
import { ClassesType, columns } from './columns';
import React from 'react';

const DataKelas = () => {

  const [ data, setData ] = React.useState<ClassesType[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        "https://65f9bcbf3909a9a65b193dd1.mockapi.io/api/class"
      );
      const data = await res.json() as ClassesType[];
      setData(data);
    };

    fetchData();
  }, [])

  return (
    <div className="flex flex-col gap-6 h-full">
      <h1 className="text-3xl font-bold leading-none text-neutral-900">
        Report Data Kelas
      </h1>
      <div className="">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}

export default DataKelas
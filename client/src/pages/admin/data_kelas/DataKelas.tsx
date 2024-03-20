import { DataTable } from '@/pages/admin/data_kelas/table';
import { ClassesType, columns } from './columns';
import React from 'react';

const DataKelas = () => {

  const [ data, setData ] = React.useState<ClassesType[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      // Simulated data fetching, replace with your own data source
      const responseData:ClassesType[] = [
        {
          id: "CLASS-001",
          grade: "X",
          major: "Rekayasa Perangkat Lunak",
          class: "1",
          waliKelas: "Pak Sarupadi"
        },
        {
          id: "CLASS-002",
          grade: "X",
          major: "Rekayasa Perangkat Lunak",
          class: "2",
          waliKelas: "Pak John"
        },
        {
          id: "CLASS-003",
          grade: "X",
          major: "Rekayasa Perangkat Lunak",
          class: "3",
          waliKelas: "Pak David"
        },
        {
          id: "CLASS-004",
          grade: "XI",
          major: "Rekayasa Perangkat Lunak",
          class: "1",
          waliKelas: "Bu Sarimuni"
        },
        {
          id: "CLASS-005",
          grade: "XI",
          major: "Rekayasa Perangkat Lunak",
          class: "2",
          waliKelas: "Bu Latiful"
        },
      ];
      setData(responseData);
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-6 overflow-y-hidden flex-nowrap whitespace-nowrap">
      <h1 className="text-3xl font-bold leading-none text-neutral-900">
        Report Data Kelas
      </h1>
      <div className='flex flex-col overflow-y-hidden'>
        <DataTable columns={columns} data={data} />
      </div>      
    </div>
  );
}

export default DataKelas
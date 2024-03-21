import { Button } from '@/components/ui/button'
import React from 'react'
import List from './components/List'
import { Checkbox } from '@/components/ui/checkbox'
import axios from 'axios'
import Detail from './components/Detail'
import { Search } from 'lucide-react'

interface StudentType {
  nisn: string,
  name: string,
  grade: "X" | "XI" | "XII";
  major: string;
  class: string;
}

const DataSiswa = () => {
  const [students, setStudents] = React.useState<StudentType[]>([]);
  const [select, setSelect] = React.useState<number>();
  const [student, setStudent] = React.useState<StudentType>();
  const [search, setSearch] = React.useState<string>('');
  
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8800/backend/students");
        setStudents(res.data);
        console.log(students);
      } catch (error) {
        console.log(error);
      }
      
    };
    fetchData();
  }, [])

  // const data = [
  //   {
  //     nisn: "2170912345",
  //     name: "Maliki Azis Azyura",
  //     major: "X OT 3",
  //   },
  //   {
  //     nisn: "2170954321",
  //     name: "Muhammad Ridho",
  //     major: "X OT 3",
  //   },
  //   {
  //     nisn: "2170951243",
  //     name: "Charly Leonardo",
  //     major: "XI RPL 1",
  //   },
  //   {
  //     nisn: "1234567890",
  //     name: "Akbar Subadajo",
  //     major: "XI RPL 1",
  //   },
  //   {
  //     nisn: "1234567890",
  //     name: "Akbar Subadajo",
  //     major: "XI RPL 1",
  //   },
  //   {
  //     nisn: "1234567890",
  //     name: "Akbar Subadajo",
  //     major: "XI RPL 1",
  //   },
  //   {
  //     nisn: "1234567890",
  //     name: "Akbar Subadajo",
  //     major: "XI RPL 1",
  //   },
  //   {
  //     nisn: "1234567890",
  //     name: "Akbar Subadajo",
  //     major: "XI RPL 1",
  //   },
  //   {
  //     nisn: "1234567890",
  //     name: "Akbar Subadajo",
  //     major: "XI RPL 1",
  //   },
  //   {
  //     nisn: "1234567890",
  //     name: "Akbar Subadajo",
  //     major: "XI RPL 1",
  //   },
  //   {
  //     nisn: "1234567890",
  //     name: "Akbar Subadajo",
  //     major: "XI RPL 1",
  //   },
  // ]

  const searchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  }

  return (
    <div className='flex gap-5 h-full w-full overflow-y-hidden flex-nowrap whitespace-nowrap'>
      <List>
        <div className="flex items-center gap-x-2 max-w-sm rounded-md border leading-none border-slate-200 bg-transparent px-2 py-1.5 m-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300">
          <Search size={16} className="text-slate-700 inline" />
          <input
            placeholder="Search by Name or NISN"
            value={search}
            onChange={searchHandler}
            className="w-full h-full placeholder:text-xs focus-visible:ring-0 focus-visible:outline-none px-2 py-0.5 focus-visible:border-b"
          />
        </div>
        {students.filter(filtered => filtered.name.toLowerCase().includes(search.toLowerCase()) || filtered.nisn.includes(search)).map((student, index) => (
          <div className='flex gap-3 items-center hover:bg-primary/[0.08] rounded-md px-4 py-2'>
            <Checkbox onCheckedChange={() => {setSelect(index); setStudent(student)}} checked={select == index}/>
            <div className='flex flex-col '>
              <h1 className='text-sm font-medium'>{student.name}</h1>
              <p className='text-xs font-light'>{student.nisn}</p>
            </div>
            <p className='text-xs ml-auto'>{student.grade} {student.major} {student.class}</p>
          </div>
        ))}
      </List>
      <Detail>
        {student?.name}
      </Detail>
    </div>
  )
}

export default DataSiswa
import React from 'react'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "../../../components/ui/sheet";
import { Button } from '@/components/ui/button';
// import { Label } from '@/components/ui/label';
// import { Input } from '@/components/ui/input';
import { SchedulesType } from './columns';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const DetailJadwal = () => {
  const [data, setData] = React.useState<SchedulesType>();
  const navigate = useNavigate();
  const location = useLocation().pathname.split("/");
  const subjectId = location[location.length - 1];

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/backend/subjects/${subjectId}`);
        setData(res.data[0]);
        console.log(data)
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [subjectId, data]);

  return (
    <Sheet defaultOpen onOpenChange={() => navigate(-1)}>
      <SheetContent >
          <SheetHeader>
              <SheetTitle>Class Detail</SheetTitle>
              <SheetDescription>
                {data?.subject_name}
              </SheetDescription>
          </SheetHeader>
          {/* <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="id">
                Schedule ID
              </Label>
              <Input id="id" value={data?.subject_id} disabled className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="Jadwal">
                Schedule Name
              </Label>
              <Input id="Jadwal" value={data?.subject_name} disabled className="col-span-3" />
            </div>
          </div> */}
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit">Save changes</Button>
            </SheetClose>
          </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default DetailJadwal
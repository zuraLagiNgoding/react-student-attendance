import React from 'react'
import { SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "../../../components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const DetailKelas = () => {
  return (
    <SheetContent>
        <SheetHeader>
            <SheetTitle>Detail Class</SheetTitle>
            <SheetDescription>
                tes
            </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="id" className="text-right">
              Class ID
            </Label>
            <Input id="id" value="CLASS-001" disabled className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="waliKelas" className="text-right">
              Wali Kelas
            </Label>
            <Input id="waliKelas" value="Bu Latiful" disabled className="col-span-3" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
    </SheetContent>
  )
}

export default DetailKelas
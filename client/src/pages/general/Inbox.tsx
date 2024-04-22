import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Circle, InboxIcon, Pencil, StickyNote } from 'lucide-react';
import React from 'react'
import { CardTitle } from '@/components/ui/card';

const Inbox = () => {
  return (
    <div className="flex flex-col h-full gap-6 overflow-y-hidden flex-nowrap whitespace-nowrap">
      <h1 className="sm:text-3xl text-2xl font-bold leading-none text-neutral-900">
        Inbox
      </h1>
      <div className="flex flex-col h-full w-full overflow-hidden">
        <div className="flex h-full w-full rounded-md border">
          <div className="flex flex-col w-full basis-5/12 border-r grow-0 overflow-hidden">
            <div className="p-3 border-b">
              <Button className="justify-start gap-2" variant={"outline"}>
                <Pencil size={16} />
                Compose
              </Button>
            </div>
            <div className="flex flex-col p-3 w-full ">
              <Card className="flex">
                <div className="flex py-6 px-4 items-center justify-center">
                  <Circle className="fill-current text-sky-500" size={10} />
                </div>
                <div className="flex flex-col w-full gap-1">
                  <CardHeader className="flex-row justify-between w-full pl-0 pb-0 pt-3.5">
                    <CardTitle className="flex flex-col gap-2">
                      <h1>John Doe</h1>
                      <h1 className="font-normal text-sm">
                        Lorem ipsum dolor sit amet
                      </h1>
                    </CardTitle>
                    <h1 className="text-xs">1 day ago</h1>
                  </CardHeader>
                  <CardContent className="p-0 pb-3.5">
                    <h1 className="font-light text-sm text-neutral-400 line-clamp-2 text-wrap">
                      Lorem ipsum dolor sit amet Lorem ipsum dolor sit ametLorem
                      ipsum dolor sit ametLorem ipsum dolor sit ametLorem ipsum
                      dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum
                      dolor sit amet
                    </h1>
                  </CardContent>
                </div>
              </Card>
            </div>
          </div>
          <div className="flex w-full basis-7/12 shrink-0"></div>
        </div>
      </div>
    </div>
  );
}

export default Inbox
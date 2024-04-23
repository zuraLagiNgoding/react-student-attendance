import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Circle, CornerUpRight, Pencil } from "lucide-react";
import React, { useRef } from "react";
import { CardTitle } from "@/components/ui/card";
import { NotificationType } from "@/Layout";
import { useFetch } from "@/hooks/fetcher";
import clsx from "clsx";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocation, useNavigate } from "react-router-dom";
import { useSocketStore } from "@/store/useSocketStore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import dayjs from "dayjs";
import { Badge } from "@/components/ui/badge";

const Inbox = () => {
  const { socket } = useSocketStore();
  const navigate = useNavigate();
  const location = useLocation();
  const messageId = location.pathname.split("/").pop();
  const reFetchRef = useRef<() => void>(() => {});
  const [ openDrawer, setOpenDrawer ] = React.useState(false);

  const { data: messages, reFetch } = useFetch<NotificationType[]>(
    `http://localhost:8800/backend/messages/all`
  );

  const [selectedMessage, setSelectedMessage] = React.useState<
    NotificationType | undefined
  >();
  React.useEffect(() => {
    if (messages) {
      if (messageId) {
        setSelectedMessage(
          messages.find((a) => a.message_id === parseInt(messageId))
        );
      } else {
        setSelectedMessage(messages[0]);
      }
    }
  }, [setSelectedMessage, messages, messageId]);

  React.useEffect(() => {
    reFetchRef.current = reFetch;
  }, [reFetch]);

  React.useEffect(() => {
    if (messageId) {
      reFetchRef.current();
      if (!messageId.includes("inbox")) {
        setOpenDrawer(true);
      }
    }
  }, [messageId])

  const timeAgo = (date: Date | undefined): string => {
    if (!date) {
      return "";
    }

    const now = new Date();
    const differenceInMs = now.getTime() - date.getTime();
    const differenceInMinutes = Math.round(differenceInMs / (1000 * 60));
    const differenceInHours = Math.round(differenceInMinutes / 60);

    if (differenceInMinutes <= 1) {
      return "Just now";
    } else if (differenceInMinutes < 60) {
      return `${differenceInMinutes} minute${
        differenceInMinutes !== 1 ? "s" : ""
      } ago`;
    } else if (differenceInHours < 24) {
      return `${differenceInHours} hour${
        differenceInHours !== 1 ? "s" : ""
      } ago`;
    } else {
      const differenceInDays = Math.round(differenceInHours / 24);
      return `${differenceInDays} day${differenceInDays !== 1 ? "s" : ""} ago`;
    }
  };

  return (
    <div className="flex flex-col h-full gap-6 overflow-y-hidden flex-nowrap whitespace-nowrap">
      <h1 className="sm:text-3xl text-2xl font-bold leading-none text-neutral-900">
        Inbox
      </h1>
      <div className="flex flex-col h-full w-full overflow-hidden">
        <div className="relative flex h-full w-full rounded-md border shadow-lg overflow-hidden">
          <div className="flex flex-col w-full xl:basis-5/12 lg:basis-6/12 overflow-hidden">
            <div className="p-3 border-b">
              <Button className="justify-start gap-2" variant={"outline"}>
                <Pencil size={16} />
                Compose
              </Button>
            </div>

            <ScrollArea className="flex flex-col p-3 w-full h-full">
              {messages.map((message) => (
                <Card
                  className="flex mb-3 hover:bg-slate-100 cursor-pointer overflow-hidden"
                  onClick={() => {
                    if (message.message_read === "0") {
                      if (socket) {
                        socket.emit("readMessage", {
                          messageId: message.message_id,
                        });
                        navigate("/inbox/" + message.message_id);
                      }
                    } else {
                      navigate("/inbox/" + message.message_id);
                    }
                    setOpenDrawer(true);
                  }}
                >
                  <div className="flex basis-1/12 items-center justify-center shrink-0">
                    <Circle
                      className={clsx(
                        "fill-current text-sky-500",
                        message.message_read === "0" ? "block" : "hidden"
                      )}
                      size={10}
                    />
                  </div>
                  <div className="flex basis-11/12 flex-col w-full gap-1 overflow-hidden">
                    <CardHeader className="flex-row justify-between w-full pl-0 pb-0 pt-3.5">
                      <CardTitle className="flex flex-col w-[calc(100%-80px)] lg:gap-2 gap-1">
                        <h1 className="lg:text-base text-sm text-ellipsis lg:max-w-[90%] max-w-[85%] overflow-hidden">
                          {message.student_name && message.student_name}
                          {message.teacher_name && message.teacher_name}
                        </h1>
                        <h1 className="font-normal lg:text-sm text-xs">
                          {message.subject}
                        </h1>
                      </CardTitle>
                      <h1 className="text-xs">
                        {timeAgo(new Date(message.send_at))}
                      </h1>
                    </CardHeader>
                    <CardContent className="p-0 pr-3 pb-3.5">
                      <h1 className="font-light lg:text-sm text-xs text-neutral-400 line-clamp-2 text-wrap">
                        {message.message}
                      </h1>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </ScrollArea>
          </div>
          <div
            className={clsx(
              "flex flex-col w-full xl:basis-7/12 lg:basis-6/12 border-l transition-transform ease-in lg:translate-x-0 lg:relative absolute bg-white h-full",
              openDrawer ? "translate-x-0" : "translate-x-[40rem]"
            )}
          >
            {selectedMessage ? (
              <>
                <div className="p-3 border-b">
                  <Button
                    className="justify-start gap-2"
                    variant={"ghost"}
                    onClick={() => setOpenDrawer(false)}
                  >
                    <CornerUpRight size={16} />
                  </Button>
                </div>
                <div className="flex flex-col h-full">
                  <ScrollArea className="flex flex-col h-full pb-16">
                    <div className="pr-3 pl-4 py-5 flex justify-between ">
                      <div className="flex items-center lg:w-full w-full gap-4">
                        <Avatar className="lg:block hidden">
                          <AvatarFallback>
                            {selectedMessage?.teacher_name &&
                              selectedMessage.teacher_name
                                .split(" ")
                                .slice(0, 2)
                                .map((name) => name.charAt(0))
                                .join("")
                                .toUpperCase()}
                            {selectedMessage?.student_name &&
                              selectedMessage.student_name
                                .split(" ")
                                .slice(0, 2)
                                .map((name) => name.charAt(0))
                                .join("")
                                .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col lg:max-w-[75%] max-w-[90%] overflow-hidden">
                          {(selectedMessage?.teacher_name ||
                            selectedMessage?.student_name) && (
                            <h1 className="font-medium text-ellipsis md:text-base text-sm overflow-hidden">
                              {selectedMessage.teacher_name}
                              {selectedMessage.student_name}
                            </h1>
                          )}
                          <h1 className="text-sm font-light text-neutral-600">
                            {selectedMessage?.subject}
                          </h1>
                          {selectedMessage?.start_date && (
                            <Badge className="mt-1 lg:text-xs text-[10px] text-wrap w-fit">
                              {dayjs(selectedMessage.start_date).format(
                                "MMM D"
                              )}
                              {selectedMessage?.end_date &&
                                " - " +
                                  dayjs(selectedMessage.end_date).format(
                                    "MMM D"
                                  )}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-4 shrink-0">
                        <h1 className="text-xs">
                          {dayjs(selectedMessage?.send_at).format(
                            "MMM D, YYYY"
                          )}
                        </h1>
                      </div>
                    </div>
                    <hr />
                    <div className="pl-4 pr-6 py-5 flex flex-col h-full whitespace-pre-line text-sm text-neutral-600 leading-relaxed">
                      <p>{selectedMessage?.message}</p>
                      <Button
                        className={clsx(
                          "lg:mt-8 mt-4 w-fit",
                          selectedMessage?.message === "" && "!mt-0"
                        )}
                      >
                        Confirm Application
                      </Button>
                    </div>
                  </ScrollArea>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inbox;

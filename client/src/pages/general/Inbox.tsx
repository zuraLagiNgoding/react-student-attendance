import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Check, ChevronsUpDown, Circle, CornerUpRight, Pencil, Search, Trash2 } from "lucide-react";
import React, { useRef } from "react";
import { NotificationType } from "@/Layout";
import { useFetch } from "@/hooks/fetcher";
import clsx from "clsx";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocation, useNavigate } from "react-router-dom";
import { useSocketStore } from "@/store/useSocketStore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import dayjs from "dayjs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MessageSchema } from "@/schemas/messages-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Command, CommandGroup } from "@/components/ui/command";
import { TeachersType } from "../admin/data_guru/columns";



const Inbox = () => {
  const { socket } = useSocketStore();
  const navigate = useNavigate();
  const location = useLocation();
  const messageId = location.pathname.split("/").pop();
  const reFetchRef = useRef<() => void>(() => {});
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [ imagePreview, setImagePreview ] = React.useState<string | null>(null);
  const [ image, setImage ] = React.useState<File | null>(null);
  const [teacherSearch, setTeacherSearch] = React.useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: teachers } = useFetch<TeachersType[]>(
    "http://localhost:8800/backend/teachers"
  );

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

  const form = useForm<z.infer<typeof MessageSchema>>({
    resolver: zodResolver(MessageSchema),
    defaultValues: {
      image: "",
      message: "",
      subject: "",
      receiver: undefined
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setImagePreview(null);
      return;
    } else {
      setImage(file)
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async () => {
    const formData = new FormData();
    if (image) {
      formData.append('image', image)

      try {
        const res = await axios.post(
          "http://localhost:8800/backend/upload", formData
        );
        return res.data;
      } catch (e) {
        console.log(e);
      }
    }
  }

  const searchTeacherHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTeacherSearch(event.target.value);
  };

  const onSubmit = async (values: z.infer<typeof MessageSchema>) => {
    const imgUrl = await uploadImage();

    try {
      await axios.post("http://localhost:8800/backend/messages/send", {
        subject: values.subject,
        message: values.message,
        image: image ? imgUrl : "",
        receiver_id: teachers.find(
          (a) => a.uid === values.receiver)?.uid
      }, {
        withCredentials: true
      }
    );
    if (socket) {
      socket.emit("sendNotification", {
        receiverId: teachers.find((a) => a.uid === values.receiver)?.uid,
      });
    }
      navigate(0);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="flex flex-col h-full gap-6 overflow-y-auto flex-nowrap whitespace-nowrap">
      <h1 className="sm:text-3xl text-2xl font-bold leading-none text-neutral-900">
        Inbox
      </h1>
      <div className="flex flex-col h-full w-full overflow-hidden bg-white">
        <div className="relative flex h-full w-full rounded-md border shadow-lg overflow-hidden">
          <div className="flex flex-col w-full xl:basis-5/12 lg:basis-6/12 overflow-hidden">
            <div className="p-3 border-b">
              <Dialog>
                <DialogTrigger>
                  <Button className="justify-start gap-2" variant={"outline"}>
                    <Pencil size={16} />
                    Compose
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:min-w-[650px] max-h-[75%] overflow-auto pb-0">
                  <DialogHeader>
                    <DialogTitle>New Message</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                      <div className="sm:space-y-5 space-y-2 relative">

                        <FormField
                          control={form.control}
                          name="receiver"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>To :</FormLabel>
                              <FormControl>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl className="w-full">
                                    <Button
                                      variant="outline"
                                      role="combobox"
                                      className={cn(
                                        "justify-between w-full",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value
                                        ? teachers.find(
                                            (item) => item.uid === field.value
                                          )?.teacher_name
                                        : "Select Teacher"}
                                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="overflow-hidden p-0">
                                  <Command>
                                    <div className="flex items-center gap-x-2 border-b leading-none border-slate-200 bg-transparent px-3 py-1.5 transition-colors placeholder:text-slate-500 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300">
                                      <Search size={16} className="text-primary inline" />
                                      <input
                                        placeholder="Search teacher..."
                                        value={teacherSearch}
                                        onChange={searchTeacherHandler}
                                        className="h-full placeholder:text-sm focus-visible:ring-0 focus-visible:outline-none px-2 py-1"
                                      />
                                    </div>
                                    <CommandGroup>
                                      <div className="overflow-y-auto max-h-[300px]">
                                        {teachers
                                          .filter((filtered) =>
                                            filtered.teacher_name
                                              .toLowerCase()
                                              .includes(teacherSearch.toLowerCase())
                                          )
                                          .map((item) => (
                                            <div
                                              key={item.nip}
                                              className="flex hover:bg-primary/[0.08] cursor-pointer items-center px-2 py-1.5 text-sm gap-2 indent-0"
                                              onClick={() => {
                                                form.setValue(
                                                  "receiver",
                                                  item.uid
                                                );
                                              }}
                                            >
                                              <Check
                                                className={cn(
                                                  "max-h-4 max-w-4 text-primary basis-1/6",
                                                  field.value === item.uid
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                                )}
                                              />
                                              <h1 className="basis-5/6 leading-tight">
                                                {item.teacher_name}
                                              </h1>
                                            </div>
                                          ))}
                                      </div>
                                    </CommandGroup>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                              </FormControl>
                            </FormItem>
                          )}
                          />

                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subject</FormLabel>
                              <FormControl>
                                <Input placeholder="Subject" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                          />
                          
                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Message</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Message" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        {!imagePreview &&
                          <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                              <FormItem className={clsx()}>
                                <FormControl>
                                  <Input
                                    {...field}
                                    ref={fileInputRef && field.ref}
                                    onChange={(e) => {
                                      field.onChange(e);
                                      handleImageChange(e);
                                    }}
                                    type="file"
                                  />
                                </FormControl>
                                <FormMessage/>
                              </FormItem>
                            )}
                          />
                        }

                        {imagePreview && (
                          <div className="w-full relative">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="max-w-full"
                            />
                            <Trash2
                              onClick={() => {
                                setImagePreview(null);
                                form.setValue("image", "");
                                if (fileInputRef.current) {
                                  fileInputRef.current.value = "";
                                }
                              }}
                              className="absolute top-3 right-3 text-red-500"
                            />
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-x-4 sticky bottom-0 bg-white pb-6 pt-2">
                          <DialogClose>
                            <Button
                              className="w-full"
                              type="button"
                              variant="outline"
                            >
                              Cancel
                            </Button>
                          </DialogClose>
                          <Button type="submit">Submit</Button>
                        </div>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
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
                      <div className="flex flex-col w-[calc(100%-80px)] lg:gap-2 gap-1">
                        <h1 className="lg:text-base text-sm text-ellipsis lg:max-w-[90%] max-w-[85%] overflow-hidden">
                          {message.student_name && message.student_name}
                          {message.teacher_name && message.teacher_name}
                        </h1>
                        <h1 className="font-normal lg:text-sm text-xs">
                          {message.subject}
                        </h1>
                      </div>
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
                    className="justify-start gap-2 lg:invisible"
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
                    <div className="pl-4 pr-6 py-5 flex flex-col gap-3 h-full whitespace-pre-line text-sm text-neutral-600 leading-relaxed">
                      {selectedMessage &&
                      <>
                        {selectedMessage.message &&
                          <p>{selectedMessage.message}</p>
                        }
                        {selectedMessage.img &&
                          <Dialog>
                            <DialogTrigger className="w-fit">                            
                              <div className="flex items-center gap-2">
                                <img
                                  src={"../upload/" + selectedMessage.img}
                                  alt={selectedMessage.img}
                                  className="max-w-[200px] rounded-md"
                                />
                              </div>
                            </DialogTrigger>
                            <DialogContent className="p-1 w-fit max-w-[100rem]">
                              <img
                                src={"../upload/" + selectedMessage.img}
                                alt={selectedMessage.img}
                                className="rounded-md max-w-full"
                              />
                            </DialogContent>
                          </Dialog>
                        }
                        {
                          selectedMessage.start_date &&
                          <div
                            className={clsx(
                              "flex gap-2 lg:mt-8 mt-1 w-fit",
                              selectedMessage.img === "" && "!mt-0",
                              selectedMessage.message === "" && "!mt-0"
                            )}
                          >
                            <Button className="w-fit">Confirm Application</Button>
                            <Button className="w-fit" variant={"outline"}>
                              Decline
                            </Button>
                          </div>
                        }
                      </>
                      }
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

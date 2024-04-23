import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Breadcrumbs from "./components/ui/breadcrumbs";
import { Bell, Circle, Inbox, Menu } from "lucide-react";
import React, { useContext } from "react";
import clsx from "clsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import { useFetch } from "./hooks/fetcher";
import { io } from "socket.io-client";
import { useSocketStore } from "./store/useSocketStore";
import { AuthContext } from "./context/authContext";
import toast from "react-hot-toast";
// import SearchBar from "./components/ui/search-bar";

export interface NotificationType {
  message_id: number;
  subject: string;
  message: string;
  sender_id: number;
  start_date: Date;
  end_date: Date;
  student_name?: string;
  teacher_name?: string;
  send_at: Date;
  message_read: "0" | "1";
  class_name: string
}

const Layout = () => {
  const [ notificationPing, setNotificationPing ] = React.useState(false);
  const [ openNotification, setOpenNotification ] = React.useState(false);
  const { socket, updateSocket } = useSocketStore();
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const { data: notifications, reFetch } = useFetch<NotificationType[]>(
    `http://localhost:8800/backend/messages/unread`
  );

  React.useEffect(() => {
    updateSocket(io("http://localhost:5000"));
  }, [updateSocket])

  React.useEffect(() => {
    if (socket) {
      if (currentUser) {
        socket.emit("addUser", currentUser.id)
      }
    }
  }, [currentUser, socket])

  React.useEffect(() => {
    if (socket) {
      socket.on("getNewNotification", ({ping}) => {
        if (ping) {
          setNotificationPing(true)
        }
      })
    }
  }, [socket])

  React.useEffect(() => {
    if (notificationPing) {
      setNotificationPing(false)
      reFetch()
    }
  }, [notificationPing, reFetch])

  React.useEffect(() => {
    if (notificationPing) {
      if (!openNotification) {
        toast("You have a new absence request!", {
          icon: "🔔",
        });
      }
    }
  }, [notificationPing, openNotification])

  const [close, setClose] = React.useState(true);
  return (
    <div className="relative flex w-[100vw] overflow-x-hidden">
      <Sidebar close={close} setClose={setClose} />
      <div className="lg:basis-5/6 sm:basis-[95%] px-4 py-8 h-screen flex flex-col min-h-screen max-h-screen max-w-full w-full sm:overflow-x-hidden gap-10">
        <div className="flex items-center justify-between sm:pr-4 sm:my-0 my-4">
          <Menu
            className="cursor-pointer sm:hidden block"
            size={20}
            onClick={() => setClose(false)}
          />
          <Breadcrumbs />
          {/* <SearchBar/> */}
          <div className={clsx("flex items-center justify-between md:gap-3 gap-0.5", !location.pathname.includes("inbox") ? "visible" : "invisible")}>
            {/* <SearchBar/> */}
            <Link to="/inbox">
              <div className="hover:bg-primary/10 p-1.5 rounded">
                <Inbox className="cursor-pointer " size={20} />
              </div>
            </Link>
            <DropdownMenu open={openNotification} onOpenChange={() => setOpenNotification(!openNotification)}>
              <DropdownMenuTrigger>
                <div className="hover:bg-primary/10 p-1.5 rounded relative" onClick={() => setOpenNotification(!openNotification)}>
                  <Bell className="cursor-pointer " size={20} />
                  {notifications.length > 0 && (
                    <span className="text-[10px] select-none text-white absolute top-1 right-1 bg-red-400 w-3 h-3 rounded-full"></span>
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="md:w-[400px] w-[300px] min-h-[350px]"
                align="end"
              >
                <DropdownMenuLabel className="text-lg">
                  Notifications
                </DropdownMenuLabel>
                <DropdownMenuGroup>
                  {notifications.map((notification) => (
                    <DropdownMenuItem className="gap-4" onClick={() => navigate(`/inbox/${notification.message_id}`)}>
                      <Circle
                        className="fill-current text-sky-300 basis-[5%]"
                        size={8}
                      />
                      <div className="basis-[95%] overflow-hidden">
                        <h1 className="capitalize text-slate-800/80 ">
                          <span className="font-medium normal-case text-neutral-900">
                            {notification.student_name && notification.student_name}
                            {notification.teacher_name && notification.teacher_name}
                          </span>
                          {" " + notification.subject}
                        </h1>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <Outlet />
      </div>
      <div
        onClick={() => setClose(true)}
        className={clsx(
          "absolute z-10 w-full h-screen bg-black/65 sm:hidden",
          !close ? "block" : "hidden"
        )}
      ></div>
    </div>
  );
};

export default Layout;

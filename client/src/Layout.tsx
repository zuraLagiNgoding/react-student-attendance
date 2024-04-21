import { Link, Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Breadcrumbs from "./components/ui/breadcrumbs";
import { Bell, Inbox, Menu } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import React from "react";
import clsx from "clsx";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "./components/ui/dropdown-menu";
// import SearchBar from "./components/ui/search-bar";

const Layout = () => {
  const [close, setClose] = React.useState(true); 
  return (
    <div className="relative flex w-[100vw] overflow-x-hidden">
      <Sidebar close={close} setClose={setClose} />
      <div className="2xl:basis-5/6 sm:basis-[85%] px-4 py-8 h-screen flex flex-col min-h-screen max-h-screen max-w-full w-full sm:overflow-x-hidden gap-10">
        <div className="flex items-center justify-between sm:pr-4 sm:my-0 my-4">
          <Menu
            className="cursor-pointer sm:hidden block"
            size={20}
            onClick={() => setClose(false)}
          />
          <Breadcrumbs />
          <div className="flex items-center justify-between md:gap-3 gap-0.5">
            {/* <SearchBar/> */}
            <Link to="/inbox">
              <div className="hover:bg-primary/10 p-1.5 rounded">
                <Inbox className="cursor-pointer " size={20} />
              </div>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="hover:bg-primary/10 p-1.5 rounded">
                  <Bell className="cursor-pointer " size={20} />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <Outlet />
      </div>
      <Toaster />
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

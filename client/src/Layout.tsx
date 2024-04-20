import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Breadcrumbs from "./components/ui/breadcrumbs";
import { Bell, Menu } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import React from "react";
import clsx from "clsx";
// import SearchBar from "./components/ui/search-bar";

const Layout = () => {
  const [close, setClose] = React.useState(true); 
  return (
    <div className="relative flex w-[100vw] overflow-x-hidden">
      <Sidebar close={close} setClose={setClose} />
      <div className="2xl:basis-5/6 sm:basis-4/5 px-5 py-8 h-screen flex flex-col min-h-screen max-h-screen max-w-full w-full overflow-x-hidden gap-10">
        <div className="flex items-center justify-between sm:pr-4 sm:my-0 my-4">
          <Menu
            className="cursor-pointer sm:hidden block"
            size={20}
            onClick={() => setClose(false)}
          />
          <Breadcrumbs />
          <div className="flex items-center justify-between md:gap-5 gap-2">
            {/* <SearchBar/> */}
            <Bell className="cursor-pointer" size={20} />
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

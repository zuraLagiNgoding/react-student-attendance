import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Breadcrumbs from "./components/ui/breadcrumbs";
import { Bell } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
// import SearchBar from "./components/ui/search-bar";

const Layout = () => {
  return (
    <div className="min-w-full max-w-full flex gap-2">
      <Sidebar/>
      <div className="2xl:basis-5/6 sm:basis-4/5 sm:!p-5 pr-5 pl-24 py-8 h-screen flex flex-col min-h-screen max-h-screen gap-10 w-full">
        <div className="flex items-center sm:justify-between justify-end sm:pr-4 sm:my-0 my-4">
          <Breadcrumbs />          
          <div className="flex items-center md:gap-5 gap-2">
            {/* <SearchBar/> */}
            <Bell className="cursor-pointer" size={20} />      
          </div>
        </div>
        <Outlet />
      </div>
      <Toaster />
    </div>
  );
};

export default Layout;

import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Breadcrumbs from "./components/ui/breadcrumbs";
import { Bell } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
// import SearchBar from "./components/ui/search-bar";

const Layout = () => {
  return (
    <div className="w-full h-screen max-h-screen flex gap-2">
      <Sidebar />
      <div className="2xl:basis-5/6 basis-4/5 p-5 flex flex-col gap-10 h-full w-full ">
        <div className="flex items-center justify-between pr-4">
          <Breadcrumbs />
          <div className="flex items-center gap-4">
            {/* <SearchBar/> */}
            <Bell size={20} />
          </div>
        </div>
        <Outlet />
      </div>
      <Toaster />
    </div>
  );
};

export default Layout;

import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Breadcrumbs from "./components/ui/breadcrumbs";
import { Bell } from "lucide-react";

const Layout = () => {

  return (
      <div className="w-full h-screen flex gap-2">
        <Sidebar />
        <div className="xl:basis-5/6 basis-4/5 p-5 flex flex-col gap-10 h-full w-full ">
          <div className="flex items-center justify-between pr-4">
            <Breadcrumbs />
            <Bell size={20} />
          </div>
          <Outlet />
        </div>
      </div>
  );
};

export default Layout;

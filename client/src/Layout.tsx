import { Outlet } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Breadcrumbs from './components/ui/breadcrumbs'
import { Bell } from "lucide-react";

const Layout = () => {
  return (
    <div className="w-full h-screen flex gap-2">
      <Sidebar />
      <div className="basis-5/6 p-5 flex flex-col gap-10">
        <div className="flex items-center justify-between pr-4">
          <Breadcrumbs />
          <Bell size={20} />
        </div>
        <Outlet />
      </div>
    </div>
  );
}

export default Layout
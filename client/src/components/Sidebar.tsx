import { NavLinks as links } from "@/data/nav-links";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";
import React, { useContext } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { MoreHorizontal } from "lucide-react";
import { AuthContext } from "@/context/authContext";

const Sidebar = () => {
  const location = useLocation();
  const { currentUser } = useContext(AuthContext);

  return (
    <aside className="2xl:basis-1/6 basis-1/5 w-full h-screen flex flex-col py-8 px-3 border-r shadow-2xl">
      <h1 className="font-semibold text-lg text-center">
        Student Attendance Management
      </h1>
      <div className="py-4">
        {links.map((base) => (
          <React.Fragment key={base.base}>
            <h1 className="2xl:text-xs text-[12px] font-light opacity-65">
              {base.base}
            </h1>
            <ul className="flex flex-col py-2 space-y-1.5 overflow-auto">
              {base.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className={clsx(
                      "rounded-md text-sm font-medium px-4 py-3 inline-flex gap-2 items-center leading-none w-full",
                      location.pathname.startsWith("/" + link.href)
                        ? "bg-slate-800 text-white"
                        : "hover:bg-primary/[0.08]"
                    )}
                  >
                    <link.icon size={18} />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </React.Fragment>
        ))}
      </div>
      <div className="flex gap-4 items-center mt-auto px-3">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-medium text-sm">@{currentUser?.username}</h1>
          <p className="text-xs">{currentUser?.email}</p>
        </div>
        <MoreHorizontal className="ml-auto" />
      </div>
    </aside>
  );
};

export default Sidebar;

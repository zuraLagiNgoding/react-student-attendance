import { NavLinks } from "@/data/nav-links";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";

const Sidebar = () => {
  const location = useLocation();
  const { links } = NavLinks["ADMIN"];

  return (
    <aside className="xl:basis-1/6 basis-1/5 w-full h-full flex flex-col py-8 px-3 border-r shadow-2xl">
      <h1 className="font-semibold text-lg text-center">
        Student Attendance Management
      </h1>
      <ul className="flex flex-col space-y-1.5 py-8 overflow-auto">
        {links.map((link) => (
          <li
            className={clsx(
              "rounded-md text-sm font-medium",
              location.pathname.startsWith("/" + link.href)
                ? "bg-slate-800 text-white"
                : "hover:bg-primary/[0.08]"
            )}
          >
            <Link to={link.href} className="px-4 py-3 inline-flex gap-2 items-center  leading-none">
              <link.icon size={18} />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;

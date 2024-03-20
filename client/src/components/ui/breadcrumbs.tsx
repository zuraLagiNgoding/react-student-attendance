import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ChevronLeft } from "lucide-react";

const Breadcrumbs = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex gap-2 items-center py-2">
      <ChevronLeft onClick={() => navigate(-1)} className="cursor-pointer"/>
      <Link to="/" className="text-sm">
        Home
      </Link>
      {location.pathname
        .split("/")
        .filter(Boolean)
        .map((path, index, array) => (
          <React.Fragment key={index}>
            <p>/</p>
            <Link
              to={`/${array.slice(0, index + 1).join("/")}`}
              className="text-sm last-of-type:font-semibold capitalize"
            >
              {path}
            </Link>
          </React.Fragment>
        ))}
    </div>
  );
}

export default Breadcrumbs
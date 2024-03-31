import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router-dom";
import hero from "@/assets/hero.svg";

const LandingPage = () => {
  return (
    <div className="flex flex-col w-full">
      <div className="relative flex flex-col w-full h-screen bg-white">
        <nav className="fixed rounded-xl border border-slate-200 bg-white shadow flex px-12 py-8 w-full items-center justify-between">
          <h1 className="text-primary text-xl">Presynce</h1>
          <Link to="/login">
            <Button>Get Started</Button>
          </Link>
        </nav>
        <div className="flex h-full flex-col justify-center w-full">
          <div className="flex">
            <div className="basis-1/2 flex flex-col p-12 gap-8 justify-center">
              <h1 className="text-7xl font-semibold text-slate-800">
                Manage Student Attendances{" "}
                <span className="text-primary">Without Limit</span>{" "}
              </h1>
              <p className="text-slate-800/75 max-w-[90%]">
                Efficiently track student attendance records with our
                streamlined system. Simplify attendance management and improve
                accuracy with ease.
              </p>
              <Link to="/login">
                <Button>Get Started</Button>
              </Link>
            </div>
            <div className="basis-1/2 p-12">
              <img src={hero} alt="heroImg" className="w-[calc(100vh*0.80)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

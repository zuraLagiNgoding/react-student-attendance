import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router-dom";
import hero from "@/assets/environment/dashboard.png";
import chart from "@/assets/environment/bar_chart.png";
import logo from "@/assets/logo1.svg";
import logo1 from "@/assets/logo.svg";
import { Badge } from "@/components/ui/badge";

const LandingPage = () => {
  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      <div className="relative flex flex-col w-full bg-white">
        <nav className="fixed rounded-xl border z-10 border-slate-200 bg-white shadow flex lg:px-24 px-16 py-6 w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <img width={48} src={logo} alt="logo" />
            <h1 className="text-secondary text-lg select-none">Presynce</h1>
          </div>
          <Link to="/login">
            <Button>Get Started</Button>
          </Link>
        </nav>
        <div className="flex h-[calc(100vh-60px)] flex-col items-center justify-center w-full">
          <div className="flex flex-row gap-8">
            <div className="basis-1/2 flex flex-col py-12 lg:pl-24 pl-16 gap-8 justify-center">
              <h1 className="2xl:text-7xl lg:text-5xl text-4xl font-semibold text-slate-800">
                Manage Student Attendances{" "}
                <span className="green_gradient">Without Limit</span>{" "}
              </h1>
              <p className="text-secondary/70 max-w-[90%]">
                Efficiently track student attendance records with our
                streamlined system. Simplify attendance management and improve
                accuracy with ease.
              </p>
              <Link className="w-fit" to="/login">
                <Button>Get Started</Button>
              </Link>
            </div>
            <div className="relative flex h-full items-center basis-1/2">
              <img
                src={hero}
                alt="heroImg"
                className="xl:min-w-[50rem] md:min-w-[40rem] absolute 2xl:right-[-12rem] xl:right-[-18rem] lg:right-[-12rem] md:right-[-16rem] shadow-2xl rounded-2xl"
              />
            </div>
          </div>
        </div>
        <div className="flex h-full flex-col gap-12 py-16 lg:px-24 px-16 justify-center w-full bg-slate-100 rounded-t-3xl">
          <div className="flex flex-col px-2 py-3 gap-4">
            <Badge className="w-fit">CORE FEATURES</Badge>
            <h1 className="text-secondary text-3xl leading-normal font-semibold 2xl:max-w-[50%] max-w-[75%]">
              See how we brought accuracy and compliance to attendance records.
            </h1>
          </div>
          <div className="grid 2xl:grid-cols-3 lg:grid-cols-2 gap-8">
            <div className="flex flex-col overflow-hidden items-center 2xl:gap-12 gap-8 p-8 w-full rounded-2xl bg-secondary 2xl:h-[30rem] lg:h-[28rem] h-[24rem]">
              <div className="flex flex-col text-center items-center gap-4">
                <img src={logo1} width={42} alt="logo" />
                <h1 className="text-white 2xl:text-3xl text-2xl font-semibold">
                  Real-time Attendance Tracking
                </h1>
                <h1 className="text-white/70 w-full">
                  Monitor student attendance with live updates, ensuring
                  accurate records and instant insights for educators.
                </h1>
              </div>
              <div className="relative">
                <img
                  src={chart}
                  alt="chart"
                  className="rounded-lg min-w-[20rem]"
                />
              </div>
            </div>
            <div className="flex flex-col overflow-hidden items-center 2xl:gap-12 gap-8 w-full rounded-2xl bg-secondary 2xl:row-span-1 row-span-2 2xl:h-[30rem] lg:h-full h-[24rem] p-8">
              <div className="flex flex-col text-center items-center gap-4">
                <img src={logo1} width={42} alt="logo" />
                <h1 className="text-white 2xl:text-3xl text-2xl font-semibold">
                  Visually Appealing and Comfortable
                </h1>
                <h1 className="text-white/70 w-full">
                  We choose a design that can have an impact on user
                  satisfaction, engagement, and retention.
                </h1>
              </div>
              <div className="relative w-full h-full">
                <img
                  src={hero}
                  alt="dashboard"
                  className="absolute top-0 rounded-md 2xl:min-w-[35rem] min-w-[55rem]"
                />
              </div>
            </div>
            <div className="flex flex-col overflow-hidden items-center 2xl:gap-12 gap-4 w-full rounded-2xl bg-secondary 2xl:h-[30rem] lg:h-[20rem] p-8">
              <div className="flex z-[1] flex-col bg-secondary text-center items-center gap-4">
                <img src={logo1} width={42} alt="logo" />
                <h1 className="text-white 2xl:text-3xl text-2xl font-semibold">
                  Stay Connected Between Teachers and Students
                </h1>
                <h1 className="text-white/70 w-full pb-4">
                  Designed to enhance communication and collaboration between
                  students and teachers, making the learning experience more
                  interactive.
                </h1>
              </div>
              {/* <div className="relative w-full h-full 2xl:text-8xl text-5xl text-center">
                🔔
              </div> */}
            </div>
          </div>
        </div>
        <div className="flex h-full text-center items-center flex-col gap-12 py-16 lg:px-24 px-16 justify-center w-full rounded-t-3xl">
          <h1 className="green_gradient 2xl:text-4xl text-3xl font-semibold w-[50%]">
            Perfect solutions for school activities management.
          </h1>
          <p className="w-[60%]">
            Streamline student activity management with real-time updates,
            smooth communication between students and organizers, and thorough
            reporting for effective coordination and planning. Our system
            ensures you're always up-to-date, encourages productive interaction,
            and provides valuable insights for managing activities efficiently.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

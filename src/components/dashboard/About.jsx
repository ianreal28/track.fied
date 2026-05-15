import { useContext } from "react";
import { FaGithub, FaLinkedinIn, FaRectangleXmark } from "react-icons/fa6";
import { dashboardContext } from "../../pages/Dashboard";

export default function About() {
  const { showAbout, setShowAbout } = useContext(dashboardContext);
  return (
    <div
      className={`${showAbout ? "flex" : "hidden"} backdrop-blur-sm fixed justify-center items-center w-full h-full z-20`}
    >
      <div className="flex flex-col bg-white border rounded w-3/4 md:w-1/3 dark:bg-slate-950">
        <div className="border-b flex text-2xl px-4 py-2 items-center">
          <h3 className="flex-1 font-space-grotesk font-bold">About</h3>
          <FaRectangleXmark
            className="cursor-pointer hover:text-mist-800"
            onClick={() => setShowAbout(false)}
          />
        </div>
        <div className="flex flex-col">
          <div className="p-4 border-b space-y-2">
            <h1 className="flex mb-4 font-bold text-3xl md:text-4xl font-space-grotesk tracking-tight transition-opacity hover:opacity-80 text-slate-800 dark:text-slate-200 justify-center">
              track
              <span className="text-slate-500 dark:text-slate-400">.</span>
              fied
            </h1>
            <p>
              This is a full-stack productivity application designed to simplify
              task management.
            </p>
            <p>
              The frontend was developed using React, while the backend API was
              powered by Express. Authentication and database management were
              implemented using Supabase.
            </p>
            <p>
              The goal of this project was to build a scalable and secure task
              management system while exploring modern development workflows and
              serverless deployment practices.
            </p>
            <small>
              Future improvements:
              <ul className="list-disc mx-6">
                <li>task groups</li>
                <li>team collabs</li>
              </ul>
            </small>
          </div>
          <div className="flex p-2 justify-center gap-4 text-2xl">
            <a
              href="https://github.com/ianreal28"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer hover:text-mist-600 dark:hover:text-mist-800"
            >
              <FaGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/ian-wendell-real-246771187/"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer hover:text-mist-600 dark:hover:text-mist-800"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

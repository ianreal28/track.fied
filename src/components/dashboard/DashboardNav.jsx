import {
  FaCaretDown,
  FaCircleHalfStroke,
  FaCircleInfo,
  FaCircleUser,
  FaMoon,
  FaScrewdriverWrench,
  FaSun,
} from "react-icons/fa6";
import { FaSignOutAlt } from "react-icons/fa";
import { useContext, useState } from "react";
import { userContext } from "../../App";
import { dashboardContext } from "../../pages/Dashboard";

export default function DashboardNav() {
  const { user_email, handleSignOut, setOpenSettings, setShowAbout } =
    useContext(dashboardContext);
  const { theme, setTheme, loading } = useContext(userContext);
  const [navCollapse, setNavCollapse] = useState(false);
  const [themeCollapse, setThemeCollapse] = useState(false);
  return (
    <>
      <div className="flex md:relative w-full p-4 bg-sky-300 z-10 dark:bg-sky-950">
        <div className="grow">
          <h1 className="font-bold text-xl md:text-2xl font-space-grotesk tracking-tight transition-opacity hover:opacity-80 text-slate-800 dark:text-slate-100">
            track<span className="text-slate-500 dark:text-slate-400">.</span>
            fied
          </h1>
        </div>
        <button
          className="px-2 border-gray-700 border-r mr-2 flex font-normal justify-center items-center cursor-pointer"
          onClick={() => {
            setThemeCollapse(!themeCollapse);
            setNavCollapse(false);
          }}
        >
          <span className="pl-2 pr-4 text-gray-700 dark:text-gray-300">
            {theme === "system" ? (
              <FaCircleHalfStroke />
            ) : theme === "dark" ? (
              <FaMoon />
            ) : (
              <FaSun />
            )}
          </span>
          <span className={`${themeCollapse ? "rotate-180" : ""}`}>
            <FaCaretDown />
          </span>
        </button>
        <button
          className="flex font-normal justify-center items-center cursor-pointer"
          onClick={() => {
            setNavCollapse(!navCollapse);
            setThemeCollapse(false);
          }}
        >
          <FaCircleUser className="md:hidden text-2xl" />
          <span className="text-gray-700 dark:text-gray-300 hidden md:block">
            {user_email}
          </span>
          <span className="pl-2">
            <FaCaretDown className={`${navCollapse ? "rotate-180" : ""}`} />
          </span>
        </button>
      </div>
      <div
        className={`${navCollapse ? "md:flex-none" : "hidden"} md:absolute px-2 bg-sky-300 md:right-0 md:mr-4 md:mt-1 dark:bg-sky-950`}
      >
        <div className="md:hidden flex items-center border-b p-1">
          <FaCircleUser className="mr-4" />
          {user_email}
        </div>
        <button
          className="flex justify-center items-center cursor-pointer my-1 p-1 hover:text-gray-600 active:text-gray-700 dark:hover:text-gray-400 dark:active:text-gray-500"
          onClick={() => setShowAbout(true)}
        >
          <span className="pr-4">
            <FaCircleInfo />
          </span>
          <span>About</span>
        </button>
        <button
          className="flex justify-center items-center cursor-pointer my-1 p-1 hover:text-gray-600 active:text-gray-700 dark:hover:text-gray-400 dark:active:text-gray-500"
          onClick={() => setOpenSettings(true)}
        >
          <span className="pr-4">
            <FaScrewdriverWrench />
          </span>
          <span>Settings</span>
        </button>
        <button
          className="flex justify-center items-center cursor-pointer my-1 p-1 hover:text-gray-600 active:text-gray-700 dark:hover:text-gray-400 dark:active:text-gray-500"
          onClick={handleSignOut}
          disabled={loading}
        >
          <span className="pr-4">
            <FaSignOutAlt />
          </span>
          <span>{loading ? "Loading..." : "Signout"}</span>
        </button>
      </div>
      <div
        className={`${themeCollapse ? "flex-none" : "hidden"} md:absolute px-2 bg-sky-300 md:right-30 md:mr-4 md:mt-1 dark:bg-sky-950`}
      >
        {["light", "dark", "system"].map((t) => (
          <button
            key={t}
            onClick={() => {
              setTheme(t);
              setThemeCollapse(false);
            }}
            className="flex justify-center items-center cursor-pointer md:my-1 p-1 hover:text-gray-600 active:text-gray-700 dark:hover:text-gray-400 dark:active:text-gray-500"
          >
            <span className="pr-4">
              {t === "system" ? (
                <FaCircleHalfStroke />
              ) : t === "dark" ? (
                <FaMoon />
              ) : (
                <FaSun />
              )}
            </span>
            <span>{t}</span>
          </button>
        ))}
      </div>
    </>
  );
}

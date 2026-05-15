import { useContext, useState } from "react";
import { userContext } from "../../App";
import { FaCircleHalfStroke, FaMoon, FaSun } from "react-icons/fa6";

export default function ThemeButton() {
  const { theme, setTheme } = useContext(userContext);
  const [showTheme, setShowTheme] = useState(false);
  return (
    <div className="fixed bottom-6 right-6">
      <div
        className={`${showTheme ? "" : "hidden"} bg-slate-950/80 dark:bg-sky-950 p-1 rounded-sm`}
      >
        {["light", "dark", "system"].map((t) => (
          <button
            key={t}
            onClick={() => {
              setTheme(t);
              setShowTheme(false);
            }}
            className="flex justify-center items-center cursor-pointer my-1 p-1"
          >
            <span className="text-3xl">
              {t === "system" ? (
                <FaCircleHalfStroke className="text-slate-300" />
              ) : t === "dark" ? (
                <FaMoon className="text-slate-500" />
              ) : (
                <FaSun className="text-yellow-500" />
              )}
            </span>
          </button>
        ))}
      </div>
      <button
        className="bg-slate-950/90 dark:bg-sky-950 p-2 mt-1 rounded-sm text-3xl cursor-pointer"
        onClick={() => setShowTheme(!showTheme)}
      >
        {theme === "system" ? (
          <FaCircleHalfStroke className="text-slate-300" />
        ) : theme === "dark" ? (
          <FaMoon className="text-slate-500" />
        ) : (
          <FaSun className="text-yellow-500" />
        )}
      </button>
    </div>
  );
}

import { useContext } from "react";
import { FaRectangleXmark } from "react-icons/fa6";
import { userContext } from "../../App";

export default function AlertModal() {
  const { alertMsg, setAlertMsg } = useContext(userContext);
  return (
    <div
      className={`${!alertMsg ? "hidden" : "flex"} backdrop-blur-sm fixed justify-center items-center w-full h-full z-20`}
    >
      <div className="flex flex-col bg-white border rounded w-3/4 md:w-1/3 h-1/4 dark:bg-slate-950">
        <div className="border-b flex text-2xl p-2 justify-end">
          <FaRectangleXmark
            className="cursor-pointer hover:text-mist-800 active:text-mist-900 active:scale-95"
            onClick={() => setAlertMsg(null)}
          />
        </div>
        <h3 className="flex text-2xl font-medium p-2 h-full items-center justify-center">
          {alertMsg}
        </h3>
      </div>
    </div>
  );
}

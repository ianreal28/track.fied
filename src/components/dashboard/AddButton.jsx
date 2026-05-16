import { useContext } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { dashboardContext } from "../../pages/Dashboard";
export default function AddButton() {
  const { setShowAddForm, showAddForm } = useContext(dashboardContext);
  return (
    <>
      <button
        className={`flex border border-gray-500 cursor-pointer w-3/4 mt-5 p-4 rounded-3xl items-center justify-center shadow-md bg-white hover:bg-gray-100 active:bg-gray-400 dark:shadow-white dark:bg-slate-950 dark:hover:bg-slate-800 dark:active:bg-slate-700`}
        onClick={() => setShowAddForm(!showAddForm)}
      >
        <span className="text-2xl pr-4">
          <FaCirclePlus />
        </span>
        <span className="text-xl font-medium">Add Task</span>
      </button>
    </>
  );
}

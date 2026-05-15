import { useContext, useState } from "react";
import {
  FaArrowRotateLeft,
  FaCheck,
  FaCircleChevronDown,
  FaCircleChevronUp,
  FaPencil,
  FaTrashCan,
} from "react-icons/fa6";
import { userContext } from "../../App";
import { dashboardContext } from "../../pages/Dashboard";

export default function TaskItem({ task, toggleComplete }) {
  const { filter, currentDate, showEdit, setDeleteData } =
    useContext(dashboardContext);
  const { loading } = useContext(userContext);
  const [showDetails, setShowDetails] = useState(null);
  return (
    <>
      <fieldset
        className={`${
          task.is_completed
            ? "border-green-600"
            : task.due_date === currentDate
              ? "border-orange-600"
              : task.due_date <= currentDate
                ? "border-red-600"
                : "border-blue-600"
        } border rounded-md bg-white shadow-lg dark:bg-slate-900 p-2`}
      >
        <legend
          className={`${
            task.is_completed
              ? "text-green-600"
              : task.due_date === currentDate
                ? "text-orange-600"
                : task.due_date <= currentDate
                  ? "text-red-600"
                  : "text-blue-600"
          } px-2 text-sm font-space-grotesk font-extrabold`}
        >
          {task.is_completed
            ? "Done"
            : task.due_date === currentDate
              ? "Due Today!"
              : task.due_date <= currentDate
                ? "Past Due!!!"
                : "Ongoing"}
        </legend>
        <div className="flex">
          <button
            className="p-2 mr-2 font-extrabold text-2xl cursor-pointer hover:text-green-600"
            onClick={() => toggleComplete(task)}
            disabled={loading}
          >
            {task.is_completed ? <FaArrowRotateLeft /> : <FaCheck />}
          </button>
          <h3 className="p-2 grow text-lg font-bold font-space-grotesk">
            {task.title}
          </h3>
          <button
            className="p-2 font-extrabold text-2xl cursor-pointer hover:text-mist-800"
            onClick={() =>
              setShowDetails(showDetails === task.id ? null : task.id)
            }
          >
            {showDetails ? <FaCircleChevronUp /> : <FaCircleChevronDown />}
          </button>
        </div>

        <div
          className={`${showDetails === task.id ? "flex flex-col" : "hidden"}`}
        >
          <p className="flex p-2 m-4 border-t border-b border-gray-700 text-gray-700 text-sm font-semibold dark:text-gray-300 dark:border-gray-700">
            {task.description}
          </p>
          <div className="flex p-2">
            <small className="flex font-semibold items-center">
              Due: {task.due_date}
            </small>
            <div className="flex grow justify-end">
              <button
                onClick={() => showEdit(task)}
                className="flex items-center mx-2 px-2 py-1 rounded-sm cursor-pointer text-sm font-medium bg-blue-600 hover:bg-blue-800 text-white"
                disabled={loading}
              >
                <FaPencil className="mr-1" /> Edit Task
              </button>
              <button
                onClick={() => setDeleteData(task)}
                className="flex items-center px-2 py-1 rounded-sm cursor-pointer text-sm font-medium bg-red-600 hover:bg-red-800 text-white"
                disabled={loading}
              >
                <FaTrashCan className="mr-1" /> Delete
              </button>
            </div>
          </div>
        </div>
      </fieldset>
    </>
  );
}

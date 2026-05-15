import { useContext, useState } from "react";
import { FaRectangleXmark } from "react-icons/fa6";
import LoadingModal from "../ui/LoadingModal";
import AlertModal from "../ui/AlertModal";
import { userContext } from "../../App";
import { dashboardContext } from "../../pages/Dashboard";

export default function Addform() {
  const { showAddForm, setShowAddForm, currentDate, user_id, setTasks } =
    useContext(dashboardContext);
  const { loading, setLoading, setAlertMsg, alertMsg, supabase } =
    useContext(userContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  // Add Task
  const handleAddTask = async (e) => {
    e.preventDefault();
    setLoading(true);
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        user_id: user_id,
        title: title,
        description: description,
        due_date: dueDate,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      setLoading(false);
      setAlertMsg("Error from Server: " + errorData.error);
      return;
    }

    const data = await res.json();

    setLoading(false);
    setAlertMsg("Task " + data.task.title + " Added!");
    setTasks((prevTasks) => [data.task, ...prevTasks]);
    setTitle("");
    setDescription("");
    setDueDate(new Date());
    setShowAddForm(!showAddForm);
  };
  return (
    <div
      className={`${showAddForm ? "flex" : "hidden"} ${loading ? "hidden" : ""} ${alertMsg ? "hidden" : ""} backdrop-blur-sm fixed justify-center items-center w-full h-full z-20`}
    >
      <AlertModal setAlertMsg={setAlertMsg} alertMsg={alertMsg} />
      <div className="flex flex-col border w-3/4 md:w-1/4 p-4 bg-white dark:bg-slate-950">
        <div className="flex my-2">
          <h1 className="flex-auto font-space-grotesk text-3xl font-bold">
            Add Task
          </h1>
          <button
            className="flex-none text-3xl cursor-pointer hover:text-mist-800"
            onClick={() => {
              setShowAddForm(!showAddForm);
              setTitle("");
              setDescription("");
              setDueDate(new Date().toISOString().split("T")[0]);
            }}
          >
            <FaRectangleXmark />
          </button>
        </div>

        <form className="flex flex-col mt-4" onSubmit={handleAddTask}>
          <input
            type="text"
            className="p-2 border my-1"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          ></input>
          <textarea
            type="text"
            className="p-2 border my-1"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <input
            type="date"
            className="p-2 border my-1 dark:text-white dark:scheme-dark"
            value={dueDate}
            min={currentDate}
            onChange={(e) =>
              setDueDate(new Date(e.target.value).toISOString().split("T")[0])
            }
          ></input>
          <button
            type="submit"
            className="cursor-pointer p-2 my-2 font-medium bg-sky-300 dark:bg-sky-500 hover:bg-sky-500 dark:hover:bg-sky-700 rounded-3xl disabled:bg-sky-100 dark:disabled:bg-sky-300 disabled:text-gray-500 disabled:cursor-not-allowed"
            disabled={loading || !title || !description || !dueDate}
          >
            {loading ? "Adding Task..." : "Add Task"}
          </button>
        </form>
      </div>
    </div>
  );
}

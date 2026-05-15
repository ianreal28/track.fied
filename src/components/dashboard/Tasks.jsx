import { useContext, useEffect, useState } from "react";
import TaskItem from "./TaskItem";
import { FaClipboardQuestion, FaGear } from "react-icons/fa6";
import { userContext } from "../../App";
import { dashboardContext } from "../../pages/Dashboard";

export default function Tasks() {
  const {
    user_id,
    tasks,
    setTasks,
    filter,
    currentDate,
    showEdit,
    setDeleteData,
  } = useContext(dashboardContext);
  const { supabase, loading, setLoading, setAlertMsg } =
    useContext(userContext);
  const [taskLoading, setTaskLoading] = useState(true);
  // Get Task
  const getTasks = async () => {
    setTaskLoading(true);
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const res = await fetch(`/api/tasks`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Fetch failed:", errorData.error);
      setTaskLoading(false);
      return;
    }

    const data = await res.json();
    setTaskLoading(false);
    setTasks(data);
  };

  useEffect(() => {
    if (user_id) {
      getTasks();
    }
  }, [user_id]);

  // Toggle complete
  const toggleComplete = async (task) => {
    setLoading(true);
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const res = await fetch(`/api/tasks?id=${task.id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ is_completed: !task.is_completed }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      setLoading(false);
      setAlertMsg("Error completing task: " + errorData.error);
      return;
    }

    const data = await res.json();
    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === task.id ? data : t)),
    );
    setLoading(false);
    setAlertMsg(
      task.is_completed
        ? "Task: " + task.title + " reopened!"
        : "Task: " + task.title + " completed!",
    );
  };

  return (
    <div className="flex justify-center w-full p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-start w-full">
        <fieldset
          className={`${taskLoading ? "" : tasks.length === 0 && !taskLoading ? "" : "hidden"} border rounded-md bg-white shadow-lg dark:bg-slate-900 p-2`}
        >
          <legend className="px-2 text-sm font-extrabold">
            {tasks.length === 0 && !taskLoading
              ? "No task found"
              : "Loading..."}
          </legend>
          <div className="flex">
            <h1 className="flex items-center mx-2">
              {tasks.length === 0 && !taskLoading ? (
                <FaClipboardQuestion className="animate-pulse text-2xl" />
              ) : (
                <FaGear className="animate-spin text-2xl" />
              )}
            </h1>
            <h3 className="p-2 grow font-medium text-base">
              {tasks.length === 0 && !taskLoading ? "No task found" : "Loading"}
            </h3>
          </div>
        </fieldset>
        {tasks
          .filter((task) => {
            if (filter === "active")
              return !task.is_completed && task.due_date > currentDate;
            if (filter === "completed") return task.is_completed;
            if (filter === "dueToday")
              return task.due_date === currentDate && !task.is_completed;
            if (filter === "pastDue")
              return !task.is_completed && task.due_date < currentDate;
            return true; // 'all'
          })
          .sort((a, b) => {
            // 1. Primary Sort: Completion (Uncompleted 0, Completed 1)
            if (a.is_completed !== b.is_completed) {
              return a.is_completed - b.is_completed;
            }

            // 2. Secondary Sort: Urgency for non-completed tasks
            // Logic: Past Due (lowest value) -> Due Today -> Ongoing (highest value)
            const getUrgency = (date) => {
              if (date < currentDate) return 0; // Past Due
              if (date === currentDate) return 1; // Due Today
              return 2; // Ongoing
            };

            return getUrgency(a.due_date) - getUrgency(b.due_date);
          })
          .map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              toggleComplete={toggleComplete}
            />
          ))}
      </div>
    </div>
  );
}

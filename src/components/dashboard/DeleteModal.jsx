import { useContext } from "react";
import { FaRectangleXmark } from "react-icons/fa6";
import { userContext } from "../../App";
import { dashboardContext } from "../../pages/Dashboard";

export default function DeleteModal() {
  const { deleteData, setDeleteData, setTasks } = useContext(dashboardContext);
  const { supabase, setLoading, loading, setAlertMsg } =
    useContext(userContext);
  // Delete task
  const handleDelete = async (deleteData) => {
    setLoading(true);
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const res = await fetch(`/api/tasks?id=${deleteData.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      setAlertMsg("Delete failed: " + errorData.error);
      setLoading(false);
      return;
    }

    const data = await res.json();
    setTasks((prevTasks) =>
      prevTasks.filter((tasks) => tasks.id !== deleteData.id),
    );
    setLoading(false);
    setAlertMsg("Task: " + deleteData.title + " successfully deleted!");
    setDeleteData(null);
  };
  return (
    <div
      className={`${!deleteData ? "hidden" : "flex"} ${loading ? "hidden" : ""} backdrop-blur-sm fixed justify-center items-center w-full h-full`}
    >
      <div className="flex flex-col bg-white border rounded w-3/4 md:w-1/3 dark:bg-slate-950">
        <div className="border-b flex text-2xl p-2 justify-end">
          <FaRectangleXmark
            className="cursor-pointer hover:text-mist-800"
            onClick={() => setDeleteData(null)}
          />
        </div>
        <h3 className="flex text-xl font-medium p-2 my-4 items-center justify-center">
          Do you want to delete task {deleteData ? deleteData.title : ""} ?
        </h3>
        <button
          className="flex border rounded-md items-center text-md font-medium justify-center py-2 m-2 cursor-pointer bg-red-600 hover:bg-red-800 text-white z-20"
          onClick={() => handleDelete(deleteData)}
        >
          Confirm
        </button>
      </div>
    </div>
  );
}

import { useContext, useEffect, useState } from "react";
import { FaRectangleXmark } from "react-icons/fa6";
import AlertModal from "../ui/AlertModal";
import { userContext } from "../../App";
import { dashboardContext } from "../../pages/Dashboard";

export default function Editform() {
  const {
    setTasks,
    editVisible,
    editData,
    setEditData,
    currentDate,
    setEditVisible,
  } = useContext(dashboardContext);
  const { supabase, loading, setLoading, alertMsg, setAlertMsg } =
    useContext(userContext);
  const [editID, setEditID] = useState(0);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editDue, setEditDue] = useState(
    new Date().toISOString().split("T")[0],
  );

  useEffect(() => {
    if (editData !== null) {
      setEditID(editData.id);
      setEditTitle(editData.title);
      setEditDesc(editData.description);
      setEditDue(editData.due_date);
    }
  }, [editData]);
  // Cancel the edit mode and hide the edit form
  const cancelEdit = (e) => {
    e.preventDefault();
    setEditVisible(false);
    setEditID(0);
    setEditTitle("");
    setEditDesc("");
    setEditDue(new Date().toISOString().split("T")[0]);
  };
  // Save the changed fields
  const saveEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const res = await fetch(`/api/tasks?id=${editID}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: editTitle,
        description: editDesc,
        due_date: editDue,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      setAlertMsg("Update error: " + errorData.error);
      setLoading(false);
      return;
    }

    const data = await res.json();
    setTasks((prevTasks) => prevTasks.map((t) => (t.id === editID ? data : t)));
    setLoading(false);
    cancelEdit(e);
    setAlertMsg("Task successfully updated");
  };
  return (
    <div
      className={`${editVisible ? "flex" : "hidden"} ${loading ? "hidden" : ""} ${alertMsg ? "hidden" : ""} backdrop-blur-sm fixed justify-center items-center w-full h-full z-20`}
    >
      <AlertModal setAlertMsg={setAlertMsg} alertMsg={alertMsg} />
      <div className="flex flex-col border w-3/4 md:w-1/4 p-4 bg-white dark:bg-slate-950">
        <div className="flex my-2">
          <h1 className="flex-auto font-space-grotesk text-3xl font-bold">
            Update Task
          </h1>
          <button
            className="flex-none text-3xl cursor-pointer hover:text-mist-800 active:text-mist-700 dark:active:text-mist-900"
            onClick={() => setEditVisible(!editVisible)}
          >
            <FaRectangleXmark />
          </button>
        </div>

        <form className="flex flex-col mt-4" onSubmit={saveEdit}>
          <input
            type="text"
            className="p-2 border my-1"
            placeholder="Title"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          ></input>
          <textarea
            type="text"
            className="p-2 border my-1"
            placeholder="Description"
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
          ></textarea>
          <input
            type="date"
            className="p-2 border my-1 dark:text-white dark:scheme-dark"
            value={editDue}
            min={currentDate}
            onChange={(e) =>
              setEditDue(new Date(e.target.value).toISOString().split("T")[0])
            }
          ></input>
          <button
            type="submit"
            className="cursor-pointer p-2 my-2 font-medium bg-sky-300 hover:bg-sky-500 dark:bg-sky-500 dark:hover:bg-sky-700 active:bg-sky-700 dark:active:bg-sky-900 rounded-3xl disabled:bg-sky-100 dark:disabled:bg-sky-300 disabled:text-gray-500 disabled:cursor-not-allowed"
            disabled={loading || !editTitle || !editDesc || !editDue}
          >
            {loading ? "Updating Task..." : "Update Task"}
          </button>
        </form>
      </div>
    </div>
  );
}

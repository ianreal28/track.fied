import { createContext, useContext, useEffect, useState } from "react";
import { userContext } from "../App";
import Tasks from "../components/dashboard/Tasks";
import DashboardNav from "../components/dashboard/DashboardNav";
import Addform from "../components/dashboard/Addform";
import Editform from "../components/dashboard/Editform";
import LoadingModal from "../components/ui/LoadingModal";
import AlertModal from "../components/ui/AlertModal";
import DeleteModal from "../components/dashboard/DeleteModal";
import Filter from "../components/dashboard/Filter";
import AddButton from "../components/dashboard/AddButton";
import SettingsModal from "../components/dashboard/SettingsModal";
import About from "../components/dashboard/About";

export const dashboardContext = createContext();

export default function Dashboard() {
  const {
    supabase,
    session,
    loading,
    setLoading,
    alertMsg,
    setAlertMsg,
    theme,
    setTheme,
    navigate,
  } = useContext(userContext);
  const currentDate = new Date().toISOString().split("T")[0];
  const [showAbout, setShowAbout] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const user_id = session?.user?.id;
  const user_email = session?.user?.email;
  // Updating states
  const [editData, setEditData] = useState(null);
  const [editVisible, setEditVisible] = useState(false);

  useEffect(() => {
    if (!user_id) {
      navigate("/login");
    } else {
      setLoading(false);
    }
  }, [user_id]);

  // Edit task title/description/dueDate
  const showEdit = (task) => {
    setEditVisible(true);
    setEditData(task);
  };
  // Signout
  const handleSignOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      setAlertMsg(error.message);
      return;
    }
    setLoading(false);
  };

  return (
    <div className="min-h-dvh font-inter antialiased bg-slate-100 dark:bg-slate-950 dark:text-white overflow-x-hidden">
      <dashboardContext.Provider
        value={{
          user_email,
          user_id,
          currentDate,
          handleSignOut,
          showEdit,
          openSettings,
          setOpenSettings,
          showAbout,
          setShowAbout,
          showAddForm,
          setShowAddForm,
          tasks,
          setTasks,
          deleteData,
          setDeleteData,
          filter,
          setFilter,
          editVisible,
          setEditVisible,
          editData,
          setEditData,
        }}
      >
        <SettingsModal />
        <About />
        <DeleteModal />
        <AlertModal />
        <LoadingModal />
        <Addform />
        <Editform />
        <DashboardNav />
        <div className="flex flex-col items-center">
          <AddButton />
          <Filter />
          <Tasks />
        </div>
      </dashboardContext.Provider>
    </div>
  );
}

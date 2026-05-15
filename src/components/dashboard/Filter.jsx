import { useContext } from "react";
import { dashboardContext } from "../../pages/Dashboard";

export default function Filter() {
  const { filter, setFilter } = useContext(dashboardContext);
  return (
    <div className="filter-container mt-4">
      <label htmlFor="task-filter">Filter: </label>
      <select
        id="task-filter"
        className="border rounded-sm dark:bg-slate-950"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="all">All Tasks</option>
        <option value="active">Active (Ongoing)</option>
        <option value="dueToday">Due Today</option>
        <option value="pastDue">Past Due</option>
        <option value="completed">Completed</option>
      </select>
    </div>
  );
}

import { useContext } from "react";
import { FaGear } from "react-icons/fa6";
import { userContext } from "../../App";

export default function LoadingModal() {
  const { loading } = useContext(userContext);
  return (
    <div
      className={`${loading ? "flex" : "hidden"} backdrop-blur-sm fixed justify-center items-center w-full h-full z-20`}
    >
      <div className="border rounded-md flex flex-col bg-white w-3/4 md:w-1/4 h-1/3 justify-center items-center dark:bg-slate-950">
        <FaGear className="animate-spin text-7xl" />
        <h3 className="text-2xl font-medium mt-4">Loading...</h3>
      </div>
    </div>
  );
}

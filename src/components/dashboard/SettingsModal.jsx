import { useContext, useState } from "react";
import { FaRectangleXmark } from "react-icons/fa6";
import { userContext } from "../../App";
import { dashboardContext } from "../../pages/Dashboard";

export default function SettingsModal() {
  const { openSettings, setOpenSettings, user_email } =
    useContext(dashboardContext);
  const { supabase, loading, setLoading, alertMsg, setAlertMsg } =
    useContext(userContext);
  const [changeEmail, setChangeEmail] = useState("");
  const [pword, setPword] = useState("");
  // Change Email
  const handleChangeEmail = async (e) => {
    e.preventDefault();
    // Silent login check to verify their current password
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user_email,
      password: pword,
    });

    if (signInError) {
      setLoading(false);
      setAlertMsg("Incorrect password. Please try again.");
      return;
    }

    // If password is valid, trigger the email change
    const { data, error: updateError } = await supabase.auth.updateUser({
      email: changeEmail,
    });

    if (updateError) {
      setLoading(false);
      setAlertMsg(`Error: ${updateError.message}`);
    } else {
      setLoading(false);
      setOpenSettings(false);
      setChangeEmail("");
      setPword("");
      setAlertMsg("Success! Please check the your new email to confirm!");
    }
  };

  // Password Reset
  const resetPword = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.resetPasswordForEmail(
      user_email,
      {
        redirectTo: "http://localhost:3000/forgot-password",
      },
    );

    if (error) {
      setAlertMsg("Error sending reset email: " + error.message);
      setLoading(false);
    } else {
      setAlertMsg("Check your email for the reset link!");
      setLoading(false);
    }
  };
  return (
    <div
      className={`${openSettings ? "flex" : "hidden"} ${loading ? "hidden" : ""} ${alertMsg ? "hidden" : ""} backdrop-blur-sm fixed justify-center items-center w-full h-full z-20`}
    >
      <div className="flex flex-col bg-white border rounded w-3/4 md:w-1/3 dark:bg-slate-950">
        <div className="border-b flex text-2xl p-2 items-center">
          <h3 className="flex-1 font-space-grotesk font-bold">Settings</h3>
          <FaRectangleXmark
            className="cursor-pointer hover:text-mist-800"
            onClick={() => setOpenSettings(false)}
          />
        </div>
        <div className="flex flex-col">
          <form className="m-2" onSubmit={handleChangeEmail}>
            <h1>Change Email Address</h1>
            <input
              type="email"
              value={changeEmail}
              onChange={(e) => setChangeEmail(e.target.value)}
              className="border rounded-sm w-full my-1 p-1"
              placeholder="Enter new email"
            ></input>
            <input
              type="password"
              value={pword}
              onChange={(e) => setPword(e.target.value)}
              className="border rounded-sm w-full my-1 p-1"
              placeholder="Confirm password"
            ></input>
            <button
              type="submit"
              className="flex w-full rounded-sm my-1 p-1 justify-center cursor-pointer bg-sky-300 dark:bg-sky-500 hover:bg-sky-500 dark:hover:bg-sky-700"
              disabled={loading}
            >
              Change email
            </button>
          </form>
          <div className="p-2 border-t">
            <button
              onClick={resetPword}
              className="flex w-full rounded-sm my-1 p-1 justify-center cursor-pointer bg-sky-300 dark:bg-sky-500 hover:bg-sky-500 dark:hover:bg-sky-700"
              disabled={loading}
            >
              Reset my password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

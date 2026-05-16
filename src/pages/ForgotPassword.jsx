import { useContext, useState, useEffect } from "react";
import { userContext } from "../App";
import LoadingModal from "../components/ui/LoadingModal";
import AlertModal from "../components/ui/AlertModal";

export default function ForgotPassword() {
  const [recoveryMode, setRecoveryMode] = useState(false);
  const { loading, setLoading, alertMsg, setAlertMsg, navigate, supabase } =
    useContext(userContext);
  const [pword, setPword] = useState("");
  const [confirmPword, setConfirmPword] = useState("");

  useEffect(() => {
    setLoading(true);
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setRecoveryMode(true);
        setLoading(false);
      } else {
        if (!recoveryMode) {
          navigate("/");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, recoveryMode]);

  const handleChangePword = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.updateUser({
      password: pword,
    });

    if (error) {
      setLoading(false);
      setAlertMsg("Error updating password: " + error.message);
    } else {
      setLoading(false);
      await supabase.auth.signOut();
      setAlertMsg(
        "Password updated successfully! Please log in with your new password.",
      );
    }
  };
  return (
    <div className="bg-sky-300 h-dvh dark:bg-slate-950 dark:text-white font-inter antialiased">
      <LoadingModal loading={loading} />
      <AlertModal alertMsg={alertMsg} setAlertMsg={setAlertMsg} />
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col bg-white w-3/4 md:w-1/4 p-4 rounded-lg min-w-0 dark:bg-sky-950">
          <h1 className="text-4xl font-medium flex py-4 font-space-grotesk justify-center">
            Change Password
          </h1>
          <form onSubmit={handleChangePword}>
            <input
              type="password"
              className="flex border rounded-lg w-full my-4 p-2"
              value={pword}
              onChange={(e) => setPword(e.target.value)}
              placeholder="Password"
            />
            <input
              type="password"
              className="flex border rounded-lg w-full my-4 p-2"
              value={confirmPword}
              onChange={(e) => setConfirmPword(e.target.value)}
              placeholder="Confirm Password"
            />
            <button
              type="submit"
              className={`disabled:cursor-not-allowed ${confirmPword && pword !== confirmPword ? "border-red-600 text-red-600" : ""} flex w-full bg-sky-300 hover:bg-sky-400 active:bg-sky-500 dark:bg-sky-500 dark:hover:bg-sky-600 dark:active:bg-sky-700 font-medium cursor-pointer py-4 mt-8 border rounded-lg justify-center`}
              disabled={loading || !pword || pword !== confirmPword}
            >
              {!pword
                ? "Input New Password"
                : pword && !confirmPword
                  ? "Please enter the password again"
                  : pword !== confirmPword
                    ? "Password did not match!!!"
                    : "Change Password!"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

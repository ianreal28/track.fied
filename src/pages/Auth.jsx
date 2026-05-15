import { useState, useContext, useEffect } from "react";
import { userContext } from "../App";
import LoadingModal from "../components/ui/LoadingModal";
import AlertModal from "../components/ui/AlertModal";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import ThemeButton from "../components/ui/ThemeButton";

export default function Auth() {
  const [showLogin, setShowLogin] = useState(true);
  const { supabase, session, loading, setLoading, alertMsg, setAlertMsg } =
    useContext(userContext);
  const [email, setEmail] = useState("");
  const [pword, setPword] = useState("");

  // Register
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (email === "" || pword === "") {
      setAlertMsg("Please complete the fields!");
    } else {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: pword,
      });
      if (error) {
        setAlertMsg(error.message);
        setLoading(false);
        return;
      }
      setAlertMsg("Signed Up Successfully!");
      console.log(data);
    }
    setLoading(false);
  };

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (email === "" || pword === "") {
      setAlertMsg("Please complete the fields!");
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: pword,
      });
      if (error) {
        setLoading(false);
        setAlertMsg(error.message);
        return;
      }
      setAlertMsg("Logged In Successfully!");
    }
    setLoading(false);
  };

  // Forgot Password
  const handleForgot = async (e) => {
    e.preventDefault();
    if (!email) {
      setAlertMsg("Please enter an email to recover the password");
    } else {
      setLoading(true);
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "https://trackfied.vercel.app/forgot-password",
      });

      if (error) {
        setAlertMsg("Error sending reset email: " + error.message);
        setLoading(false);
      } else {
        setAlertMsg("Check your email for the reset link!");
        setLoading(false);
      }
    }
  };
  return (
    <div className="bg-sky-300 h-dvh dark:bg-slate-950 dark:text-white font-inter antialiased">
      <LoadingModal loading={loading} />
      <AlertModal alertMsg={alertMsg} setAlertMsg={setAlertMsg} />
      <div className="fixed top-6 left-6">
        <h1 className="font-bold text-3xl md:text-2xl font-space-grotesk tracking-tight transition-opacity hover:opacity-80 text-slate-800 dark:text-white">
          track<span className="text-slate-500 dark:text-neutral-400">.</span>
          fied
        </h1>
      </div>
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col bg-white w-3/4 md:w-1/4 p-6 rounded-lg min-w-0 dark:bg-sky-950">
          <h1 className="text-4xl font-medium flex py-4 font-space-grotesk">
            {showLogin ? "Login" : "Register"}
          </h1>
          <Register
            handleRegister={handleRegister}
            email={email}
            setEmail={setEmail}
            pword={pword}
            setPword={setPword}
            loading={loading}
            setShowLogin={setShowLogin}
            showLogin={showLogin}
          />
          <Login
            handleLogin={handleLogin}
            email={email}
            setEmail={setEmail}
            pword={pword}
            setPword={setPword}
            loading={loading}
            setShowLogin={setShowLogin}
            showLogin={showLogin}
            handleForgot={handleForgot}
          />
        </div>
      </div>
      <ThemeButton />
    </div>
  );
}

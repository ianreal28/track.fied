import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "./lib/supabaseClient";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
export const userContext = createContext();

function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "system");
  const [alertMsg, setAlertMsg] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //AUTH Session
  useEffect(() => {
    // Get the initial session
    setLoading(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      if (event === "PASSWORD_RECOVERY") {
        navigate("/forgot-password");
        return;
      }
      if (event === "SIGNED_OUT") {
        setAlertMsg("Logged Out Successfully!");
      }
      if (event === "USER_UPDATED") {
        setAlertMsg("Account updated successfully!");
        navigate("/dashboard");
      }
      if (event == "SIGNED_IN" || session) {
        if (window.location.pathname !== "/forgot-password") {
          navigate("/dashboard");
        }
      }
    });

    // Cleanup the listener when the component unmounts
    return () => subscription.unsubscribe();
  }, [navigate]);

  // Theme Management
  useEffect(() => {
    const root = window.document.documentElement;

    // Logic to determine if we should apply the 'dark' class
    const applyTheme = () => {
      const isDark =
        theme === "dark" ||
        (theme === "system" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);

      if (isDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    applyTheme();
    localStorage.setItem("theme", theme);

    // Listen for system changes if 'system' is selected
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme();
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);
  return (
    <userContext.Provider
      value={{
        supabase,
        session,
        loading,
        setLoading,
        alertMsg,
        setAlertMsg,
        theme,
        setTheme,
        navigate,
      }}
    >
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </userContext.Provider>
  );
}

export default App;
